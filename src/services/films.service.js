const prisma = require("../connections/prisma");
const { notFound } = require("@hapi/boom");
const { handleApiFetch } = require("../utils/fetch.functions");
const { badRequest } = require("@hapi/boom");
const {
  MOVIE_SERIES_DETAILS_API,
  MOVIES_BY_CATEGORY_API,
  SERIES_BY_CATEGORY_API,
  SEARCH_MOVIE_SERIE_BY_TITLE_API,
  IMAGES_MOVIE_SERIE_API,
  TRENDING_MOVIE_SERIES_API,
  MOVIES_SERIES_BY_CATEGORY_API,
} = require("../utils/api.routes");

class FilmsService {
  async getMovieById(filmId) {
    let apiFilm;

    const film = await prisma.films.findUnique({
      where: {
        id: parseInt(filmId),
        mediaType: "MOVIE",
      },
      include: {
        Categories: true,
        FilmImages: true,
      },
    });

    if (film) return film;

    if (!film)
      apiFilm = await handleApiFetch(
        MOVIE_SERIES_DETAILS_API(filmId, "movie"),
        "GET"
      );

    if (!film && !apiFilm) throw new notFound("Movie not found.");

    const date = new Date(apiFilm.release_date).toISOString();
    const images = await handleApiFetch(
      IMAGES_MOVIE_SERIE_API("movie", filmId),
      "GET"
    );

    const transformed = images.backdrops.map((img) => ({ url: img.file_path }));
    const maxImages = transformed.splice(0, 16);

    const createMovie = await prisma.films.create({
      data: {
        id: parseInt(filmId),
        title: apiFilm.title,
        overview: apiFilm.overview,
        releaseDate: date,
        mediaType: "MOVIE",
        coverImage: apiFilm.poster_path,
        language: apiFilm.original_language,
        Categories: {
          connect: [...apiFilm.genres.map((g) => ({ id: g.id }))],
        },
        FilmImages: {
          createMany: {
            data: maxImages,
            skipDuplicates: true,
          },
        },
      },
      include: {
        Categories: true,
        FilmImages: true,
      },
    });

    return createMovie;
  }

  async getSerieById(serieId) {
    const serie = await prisma.films.findUnique({
      where: {
        id: parseInt(serieId),
      },
      include: {
        Categories: true,
        FilmImages: true,
        CommentsReview: true,
      },
    });
    if (serie) return serie;

    let apiSerie;

    if (!serie)
      apiSerie = await handleApiFetch(
        MOVIE_SERIES_DETAILS_API(serieId, "tv"),
        "GET"
      );

    if (!serie && !apiSerie) throw new notFound("Serie not found");

    const images = await handleApiFetch(
      IMAGES_MOVIE_SERIE_API("tv", serieId),
      "GET"
    );

    const date = new Date(apiSerie.first_air_date).toISOString();

    const transformed = images.backdrops.map((img) => ({ url: img.file_path }));
    const maxImages = transformed.splice(0, 16);

    const createSerie = await prisma.films.create({
      data: {
        id: apiSerie.id,
        title: apiSerie.name,
        language: apiSerie.original_language ?? "en",
        coverImage: apiSerie.poster_path,
        mediaType: "TV",
        overview: apiSerie.overview,
        releaseDate: date,
        Categories: {
          connect: [...apiSerie.genres.map((g) => ({ id: g.id }))],
        },
        Seasons: {
          createMany: {
            data: [
              ...apiSerie.seasons.map((s) => {
                const internalDate = new Date(s.air_date).toISOString();

                return {
                  id: s.id,
                  name: s.name,
                  coverImage: s.poster_path,
                  airDate: internalDate,
                  overview: s.overview,
                  seasonNumber: s.season_number,
                  episodeCount: s.episode_count,
                };
              }),
            ],
          },
        },
        FilmImages: {
          createMany: {
            data: maxImages,
            skipDuplicates: true,
          },
        },
      },
      include: {
        Categories: true,
        FilmImages: true,
        Seasons: true,
      },
    });

    return createSerie;
  }

  async getFilmsByCategory(type = "movie", categoryId, page = 1) {
    const movies =
      type === "movie"
        ? await handleApiFetch(MOVIES_BY_CATEGORY_API(categoryId, page))
        : await handleApiFetch(SERIES_BY_CATEGORY_API(categoryId, page));

    return movies;
  }

  async getFilmsByTrending(window = "day") {
    const movies = await handleApiFetch(
      `${TRENDING_MOVIE_SERIES_API}${window}`,
      "GET"
    );

    return movies;
  }

  async existFilm(id) {
    const film = await prisma.films.findUnique({
      where: {
        id,
      },
    });

    return film ? true : false;
  }

  async searchFilms(querys) {
    const { s, p } = querys;

    if (!s.length)
      return {
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0,
      };

    const query = SEARCH_MOVIE_SERIE_BY_TITLE_API(s, p);
    const movies = await handleApiFetch(query, "GET");

    console.log(movies);

    return movies;

    return [
      ...movies.map((m) => ({
        id: m.id,
        title: m.name ?? m.title,
        overview: m.overview,
        releaseDate: m.release_date ?? m.first_air_date,
        mediaType: m.media_type,
        coverImage: m.poster_path,
        language: m.original_language,
      })),
    ];
  }

  async addNewFilmScore(filmId, comment) {
    const parsed = parseInt(filmId);
    if (isNaN(parsed)) throw new badRequest("Film id must me a integer");

    const film = await prisma.films.findUnique({
      where: {
        id: parsed,
      },
      select: {
        voteCount: true,
        voteAverage: true,
      },
    });

    const previousScore = parseInt(film.voteAverage * film.voteCount);
    const newAverage = (previousScore + comment.score) / (film.voteCount + 1);

    await prisma.films.update({
      where: {
        id: parsed,
      },
      data: {
        voteCount: {
          increment: 1,
        },
        voteAverage: newAverage,
      },
    });
  }

  async updateFilmScore(filmId, prevComment, newComment) {
    const parsed = parseInt(filmId);
    if (isNaN(parsed)) throw new badRequest("Film id must me a integer");

    const film = await prisma.films.findUnique({
      where: {
        id: parseInt(filmId),
      },
      select: {
        voteCount: true,
        voteAverage: true,
      },
    });

    const previousScore = film.voteAverage * film.voteCount;
    const newAverage =
      (newComment.score - prevComment.score + previousScore) /
      parseInt(film.voteCount);

    await prisma.films.update({
      where: {
        id: parsed,
      },
      data: {
        voteAverage: newAverage,
      },
    });
  }

  async updateScoreByDecrement(filmId, comment) {
    const parsed = parseInt(filmId);
    if (isNaN(parsed)) throw new badRequest("Film id must me a integer");

    const film = await prisma.films.findUnique({
      where: {
        id: parsed,
      },
      select: {
        voteCount: true,
        voteAverage: true,
      },
    });

    const newAverage =
      parseInt(film.voteAverage * film.voteCount) - comment.score <= 0
        ? 0
        : parseInt(film.voteAverage * film.voteCount) - comment.score;

    await prisma.films.update({
      where: {
        id: parsed,
      },
      data: {
        voteCount: {
          decrement: 1,
        },
        voteAverage: newAverage,
      },
    });
  }
}

module.exports = new FilmsService();
