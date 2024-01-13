const path = require('path');

const routes = () => [
  {
    method: 'GET',
    path: '/uploads/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, `../../${process.env.FILE_PATH}`),
      },
    },
  },

];

module.exports = routes;
