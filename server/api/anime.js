const router = require('express').Router();
const CommonHelper = require('../helpers/CommonHelper');
const ValidationHelper = require('../helpers/ValidationHelper');
const AnimeHelper = require('../helpers/AnimeHelper');

const getAllAnime = async (req, res) => {
  try {
    // get data from json
    const data = await AnimeHelper.getAnimeListName();
    // return response success
    return res.send(data);
  } catch (error) {
    // return response error
    CommonHelper.log(['Anime', 'Get All Anime', 'ERROR'], {
      message: `${error}`,
      transaction_id: req.headers.transaction_id
    });
    return res.send(CommonHelper.errorResponse(error));
  }
};

const searchAnime = async (req, res) => {
  try {
    // check validation input
    ValidationHelper.searchAnimeValidation(req.body);
    // Get detail anime by request body name
    const data = await AnimeHelper.getAnimeByName(req);
    // return response success
    return res.send(data);
  } catch (error) {
    CommonHelper.log(['Anime', 'Search Anime', 'ERROR'], {
      message: `${error}`,
      transaction_id: req.headers.transaction_id
    });
    return res.send(CommonHelper.errorResponse(error));
  }
};

router.get('/list', CommonHelper.preHandler, getAllAnime);
router.post('/search', CommonHelper.preHandler, searchAnime);

module.exports = router;
