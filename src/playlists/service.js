const { nanoid } = require('nanoid');
const InvariantError = require('../../utils/response/exceptions/InvariantError');
const NotFoundError = require('../../utils/response/exceptions/NotFoundError');
const AuthenticationError = require('../../utils/response/exceptions/AuthenticationError');

class PlaylistService {
  constructor(playlistRepo) {
    this.playlistRepo = playlistRepo;
  }

  async verifyPlaylistOwner(credentialId, playlistId) {
    const playlist = await this.playlistRepo.getById(playlistId);
    if (!playlist) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    if (playlist.owner !== credentialId) {
      throw new AuthenticationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async addPlaylist(credentialId, { name }) {
    const id = `playlist-${nanoid(16)}}`;
    const resultId = await this.playlistRepo.create(id, name, credentialId);
    if (!resultId) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }
    return resultId;
  }

  async getPlaylists(credentialId) {
    const songs = await this.playlistRepo.getAll(credentialId);
    return songs.map(({
      id, name, owner,
    }) => ({
      id,
      name,
      username: owner,
    }));
  }

  async deletePlaylistById(credentialId, id) {
    await this.verifyPlaylistOwner(credentialId, id);
    const resultId = await this.playlistRepo.deleteById(id);
    if (!resultId) {
      throw new NotFoundError('Playlist gagal dihapus');
    }
  }
}

module.exports = PlaylistService;
