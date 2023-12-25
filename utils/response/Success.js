const Response = require('./Response');

class Success extends Response {
  constructor(h, message, data, code = 200) {
    super(h, message, code, data, 'success');
  }
}

module.exports = Success;
