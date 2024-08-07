const Boom = require('boom');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const CommonHelper = require('../helpers/CommonHelper');
const ValidationHelper = require('../helpers/ValidationHelper');
const LaptopHelper = require('../helpers/LaptopHelper');

const authorization = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.send(Boom.unauthorized('No token provided'));
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.send(Boom.unauthorized('No token provided'));
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.send(Boom.unauthorized('Invalid token provided'));
    }
    req.userId = decoded.id;
    next();
  });
};

const getListLaptop = async (req, res) => {
  try {
    const data = await LaptopHelper.getListLaptop();
    return res.send(data);
  } catch (error) {
    CommonHelper.log(['Laptop', 'getListLaptop', 'ERROR'], {
      message: `${error}`,
      transaction_id: req.headers.transaction_id
    });
    return res.send(CommonHelper.errorResponse(error));
  }
};
const addLaptop = async (req, res) => {
  try {
    ValidationHelper.laptopValidation(req.body);
    const data = await LaptopHelper.addLaptop(req);
    return res.send(data);
  } catch (error) {
    CommonHelper.log(['Laptop', 'addLaptop', 'ERROR'], {
      message: `${error}`,
      transaction_id: req.headers.transaction_id
    });
    return res.send(CommonHelper.errorResponse(error));
  }
};
const deleteLaptop = async (req, res) => {
  try {
    ValidationHelper.deleteLaptopValidation(req.params);
    const data = await LaptopHelper.deleteLaptop(req);
    return res.send(data);
  } catch (error) {
    CommonHelper.log(['Laptop', 'deleteLaptop', 'ERROR'], {
      message: `${error}`,
      transaction_id: req.headers.transaction_id
    });
    return res.send(CommonHelper.errorResponse(error));
  }
};
const editLaptop = async (req, res) => {
  try {
    ValidationHelper.laptopValidation(req.body);
    const data = await LaptopHelper.editLaptop(req);
    return res.send(data);
  } catch (error) {
    CommonHelper.log(['Laptop', 'editLaptop', 'ERROR'], {
      message: `${error}`,
      transaction_id: req.headers.transaction_id
    });
    return res.send(CommonHelper.errorResponse(error));
  }
};
const getListLaptopV2 = async (req, res) => {
  try {
    const data = await LaptopHelper.getListLaptopV2();
    return res.send(data);
  } catch (error) {
    CommonHelper.log(['Laptop', 'getListLaptopV2', 'ERROR'], {
      message: `${error}`,
      transaction_id: req.headers.transaction_id
    });
    return res.send(CommonHelper.errorResponse(error));
  }
};
const addLaptopV2 = async (req, res) => {
  try {
    ValidationHelper.laptopValidation(req.body);
    const data = await LaptopHelper.addLaptopV2(req);
    return res.send(data);
  } catch (error) {
    CommonHelper.log(['Laptop', 'addLaptopV2', 'ERROR'], {
      message: `${error}`,
      transaction_id: req.headers.transaction_id
    });
    return res.send(CommonHelper.errorResponse(error));
  }
};
const editLaptopV2 = async (req, res) => {
  try {
    ValidationHelper.laptopValidation(req.body);
    const data = await LaptopHelper.editLaptopV2(req);
    return res.send(data);
  } catch (error) {
    CommonHelper.log(['Laptop', 'editLaptopV2', 'ERROR'], {
      message: `${error}`,
      transaction_id: req.headers.transaction_id
    });
    return res.send(CommonHelper.errorResponse(error));
  }
};

const deleteLaptopV2 = async (req, res) => {
  try {
    ValidationHelper.deleteLaptopValidation(req.params);
    const data = await LaptopHelper.deleteLaptopV2(req);
    return res.send(data);
  } catch (error) {
    CommonHelper.log(['Laptop', 'deleteLaptopV2', 'ERROR'], {
      message: `${error}`,
      transaction_id: req.headers.transaction_id
    });
    return res.send(CommonHelper.errorResponse(error));
  }
};
const Login = async (req, res) => {
  try {
    const data = await LaptopHelper.Login(req);
    const token = jwt.sign({ id: data.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    return res.send({ message: 'Login successful', token });
  } catch (error) {
    CommonHelper.log(['Laptop Helper', 'Login', 'ERROR'], {
      message: `${error}`,
      transaction_id: req.headers.transaction_id
    });
    return res.send(CommonHelper.errorResponse(error));
  }
};
const Register = async (req, res) => {
  try {
    ValidationHelper.registerValidation(req.body);
    const data = await LaptopHelper.Register(req);
    return res.send(data);
  } catch (error) {
    CommonHelper.log(['Laptop Helper', 'Register', 'ERROR'], {
      message: `${error}`,
      transaction_id: req.headers.transaction_id
    });
    return res.send(CommonHelper.errorResponse(error));
  }
};

router.get('/v1/laptop', authorization, CommonHelper.preHandler, getListLaptop);
router.post('/v1/laptop', authorization, CommonHelper.preHandler, addLaptop);
router.delete('/v1/laptop/:id', authorization, CommonHelper.preHandler, deleteLaptop);
router.put('/v1/laptop/:id', authorization, CommonHelper.preHandler, editLaptop);
router.post('/v1/laptop/login', CommonHelper.preHandler, Login);
router.post('/v1/laptop/register', CommonHelper.preHandler, Register);

router.get('/v2/laptop', CommonHelper.preHandler, getListLaptopV2);
router.post('/v2/laptop', CommonHelper.preHandler, addLaptopV2);
router.put('/v2/laptop/:id', CommonHelper.preHandler, editLaptopV2);
router.delete('/v2/laptop/:id', CommonHelper.preHandler, deleteLaptopV2);

module.exports = router;
