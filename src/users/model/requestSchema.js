const Joi = require('joi');

const UserPayloadSchema = {
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
};

module.exports = { UserPayloadSchema };
