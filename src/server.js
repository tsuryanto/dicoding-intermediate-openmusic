// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const OnPreResponse = require('../utils/response/OnPreResponse');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // TODO: Init Services

  server.ext('onPreResponse', OnPreResponse);
  await server.start();
  process.stdout(`Server berjalan pada ${server.info.uri}`);
};

init();
