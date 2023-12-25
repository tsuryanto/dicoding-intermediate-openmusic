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
      return '';
    }

    return result.rows[0].id;
  }
}

module.exports = AlbumRepository;
