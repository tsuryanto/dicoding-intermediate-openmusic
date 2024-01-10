const PostExportPlaylistsPayloadSchema = require('./model/requestSchema');
const Success = require('../../utils/response/Success');
const Validator = require('../../utils/request/Validator');

class ExportsHandler {
  constructor(service) {
    this.service = service;
  }

  async postExportPlaylistsHandler(request, h) {
    const validator = new Validator(PostExportPlaylistsPayloadSchema);
    validator.validate(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { targetEmail } = request.payload;
    const { playlistId } = request.params;

    await this.service.postExportPlaylists(credentialId, playlistId, targetEmail);

    const success = new Success(h, 'Permintaan Anda sedang kami proses', null, 201);
    return success.response();
  }
}

module.exports = ExportsHandler;
