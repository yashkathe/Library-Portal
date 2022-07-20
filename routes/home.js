const express = require("express")
const router = express.Router()

const controller = require('../controllers/home')

router.get('/', controller.getHomePage)

module.exports = router