const db = require('./postgres')

module.exports.getReviews = async (product_id) => {

    let result = await db.query(`SELECT (SELECT username FROM users WHERE user_id = reviews.user_id) as name, rating, message FROM reviews WHERE product_id = $1;`, [product_id])

    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: result.rows}
}

module.exports.addReview = async (user_id, product_id, rating, message) => {
    let result = await db.query(`
        INSERT INTO reviews VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, product_id) DO
        UPDATE SET rating = excluded.rating, message = excluded.message;`, [user_id, product_id, rating, message])

    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: "Success."}
}

module.exports.removeReview = async (user_id, product_id) => {
    let result = await db.query(`DELETE FROM reviews WHERE user_id = $1 AND product_id = $2;`, [user_id, product_id])

    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: "Success."}
}