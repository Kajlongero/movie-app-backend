const { badRequest } = require("@hapi/boom");

const validateIdParams = (req, res, next) => {
  const { id } = req.params;

  if (isNaN(parseInt(id)) || parseInt(id) < 0)
    throw new badRequest("Id must be a positive integer");

  next();
};

module.exports = validateIdParams;
