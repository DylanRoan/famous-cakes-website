const db = require('./postgres')

module.exports.getCart = async (user_id) => {
    let result = await db.query(`SELECT products.product_id, products.category, products.name, cart.amount, cart.option_index,
        (
            CASE
                WHEN (products.options->>cart.option_index) IS NULL THEN
                    price * amount
                WHEN (products.options->cart.option_index->>'price') IS NULL THEN
                    price * amount
                ELSE
                    ((products.options->cart.option_index->>'price')::DECIMAL(10, 2)) * amount
            END
        ) as total_price,
        (
            CASE
                WHEN (products.options->>cart.option_index) IS NULL THEN
                    ''
                WHEN (products.options->cart.option_index->>'name') IS NULL THEN
                    ''
                ELSE
                    (products.options->cart.option_index->>'name')
            END
        ) as option
            FROM cart INNER JOIN products ON cart.product_id = products.product_id WHERE cart.user_id = $1;`, [user_id])

    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: result.rows}
}

module.exports.addToCart = async (user_id, product_id, option_index, amount) => {
    let result = await db.query(`INSERT INTO cart (user_id, product_id, option_index, amount)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, product_id, option_index) DO
        UPDATE SET amount = excluded.amount;`, [user_id, product_id, option_index, amount])

    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: "Success."}
}


module.exports.removeFromCart = async (user_id, product_id, option_index) => {
    let result = await db.query(`DELETE FROM cart WHERE user_id = $1 AND product_id = $2 AND option_index = $3;`, [user_id, product_id, option_index])

    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: "Success."}

}
