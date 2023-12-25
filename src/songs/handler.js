const { SongPayloadSchema } = require('./model/requestSchema');
const Success = require('../../utils/response/Success');
const Validator = require('../../utils/request/Validator');

class SongHandler {
  constructor(service) {
    this.service = service;
  }

  async postSongHandler(request, h) {
    const validator = new Validator(SongPayloadSchema);
    validator.validate(request.payload);

    const {
      title, year, genre, performer, duration, albumId,
    } = request.payload;

    const songId = await this.service.addSong({
      title, year, genre, performer, duration, albumId,
    });

    const success = new Success(h, 'Song berhasil ditambahkan', { songId }, 201);
    return success.response();
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this.service.getSong(id);
    const success = new Success(h, null, { song });
    return success.response();
  }
}

module.exports = SongHandler;
