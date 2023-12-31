const Joi = require('joi');

const PostPlaylistPayloadSchema = {
  name: Joi.string().required(),
};

module.exports = { PostPlaylistPayloadSchema };
