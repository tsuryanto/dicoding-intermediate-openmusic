const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');

const InvariantError = require('../../utils/response/exceptions/InvariantError');

class SongService {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  async addUser({ username, password, fullname }) {
    const id = `user-${nanoid(16)}}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const resultId = await this.userRepo.create({
      id, username, hashedPassword, fullname,
    });
    if (!resultId) {
      throw new InvariantError('User gagal ditambahkan');
    }
    return resultId;
  }
}

module.exports = SongService;
