require("dotenv").config();

const SERVER_CONFIGS = {
  PORT: process.env.SERVER_PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL,
  NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,
};

module.exports = { SERVER_CONFIGS };
