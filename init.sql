use example;

CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(32) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL,
  modified_at DATETIME,
  deleted_at DATETIME,
  PRIMARY KEY (id) 
);

CREATE TABLE IF NOT EXISTS posts (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(128) NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  modified_at DATETIME,
  deleted_at DATETIME,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  id INT NOT NULL AUTO_INCREMENT,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  modified_at DATETIME,
  deleted_at DATETIME,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS followers (
  source_id INT NOT NULL,
  target_id INT NOT NULL,
  created_at DATETIME NOT NULL,
  modified_at DATETIME,
  deleted_at DATETIME,
  FOREIGN KEY (source_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (target_id) REFERENCES users(id) ON DELETE CASCADE
);
