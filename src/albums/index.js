const routes = require('./routes');
const AlbumHandler = require('./handler');
const AlbumService = require('./service');
const AlbumRepository = require('./repository');

const InitAlbumPlugin = (dbPool) => ({
  plugin: {
    name: 'albums',
    version: '1.0.0',
    register: async (server) => {
      const albumRepo = new AlbumRepository(dbPool);
      const albumService = new AlbumService(albumRepo);
      const albumHandler = new AlbumHandler(albumService);
      server.route(routes(albumHandler));
    },
  },
});

module.exports = InitAlbumPlugin;
