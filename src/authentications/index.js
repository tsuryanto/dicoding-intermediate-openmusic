const routes = require('./routes');
const AuthenticationHandler = require('./handler');
const AuthenticationService = require('./service');
const AuthenticationRepository = require('./repository');

const InitAuthenticationPlugin = (dbPool) => ({
  plugin: {
    name: 'authentications',
    version: '1.0.0',
    register: async (server) => {
      const authenticationRepo = new AuthenticationRepository(dbPool);
      const authenticationService = new AuthenticationService(authenticationRepo);
      const authenticationHandler = new AuthenticationHandler(authenticationService);
      server.route(routes(authenticationHandler));
    },
  },
});

module.exports = InitAuthenticationPlugin;
