const { Strategy, ExtractJwt } = require("passport-jwt");
const { SERVER_CONFIGS } = require("../../configs");

const jwtStrategy = new Strategy(
  {
    ignoreExpiration: false,
    secretOrKey: SERVER_CONFIGS.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload, done) => done(null, payload)
);

module.exports = jwtStrategy;
