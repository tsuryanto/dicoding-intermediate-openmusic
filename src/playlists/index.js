const routes = require('./routes');
const PlaylistHandler = require('./handler');
const PlaylistService = require('./service');
const PlaylistRepository = require('./repository');
const SongService = require('../songs/service');
const SongRepository = require('../songs/repository');

const InitPlaylistPlugin = (dbPool) => ({
  plugin: {
    name: 'playlists',
    version: '1.0.0',
    register: async (server) => {
      const songRepo = new SongRepository(dbPool);
      const songService = new SongService(songRepo);

      const playlistRepo = new PlaylistRepository(dbPool);
      const playlistService = new PlaylistService(songService, playlistRepo, songRepo);
      const playlistHandler = new PlaylistHandler(playlistService);
      server.route(routes(playlistHandler));
    },
  },
});

module.exports = InitPlaylistPlugin;
