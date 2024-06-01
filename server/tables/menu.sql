CREATE TABLE IF NOT EXISTS menu (
    id TEXT NOT NULL UNIQUE,
    item_name TEXT NOT NULL,
    image_link TEXT,
    category TEXT NOT NULL,
    price INT NOT NULL,
    description TEXT
)