const { nanoid } = require('nanoid');
const InvariantError = require('../../utils/response/exceptions/InvariantError');
const NotFoundError = require('../../utils/response/exceptions/NotFoundError');

class SongService {
  constructor(songRepo) {
    this.songRepo = songRepo;
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}}`;
    const resultId = await this.songRepo.create({
      id, title, year, genre, performer, duration, albumId,
    });
    if (!resultId) {
      throw new InvariantError('Song gagal ditambahkan');
    }
    return resultId;
  }

  async getSongs({ albumIdParam, titleParam, performerParam }) {
    const songs = await this.songRepo.getAll({ albumIdParam, titleParam, performerParam });
    return songs.map(({
      id, title, performer,
    }) => ({
      id,
      title,
      performer,
    }));
  }

  async getSong(id) {
    const song = await this.songRepo.getById(id);
    if (!song) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return {
      id: song.id,
      title: song.title,
      year: song.year,
      performer: song.performer,
      genre: song.genre,
      duration: song.duration,
      albumId: song.albumId,
    };
  }

  async editSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const resultId = await this.songRepo.updateById(id, {
      title, year, genre, performer, duration, albumId,
    });
    if (!resultId) {
      throw new NotFoundError('Song gagal diperbarui');
    }
  }

  async deleteSongById(id) {
    const resultId = await this.songRepo.deleteById(id);
    if (!resultId) {
      throw new NotFoundError('Song gagal dihapus');
    }
  }
}

module.exports = SongService;
