const {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
} = require('./model/requestSchema');
const Success = require('../../utils/response/Success');
const Validator = require('../../utils/request/Validator');

class AuthenticationHandler {
  constructor(service) {
    this.service = service;
  }

  async postAuthenticationHandler(request, h) {
    const validator = new Validator(PostAuthenticationPayloadSchema);
    validator.validate(request.payload);

    const { username, password } = request.payload;
    const {
      accessToken,
      refreshToken,
    } = await this.service.processAuthentication({ username, password });
    const success = new Success(h, 'Authentication berhasil', { accessToken, refreshToken }, 201);
    return success.response();
  }

  async putAuthenticationHandler(request, h) {
    const validator = new Validator(PutAuthenticationPayloadSchema);
    validator.validate(request.payload);

    const { refreshToken } = request.payload;
    const accessToken = await this.service.getAccessToken(refreshToken);
    const success = new Success(h, 'Access Token berhasil diperbarui', { accessToken });
    return success.response();
  }

  async deleteAuthenticationHandler(request, h) {
    const validator = new Validator(DeleteAuthenticationPayloadSchema);
    validator.validate(request.payload);

    const { refreshToken } = request.payload;
    await this.service.deleteRefreshToken(refreshToken);
    const success = new Success(h, 'Access Token berhasil dihapus');
    return success.response();
  }
}

module.exports = AuthenticationHandler;
