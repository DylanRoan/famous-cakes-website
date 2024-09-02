const db = require('./postgres')

module.exports.search = async (value, limit = 5) => {
    //This needs `CREATE EXTENSION pg_trgm;` on a new database.
    let result = await db.query(`SELECT product_id, name, price FROM products ORDER BY SIMILARITY(name, $1) DESC LIMIT $2;`, [value, limit])
    
    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: result.rows}
}

module.exports.product = async (product) => {
    let result = await db.query(`
        SELECT p.*, (
            SELECT ROUND(AVG(r.rating), 1)
            FROM reviews r
            WHERE r.product_id = p.product_id
        ) AS average_rating,
        (
            SELECT COUNT(*)
            FROM reviews r
            WHERE r.product_id = p.product_id
        ) AS num_reviews
        FROM products p
        WHERE p.product_id = $1;`, [product])
    return result
}

module.exports.products = async (category = false, subcategory = false, sort = false, price_name_sort = [], user_id = false) => {
    let params = {'category': category, 'subcategory': subcategory, 'sort': sort}
    let placeholder = []
    let parameters = []
    let index = 1
    for (const [key, value] of Object.entries(params)) {
        if (value) 
        {
            placeholder.push(`${key} = $${index}`)
            parameters.push(value)
            index += 1
        }
    }

    let query = `SELECT products.*, (
            SELECT COALESCE(ROUND(AVG(r.rating), 1), 0)
            FROM reviews r
            WHERE r.product_id = products.product_id
        ) AS average_rating,
        (
            SELECT COUNT(*)
            FROM reviews r
            WHERE r.product_id = products.product_id
        ) AS num_reviews`

    if (user_id) {
        query += `, (SELECT amount FROM cart WHERE user_id = '${user_id}' AND product_id = products.product_id) AS cart_count`
    }

    query += ` FROM products `

    if (placeholder.length > 0) query += " WHERE " + placeholder.join(" AND ")


    let order_by = [`CASE WHEN category = 'cake' THEN 0 ELSE 1 END`, 'custom DESC', 'category', 'subcategory']
    order_by.concat(price_name_sort)
    
    query += " ORDER BY " + order_by.join(", ")
    query += ';'

    let result = await db.query(query, parameters)
    if (!result) 
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: result.rows}
}

module.exports.categories = async () => {
    let result = await db.query(`
        WITH filtered_subcategories AS (
            SELECT
                category,
                subcategory
            FROM products
            WHERE subcategory <> ''
            ORDER BY CASE WHEN category = 'cake' THEN 0 ELSE 1 END
        ),
        subcategories_aggregated AS (
            SELECT
                category,
                array_agg(DISTINCT subcategory ORDER BY subcategory) AS subcategories
            FROM filtered_subcategories
            GROUP BY category
            ORDER BY CASE WHEN category = 'cake' THEN 0 ELSE 1 END
        )
        SELECT json_object_agg(category, subcategories) AS categories
        FROM subcategories_aggregated;`)

    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: result.rows}
}



module.exports.add = async (product_id, product_data) => {
    
    if (Object.keys(product_data).length < 1)
        return {status: 403, message: "Insufficient product data."}

    product_data["product_id"] = product_id

    let keys = Object.keys(product_data)
    let values = Object.values(product_data)
    let params = []
    for (let v = 0; v < keys.length; v++) {
        params.push(`$` + (v + 1))
    }

    let exists = await db.query(`SELECT product_id FROM products WHERE product_id = $1;`, [product_id])
    if (!exists)
        return {status: 400, message: "Database error."}
    else if (exists.rows.length > 0)
        return {status: 403, message: "Product with that id already exists."}

    let result = await db.query(`INSERT INTO products (${keys.join(", ")}) VALUES (${params.join(", ")})`, values)

    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: "Success."}
}

module.exports.edit = async (product_id, product_data) => {

    //Return if product data is empty
    if (Object.keys(product_data).length < 1)
        return {status: 403, message: "Insufficient product data."}

    //Create parametization
    let keys = Object.keys(product_data)
    let values = Object.values(product_data)
    let params = []
    for (let v = 0; v < keys.length; v++) {
        let k = keys[v]
        if (k == "new_product_id") 
            k = "product_id"
        params.push(`${k} = $${v + 1}`)
    }

    //Check if product with the id exists
    let exists = await db.query(`SELECT product_id FROM products WHERE product_id = $1;`, [product_id])
    if (!exists)
        return {status: 400, message: "Database error."}
    else if (exists.rows.length < 1)
        return {status: 403, message: "Product with that id doesn't exist."}

    //Check if product with the new id exists
    if ("new_product_id" in product_data) {
        let exists2 = await db.query(`SELECT product_id FROM products WHERE product_id = $1;`, [product_data['new_product_id']])
        if (!exists2)
            return {status: 400, message: "Database error."}
        else if (exists2.rows.length > 0)
            return {status: 403, message: "Product with that new id already exists."}
    }

    //Make the call
    values.push(product_id)
    let result = await db.query(`UPDATE products SET ${params.join(", ")} WHERE product_id = $${params.length + 1}`, values)

    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: "Success."}
}

module.exports.remove = async (product_id) => {
    //Check if product with the id exists
    let exists = await db.query(`SELECT product_id FROM products WHERE product_id = $1;`, [product_id])
    if (!exists)
        return {status: 400, message: "Database error."}
    else if (exists.rows.length < 1)
        return {status: 403, message: "Product with that id doesn't exist."}

    //Make the call
    let result = await db.query(`DELETE FROM products WHERE product_id = $1`, [product_id])

    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: "Success."}
}