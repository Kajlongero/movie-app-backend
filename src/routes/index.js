const router = require("express").Router();

const apiRoutes = (app) => {
  app.use("/api/v1", router);
};

module.exports = apiRoutes;
