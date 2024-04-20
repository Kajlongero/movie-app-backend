const passport = require("passport");
const validateSchema = require("../middlewares/validate.schema");
const {
  getCommentSchema,
  createCommentSchema,
  updateCommentSchema,
} = require("../models/comments.review");
const {
  SuccessBody,
  SuccessResponse,
  SuccessMessage,
} = require("../responses/success.responses");
const commentsReviewService = require("../services/comments.review.service");

const router = require("express").Router();

router.get(
  "/movie-comment-reviews/:id",
  validateSchema(getCommentSchema, "params"),
  async (req, res, next) => {
    try {
      const { offset } = req.query;
      const { id } = req.params;
      const comments = await commentsReviewService.getCommentsByFilmId(
        id,
        offset
      );

      SuccessBody(req, res, comments, 200);
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/comment-by-id/:id",
  validateSchema(getCommentSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const comment = await commentsReviewService.getUniqueComment(id);

      SuccessBody(req, res, comment, 200);
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/user-comment-on-film/:id",
  validateSchema(getCommentSchema, "params"),
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const comment = await commentsReviewService.getUserReviewOnFilm(
        req.user,
        id
      );

      SuccessBody(req, res, comment, 200);
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/comment/history/:id",
  validateSchema(getCommentSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const history = await commentsReviewService.getCommentHistory(id);

      SuccessBody(req, res, history, 200);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/create-comment-review",
  validateSchema(createCommentSchema, "body"),
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      const body = req.body;

      const comment = await commentsReviewService.createCommentReview(
        user,
        body
      );
      SuccessResponse(req, res, "Created successfully", comment, 201);
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/update-comment-review/:id",
  validateSchema(getCommentSchema, "params"),
  validateSchema(updateCommentSchema, "body"),
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      const id = req.params.id;
      const body = req.body;

      const updated = await commentsReviewService.updateCommentReview(
        user,
        id,
        body
      );

      SuccessResponse(req, res, "Updated successfully", updated, 200);
    } catch (e) {
      next(e);
    }
  }
);

router.delete(
  "/delete-comment/:id",
  validateSchema(getCommentSchema, "params"),
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const user = req.user;

      await commentsReviewService.deleteCommentReview(user, id);

      SuccessMessage(req, res, "Deleted successfully", 200);
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
