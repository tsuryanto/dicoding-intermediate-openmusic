const bcrypt = require('bcrypt');
const AuthenticationError = require('../../utils/response/exceptions/AuthenticationError');
const JWT = require('../../utils/authentication/JWT');

class AuthenticationService {
  constructor(authenticationRepo) {
    this.authenticationRepo = authenticationRepo;
  }

  async processAuthentication({ username, password }) {
    // verify user credential
    const { id, password: hashedPassword } = await this.authenticationRepo.getUser(username);
    const isMatch = await bcrypt.compare(password, hashedPassword || null);
    if (!isMatch) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    // generate access token dan refresh token
    const accessToken = new JWT(process.env.ACCESS_TOKEN_KEY).encrypt({ id });
    const refreshToken = new JWT(process.env.REFRESH_TOKEN_KEY).encrypt({ id });

    // add refresh token
    await this.authenticationRepo.addRefreshToken(refreshToken);

    return { accessToken, refreshToken };
  }
}

module.exports = AuthenticationService;
