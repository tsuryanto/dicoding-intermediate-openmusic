const Joi = require('joi');

const PostCollaborationPayloadSchema = {
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
};

const DeleteCollaborationPayloadSchema = {
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
};

module.exports = {
  PostCollaborationPayloadSchema,
  DeleteCollaborationPayloadSchema,
};
