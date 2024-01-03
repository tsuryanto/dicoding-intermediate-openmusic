/* eslint-disable camelcase */
const {
  PLAYLISTS, PLAYLIST_SONGS, USERS, COLLABORATIONS, PLAYLIST_SONG_ACTIVITIES, SONGS,
} = require('../../utils/constant/Tables');
const { returningId } = require('../../utils/storage/postgres/Query');

class PlaylistRepository {
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

  async getAll(credentialId) {
    const query = {
      text: `SELECT p.*, u.username from ${PLAYLISTS} p JOIN ${USERS} u on p.owner = u.id LEFT JOIN ${COLLABORATIONS} c ON p.id = c.playlist_id WHERE p.owner = $1 OR c.user_id = $1 GROUP BY p.id, u.username`,
      values: [credentialId],
    };

    const result = await this.dbPool.query(query);
    return result.rows.map(({
      id, name, owner, username,
    }) => ({
      id,
      name,
      owner,
      username,
    }));
  }

  async getById(reqId) {
    const query = {
      text: `SELECT p.id, p.name, p.owner, u.username FROM ${PLAYLISTS} p LEFT JOIN ${USERS} u on p.owner = u.id WHERE p.id = $1`,
      values: [reqId],
    };
    const result = await this.dbPool.query(query);
    if (!result.rowCount) {
      return null;
    }

    return result.rows.map(({
      id, name, owner, username,
    }) => ({
      id,
      name,
      owner,
      username,
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

  async deleteSongById(playlistId, songId) {
    const query = {
      text: `DELETE FROM ${PLAYLIST_SONGS} WHERE playlist_id = $1 AND song_id = $2 RETURNING id`,
      values: [playlistId, songId],
    };

    const resultId = await returningId(this.dbPool, query);
    return resultId;
  }

  async createSongActivity(credentialId, {
    id, playlistId, songId, action,
  }) {
    const now = new Date().toISOString();
    const query = {
      text: `INSERT INTO ${PLAYLIST_SONG_ACTIVITIES}(id, playlist_id, song_id ,user_id, action, created_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING id`,
      values: [id, playlistId, songId, credentialId, action, now],
    };

    const resultId = await returningId(this.dbPool, query);
    return resultId;
  }

  async getAllSongActivities(playlistId) {
    const query = {
      text: `SELECT psa.*, u.username, s.title from ${PLAYLIST_SONG_ACTIVITIES} psa JOIN ${USERS} u on psa.user_id = u.id JOIN ${SONGS} s ON psa.song_id = s.id WHERE psa.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this.dbPool.query(query);
    return result.rows.map(({
      id, playlist_id, song_id, user_id, action, created_at, username, title,
    }) => ({
      id,
      playlistId: playlist_id,
      songId: song_id,
      userId: user_id,
      time: created_at,
      action,
      username,
      title,
    }));
  }
}

module.exports = PlaylistRepository;
