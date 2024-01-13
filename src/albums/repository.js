/* eslint-disable camelcase */
const { ALBUMS, USER_ALBUM_LIKES } = require('../../utils/constant/Tables');
const { returningId } = require('../../utils/storage/postgres/Query');

class AlbumRepository {
  constructor(dbPool) {
    this.dbPool = dbPool;
  }

  async create(id, name, year) {
    const now = new Date().toISOString();
    const query = {
      text: `INSERT INTO ${ALBUMS}(id, name, year, created_at, updated_at) VALUES($1, $2, $3, $4, $4) RETURNING id`,
      values: [id, name, year, now],
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
    if (!result.rowCount) {
      return null;
    }

    return result.rows.map(({
      id, name, year, cover, created_at, updated_at,
    }) => ({
      id,
      name,
      year,
      cover,
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

  async updateCoverById(id, filename) {
    const now = new Date().toISOString();
    const query = {
      text: `UPDATE ${ALBUMS} SET cover = $2, updated_at = $3 WHERE id = $1 RETURNING id`,
      values: [id, filename, now],
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

  async addLikeAlbumById(id, userId, albumId) {
    const now = new Date().toISOString();
    const query = {
      text: `INSERT INTO ${USER_ALBUM_LIKES}(id, user_id, album_id, created_at) VALUES($1, $2, $3, $4) RETURNING id`,
      values: [id, userId, albumId, now],
    };

    const resultId = await returningId(this.dbPool, query);
    return resultId;
  }

  async getLikeAlbumById(userId, albumId) {
    const query = {
      text: `SELECT * FROM ${USER_ALBUM_LIKES} WHERE user_id = $1 AND album_id = $2`,
      values: [userId, albumId],
    };
    const result = await this.dbPool.query(query);
    if (!result.rowCount) {
      return null;
    }

    return result.rows.map(({
      id, user_id, album_id, created_at,
    }) => ({
      id,
      userId: user_id,
      albumId: album_id,
      createdAt: created_at,
    }))[0];
  }

  async countLikesAlbumById(albumId) {
    const query = {
      text: `SELECT COUNT(*) FROM ${USER_ALBUM_LIKES} WHERE album_id = $1`,
      values: [albumId],
    };
    const result = await this.dbPool.query(query);
    if (!result.rowCount) {
      return null;
    }

    return result.rows[0].count;
  }

  async deleteLikeAlbumById(userId, albumId) {
    const query = {
      text: `DELETE FROM ${USER_ALBUM_LIKES} WHERE user_id = $1 AND album_id = $2 RETURNING id`,
      values: [userId, albumId],
    };

    const resultId = await returningId(this.dbPool, query);
    return resultId;
  }
}

module.exports = AlbumRepository;
