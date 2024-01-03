const Validator = require('../../utils/request/Validator');
const Success = require('../../utils/response/Success');
const {
  PostCollaborationPayloadSchema,
  DeleteCollaborationPayloadSchema,
} = require('./model/requestSchema');

class CollaborationHandler {
  constructor(service) {
    this.service = service;
  }

  async postCollaborationHandler(request, h) {
    const validator = new Validator(PostCollaborationPayloadSchema);
    validator.validate(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    const collaborationId = await this.service.addCollaboration(
      credentialId,
      { playlistId, userId },
    );
    const success = new Success(h, 'Collaboration berhasil ditambahkan', { collaborationId }, 201);
    return success.response();
  }

  async deleteCollaborationHandler(request, h) {
    const validator = new Validator(DeleteCollaborationPayloadSchema);
    validator.validate(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this.service.deleteCollaboration(credentialId, { playlistId, userId });
    const success = new Success(h, 'Collaboration berhasil dihapus');
    return success.response();
  }
}

module.exports = CollaborationHandler;
