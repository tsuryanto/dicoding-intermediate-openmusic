const Joi = require('joi');

const AlbumPayloadSchema = {
  name: Joi.string().required(),
  year: Joi.number().required(),
};

module.exports = { AlbumPayloadSchema };
