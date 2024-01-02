const routes = require('./routes');
const CollaborationHandler = require('./handler');
const CollaborationService = require('./service');
const CollaborationRepository = require('./repository');

const PlaylistService = require('../playlists/service');
const PlaylistRepository = require('../playlists/repository');
const SongService = require('../songs/service');
const SongRepository = require('../songs/repository');
const UserRepository = require('../users/repository');

const InitCollaborationPlugin = (dbPool) => ({
  plugin: {
    name: 'collaborations',
    version: '1.0.0',
    register: async (server) => {
      const songRepo = new SongRepository(dbPool);
      const songService = new SongService(songRepo);

      const playlistRepo = new PlaylistRepository(dbPool);
      const playlistService = new PlaylistService(songService, playlistRepo, songRepo);

      const userRepo = new UserRepository(dbPool);
      const collaborationRepo = new CollaborationRepository(dbPool);
      const collaborationService = new CollaborationService(
        playlistService,
        collaborationRepo,
        userRepo,
      );
      const collaborationHandler = new CollaborationHandler(collaborationService);
      server.route(routes(collaborationHandler));
    },
  },
});

module.exports = InitCollaborationPlugin;
