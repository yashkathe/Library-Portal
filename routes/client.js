const express = require("express")
const router = express.Router()

const controller = require('../controllers/client')

// client/usersignup
router.get("/usersignup", controller.getSignUpPage)

// client/userlogin
router.get("/userlogin", controller.getLoginPage)

// client/home
router.get("/home", controller.getUserHomePage)

router.get("/home/profile/:id", controller.getUserProfile)

router.get("/home/barcode/:id", controller.getUserBarcode)

router.get("/home/issuedBooks/:id", controller.getIssuedBooksById)

router.get("/searchBooks", controller.getSearchBooksPage)

router.get("/returnBook/:id", controller.getReturnBookBarcode )

router.post("/signup", controller.postSignUpPage)

router.post("/login", controller.postLoginPage)

router.post("/logout", controller.postLogout)

module.exports = router