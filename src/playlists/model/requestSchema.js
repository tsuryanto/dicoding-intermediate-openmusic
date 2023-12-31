const Joi = require('joi');

const PostPlaylistPayloadSchema = {
  name: Joi.string().required(),
};

const PostSongIntoPlaylistPayloadSchema = {
  songId: Joi.string().required(),
};

const DeleteSongFromPlaylistPayloadSchema = {
  songId: Joi.string().required(),
};

module.exports = {
  PostPlaylistPayloadSchema,
  PostSongIntoPlaylistPayloadSchema,
  DeleteSongFromPlaylistPayloadSchema,
};
