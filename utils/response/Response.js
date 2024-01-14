class Response {
  constructor(h, message, code, data, status) {
    this.h = h;
    this.message = message;
    this.code = code;
    this.data = data;
    this.status = status;
  }

  header() {
    return this.h.response();
  }

  response() {
    const payload = {
      status: this.status,
    };

    if (this.data) {
      payload.data = this.data;
    }

    if (this.message) {
      payload.message = this.message;
    }

    return this.h.response(payload).code(this.code);
  }
}

module.exports = Response;
