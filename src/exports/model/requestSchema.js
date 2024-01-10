const Joi = require('joi');

const PostExportPlaylistsPayloadSchema = {
  targetEmail: Joi.string().email({ tlds: true }).required(),
};

module.exports = PostExportPlaylistsPayloadSchema;
