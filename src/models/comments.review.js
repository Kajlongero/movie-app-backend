const joi = require("joi");

const id = joi.number().min(0);
const content = joi.string().min(1).max(300);
const score = joi.number().min(1).max(10);
const filmId = joi.number().min(0);

const getCommentSchema = joi.object({
  id: id.required(),
});

const createCommentSchema = joi.object({
  filmId: id.required(),
  content: content.required(),
  score: score.required(),
});

const updateCommentSchema = joi.object({
  filmId: id.required(),
  content,
  score,
});

module.exports = {
  getCommentSchema,
  createCommentSchema,
  updateCommentSchema,
};
