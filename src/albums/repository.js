/* eslint-disable camelcase */
const { ALBUMS } = require('../../utils/constant/Tables');
const { returningId } = require('../../utils/storage/postgres/Query');

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

    const resultId = await returningId(this.dbPool, query);
    return resultId;
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

  async updateById(id, { name, year }) {
    const now = new Date().toISOString();
    const query = {
      text: `UPDATE ${ALBUMS} SET name = $2, year = $3, updated_at = $4 WHERE id = $1 RETURNING id`,
      values: [id, name, year, now],
    };

    const resultId = await returningId(this.dbPool, query);
    return resultId;
  }

  async deleteById(id) {
    const query = {
      text: `DELETE FROM ${ALBUMS} WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const resultId = await returningId(this.dbPool, query);
    return resultId;
  }
}

module.exports = AlbumRepository;
