const Joi = require('joi');

const SongPayloadSchema = {
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
};

module.exports = { SongPayloadSchema };
