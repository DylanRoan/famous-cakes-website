const db = require('./postgres')

/* ADMIN */
//Get all orders from completed or not, and from oldest to youngest
module.exports.getAllActiveUserOrders = async (completed = false) => {
    let result = await db.query(`SELECT *, 
        (SELECT SUM(product_price * amount) FROM order_data WHERE order_id = orders.order_id) as total_price,
        (SELECT COUNT(*) FROM order_data WHERE order_id = orders.order_id) as product_count,
        (SELECT username FROM users WHERE orders.user_id = users.user_id) as username 
        FROM orders 
        WHERE order_status ${completed ? '':'!'}= 'COMPLETED'
        ORDER BY order_date;`)// ORDER BY CASE WHEN order_status = 'COMPLETED' THEN 1 ELSE 0 END
    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: result.rows}
}
/* */
module.exports.getActiveOrders = async (user_id) => {
    let result = await db.query(`SELECT * FROM orders WHERE order_status != 'COMPLETED' AND user_id = $1;`, [user_id])
    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: result.rows}
}

module.exports.getUserOrders = async (user_id, order_id) => {
    let parms = [user_id]
    if (order_id)
        parms.push(order_id)

    let result = await db.query(`SELECT *, 
        (SELECT SUM(product_price * amount) FROM order_data WHERE order_id = orders.order_id) as total_price,
        (SELECT COUNT(*) FROM order_data WHERE order_id = orders.order_id) as product_count
        FROM orders WHERE user_id = $1 ${order_id ? `AND order_id = $2 ` : ''}
        ORDER BY CASE WHEN order_status = 'COMPLETED' THEN 1 ELSE 0 END, order_date DESC`, parms)

    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: result.rows}
}

module.exports.getOrder = async (order_id) => {
    let result = await db.query(`SELECT * FROM orders WHERE order_id = $1`, [order_id])

    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: result.rows}
}

module.exports.setOrder = async (user_id, order_id, order_data, allowEdit) => {    
    if (Object.keys(order_data).length < 1)
        return {status: 403, message: "Insufficient order data."}

    let columns = Object.keys(order_data)
    let nums = []
    let update = []

    let values = [user_id, order_id]
    values = values.concat(Object.values(order_data))

    let index = 3
    for (const [key, value] of Object.entries(order_data)) {
        nums.push(`$${index}`)
        update.push(`${key} = EXCLUDED.${key}`)
        index += 1
    }

    let query = `
    INSERT INTO orders (user_id, order_id, ${columns.join(', ')})
    VALUES ($1, $2, ${nums.join(', ')})`

    if (allowEdit)
        query += `\nON CONFLICT (order_id) DO UPDATE SET ${update.join(', ')}`

    let result = await db.query(query, values)
    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: "Success."}
}

module.exports.deleteOrder = async (order_id) => {
    let result = await db.query(`DELETE FROM products WHERE product_id = $1`, [order_id])
    
    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: "Success."}
}

module.exports.getOrderData = async (order_id) => {
    let result = await db.query(`SELECT *, (product_price * amount) as total_price FROM order_data WHERE order_id = $1`, [order_id])

    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: result.rows}
}

module.exports.setOrderData = async (order_id, order_data) => {
    if (order_data.length < 1)
        return {status: 403, message: "Insufficient order data."}

    let query = `INSERT INTO order_data (order_id, product_name, product_price, amount) VALUES `

    //Maybe this should have been  done by hardcoding inserts instead of parametization
    //But maybe some weird text in the product names might accidentally break something
    let values = [order_id]
    let paramCols = []
    let n = 2
    order_data.map((o, i) => {
        let numCol = ['$1']

        values.push(o.product_name)
        numCol.push(`$${n}`)
        n++

        values.push(o.product_price)
        numCol.push(`$${n}`)
        n++

        values.push(o.amount)
        numCol.push(`$${n}`)
        n++

        paramCols.push(`(${numCol.join(', ')})`)
    })

    if (paramCols.length < 1)
        return {status: 400, message: 'Bad order data.'}
    query += paramCols.join(', ')

    let result = await db.query(query, values)
    if (!result)
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: "Success."}
}
