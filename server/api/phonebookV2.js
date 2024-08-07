const router = require('express').Router();
const CommonHelper = require('../helpers/CommonHelper');
const PhoneBookHelper = require('../helpers/PhoneBookHelper');
const ValidationHelper = require('../helpers/ValidationHelper');

const getListPhonebookV2 = async (req, res) => {
  try {
    // get data from json
    const data = await PhoneBookHelper.getAllListV2();
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

const addPhonebookV2 = async (req, res) => {
  try {
    // check validation input
    ValidationHelper.addPhoneBookValidation(req.body);
    // get data from json
    const data = await PhoneBookHelper.addPhonebookV2(req);
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

const editPhonebookV2 = async (req, res) => {
  try {
    // check validation input
    ValidationHelper.phoneBookValidation(req.body);
    // get data from json
    const data = await PhoneBookHelper.editPhonebookV2(req);
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

const deletePhonebookV2 = async (req, res) => {
  try {
    // get data from json
    const data = await PhoneBookHelper.deletePhonebookV2(req);
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

router.get('/', CommonHelper.preHandler, getListPhonebookV2);
router.post('/', CommonHelper.preHandler, addPhonebookV2);
router.put('/:id', CommonHelper.preHandler, editPhonebookV2);
router.delete('/:id', CommonHelper.preHandler, deletePhonebookV2);

module.exports = router;
