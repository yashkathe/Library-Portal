const express = require("express")
const router = express.Router()

const controller = require('../controllers/client')

// client/usersignup
router.get("/usersignup", controller.getSignUpPage)

//client/userlogin
router.get("/userlogin", controller.getLoginPage)

router.post("/signup", controller.postSignUpPage)

module.exports = router