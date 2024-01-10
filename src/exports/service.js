const Publish = require('../../utils/messageBroker/rabbitmq');

class ExportService {
  constructor(playlistService) {
    this.playlistService = playlistService;
    this.queueExportPlaylists = 'export:playlists';
  }

  async postExportPlaylists(credentialId, playlistId, targetEmail) {
    await this.playlistService.verifyPlaylistOwner(credentialId, playlistId);
    await Publish.sendMessage(this.queueExportPlaylists, JSON.stringify({
      userId: credentialId,
      playlistId,
      targetEmail,
    }));
  }
}

module.exports = ExportService;
