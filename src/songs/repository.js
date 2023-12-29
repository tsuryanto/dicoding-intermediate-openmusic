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
      text: `INSERT INTO ${SONGS}(id, title, year, genre, performer, duration, album_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $8) RETURNING id`,
      values: [id, title, year, genre, performer, duration, albumId, now],
    };

    const resultId = await returningId(this.dbPool, query);
    return resultId;
  }

  async getAll({ albumIdParam, titleParam, performerParam }) {
    const query = {
      text: `SELECT * from ${SONGS}`,
      values: [],
    };

    const param = {
      album_id: albumIdParam,
      title: titleParam,
      performer: performerParam,
    };
    const isParamEmpty = Object.keys(param).every((k) => !param[k]);
    if (!isParamEmpty) {
      query.text += ' WHERE ';
    }

    let i = 1;
    Object.keys(param).forEach((key) => {
      const value = param[key];
      if (value) {
        if (key === 'album_id') {
          query.text += `album_id = $${i}`;
          query.values.push(value);
        } else {
          if (i > 1) {
            query.text += ' AND ';
          }
          query.text += `LOWER(${key}) LIKE '%'||$${i}||'%'`;
          value.toLowerCase();
          query.values.push(value);
        }
        i += 1;
      }
    });

    const result = await this.dbPool.query(query);
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
