const bcrypt = require('bcrypt');
const AuthenticationError = require('../../utils/response/exceptions/AuthenticationError');
const JWT = require('../../utils/authentication/JWT');
const InvariantError = require('../../utils/response/exceptions/InvariantError');
const config = require('../../utils/constant/Config');

class AuthenticationService {
  constructor(authenticationRepo) {
    this.authenticationRepo = authenticationRepo;
  }

  async processAuthentication({ username, password }) {
    // verify user credential
    const user = await this.authenticationRepo.getUser(username);
    if (!user?.id) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    // generate access token dan refresh token
    const accessToken = new JWT(config.jwt.accessKey).encrypt({ userId: user.id });
    const refreshToken = new JWT(config.jwt.refreshKey).encrypt({ userId: user.id });

    // add refresh token
    await this.authenticationRepo.addRefreshToken(refreshToken);

    return { accessToken, refreshToken };
  }

  async getAccessToken(refreshToken) {
    // get available refresh token from database
    const availableRefreshToken = await this.authenticationRepo.getRefreshToken(refreshToken);
    if (!availableRefreshToken) {
      throw new InvariantError('Refresh token tidak valid');
    }

    const { userId } = new JWT(config.jwt.refreshKey).decrypt(availableRefreshToken);
    const accessToken = new JWT(config.jwt.accessKey).encrypt({ userId });
    return accessToken;
  }

  async deleteRefreshToken(refreshToken) {
    new JWT(config.jwt.refreshKey).decrypt(refreshToken);
    await this.authenticationRepo.deleteRefreshToken(refreshToken);
  }
}

module.exports = AuthenticationService;
