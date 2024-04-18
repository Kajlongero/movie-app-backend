const { badRequest } = require("@hapi/boom");

const validQueryParams = ["a", "c", "s", "t", "dt", "score"];

const validateSearch = (req, res, next) => {
  const querys = Object.keys(req.query);

  querys.map((v) => {
    if (!validQueryParams.includes(v)) {
      throw new badRequest("Invalid search params");
    }
  });

  next();
};

module.exports = validateSearch;
