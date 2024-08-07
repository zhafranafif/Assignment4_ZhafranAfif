const router = require('express').Router();
const CommonHelper = require('../helpers/CommonHelper');
const PhoneBookHelper = require('../helpers/PhoneBookHelper');
const ValidationHelper = require('../helpers/ValidationHelper');

const getListPhonebook = async (req, res) => {
  try {
    // get data from json
    const data = await PhoneBookHelper.getAllList();
    // return response success
    return res.send(data);
  } catch (error) {
    // return response error
    CommonHelper.log(['PhoneBook', 'Get List Phonebook', 'ERROR'], {
      message: `${error}`,
      transaction_id: req.headers.transaction_id
    });
    return res.send(CommonHelper.errorResponse(error));
  }
};

const addPhonebook = async (req, res) => {
  try {
    // check validation input
    ValidationHelper.phoneBookValidation(req.body);
    // get data from json
    const data = await PhoneBookHelper.addPhonebook(req);
    // return response success
    return res.send(data);
  } catch (error) {
    // return response error
    CommonHelper.log(['PhoneBook', 'Add Phonebook', 'ERROR'], {
      message: `${error}`,
      transaction_id: req.headers.transaction_id
    });
    return res.send(CommonHelper.errorResponse(error));
  }
};

const editPhonebook = async (req, res) => {
  try {
    // check validation input
    ValidationHelper.phoneBookValidation(req.body);
    // get data from json
    const data = await PhoneBookHelper.editPhonebook(req);
    // return response success
    return res.send(data);
  } catch (error) {
    // return response error
    CommonHelper.log(['PhoneBook', 'Edit Phonebook', 'ERROR'], {
      message: `${error}`,
      transaction_id: req.headers.transaction_id
    });
    return res.send(CommonHelper.errorResponse(error));
  }
};

const deletePhonebook = async (req, res) => {
  try {
    // get data from json
    const data = await PhoneBookHelper.deletePhonebook(req);
    // return response success
    return res.send(data);
  } catch (error) {
    // return response error
    CommonHelper.log(['PhoneBook', 'Delete Phonebook', 'ERROR'], {
      message: `${error}`,
      transaction_id: req.headers.transaction_id
    });
    return res.send(CommonHelper.errorResponse(error));
  }
};

router.get('/', CommonHelper.preHandler, getListPhonebook);
router.post('/', CommonHelper.preHandler, addPhonebook);
router.put('/:id', CommonHelper.preHandler, editPhonebook);
router.delete('/:id', CommonHelper.preHandler, deletePhonebook);

module.exports = router;
