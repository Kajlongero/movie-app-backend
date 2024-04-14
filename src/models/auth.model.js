const joi = require("joi");

const id = joi.string().uuid();
const email = joi.string().email();
const password = joi.string().min(8).max(32);
const firstName = joi.string().min(3).max(60);
const lastName = joi.string().min(3).max(60);

const getUserSchema = joi.object({
  id: id.required(),
});

const createUserSchema = joi.object({
  email: email.required(),
  password: password.required(),
  firstName: firstName.required(),
  lastName: lastName.required(),
});

const udpatedUserSchema = joi.object({
  email,
  oldPassword: password,
  newPassword: password,
  firstName,
  lastName,
});

const loginSchema = joi.object({
  email: email.required(),
  password: password.required(),
});

const recoveryEmailSchema = joi.object({
  email: email.required(),
});

const validationCodeSchema = joi.object({
  code: joi.number(),
});

module.exports = {
  getUserSchema,
  recoveryEmailSchema,
  validationCodeSchema,
  loginSchema,
  createUserSchema,
  udpatedUserSchema,
};
