const db = require('./postgres')

const bcrypt = require('bcrypt')

module.exports.userempty = async (email) => {
    let result = await db.query("SELECT user_id FROM users WHERE email = $1", [email.toLowerCase()])

    if (!result) 
        return {status: 400, message: "Database error."}
    else if (result.rows < 1)
        return {status: 200, message: "User does not exist."}
    else 
        return {status: 403, message: "User exists."}
}

module.exports.signup = async (username, email, password, phone_code = "", phone = "") => {

    function make_id() {
        let res = ''
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        for (let i = 0; i < 10; i++)
            res += characters.charAt(Math.floor(Math.random() * characters.length))
        return res
    }

    let new_id = make_id()
    let exist = await db.query(`SELECT user_id FROM users WHERE user_id = $1;`, [new_id])
    while (exist && exist.rows > 0) {
        new_id = make_id()
    }

    if (!exist) 
        return {status: 400, message: "Database error."}

    let result = await db.query("INSERT INTO users (user_id, username, email, password, phone_code, phone_number) VALUES ($1, $2, $3, $4, $5, $6)", [new_id, username, email, password, phone_code, phone])

    if (!result) 
        return {status: 400, message: "Database error."}
    else 
        return {status: 200, message: "Success."}
}

module.exports.login = async (email, password) => {
    let result = await db.query("SELECT user_id, password FROM users WHERE email = $1", [email.toLowerCase()]) 

    if (!result) 
        return {status: 400, message: "Database error."}
    else if (result.rows < 1)
        return {status: 403, message: "User does not exist."}
    else if (bcrypt.compareSync(password, result.rows[0].password)) 
        return {status: 200, message: result.rows}
    else
        return {status: 403, message: "Credentials don't match."}
}


module.exports.session = async (session) => {
    let result = await db.query(`SELECT user_id, creation_date, expiry_date FROM sessions WHERE session_token = $1`, [session])
    
    if (!result) 
        return {status: 400, message: "Database error."}
    else if (result.rows < 1) 
        return {status: 403, message: "Session does not exist or expired."}
    else
        return {status: 200, message: result.rows}
}

module.exports.setsession = async (id, session, ip) => {
    let result = await db.query(`INSERT INTO sessions (user_id, session_token, ip) VALUES ($1, $2, $3)`, [id, session, ip])

    if (!result) 
        return {status: 400, message: "Database error."}
    else
        return {status: 200, message: "Success."}
}