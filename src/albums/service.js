const { nanoid } = require('nanoid');
const InvariantError = require('../../utils/response/exceptions/InvariantError');
const NotFoundError = require('../../utils/response/exceptions/NotFoundError');

class AlbumService {
  constructor(songService, albumRepo) {
    this.songService = songService;
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
      songs: await this.songService.getSongs({
        albumIdParam: album.id,
      }),
    };
  }

  async editAlbumById(id, { name, year }) {
    const resultId = await this.albumRepo.updateById(id, { name, year });
    if (!resultId) {
      throw new NotFoundError('Album gagal diperbarui');
    }
  }

  async deleteAlbumById(id) {
    const resultId = await this.albumRepo.deleteById(id);
    if (!resultId) {
      throw new NotFoundError('Album gagal dihapus');
    }
  }
}

module.exports = AlbumService;
