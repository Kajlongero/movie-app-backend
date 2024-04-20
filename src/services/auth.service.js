const nodemailer = require("nodemailer");
const { randomUUID } = require("node:crypto");
const { sign, verify } = require("jsonwebtoken");
const { hash, hashSync, compare, compareSync } = require("bcrypt");
const { badRequest, unauthorized, notFound, conflict } = require("@hapi/boom");
const { SERVER_CONFIGS } = require("../configs");
const prisma = require("../connections/prisma");
const generateCode = require("../functions/gen.code");
const setTime = require("../functions/set.time");
const codeStructure = require("../html/mail.structure");
const { forbidden } = require("@hapi/boom");

class AuthService {
  genJWT(payload, expireTime = "30d") {
    return sign(payload, SERVER_CONFIGS.JWT_SECRET, {
      expiresIn: expireTime,
    });
  }

  verifyJWT(token) {
    return verify(token, SERVER_CONFIGS.JWT_SECRET);
  }

  async getUserById(id) {
    const user = await prisma.users.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        auth: {
          select: {
            id: true,
            email: true,
            password: true,
            createdAt: true,
            updatedAt: true,
            confirmed: true,
          },
        },
      },
    });
    if (!user) throw new notFound("User not found.");

    return user;
  }

  async getUserByToken(token) {
    const data = this.verifyJWT(token);
    const user = await this.getUserById(data.sub);

    return user;
  }

  async getUserByEmail(email) {
    const user = await prisma.users.findUnique({
      where: {
        auth: {
          email: email,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        auth: {
          select: {
            email: true,
            password: true,
            createdAt: true,
            updatedAt: true,
            confirmed: true,
            timeToLoginAgain: true,
          },
        },
      },
    });

    return user;
  }

  async login(data) {
    const { email, password } = data;

    const findEmail = await prisma.auth.findUnique({
      where: {
        email: email,
      },
      include: {
        Users: true,
      },
    });
    if (!findEmail) throw new unauthorized("Invalid email or password");

    const time = findEmail.timeToLoginAgain;

    const timeToLoginAgain = time > new Date().toISOString();
    if (timeToLoginAgain) throw new unauthorized("You cannot login yet");

    const comparePasswords = await compare(password, findEmail.password);
    if (!comparePasswords) {
      const attempts = findEmail.loginAttempts;
      const timeNow =
        attempts % 3 === 0 ? setTime((30 * 2 * attempts) / 3) : undefined;

      await prisma.auth.update({
        where: {
          id: findEmail.id,
        },
        data: {
          loginAttempts: {
            increment: 1,
          },
          timeToLoginAgain: timeNow,
        },
      });

      throw new unauthorized("Invalid email or password");
    }

    await prisma.auth.update({
      where: {
        id: findEmail.id,
      },
      data: {
        loginAttempts: 0,
        timeToLoginAgain: null,
      },
    });

    return this.genJWT({
      sub: findEmail.id,
      uid: findEmail.Users[0].id,
    });
  }

  async createUser(data) {
    const { email, password, firstName, lastName } = data;

    const exist = await prisma.auth.findUnique({
      where: {
        email: email,
      },
    });
    if (exist) throw new conflict("Email already used");

    const hashPassword = await hash(password, 10);
    const uuid = randomUUID();

    const createdUser = await prisma.$transaction(async (tx) => {
      const createAuth = await tx.auth.create({
        data: {
          email: email,
          password: hashPassword,
        },
      });

      const createdUser = await tx.users.create({
        data: {
          authId: createAuth.id,
          firstName: firstName,
          lastName: lastName,
        },
      });

      return {
        id: createdUser.id,
        authId: createAuth.id,
      };
    });

    return this.genJWT({
      sub: createdUser.authId,
      uid: createdUser.id,
    });
  }

  async updateUser(user, data) {
    const findUser = await prisma.users.findUnique({
      where: {
        id: user.uid,
      },
      include: {
        auth: true,
      },
    });

    const { email, oldPassword, newPassword, firstName, lastName } = data;

    const newEmail = email
      ? await prisma.auth.findUnique({
          where: {
            email: email,
          },
        })
      : null;

    const comparedPasswords =
      oldPassword && newPassword
        ? await compare(oldPassword, findUser.auth.password)
        : null;

    if (email && newEmail && email !== findUser.auth.email)
      throw new conflict("Email already used");

    if (oldPassword && newPassword && comparedPasswords !== true)
      throw new unauthorized("Old password invalid to change");

    let newHashPassword;

    if (oldPassword && newPassword && comparedPasswords)
      newHashPassword = hashSync(newPassword, 10);

    const updatedUser = await prisma.$transaction(async (tx) => {
      firstName || lastName
        ? await tx.users.update({
            where: {
              id: user.uid,
            },
            data: {
              firstName: firstName || undefined,
              lastName: lastName || undefined,
            },
          })
        : null;

      email || newPassword
        ? await tx.auth.update({
            where: {
              id: user.sub,
            },
            data: {
              email: email || undefined,
              password: newHashPassword || undefined,
            },
          })
        : null;
    });

    return "Updated successfully";
  }

  async deleteUser(data) {
    const user = await prisma.users.findUnique({
      where: {
        id: data.uid,
      },
    });
    if (!user) throw new notFound("User not found");

    await prisma.$transaction([
      prisma.users.delete({ where: { id: user.id } }),
      prisma.auth.delete({ where: { id: user.authId } }),
      prisma.commentsReview.deleteMany({ where: { userId: user.id } }),
      prisma.chatMessage.deleteMany({ where: { userId: user.id } }),
      prisma.authRecovery.deleteMany({ where: { authId: user.authId } }),
      prisma.authConfirm.deleteMany({ where: { authId: user.authId } }),
    ]);

    return "User deleted successfully";
  }

  async requestChangePassword(email) {
    const authUser = await prisma.auth.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        recoveryPasswordAttempts: true,
        timeToRequestPasswordRecovery: true,
      },
    });
    if (!authUser) throw new notFound("User does not exists in our registry");

    const timeNow = new Date().toISOString();

    if (authUser.timeToRequestPasswordRecovery > timeNow)
      throw new unauthorized("You cannot request a password recovery yet");

    const uuidVerifyCode = randomUUID();
    const uuidChangePassword = randomUUID();

    const code = generateCode();

    const tokenVerifyCode = this.genJWT(
      {
        sub: uuidVerifyCode,
        auid: authUser.id,
        jti: "AUTORIZE_VERIFY_CODE",
      },
      "15m"
    );

    const tokenChangePassword = this.genJWT(
      {
        sub: uuidChangePassword,
        auid: authUser.id,
        jti: "AUTORIZE_CHANGE_PASSWORD",
      },
      "30m"
    );

    await prisma.authRecovery.create({
      data: {
        id: uuidVerifyCode,
        code: code,
        recoveryToken: tokenVerifyCode,
        authorizeChangeToken: tokenChangePassword,
        lifetime: setTime(15),
      },
    });

    const mail = codeStructure(
      {
        to: email,
        subject: "Your verify code",
        message: "Your password change verification code",
        text: "Verification code",
      },
      code
    );

    this.#sendMail(mail).then(() => null);

    return {
      message:
        "If the email exists in our registry we will send a verification mail",
    };
  }

  async verifyCode(token, code) {
    const decodeToken = this.verifyJWT(token);

    if (decodeToken.jti !== "AUTORIZE_VERIFY_CODE")
      throw new unauthorized("Token invalid for this action");

    const findToken = await prisma.authRecovery.findUnique({
      where: {
        id: decodeToken.sub,
      },
      select: {
        authorizeChangeToken: true,
        lifetime: true,
        attempts: true,
        valid: true,
        code: true,
      },
    });

    if (findToken.lifetime < new Date().toISOString())
      throw new forbidden("Token expired");

    const isSame = code === findToken.code;
    if (!isSame) {
      await prisma.authRecovery.update({
        where: {
          id: decodeToken.sub,
        },
        data: {
          attempts: {
            increment: true,
          },
          valid: findToken.attempts > 2 ? false : undefined,
        },
      });
    }

    await prisma.authRecovery.update({
      where: {
        id: decodeToken.sub,
      },
      data: {
        attempts: {
          increment: true,
        },
      },
    });

    return {
      token: findToken.authorizeChangeToken,
    };
  }

  async changePasswordAuthorized(token, password) {
    const decodeToken = this.verifyJWT(token);

    if (decodeToken.jti !== "AUTORIZE_CHANGE_PASSWORD")
      throw new unauthorized("Token invalid for this action");

    const newPassword = await hash(password, 10);

    await prisma.auth.update({
      where: {
        id: decodeToken.auid,
      },
      data: {
        password: newPassword,
      },
    });

    return {
      message: "Password changed successfully",
    };
  }

  async #sendMail(email) {
    // función de nodemailer para enviar el mail
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: nodemailerConfig.MAIL,
        pass: nodemailerConfig.APP_PASSWORD,
      },
    });

    await transporter.sendMail(email);
    return { message: "email sent" };
  }
}

module.exports = new AuthService();
