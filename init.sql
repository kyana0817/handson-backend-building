use example;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY,
  username VARCHAR(32),
  email VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS posts (
  id INT PRIMARY KEY,
  user_id INT,
  title VARCHAR(64),
  content TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  id INT PRIMARY KEY,
  post_id INT,
  content TEXT,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS followers (
  source_id INT,
  target_id INT,
  FOREIGN KEY (source_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (target_id) REFERENCES users(id) ON DELETE CASCADE
);
