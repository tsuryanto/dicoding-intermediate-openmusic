const { nanoid } = require('nanoid');
const InvariantError = require('../../utils/response/exceptions/InvariantError');
const NotFoundError = require('../../utils/response/exceptions/NotFoundError');

class AlbumService {
  constructor(albumRepo) {
    this.albumRepo = albumRepo;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}}`;
    const resultId = await this.albumRepo.create(id, name, year);
    if (!resultId) {
      throw new InvariantError('Album gagal ditambahkan');
    }
    return resultId;
  }

  async getAlbum(id) {
    const album = await this.albumRepo.getById(id);
    if (!album) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return {
      id: album.id,
      name: album.name,
      year: album.year,
    };
  }
}

module.exports = AlbumService;
