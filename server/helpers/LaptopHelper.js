const Boom = require('boom');
const bcrypt = require('bcrypt');

const CommonHelper = require('./CommonHelper');
const Database = require('../services/Database');
const Prisma = require('../services/Prisma');
const Redis = require('../services/Redis');

const getListLaptop = async () => {
  try {
    const getDataRedis = await Redis.getKey('laptop');
    if (getDataRedis) {
      const parsedData = JSON.parse(getDataRedis);

      if (parsedData.length === 0) {
        return Boom.notFound('Laptop not found');
      }
      CommonHelper.log(['Laptop Helper', 'getListLaptop', 'INFO'], {
        message: 'Get data from redis',
        key: 'laptop'
      });
      return JSON.parse(getDataRedis);
    }
    const data = await Database.getListLaptop();
    if (data.length === 0) {
      return Boom.notFound('Laptop not found');
    }
    await Redis.setWithExpire('laptop', JSON.stringify(data), 86400);
    return {
      count: data.length,
      list: data
    };
  } catch (error) {
    CommonHelper.log(['Laptop Helper', 'getListLaptop', 'ERROR'], {
      message: `${error}`
    });
    throw CommonHelper.errorResponse(error);
  }
};

const addLaptop = async (req) => {
  try {
    await Database.addLaptop(req.body.name, req.body.price, req.body.stock, req.body.brand_id);
    return `Success adding ${req.body.name} to the database!`;
  } catch (error) {
    CommonHelper.log(['Laptop Helper', 'addLaptop', 'ERROR'], {
      message: `${error}`
    });
    throw CommonHelper.errorResponse(error);
  }
};

const deleteLaptop = async (req) => {
  try {
    const deletingLaptop = await Database.deleteLaptop(req.params.id);
    if (!deletingLaptop) {
      return Boom.notFound(`Laptop with id ${req.params.id} not found `);
    }
    return `Successfully Delete id ${req.params.id}`;
  } catch (error) {
    CommonHelper.log(['Laptop Helper', 'deleteLaptop', 'ERROR'], {
      message: `${error}`
    });
    throw CommonHelper.errorResponse(error);
  }
};
const editLaptop = async (req) => {
  try {
    const editingLaptop = await Database.editLaptop(
      req.params.id,
      req.body.name,
      req.body.price,
      req.body.stock,
      req.body.brand_id
    );
    if (!editingLaptop) {
      throw Boom.notFound(`Laptop with id ${req.params.id} not found `);
    }
    return `Edited id ${req.params.id}`;
  } catch (error) {
    CommonHelper.log(['Laptop Helper', 'editLaptop', 'ERROR'], {
      message: `${error}`
    });
    throw CommonHelper.errorResponse(error);
  }
};

const getListLaptopV2 = async () => {
  try {
    const data = await Prisma.getListLaptopV2();
    if (data.length === 0) {
      return Boom.notFound('Laptop not found');
    }
    return {
      count: data.length,
      list: data
    };
  } catch (error) {
    CommonHelper.log(['Laptop Helper', 'getListLaptopV2', 'ERROR'], {
      message: `${error}`
    });
    throw CommonHelper.errorResponse(error);
  }
};
const addLaptopV2 = async (req) => {
  try {
    await Prisma.addLaptopV2(req.body.name, req.body.price, req.body.stock, req.body.brand_id);
    return `Success adding ${req.body.name} to the database!`;
  } catch (error) {
    CommonHelper.log(['Laptop Helper', 'addLaptopV2', 'ERROR'], {
      message: `${error}`
    });
    throw CommonHelper.errorResponse(error);
  }
};

const editLaptopV2 = async (req) => {
  try {
    const editingLaptop = await Prisma.editLaptopV2(
      req.params.id,
      req.body.name,
      req.body.price,
      req.body.stock,
      req.body.brand_id
    );
    if (!editingLaptop) {
      throw Boom.notFound(`Laptop with id ${req.params.id} not found `);
    }
    return `Edited id ${req.params.id}`;
  } catch (error) {
    CommonHelper.log(['Laptop Helper', 'editLaptopV2', 'ERROR'], {
      message: `${error}`
    });
    throw CommonHelper.errorResponse(error);
  }
};

const deleteLaptopV2 = async (req) => {
  try {
    const deletingLaptop = await Prisma.deleteLaptopV2(req.params.id);
    if (!deletingLaptop) {
      return Boom.notFound(`Laptop with id ${req.params.id} not found `);
    }
    return `Successfully Delete id ${req.params.id}`;
  } catch (error) {
    CommonHelper.log(['Laptop Helper', 'deleteLaptopV2', 'ERROR'], {
      message: `${error}`
    });
    throw CommonHelper.errorResponse(error);
  }
};
const Login = async (req) => {
  try {
    const data = await Database.Login(req.body.username);
    const isPasswordValid = bcrypt.compareSync(req.body.password, data.password);
    if (!isPasswordValid || !data) {
      throw Boom.notFound('Invalid username or password');
    }
    return data;
  } catch (error) {
    CommonHelper.log(['Laptop Helper', 'Login', 'ERROR'], {
      message: `${error}`
    });
    throw CommonHelper.errorResponse(error);
  }
};
const Register = async (req) => {
  try {
    await Database.Register(req.body.username, req.body.password);
    return `Register success`;
  } catch (error) {
    CommonHelper.log(['Laptop Helper', 'Register', 'ERROR'], {
      message: `${error}`
    });
    throw CommonHelper.errorResponse(error);
  }
};
module.exports = {
  getListLaptop,
  addLaptop,
  deleteLaptop,
  editLaptop,
  getListLaptopV2,
  addLaptopV2,
  editLaptopV2,
  deleteLaptopV2,
  Login,
  Register
};
