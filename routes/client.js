const express = require("express")
const router = express.Router()

const controller = require('../controllers/client')

router.get("/usersignup", controller.getSignupPage)

router.get("/userlogin", controller.getLoginPage)

module.exports = router