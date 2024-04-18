const router = require("express").Router();
const authRouter = require("./auth.router");
const categoriesRouter = require("./categories.router");
const filmsRouter = require("./films.router");
const commentsReviewRouter = require("./comments.review.router");

const apiRouter = (app) => {
  app.use("/api/v1", router);
  router.use("/auth", authRouter);
  router.use("/categories", categoriesRouter);
  router.use("/films", filmsRouter);
  router.use("/reviews", commentsReviewRouter);
};

module.exports = apiRouter;
