const { nanoid } = require('nanoid');

const InvariantError = require('../../utils/response/exceptions/InvariantError');
const NotFoundError = require('../../utils/response/exceptions/NotFoundError');
const LocalStorage = require('../../utils/storage/local/File');

class AlbumService {
  constructor(songService, albumRepo) {
    this.songService = songService;
    this.albumRepo = albumRepo;

    this.coversDir = 'albums/covers';
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

    const storage = new LocalStorage(this.coversDir);
    return {
      id: album.id,
      name: album.name,
      year: album.year,
      songs: await this.songService.getSongs({
        albumIdParam: album.id,
      }),
      coverUrl: album.cover ? storage.getUrlUpload(album.cover) : null,
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

  async uploadAlbumCover(id, payload, meta) {
    // check file size
    const { _data: fileData } = payload;
    if (fileData.length > 512000) {
      throw new InvariantError('Ukuran file harus kurang dari 500kb', 413);
    }

    const storage = new LocalStorage(this.coversDir);
    const fileName = await storage.writeFile(payload, meta);
    const resultId = await this.albumRepo.updateCoverById(id, fileName);
    if (!resultId) {
      throw new InvariantError('Sampul berhasil diunggah');
    }
  }
}

module.exports = AlbumService;
