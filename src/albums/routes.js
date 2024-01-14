const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (request, h) => handler.postAlbumHandler(request, h),
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (request, h) => handler.getAlbumByIdHandler(request, h),
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (request, h) => handler.putAlbumByIdHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (request, h) => handler.deleteAlbumByIdHandler(request, h),
  },
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: (request, h) => handler.postUploadAlbumCoverHandler(request, h),
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'POST',
    path: '/albums/{albumId}/likes',
    handler: (request, h) => handler.postLikeAlbumByIdHandler(request, h),
    options: {
      auth: 'openMusicJwt',
    },
  },
  {
    method: 'DELETE',
    path: '/albums/{albumId}/likes',
    handler: (request, h) => handler.deleteLikeAlbumByIdHandler(request, h),
    options: {
      auth: 'openMusicJwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{albumId}/likes',
    handler: (request, h) => handler.getLikesAlbumByIdHandler(request, h),
  },
];

module.exports = routes;
