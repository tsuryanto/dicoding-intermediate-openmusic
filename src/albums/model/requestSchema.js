const Joi = require('joi');

const AlbumPayloadSchema = {
  name: Joi.string().required(),
  year: Joi.number().required(),
};

const PostAlbumCoverHeaderSchema = {
  'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp').required(),
};

module.exports = { AlbumPayloadSchema, PostAlbumCoverHeaderSchema };
