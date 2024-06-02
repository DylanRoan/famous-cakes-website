const db = require('./postgres')

module.exports.initialize = async () => {
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
    return await db.query(`
        SELECT * FROM menu ${(featured) ? 'WHERE featured = true' : ''}`)
}

module.exports.add = async (data) => {
    return await db.query(`
        INSERT INTO menu (item_name, image_link, category, price, description, featured)
        VALUES ($1, $2, $3, $4, $5, $6);`, 
        [data.item_name, data.image_link, data.category, data.price, data.description, data.featured != null]
    )
}

module.exports.categories = async () => {
    return await db.query(`SELECT DISTINCT category FROM menu`)
}

module.exports.category_items = async (category) => {
    return await db.query(`SELECT * FROM menu WHERE category = $1`, [category])
}

module.exports.item = async (id) => {
    return await db.query(`SELECT * FROM menu WHERE id = $1`, [id])
}