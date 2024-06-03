const db = require('./postgres')

module.exports.get = async (featured = false) => {
    return await db.query(`
        SELECT * FROM menu ${(featured) ? 'WHERE featured = true' : ''} ORDER BY id`)
}

module.exports.add = async (data) => {
    return await db.query(`
        INSERT INTO menu (item_name, image_link, category, price, description, featured)
        VALUES ($1, $2, $3, $4, $5, $6);`, 
        [data.item_name, data.image_link, data.category, data.price, data.description, data.featured != null]
    )
}

module.exports.edit = async (data) => {
    return await db.query(`
        UPDATE menu 
        SET item_name = $1, image_link = $2, category = $3, price = $4, description = $5, featured = $6
        WHERE id = $7`, 
        [data.item_name, data.image_link, data.category, data.price, data.description, data.featured != null, data.id]
    )
}

module.exports.remove = async (data) => {
    return await db.query(`
        DELETE FROM menu
        WHERE id = $1;`, 
        [data.id]
    )
}

module.exports.categories = async () => {
    return await db.query(`SELECT DISTINCT category FROM menu`)
}

module.exports.category_items = async (category) => {
    return await db.query(`SELECT * FROM menu WHERE category = $1 ORDER BY id`, [category])
}

module.exports.product = async (id) => {
    return await db.query(`SELECT * FROM menu WHERE id = $1`, [id])
}