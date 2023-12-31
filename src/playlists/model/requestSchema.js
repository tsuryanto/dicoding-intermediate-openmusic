const Joi = require('joi');

const PostPlaylistPayloadSchema = {
  name: Joi.string().required(),
};

const PostSongIntoPlaylistPayloadSchema = {
  songId: Joi.string().required(),
};

module.exports = {
  PostPlaylistPayloadSchema,
  PostSongIntoPlaylistPayloadSchema,
};
