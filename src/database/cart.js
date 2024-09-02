const db = require('./postgres')

module.exports.getCart = async (user_id) => {
    //Delete all unavailable items from cart whenever you get your cart
    let del = await db.query(`DELETE FROM cart USING products WHERE cart.product_id = products.product_id AND products.availability = false AND user_id = $1;`, [user_id])
    if (!del)
        return {status: 400, message: "Database error."}

    let result = await db.query(`
        SELECT products.product_id, products.category, products.subcategory, products.name, cart.amount, products.price,
        (products.price * cart.amount) as total_price
        FROM cart INNER JOIN products ON cart.product_id = products.product_id WHERE cart.user_id = $1;`, [user_id])

    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: result.rows}
}

module.exports.addToCart = async (user_id, product_id, amount) => {
    let result = await db.query(`INSERT INTO cart (user_id, product_id, amount)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, product_id) DO
        UPDATE SET amount = excluded.amount;`, [user_id, product_id, amount])

    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: "Success."}
}


module.exports.removeFromCart = async (user_id, product_id) => {
    let result = await db.query(`DELETE FROM cart WHERE user_id = $1 AND product_id = $2;`, [user_id, product_id])

    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: "Success."}

}

module.exports.clearCart = async (user_id) => {
    let result = await db.query(`DELETE FROM CART WHERE user_id = $1`, [user_id])

    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: "Success."}
}