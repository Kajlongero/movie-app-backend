const router = require("express").Router();
const { SuccessBody } = require("../responses/success.responses");
const categoriesService = require("../services/categories.service");

router.get("/all", async (req, res, next) => {
  try {
    const categories = await categoriesService.getAllCategories();

    SuccessBody(req, res, categories, 200);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
