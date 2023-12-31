const Success = require('../../utils/response/Success');
const { PostPlaylistPayloadSchema } = require('./model/requestSchema');
const Validator = require('../../utils/request/Validator');

class PlaylistHandler {
  constructor(service) {
    this.service = service;
  }

  async postPlaylistHandler(request, h) {
    const validator = new Validator(PostPlaylistPayloadSchema);
    validator.validate(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this.service.addPlaylist(credentialId, { name });

    const success = new Success(h, 'Playlist berhasil ditambahkan', { playlistId }, 201);
    return success.response();
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this.service.getPlaylists(credentialId);
    const success = new Success(h, null, { playlists });
    return success.response();
  }

  async deletePlaylistByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.service.deletePlaylistById(credentialId, id);
    const success = new Success(h, 'Playlist berhasil dihapus');
    return success.response();
  }
}

module.exports = PlaylistHandler;
