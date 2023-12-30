const Jwt = require('@hapi/jwt');
const InvariantError = require('../response/exceptions/InvariantError');

class JWT {
  constructor(signature) {
    this.signature = signature;
  }

  encrypt(payload) {
    return Jwt.token.generate(payload, this.signature);
  }

  decrypt(token) {
    try {
      const artifacts = Jwt.token.decode(token);
      Jwt.token.verifySignature(artifacts, this.signature);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Token tidak valid');
    }
  }
}

module.exports = JWT;
