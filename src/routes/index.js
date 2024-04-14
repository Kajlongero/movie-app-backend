const router = require("express").Router();
const authRouter = require("./auth.router");

const apiRouter = (app) => {
  app.use("/api/v1", router);
  router.use("/auth", authRouter);
};

module.exports = apiRouter;
