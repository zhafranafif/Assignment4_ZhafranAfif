const Joi = require('joi');
const Boom = require('boom');

const laptopValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
    brand_id: Joi.number().required()
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const deleteLaptopValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().required()
  });
  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string()
      .pattern(/^[a-zA-Z0-9]{8,}$/)
      .required()
      .messages({
        'string.pattern.base': 'Username must contain at least 8 characters. Alphabet and number only'
      }),
    password: Joi.string()
      .pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
      .required()
      .messages({
        'string.pattern.base':
          'Password must be at least 8 characters long and contain at least one alphabet, one number, and one special character, 6-16 characters'
      })
  });
  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};
module.exports = { laptopValidation, deleteLaptopValidation, registerValidation };
