const routes = require('./routes');
const PlaylistHandler = require('./handler');
const PlaylistService = require('./service');
const PlaylistRepository = require('./repository');

const InitPlaylistHPlugin = (dbPool) => ({
  plugin: {
    name: 'playlists',
    version: '1.0.0',
    register: async (server) => {
      const playlistRepo = new PlaylistRepository(dbPool);
      const playlistService = new PlaylistService(playlistRepo);
      const playlistHandler = new PlaylistHandler(playlistService);
      server.route(routes(playlistHandler));
    },
  },
});

module.exports = InitPlaylistHPlugin;
