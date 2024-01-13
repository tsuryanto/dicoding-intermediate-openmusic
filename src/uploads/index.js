const routes = require('./routes');

const InitUploadsPlugin = () => ({
  name: 'Uploads',
  version: '1.0.0',
  register: async (server) => {
    server.route(routes());
  },
});

module.exports = InitUploadsPlugin;
