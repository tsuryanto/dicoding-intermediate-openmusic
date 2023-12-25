const Joi = require('joi');

const AddAlbumPayloadSchema = {
  name: Joi.string().required(),
  year: Joi.number().required(),
};

module.exports = { AddAlbumPayloadSchema };
