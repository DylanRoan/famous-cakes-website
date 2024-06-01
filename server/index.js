const express = require('express')

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())

const router = require('./express/router.js')
app.use("/", router)

app.route("/").get(function (req, res) {
    res.send("<p>API Server</p>")
})

const listener = app.listen(port, () => {
    console.log('Server is running on port ' + listener.address().port)
})