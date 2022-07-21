const express = require("express")
const router = express.Router()

const controller = require('../controllers/client')

router.get("/usersignup", controller.getSignUpPage)

router.get("/userlogin", controller.getLoginPage)

router.post("/signup", controller.postSignUpPage)

module.exports = router