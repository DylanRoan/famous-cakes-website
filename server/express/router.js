const express = require('express')
const router = express.Router()

const multer = require('multer');
const upload = multer();

router.get('/menu', upload.none(), async (req, res, next) => {
})

module.exports = router;