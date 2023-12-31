/* eslint-disable camelcase */
const { PLAYLISTS, PLAYLIST_SONGS } = require('../../utils/constant/Tables');
const { returningId } = require('../../utils/storage/postgres/Query');

class AlbumRepository {
  constructor(dbPool) {
    this.dbPool = dbPool;
  }

  async create(id, name, owner) {
    const now = new Date().toISOString();
    const query = {
      text: `INSERT INTO ${PLAYLISTS}(id, name, owner ,created_at, updated_at) VALUES($1, $2, $3, $4, $4) RETURNING id`,
      values: [id, name, owner, now],
    };

    const resultId = await returningId(this.dbPool, query);
    return resultId;
  }

  async getAll(ownerParam) {
    const query = {
      text: `SELECT * from ${PLAYLISTS} WHERE owner = $1`,
      values: [ownerParam],
    };

    const result = await this.dbPool.query(query);
    return result.rows.map(({
      id, name, owner,
    }) => ({
      id,
      name,
      owner,
    }));
  }

  async getById(reqId) {
    const query = {
      text: `SELECT * FROM ${PLAYLISTS} WHERE id = $1`,
      values: [reqId],
    };
    const result = await this.dbPool.query(query);
    if (!result.rowCount) {
      return null;
    }

    return result.rows.map(({
      id, name, owner,
    }) => ({
      id,
      name,
      owner,
    }))[0];
  }

  async deleteById(id) {
    const query = {
      text: `DELETE FROM ${PLAYLISTS} WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const resultId = await returningId(this.dbPool, query);
    return resultId;
  }

  async addSong(id, playlistId, songId) {
    const now = new Date().toISOString();
    const query = {
      text: `INSERT INTO ${PLAYLIST_SONGS}(id, playlist_id, song_id, created_at) VALUES($1, $2, $3, $4) RETURNING id`,
      values: [id, playlistId, songId, now],
    };

    const resultId = await returningId(this.dbPool, query);
    return resultId;
  }
}

module.exports = AlbumRepository;
