exports.up = (pgm) => {
  // create table user_album_likes with column id (primary key) , user_id, and album_id
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  // create constraint foreign key from user_album_likes.user_id to users.id
  pgm.addConstraint('user_album_likes', 'fk_user_album_likes.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');

  // create constraint foreign key from user_album_likes.album_id to albums.id
  pgm.addConstraint('user_album_likes', 'fk_user_album_likes.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // drop constraint foreign key from user_album_likes.album_id to albums.id
  pgm.dropConstraint('user_album_likes', 'fk_user_album_likes.album_id_albums.id');

  // drop constraint foreign key from user_album_likes.user_id to users.id
  pgm.dropConstraint('user_album_likes', 'fk_user_album_likes.user_id_users.id');

  // drop table user_album_likes
  pgm.dropTable('user_album_likes');
};
