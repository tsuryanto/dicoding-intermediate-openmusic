const { COLLABORATIONS } = require('../utils/constant/Tables');

exports.up = (pgm) => {
  pgm.createTable(COLLABORATIONS, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
  });

  pgm.addConstraint('collaborations', 'fk_collaborations.playlist_id__playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('collaborations', 'fk_collaborations.user_id__users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable(COLLABORATIONS);
  pgm.dropConstraint('collaborations', 'fk_collaborations.playlist_id__playlists.id');
  pgm.dropConstraint('collaborations', 'fk_collaborations.user_id__users.id');
};
