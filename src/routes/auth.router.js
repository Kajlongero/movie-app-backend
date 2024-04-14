const passport = require("passport");
const {
  SuccessResponse,
  SuccessBody,
  SuccessMessage,
} = require("../responses/success.responses");
const authService = require("../services/auth.service");
const validateSchema = require("../middlewares/validate.schema");
const {
  createUserSchema,
  loginSchema,
  udpatedUserSchema,
  getUserSchema,
} = require("../models/auth.model");

const router = require("express").Router();

router.get(
  "/user-by-token",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;

      const data = await authService.getUserById(user.uid);

      delete data.auth.password;

      SuccessBody(req, res, data, 200);
    } catch (e) {
      next(e);
    }
  }
);

router.get("/user-by-id/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await authService.getUserById(id);

    delete user.auth.password;

    SuccessBody(req, res, user, 200);
  } catch (e) {
    next(e);
  }
});

router.post(
  "/signup",
  validateSchema(createUserSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;

      const user = await authService.createUser(body);

      SuccessResponse(
        req,
        res,
        "Registered sucessfully",
        {
          token: user,
        },
        201
      );
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/login",
  validateSchema(loginSchema, "body"),
  passport.authenticate("local", { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;

      SuccessResponse(
        req,
        res,
        "Logged in sucessfully",
        {
          token: user,
        },
        200
      );
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/update",
  validateSchema(udpatedUserSchema, "body"),
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      const body = req.body;

      const updated = await authService.updateUser(user, body);

      SuccessMessage(req, res, updated, 200);
    } catch (e) {
      next(e);
    }
  }
);

router.delete(
  "/delete-user/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;

      const deleted = await authService.deleteUser(user);

      SuccessMessage(
        req,
        res,
        {
          message: deleted,
        },
        200
      );
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
