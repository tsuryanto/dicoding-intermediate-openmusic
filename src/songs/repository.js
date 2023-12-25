/* eslint-disable camelcase */
const { SONGS } = require('../../utils/constant/Tables');
const { returningId } = require('../../utils/storage/postgres/Query');

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

    const resultId = await returningId(this.dbPool, query);
    return resultId;
  }

  async getAll() {
    const result = await this.dbPool.query(`SELECT * from ${SONGS}`);
    return result.rows.map(({
      id, title, year, genre, performer, duration, album_id, created_at, updated_at,
    }) => ({
      id,
      title,
      year,
      genre,
      performer,
      duration,
      albumId: album_id,
      createdAt: created_at,
      updatedAt: updated_at,
    }));
  }

  async getById(reqId) {
    const query = {
      text: `SELECT * FROM ${SONGS} WHERE id = $1`,
      values: [reqId],
    };
    const result = await this.dbPool.query(query);
    if (result.rows.length === 0) {
      return null;
    }

    return result.rows.map(({
      id, title, year, genre, performer, duration, album_id, created_at, updated_at,
    }) => ({
      id,
      title,
      year,
      genre,
      performer,
      duration,
      albumId: album_id,
      createdAt: created_at,
      updatedAt: updated_at,
    }))[0];
  }

  async updateById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const now = new Date().toISOString();
    const query = {
      text: `UPDATE ${SONGS} SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id`,
      values: [title, year, genre, performer, duration, albumId, now, id],
    };

    const resultId = await returningId(this.dbPool, query);
    return resultId;
  }

  async deleteById(id) {
    const query = {
      text: `DELETE FROM ${SONGS} WHERE id = $1 RETURNING id`,
      values: [id],
    };
    const resultId = await returningId(this.dbPool, query);
    return resultId;
  }
}

module.exports = SongRepository;
