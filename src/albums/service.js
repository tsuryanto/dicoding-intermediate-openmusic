const { nanoid } = require('nanoid');
const InvariantError = require('../../utils/response/exceptions/InvariantError');

class AlbumService {
  constructor(albumRepo) {
    this.albumRepo = albumRepo;
  }

  addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}}`;
    const resultId = this.albumRepo.create(id, name, year);
    if (!resultId) {
      throw new InvariantError('Album gagal ditambahkan');
    }
    return resultId;
  }
}

module.exports = AlbumService;
