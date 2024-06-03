const db = require('./postgres')

async function initialize() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS menu (
            id SERIAL PRIMARY KEY,
            item_name TEXT NOT NULL,
            image_link TEXT,
            category TEXT NOT NULL,
            price INT NOT NULL,
            description TEXT,
            featured BOOL DEFAULT false
        )
    `)
    return {message: "Success."}
}

module.exports.get = async (featured = false) => {
    await initialize()
    return await db.query(`
        SELECT * FROM menu ${(featured) ? 'WHERE featured = true' : ''} ORDER BY id`)
}

module.exports.add = async (data) => {
    await initialize()
    return await db.query(`
        INSERT INTO menu (item_name, image_link, category, price, description, featured)
        VALUES ($1, $2, $3, $4, $5, $6);`, 
        [data.item_name, data.image_link, data.category, data.price, data.description, data.featured != null]
    )
}

module.exports.edit = async (data) => {
    await initialize()
    return await db.query(`
        UPDATE menu 
        SET item_name = $1, image_link = $2, category = $3, price = $4, description = $5, featured = $6
        WHERE id = $7`, 
        [data.item_name, data.image_link, data.category, data.price, data.description, data.featured != null, data.id]
    )
}

module.exports.remove = async (data) => {
    await initialize()
    return await db.query(`
        DELETE FROM menu
        WHERE id = $1;`, 
        [data.id]
    )
}

module.exports.categories = async () => {
    await initialize()
    return await db.query(`SELECT DISTINCT category FROM menu`)
}

module.exports.category_items = async (category) => {
    await initialize()
    return await db.query(`SELECT * FROM menu WHERE category = $1 ORDER BY id`, [category])
}

module.exports.product = async (id) => {
    await initialize()
    return await db.query(`SELECT * FROM menu WHERE id = $1`, [id])
}