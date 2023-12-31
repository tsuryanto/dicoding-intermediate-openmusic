// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const { Pool } = require('pg');
const Jwt = require('@hapi/jwt');
const ClientError = require('../utils/response/exceptions/ClientError');
const InitAuthenticationPlugin = require('./authentications');
const InitUserPlugin = require('./users');
const InitAlbumPlugin = require('./albums');
const InitSongPlugin = require('./songs');
const InitPlaylistPlugin = require('./playlists');
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

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt

  // 'notesapp_jwt' = strategy name akan digunakan untuk menetapkan authentication pada routes.
  // 'jwt' = nama skema yang akan digunakan pada pembuatan strategy
  //         di sini kita memberikan nilai ‘jwt’ untuk menggunakan strategi jwt dari @hapi/jwt.
  server.auth.strategy('notesappJwt', 'jwt', {

    // merupakan key atau kunci dari token JWT-nya (di mana merupakan access token key)
    keys: process.env.ACCESS_TOKEN_KEY,

    // merupakan objek yang menentukan seperti apa signature token JWT harus diverifikasi.
    // nilai false di value dari object verify berarti tidak akan di verifikasi
    verify: {
    // nilai audience dari token
      aud: false,
      // nilai issuer dari token
      iss: false,
      // nilai subject dari token,
      sub: false,
      // nilai number yang menentukan umur kedaluwarsa dari token
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },

    // merupakan fungsi yang membawa artifacts token.
    // Fungsi ini dapat kita manfaatkan untuk menyimpan payload token
    // yang berarti kredensial pengguna pada request.auth
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  const dbPool = new Pool();

  // Init Services
  await server.register([
    InitAuthenticationPlugin(dbPool),
    InitUserPlugin(dbPool),
    InitAlbumPlugin(dbPool),
    InitSongPlugin(dbPool),
    InitPlaylistPlugin(dbPool),
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

      // handle unauthorized response from Hapi
      if (response.isBoom && response.output.payload.statusCode === 401) {
        const resp = new Response(h, response.output.payload.message, response.output.payload.statusCode, null, 'fail');
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
