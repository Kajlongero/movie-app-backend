const joi = require("joi");

// a - attempts made to find by search, p - page, s - search query, t - type [movie serie(tv)], dt - date (year), score - score

const a = joi.number().min(0).max(5);
const p = joi.number();
const s = joi.string().alphanum();
const t = joi.string().valid("movie", "tv");
const dt = joi.number().min(1000).max(9999);
const score = joi.number().min(1).max(10);

const querySearchSchema = joi.object({
  a,
  p,
  s,
  t,
  dt,
  score,
});

const getFilmSchema = joi.object({
  id: joi.number().min(1).integer().integer(),
});

module.exports = {
  getFilmSchema,
  querySearchSchema,
};
