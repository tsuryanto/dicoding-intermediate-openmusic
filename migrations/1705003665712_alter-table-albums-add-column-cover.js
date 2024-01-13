const { ALBUMS } = require('../utils/constant/Tables');

exports.up = (pgm) => {
  pgm.addColumns(ALBUMS, {
    cover: {
      type: 'TEXT',
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns(ALBUMS, 'cover');
};
