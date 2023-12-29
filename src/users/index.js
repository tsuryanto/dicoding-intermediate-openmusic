const routes = require('./routes');
const UserHandler = require('./handler');
const UserService = require('./service');
const UserRepository = require('./repository');

const InitUserPlugin = (dbPool) => ({
  plugin: {
    name: 'users',
    version: '1.0.0',
    register: async (server) => {
      const userRepo = new UserRepository(dbPool);
      const userService = new UserService(userRepo);
      const userHandler = new UserHandler(userService);
      server.route(routes(userHandler));
    },
  },
});

module.exports = InitUserPlugin;
