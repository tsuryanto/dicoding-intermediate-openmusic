/* eslint-disable camelcase */
const { COLLABORATIONS, PLAYLISTS } = require('../../utils/constant/Tables');
const { returningId } = require('../../utils/storage/postgres/Query');

class CollaborationRepository {
  constructor(dbPool) {
    this.dbPool = dbPool;
  }

  async create(id, { playlistId, userId }) {
    const now = new Date().toISOString();
    const query = {
      text: `INSERT INTO ${COLLABORATIONS}(id, playlist_id, user_id ,created_at) VALUES($1, $2, $3, $4) RETURNING id`,
      values: [id, playlistId, userId, now],
    };
    const resultId = await returningId(this.dbPool, query);
    return resultId;
  }

  async get({ playlistId, userId }) {
    const query = {
      text: `SELECT c.id, c.playlist_id, c.user_id, p.owner FROM ${COLLABORATIONS} c JOIN ${PLAYLISTS} p ON c.playlist_id = p.id WHERE c.playlist_id = $1 AND c.user_id = $2`,
      values: [playlistId, userId],
    };

    const result = await this.dbPool.query(query);
    if (!result.rowCount) {
      return null;
    }

    return result.rows.map(({
      id, playlist_id, user_id, owner,
    }) => ({
      id,
      playlistId: playlist_id,
      userId: user_id,
      owner,
    }))[0];
  }

  async deleteById(id) {
    const query = {
      text: `DELETE FROM ${COLLABORATIONS} WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const resultId = await returningId(this.dbPool, query);
    return resultId;
  }
}

module.exports = CollaborationRepository;
