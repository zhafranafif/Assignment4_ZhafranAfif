const Path = require('path');
const Boom = require('boom');
const CommonHelper = require('./CommonHelper');
const GeneralHelper = require('./GeneralHelper');

const ANIME_DATA = Path.join(__dirname, '../../assets/anime.json');

const getAnimeListName = async () => {
  try {
    const data = await GeneralHelper.readLargeFile(ANIME_DATA, 'data.*');
    const animeName = data.map((item) => item.title);
    return {
      count: data.length,
      list: animeName
    };
  } catch (error) {
    CommonHelper.log(['Anime Helper', 'getAnimeListName', 'ERROR'], { message: `${error}` });
    throw CommonHelper.errorResponse(error);
  }
};

const getAnimeByName = async (req) => {
  try {
    const data = await GeneralHelper.readLargeFile(ANIME_DATA, 'data.*');
    const animeDetail = data.filter((item) => item.title.toLowerCase().includes(req.body.name.toLowerCase()));

    if (animeDetail.length === 0) {
      return Boom.notFound('Anime not found');
    }
    const animeList = animeDetail.map((item) => item.title);

    return {
      count: animeDetail.length,
      list: animeList,
      detail: animeDetail
    };
  } catch (error) {
    CommonHelper.log(['Anime Helper', 'getAnimeByName', 'ERROR'], { message: `${error}` });
    throw CommonHelper.errorResponse(error);
  }
};

module.exports = { getAnimeListName, getAnimeByName };
