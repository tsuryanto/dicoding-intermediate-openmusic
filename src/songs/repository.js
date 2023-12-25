/* eslint-disable camelcase */
const { SONGS } = require('../../utils/constant/Tables');

class SongRepository {
  constructor(dbPool) {
    this.dbPool = dbPool;
  }

  async create({
    id, title, year, genre, performer, duration, albumId,
  }) {
    const now = new Date().toISOString();
    const query = {
      text: `INSERT INTO ${SONGS}(id, title, year, genre, performer, duration, album_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      values: [id, title, year, genre, performer, duration, albumId, now, now],
    };

    const result = await this.dbPool.query(query);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0].id;
  }
}

module.exports = SongRepository;
