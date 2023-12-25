/* eslint-disable camelcase */
const { ALBUMS } = require('../../utils/constant/Tables');

class AlbumRepository {
  constructor(dbPool) {
    this.dbPool = dbPool;
  }

  async create(id, name, year) {
    const now = new Date().toISOString();
    const query = {
      text: `INSERT INTO ${ALBUMS}(id, name, year, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING id`,
      values: [id, name, year, now, now],
    };

    const result = await this.dbPool.query(query);
    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].id;
  }

  async getById(reqId) {
    const query = {
      text: `SELECT * FROM ${ALBUMS} WHERE id = $1`,
      values: [reqId],
    };
    const result = await this.dbPool.query(query);
    if (result.rows.length === 0) {
      return null;
    }

    return result.rows.map(({
      id, name, year, created_at, updated_at,
    }) => ({
      id,
      name,
      year,
      createdAt: created_at,
      updatedAt: updated_at,
    }))[0];
  }
}

module.exports = AlbumRepository;
