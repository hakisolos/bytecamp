CREATE TABLE IF NOT EXISTS users (
    ID SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT,
    courses JSONB DEFAULT '[]'::jsonb,
    avatar TEXT DEFAULT 'https://cdn.kord.live/serve/0UheGdj1TJcC.jpg',
    level TEXT DEFAULT 'bronze',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)