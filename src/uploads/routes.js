const path = require('path');
const config = require('../../utils/constant/Config');

const routes = () => [
  {
    method: 'GET',
    path: '/uploads/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, `../../${config.file.path}`),
      },
    },
  },

];

module.exports = routes;
