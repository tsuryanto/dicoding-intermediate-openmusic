const Success = require('../../utils/response/Success');
const { AlbumPayloadSchema, PostAlbumCoverHeaderSchema } = require('./model/requestSchema');
const Validator = require('../../utils/request/Validator');
const Cache = require('../../utils/storage/redis/Cache');

class AlbumHandler {
  constructor(service) {
    this.service = service;
    this.cache = new Cache();
  }

  async postAlbumHandler(request, h) {
    const validator = new Validator(AlbumPayloadSchema);
    validator.validate(request.payload);

    const { name, year } = request.payload;
    const albumId = await this.service.addAlbum({ name, year });

    const success = new Success(h, 'Album berhasil ditambahkan', { albumId }, 201);
    return success.response();
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this.service.getAlbum(id);
    const success = new Success(h, null, { album });
    return success.response();
  }

  async putAlbumByIdHandler(request, h) {
    const validator = new Validator(AlbumPayloadSchema);
    validator.validate(request.payload);

    const { id } = request.params;
    const { name, year } = request.payload;

    await this.service.editAlbumById(id, { name, year });
    const success = new Success(h, 'Album berhasil diperbarui');
    return success.response();
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    await this.service.deleteAlbumById(id);
    const success = new Success(h, 'Album berhasil dihapus');
    return success.response();
  }

  async postUploadAlbumCoverHandler(request, h) {
    const payloadObj = request.payload;
    const data = payloadObj.cover;

    const validator = new Validator(PostAlbumCoverHeaderSchema, true);
    validator.validate(data.hapi.headers);

    const { id } = request.params;
    await this.service.uploadAlbumCover(id, data, data.hapi);
    const success = new Success(h, 'Sampul berhasil diunggah', null, 201);
    return success.response();
  }

  async postLikeAlbumByIdHandler(request, h) {
    const { albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.service.likeAlbum(albumId, credentialId);
    const success = new Success(h, 'Album berhasil dilike', null, 201);

    // delete cache
    await this.cache.delete(`album-likes:${albumId}`);
    return success.response();
  }

  async deleteLikeAlbumByIdHandler(request, h) {
    const { albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.service.unlikeAlbum(albumId, credentialId);
    const success = new Success(h, 'Album berhasil diunlike');

    // delete cache
    await this.cache.delete(`album-likes:${albumId}`);
    return success.response();
  }

  async getLikesAlbumByIdHandler(request, h) {
    const { albumId } = request.params;
    try {
      // get cache
      const result = await this.cache.get(`album-likes:${albumId}`);
      const success = new Success(h, null, { likes: Number(result) });
      const response = success.response();
      response.header('X-Data-Source', 'cache');
      return response;
    } catch (error) {
      const likes = await this.service.countLikesAlbumById(albumId);
      const success = new Success(h, null, { likes });

      // set cache
      await this.cache.set(`album-likes:${albumId}`, likes, 1800);
      return success.response();
    }
  }
}

module.exports = AlbumHandler;
