const Boom = require('boom');

const CommonHelper = require('./CommonHelper');
const Database = require('../services/Database');
const Prisma = require('../services/Prisma');

const getAllList = async () => {
  try {
    const data = await Database.getListPhonebook();
    if (data.length === 0) {
      return Boom.notFound('Phonebook not found');
    }
    return {
      count: data.length,
      list: data
    };
  } catch (error) {
    CommonHelper.log(['PhoneBook Helper', 'getAllList', 'ERROR'], { message: `${error}` });
    throw CommonHelper.errorResponse(error);
  }
};

const addPhonebook = async (req) => {
  try {
    await Database.addPhonebook(req.body.name, req.body.number);
    return `Added '${req.body.number}' as '${req.body.name}' to phonebook`;
  } catch (error) {
    CommonHelper.log(['PhoneBook Helper', 'addPhonebook', 'ERROR'], { message: `${error}` });
    throw CommonHelper.errorResponse(error);
  }
};

const editPhonebook = async (req) => {
  try {
    const editAction = await Database.editPhonebook(req.params.id, req.body.name, req.body.number);
    if (!editAction) {
      return Boom.notFound(`Phonebook with id ${req.params.id} not found `);
    }
    return `Edited '${req.body.number}' as '${req.body.name}' to phonebook`;
  } catch (error) {
    CommonHelper.log(['PhoneBook Helper', 'editPhonebook', 'ERROR'], { message: `${error}` });
    throw CommonHelper.errorResponse(error);
  }
};

const deletePhonebook = async (req) => {
  try {
    const deleteAction = await Database.deletePhonebook(req.params.id);
    if (!deleteAction) {
      return Boom.notFound(`Phonebook with id ${req.params.id} not found `);
    }
    return `Delete id ${req.params.id} successfully`;
  } catch (error) {
    CommonHelper.log(['PhoneBook Helper', 'deletePhonebook', 'ERROR'], { message: `${error}` });
    throw CommonHelper.errorResponse(error);
  }
};

const getAllListV2 = async () => {
  try {
    const data = await Prisma.getListPhonebook();
    if (data.length === 0) {
      return Boom.notFound('Phonebook not found');
    }
    return {
      count: data.length,
      list: data
    };
  } catch (error) {
    CommonHelper.log(['PhoneBook Helper', 'getAllList', 'ERROR'], { message: `${error}` });
    throw CommonHelper.errorResponse(error);
  }
};

const addPhonebookV2 = async (req) => {
  try {
    await Prisma.addPhonebook(req.body.name, req.body.number);
    return `Added '${req.body.number}' as '${req.body.name}' to phonebook`;
  } catch (error) {
    CommonHelper.log(['PhoneBook Helper', 'addPhonebook', 'ERROR'], { message: `${error}` });
    throw CommonHelper.errorResponse(error);
  }
};

const editPhonebookV2 = async (req) => {
  try {
    const editAction = await Prisma.editPhonebook(req.params.id, req.body.name, req.body.number);
    if (!editAction) {
      return Boom.notFound(`Phonebook with id ${req.params.id} not found `);
    }
    return `Edited '${req.body.number}' as '${req.body.name}' to phonebook`;
  } catch (error) {
    CommonHelper.log(['PhoneBook Helper', 'editPhonebook', 'ERROR'], { message: `${error}` });
    throw CommonHelper.errorResponse(error);
  }
};

const deletePhonebookV2 = async (req) => {
  try {
    const deleteAction = await Prisma.deletePhonebook(req.params.id);
    if (!deleteAction) {
      return Boom.notFound(`Phonebook with id ${req.params.id} not found `);
    }
    return `Delete id ${req.params.id} successfully`;
  } catch (error) {
    CommonHelper.log(['PhoneBook Helper', 'deletePhonebook', 'ERROR'], { message: `${error}` });
    throw CommonHelper.errorResponse(error);
  }
};

module.exports = {
  getAllList,
  addPhonebook,
  editPhonebook,
  deletePhonebook,
  getAllListV2,
  addPhonebookV2,
  editPhonebookV2,
  deletePhonebookV2
};
