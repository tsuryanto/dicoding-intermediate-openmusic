const routes = require('./routes');
const SongHandler = require('./handler');
const SongService = require('./service');
const SongRepository = require('./repository');

const InitSongPlugin = (dbPool) => ({
  plugin: {
    name: 'songs',
    version: '1.0.0',
    register: async (server) => {
      const songRepo = new SongRepository(dbPool);
      const songService = new SongService(songRepo);
      const songHandler = new SongHandler(songService);
      server.route(routes(songHandler));
    },
  },
});

module.exports = InitSongPlugin;
