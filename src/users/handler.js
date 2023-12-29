const { UserPayloadSchema } = require('./model/requestSchema');
const Success = require('../../utils/response/Success');
const Validator = require('../../utils/request/Validator');

class UsersHandler {
  constructor(service) {
    this.service = service;
  }

  async postUserHandler(request, h) {
    const validator = new Validator(UserPayloadSchema);
    validator.validate(request.payload);

    const { username, password, fullname } = request.payload;
    const userId = await this.service.addUser({ username, password, fullname });
    const success = new Success(h, 'User berhasil ditambahkan', { userId }, 201);
    return success.response();
  }
}

module.exports = UsersHandler;
