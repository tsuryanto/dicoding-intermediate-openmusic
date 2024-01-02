const { USERS } = require('../../utils/constant/Tables');
const { returningId } = require('../../utils/storage/postgres/Query');

class UserRepository {
  constructor(dbPool) {
    this.dbPool = dbPool;
  }

  async create({
    id, username, hashedPassword: password, fullname,
  }) {
    const now = new Date().toISOString();
    const query = {
      text: `INSERT INTO ${USERS}(id, username, password, fullname, created_at, updated_at) 
            VALUES($1, $2, $3, $4, $5, $5) ON CONFLICT (username) DO NOTHING RETURNING id`,
      values: [id, username, password, fullname, now],
    };

    const resultId = await returningId(this.dbPool, query);
    return resultId;
  }

  async getById(reqId) {
    const query = {
      text: `SELECT id, username, fullname FROM ${USERS} WHERE id = $1`,
      values: [reqId],
    };

    const result = await this.dbPool.query(query);
    if (!result.rowCount) {
      return null;
    }

    return result.rows.map(({
      id, username, fullname,
    }) => ({
      id,
      username,
      fullname,
    }))[0];
  }
}

module.exports = UserRepository;
