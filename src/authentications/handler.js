const { PostAuthenticationPayloadSchema } = require('./model/requestSchema');
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
}

module.exports = AuthenticationHandler;
