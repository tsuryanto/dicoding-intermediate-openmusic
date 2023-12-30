const Joi = require('joi');

const PostAuthenticationPayloadSchema = {
  username: Joi.string().required(),
  password: Joi.string().required(),
};

const PutAuthenticationPayloadSchema = {
  refreshToken: Joi.string().required(),
};

const DeleteAuthenticationPayloadSchema = {
  refreshToken: Joi.string().required(),
};

module.exports = {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
};
