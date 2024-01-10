const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: (request, h) => handler.postPlaylistHandler(request, h),
    options: {
      auth: 'openMusicJwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: (request, h) => handler.getPlaylistsHandler(request, h),
    options: {
      auth: 'openMusicJwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: (request, h) => handler.deletePlaylistByIdHandler(request, h),
    options: {
      auth: 'openMusicJwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.postSongIntoPlaylistHandler(request, h),
    options: {
      auth: 'openMusicJwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.getSongsInPlaylistHandler(request, h),
    options: {
      auth: 'openMusicJwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.deleteSongFromPlaylistHandler(request, h),
    options: {
      auth: 'openMusicJwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: (request, h) => handler.getPlaylistSongActivityHandler(request, h),
    options: {
      auth: 'openMusicJwt',
    },
  },
];

module.exports = routes;
