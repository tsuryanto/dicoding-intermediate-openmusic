const { USERS, AUTHENTICATIONS } = require('../../utils/constant/Tables');

class AuthenticationRepository {
  constructor(dbPool) {
    this.dbPool = dbPool;
  }

  async getUser(username) {
    const query = {
      text: `SELECT id, password FROM ${USERS} WHERE username = $1`,
      values: [username],
    };

    const result = await this.dbPool.query(query);
    if (!result.rowCount) {
      return {};
    }

    return result.rows.map(({
      id, password,
    }) => ({
      id,
      password,
    }))[0];
  }

  async addRefreshToken(token) {
    const now = new Date().toISOString();
    const query = {
      text: `INSERT INTO ${AUTHENTICATIONS}(token, created_at) VALUES($1, $2)`,
      values: [token, now],
    };
    await this.dbPool.query(query);
  }

  async getToken(token) {
    const query = {
      text: `SELECT token FROM ${AUTHENTICATIONS} WHERE token = $1`,
      values: [token],
    };

    const result = await this.dbPool.query(query);
    if (!result.rowCount) {
      return null;
    }
    return result.rows[0].token;
  }
}

module.exports = AuthenticationRepository;
