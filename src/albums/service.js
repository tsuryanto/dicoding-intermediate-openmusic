const { nanoid } = require('nanoid');

const InvariantError = require('../../utils/response/exceptions/InvariantError');
const NotFoundError = require('../../utils/response/exceptions/NotFoundError');
const LocalStorage = require('../../utils/storage/local/File');
const Cache = require('../../utils/storage/redis/Cache');

class AlbumService {
  constructor(songService, albumRepo) {
    this.songService = songService;
    this.albumRepo = albumRepo;

    this.coversDir = 'albums/covers';
    this.cache = new Cache();
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
    const storage = new LocalStorage(this.coversDir);
    const fileName = await storage.writeFile(payload, meta);
    const resultId = await this.albumRepo.updateCoverById(id, fileName);
    if (!resultId) {
      throw new InvariantError('Sampul berhasil diunggah');
    }
  }

  async likeAlbum(albumId, userId) {
    const album = await this.albumRepo.getById(albumId);
    if (!album) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const userAlbumLike = await this.albumRepo.getLikeAlbumById(userId, albumId);
    if (userAlbumLike) {
      throw new InvariantError('Anda sudah men-like album ini');
    }

    const id = `user-album-like-${nanoid(16)}}`;
    const resultId = await this.albumRepo.addLikeAlbumById(id, userId, albumId);
    if (!resultId) {
      throw new InvariantError('Album gagal dilike');
    }

    // delete cache
    await this.cache.delete(`album-likes:${albumId}`);
  }

  async unlikeAlbum(albumId, userId) {
    const album = await this.albumRepo.getById(albumId);
    if (!album) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const userAlbumLike = await this.albumRepo.getLikeAlbumById(userId, albumId);
    if (!userAlbumLike) {
      throw new InvariantError('Anda belum men-like album ini');
    }

    const resultId = await this.albumRepo.deleteLikeAlbumById(userId, albumId);
    if (!resultId) {
      throw new InvariantError('Album gagal diunlike');
    }

    // delete cache
    await this.cache.delete(`album-likes:${albumId}`);
  }

  async countLikesAlbumById(albumId) {
    try {
      // get cache
      const likes = await this.cache.get(`album-likes:${albumId}`);
      return { likes: Number(likes), isCache: true };
    } catch (error) {
      const likes = await this.albumRepo.countLikesAlbumById(albumId);

      // set cache
      await this.cache.set(`album-likes:${albumId}`, likes, 1800);
      return { likes: Number(likes), isCache: false };
    }
  }
}

module.exports = AlbumService;
