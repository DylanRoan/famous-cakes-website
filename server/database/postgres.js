require('dotenv').config()

const Pool = require('pg').Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false  }
})

module.exports.query = async (query, params = []) => {
    try {
        let result = await pool.query(query, params);
        return result;
    }
    catch (err) {
        console.log("Database Query Error | ")
        console.log(err)
        return false
    }
}

//Menu Table

//Users Table