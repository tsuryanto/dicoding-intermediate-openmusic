const { PLAYLIST_SONG_ACTIVITIES } = require('../utils/constant/Tables');

exports.up = (pgm) => {
  pgm.createTable(PLAYLIST_SONG_ACTIVITIES, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
    },
    user_id: {
      type: 'VARCHAR(50)',
    },
    action: {
      type: 'TEXT',
      notNull: true,
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
  });

  pgm.addConstraint(PLAYLIST_SONG_ACTIVITIES, 'fk_playlist_song_activities.playlist_id__playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint(PLAYLIST_SONG_ACTIVITIES, 'fk_playlist_song_activities.playlist_id__playlists.id');

  pgm.dropTable(PLAYLIST_SONG_ACTIVITIES);
};
