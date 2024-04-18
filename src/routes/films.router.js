const router = require("express").Router();
const { SuccessBody } = require("../responses/success.responses");
const { querySearchSchema, getFilmSchema } = require("../models/films.model");
const filmsService = require("../services/films.service");
const validateSchema = require("../middlewares/validate.schema");

router.get(
  "/movie/:id",
  validateSchema(getFilmSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log(id);
      const film = await filmsService.getMovieById(id);

      SuccessBody(req, res, film, 200);
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/serie/:id",
  validateSchema(getFilmSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const serie = await filmsService.getSerieById(id);

      SuccessBody(req, res, serie, 200);
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/search",
  validateSchema(querySearchSchema, "query"),
  async (req, res, next) => {
    try {
      const querys = req.query;
      const search = await filmsService.searchFilms(querys);

      SuccessBody(req, res, search, 200);
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
