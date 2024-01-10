const routes = require('./routes');
const ExportHandler = require('./handler');
const ExportService = require('./service');
const PlaylistService = require('../playlists/service');
const PlaylistRepository = require('../playlists/repository');
const SongService = require('../songs/service');
const SongRepository = require('../songs/repository');
const CollaborationRepository = require('../collaborations/repository');

const InitExportPlugin = (dbPool) => ({
  plugin: {
    name: 'exports',
    version: '1.0.0',
    register: async (server) => {
      const songRepo = new SongRepository(dbPool);
      const songService = new SongService(songRepo);
      const collaborationRepo = new CollaborationRepository(dbPool);
      const playlistRepo = new PlaylistRepository(dbPool);
      const playlistService = new PlaylistService(songService, playlistRepo, collaborationRepo);

      const exportService = new ExportService(playlistService);
      const exportHandler = new ExportHandler(exportService, playlistService);
      server.route(routes(exportHandler));
    },
  },
});

module.exports = InitExportPlugin;
