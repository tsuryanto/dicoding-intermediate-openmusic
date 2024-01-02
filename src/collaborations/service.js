const { nanoid } = require('nanoid');
const InvariantError = require('../../utils/response/exceptions/InvariantError');
const NotFoundError = require('../../utils/response/exceptions/NotFoundError');
const ForbiddenError = require('../../utils/response/exceptions/ForbiddenError');

class CollaborationService {
  constructor(playlistService, collaborationRepo, userRepo) {
    this.playlistService = playlistService;
    this.collaborationRepo = collaborationRepo;
    this.userRepo = userRepo;
  }

  async verifyCollaboration(credentialId, { playlistId }) {
    const collaboration = await this.collaborationRepo.get({ playlistId, userId: credentialId });
    if (!collaboration) {
      throw new NotFoundError('Collaboration tidak ditemukan');
    }

    if ((collaboration.userId !== credentialId)
    && (collaboration.owner !== credentialId)) {
      throw new ForbiddenError('Anda tidak berhak mengakses resource ini');
    }
  }

  async addCollaboration(credentialId, { playlistId, userId }) {
    await this.playlistService.verifyPlaylistOwner(credentialId, playlistId);
    const user = await this.userRepo.getById(userId);
    if (!user) {
      throw new NotFoundError('User tidak ditemukan');
    }

    const id = `collab-${nanoid(16)}}`;
    const resultId = await this.collaborationRepo.create(id, { playlistId, userId });
    if (!resultId) {
      throw new InvariantError('Collaboration gagal ditambahkan');
    }
    return resultId;
  }

  async deleteCollaboration(credentialId, { playlistId, userId }) {
    await this.playlistService.verifyPlaylistOwner(credentialId, playlistId);
    await this.verifyCollaboration(credentialId, { playlistId });
    const collaboration = await this.collaborationRepo.get({ playlistId, userId });
    if (!collaboration) {
      throw new NotFoundError('Collaboration tidak ditemukan');
    }

    const resultId = await this.collaborationRepo.deleteById({ id: collaboration.id });
    if (!resultId) {
      throw new NotFoundError('Song gagal dihapus dari Playlist');
    }
  }
}

module.exports = CollaborationService;
