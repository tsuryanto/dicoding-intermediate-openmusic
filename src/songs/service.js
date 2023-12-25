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

  async getSongs() {
    const songs = await this.songRepo.getAll();
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
}

module.exports = SongService;
