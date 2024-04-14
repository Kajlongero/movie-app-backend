const passport = require("passport");
const local = require("./strategies/local.strategy");
const jwt = require("./strategies/jwt.strategy");

passport.use("local", local);
passport.use("jwt", jwt);
