const { Strategy } = require("passport-local");
const authService = require("../../services/auth.service");

const local = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      const user = await authService.login({ email, password });

      done(null, user);
    } catch (e) {
      done(e, null);
    }
  }
);

module.exports = local;
