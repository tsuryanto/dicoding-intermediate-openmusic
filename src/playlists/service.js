const { nanoid } = require('nanoid');
const InvariantError = require('../../utils/response/exceptions/InvariantError');
const NotFoundError = require('../../utils/response/exceptions/NotFoundError');
const ForbiddenError = require('../../utils/response/exceptions/ForbiddenError');

class PlaylistService {
  constructor(songService, playlistRepo) {
    this.songService = songService;
    this.playlistRepo = playlistRepo;
  }

  async verifyPlaylistOwner(credentialId, playlistId) {
    const playlist = await this.playlistRepo.getById(playlistId);
    if (!playlist) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    if (playlist.owner !== credentialId) {
      throw new ForbiddenError('Anda tidak berhak mengakses resource ini');
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

  async addSongIntoPlaylist(credentialId, playlistId, { songId }) {
    await this.verifyPlaylistOwner(credentialId, playlistId);
    await this.songService.getSong(songId);
    const id = `playlist-song-${nanoid(16)}}`;
    const resultId = await this.playlistRepo.addSong(id, playlistId, songId);

    if (!resultId) {
      throw new InvariantError('Song gagal ditambahkan ke Playlist');
    }
    return resultId;
  }

  async getSongsInPlaylist(credentialId, playlistId) {
    await this.verifyPlaylistOwner(credentialId, playlistId);
    const { id, name, username } = await this.playlistRepo.getById(playlistId);
    const songs = await this.songService.getSongs({ playlistIdParam: playlistId });
    return {
      id,
      name,
      username,
      songs,
    };
  }

  async deleteSongFromPlaylist(credentialId, playlistId, { songId }) {
    await this.verifyPlaylistOwner(credentialId, playlistId);
    const resultId = await this.playlistRepo.deleteSongById(playlistId, songId);
    if (!resultId) {
      throw new NotFoundError('Song gagal dihapus dari Playlist');
    }
  }
}

module.exports = PlaylistService;