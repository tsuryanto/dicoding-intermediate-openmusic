// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const { Pool } = require('pg');
const ClientError = require('../utils/response/exceptions/ClientError');
const InitUserPlugin = require('./users');
const InitAlbumPlugin = require('./albums');
const InitSongPlugin = require('./songs');
const Response = require('../utils/response/Response');

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

  const dbPool = new Pool();

  // Init Services
  await server.register([
    InitUserPlugin(dbPool),
    InitAlbumPlugin(dbPool),
    InitSongPlugin(dbPool),
  ]);

  // err response handling
  server.ext('onPreResponse', (request, h) => {
    // get response context from request
    const { response } = request;

    // handling internal client error
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const resp = new Response(h, response.message, response.statusCode, null, 'fail');
        return resp.response();
      }

      const resp = new Response(h, 'Internal server error', 500, null, 'error');
      return resp.response();
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
