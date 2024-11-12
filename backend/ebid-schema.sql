CREATE TABLE categories (
  title VARCHAR(25) PRIMARY KEY
);

CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL CHECK (position('@' IN email) > 1),
  password TEXT NOT NULL
);

CREATE TABLE listings (
  id SERIAL PRIMARY KEY,
  created_by VARCHAR(25) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  starting_bid NUMERIC NOT NULL,
  current_bid NUMERIC,
  category VARCHAR(25) REFERENCES categories (title) ON DELETE SET NULL,
  winner VARCHAR(25),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  end_datetime TIMESTAMPTZ NOT NULL
);

CREATE TABLE watched_listings (
  username VARCHAR(25)
    REFERENCES users ON DELETE CASCADE,
  listing_id INTEGER
    REFERENCES listings ON DELETE CASCADE,
  PRIMARY KEY (username, listing_id)
);

CREATE TABLE bidders (
  id SERIAL PRIMARY KEY,
  bidder VARCHAR(25) NOT NULL
    REFERENCES users ON DELETE CASCADE,
  listing_id INTEGER NOT NULL
    REFERENCES listings ON DELETE CASCADE,
  bid NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
