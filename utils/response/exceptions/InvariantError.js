const ClientError = require('./ClientError');

class InvariantError extends ClientError {
  constructor(message, statusCode) {
    super(message, statusCode);
    this.name = 'InvariantError';
  }
}

module.exports = InvariantError;
