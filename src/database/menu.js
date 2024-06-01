const db = require('./postgres')

module.exports.menuTable = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS menu (
            id ID SERIAL PRIMARY KEY,
            item_name TEXT NOT NULL,
            image_link TEXT,
            category TEXT NOT NULL,
            price INT NOT NULL,
            description TEXT
        )
    `)
}