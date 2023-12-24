const ClientError = require('../exceptions/ClientError');

const OnPreResponse = (request, h) => {
  // mendapatkan konteks response dari request
  const { response } = request;

  // penanganan client error secara internal.
  if (response instanceof ClientError) {
    const newResponse = h.response({
      status: 'fail',
      message: response.message,
    });
    newResponse.code(response.statusCode);
    return newResponse;
  }

  return h.continue;
};

module.exports = OnPreResponse;
