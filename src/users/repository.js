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
}

module.exports = UserRepository;
