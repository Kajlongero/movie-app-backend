const prisma = require("../connections/prisma");
const { GENRES_API } = require("../utils/api.routes");
const { handleApiFetch } = require("../utils/fetch.functions");

class CategoriesService {
  async getAllCategories() {
    const categories = await prisma.categories.findMany();

    if (!categories.length) {
      let apiMovieCategories = await handleApiFetch(GENRES_API("movie"), "GET");
      let apiSeriesCategories = await handleApiFetch(GENRES_API("tv"), "GET");

      const apiCategories = [
        ...apiMovieCategories.genres,
        ...apiSeriesCategories.genres,
      ];

      const cats = await prisma.categories.createMany({
        skipDuplicates: true,
        data: apiCategories,
      });

      return cats;
    }

    return categories;
  }
}

module.exports = new CategoriesService();
