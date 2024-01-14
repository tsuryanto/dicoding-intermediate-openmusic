// mengimpor dotenv dan menjalankan konfigurasinya
const { Pool } = require('pg');
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const config = require('../utils/constant/Config');

const ClientError = require('../utils/response/exceptions/ClientError');
const Response = require('../utils/response/Response');

const InitAuthenticationPlugin = require('./authentications');
const InitUserPlugin = require('./users');
const InitAlbumPlugin = require('./albums');
const InitSongPlugin = require('./songs');
const InitPlaylistPlugin = require('./playlists');
const InitCollaborationPlugin = require('./collaborations');
const InitExportPlugin = require('./exports');
const InitUploadsPlugin = require('./uploads');

const init = async () => {
  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
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
    {
      plugin: Inert,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt

  // 'openMusicJwt' = strategy name akan digunakan untuk menetapkan authentication pada routes.
  // 'jwt' = nama skema yang akan digunakan pada pembuatan strategy
  //         di sini kita memberikan nilai ‘jwt’ untuk menggunakan strategi jwt dari @hapi/jwt.
  server.auth.strategy('openMusicJwt', 'jwt', {

    // merupakan key atau kunci dari token JWT-nya (di mana merupakan access token key)
    keys: config.jwt.accessKey,

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
      maxAgeSec: config.jwt.tokenAge,
    },

    // merupakan fungsi yang membawa artifacts token.
    // Fungsi ini dapat kita manfaatkan untuk menyimpan payload token
    // yang berarti kredensial pengguna pada request.auth
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.userId,
      },
    }),
  });

  // postgres connection
  const dbPool = new Pool({
    user: config.postgres.user,
    host: config.postgres.host,
    database: config.postgres.database,
    password: config.postgres.password,
    port: config.postgres.port,
  });

  // Init Services
  await server.register([
    InitAuthenticationPlugin(dbPool),
    InitUserPlugin(dbPool),
    InitAlbumPlugin(dbPool),
    InitSongPlugin(dbPool),
    InitPlaylistPlugin(dbPool),
    InitCollaborationPlugin(dbPool),
    InitExportPlugin(dbPool),
    InitUploadsPlugin(),
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

      // handle error response from Hapi
      if (response.isBoom) {
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
