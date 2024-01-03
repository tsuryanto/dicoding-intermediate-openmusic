const Success = require('../../utils/response/Success');
const {
  PostPlaylistPayloadSchema,
  PostSongIntoPlaylistPayloadSchema,
  DeleteSongFromPlaylistPayloadSchema,
} = require('./model/requestSchema');
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

  async postSongIntoPlaylistHandler(request, h) {
    const validator = new Validator(PostSongIntoPlaylistPayloadSchema);
    validator.validate(request.payload);

    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const resultId = await this.service.addSongIntoPlaylist(credentialId, playlistId, { songId });

    const success = new Success(h, 'Song berhasil ditambahkan ke Playlist', { resultId }, 201);
    return success.response();
  }

  async getSongsInPlaylistHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    const playlist = await this.service.getSongsInPlaylist(credentialId, playlistId);
    const success = new Success(h, null, { playlist });
    return success.response();
  }

  async deleteSongFromPlaylistHandler(request, h) {
    const validator = new Validator(DeleteSongFromPlaylistPayloadSchema);
    validator.validate(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    await this.service.deleteSongFromPlaylist(credentialId, playlistId, { songId });
    const success = new Success(h, 'Playlist berhasil dihapus dari Playlist');
    return success.response();
  }

  async getPlaylistSongActivityHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistIdParam } = request.params;
    const {
      playlistId,
      activities,
    } = await this.service.getPlaylistSongActivity(credentialId, playlistIdParam);
    const success = new Success(h, null, { playlistId, activities });
    return success.response();
  }
}

module.exports = PlaylistHandler;
