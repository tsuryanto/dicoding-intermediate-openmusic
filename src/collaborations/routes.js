const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: (request, h) => handler.postCollaborationHandler(request, h),
    options: {
      auth: 'notesappJwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: (request, h) => handler.deleteCollaborationHandler(request, h),
    options: {
      auth: 'notesappJwt',
    },
  },
];

module.exports = routes;
