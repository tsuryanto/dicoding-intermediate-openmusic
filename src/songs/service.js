const { nanoid } = require('nanoid');
const InvariantError = require('../../utils/response/exceptions/InvariantError');

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
}

module.exports = SongService;
