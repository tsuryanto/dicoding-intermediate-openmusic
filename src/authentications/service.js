const Jwt = require('@hapi/jwt');
const bcrypt = require('bcrypt');
const AuthenticationError = require('../../utils/response/exceptions/AuthenticationError');

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
    const accessToken = Jwt.token.generate({ id }, process.env.ACCESS_TOKEN_KEY);
    const refreshToken = Jwt.token.generate({ id }, process.env.REFRESH_TOKEN_KEY);

    // add refresh token
    await this.authenticationRepo.addRefreshToken(refreshToken);

    return { accessToken, refreshToken };
  }
}

module.exports = AuthenticationService;
