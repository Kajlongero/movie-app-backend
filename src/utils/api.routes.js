// Base API URL
const BASE_URL = "https://api.themoviedb.org/3";

const GENRES_API = (type = "movie") => `${BASE_URL}/genre/${type}/list`;

// CATEGORIES API URL MOVIE AND SERIES
const CATEGORIES_API = (page = 1) => `${BASE_URL}/movie/list?page=${page}`;

// IMAGES BELONG TO MOVIE - SERIE API
const IMAGES_MOVIE_SERIE_API = (type = "movie", id) =>
  `${BASE_URL}/${type}/${id}/images`;

// POPULAR MOVIES
const POPULAR_MOVIES_API = (page = 1) =>
  `${BASE_URL}/movie/popular?page=${page}`;

// TOP_RATED MOVIES
const TOP_RATED_MOVIES_API = (page = 1) =>
  `${BASE_URL}/movie/top_rated?page=${page}`;

const MOVIES_SERIES_BY_CATEGORY_API = (page = 1, type = "movie") =>
  `${BASE_URL}/discover/${type}?page=${page}`;

// MOVIE DETAILS
const MOVIE_SERIES_DETAILS_API = (id, type) => `${BASE_URL}/${type}/${id}`;

// SIMILAR MOVIES
const SIMILAR_MOVIE_API = (id, page = 1) =>
  `${BASE_URL}/movie/${id}/similar?page=${page}`;

// RECOMMENDATIONS MOVIES
const RECOMMENDED_MOVIE_API = (id, page = 1) =>
  `${BASE_URL}/movie/${id}/recommendations?page=${page}`;

// TRENDING MOVIES AND SERIES - CAN BE "day" or "week"
const TRENDING_MOVIE_SERIES_API = `${BASE_URL}/trending/all/`;

// SEARCH MOVIE OR SERIES API
const SEARCH_MOVIE_SERIE_BY_TITLE_API = (type = "movie", query, page = 1) =>
  `${BASE_URL}/search/${type}?query=${query}&page=${page}`;

const SERIES_SEASON_API = (serieId, seasonNumber) =>
  `${BASE_URL}/tv/${serieId}/season/${seasonNumber}`;

module.exports = {
  BASE_URL,
  TRENDING_MOVIE_SERIES_API,
  MOVIE_SERIES_DETAILS_API,
  GENRES_API,
  CATEGORIES_API,
  POPULAR_MOVIES_API,
  IMAGES_MOVIE_SERIE_API,
  TOP_RATED_MOVIES_API,
  SIMILAR_MOVIE_API,
  RECOMMENDED_MOVIE_API,
  SEARCH_MOVIE_SERIE_BY_TITLE_API,
  SERIES_SEASON_API,
  MOVIES_SERIES_BY_CATEGORY_API,
};
