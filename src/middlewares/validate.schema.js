const { badRequest } = require("@hapi/boom");

const validateSchema = (schema, property) => (req, res, next) => {
  const data = req[property];

  const { error } = schema.validate(data, { abortEarly: false });

  if (error) throw new badRequest(error);

  next();
};

module.exports = validateSchema;
