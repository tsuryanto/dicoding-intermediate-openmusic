const Success = require('../../utils/response/Success');
const { AddAlbumPayloadSchema } = require('./model/requestSchema');
const Validator = require('../../utils/request/Validator');

class AlbumHandler {
  constructor(service) {
    this.service = service;
  }

  async postAlbumHandler(request, h) {
    const validator = new Validator(AddAlbumPayloadSchema);
    validator.validate(request.payload);

    const { name, year } = request.payload;
    const albumId = await this.service.addAlbum({ name, year });

    const success = new Success(h, 'Catatan berhasil ditambahkan', { albumId }, 201);
    return success.response();
  }
}

module.exports = AlbumHandler;
