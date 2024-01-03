const routes = require('./routes');
const PlaylistHandler = require('./handler');
const PlaylistService = require('./service');
const PlaylistRepository = require('./repository');
const SongService = require('../songs/service');
const SongRepository = require('../songs/repository');
const CollaborationRepository = require('../collaborations/repository');

const InitPlaylistPlugin = (dbPool) => ({
  plugin: {
    name: 'playlists',
    version: '1.0.0',
    register: async (server) => {
      const songRepo = new SongRepository(dbPool);
      const songService = new SongService(songRepo);

      const collaborationRepo = new CollaborationRepository(dbPool);

      const playlistRepo = new PlaylistRepository(dbPool);
      const playlistService = new PlaylistService(songService, playlistRepo, collaborationRepo);
      const playlistHandler = new PlaylistHandler(playlistService);
      server.route(routes(playlistHandler));
    },
  },
});

module.exports = InitPlaylistPlugin;
