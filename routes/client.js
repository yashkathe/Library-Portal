const express = require("express")
const router = express.Router()

const controller = require('../controllers/client')

// client/usersignup
router.get("/signup", controller.getSignUpPage)

// client/userlogin
router.get("/login", controller.getLoginPage)

// client/home
router.get("/home", controller.getUserHomePage)

router.get("/barcode/:id", controller.getUserBarcode)

router.get("/issuedBooks/:id", controller.getIssuedBooksById)

router.get("/searchBooks", controller.getSearchBooksPage)

router.get("/returnBook/:id", controller.getReturnBookBarcode )

router.post("/signup", controller.postSignUpPage)

router.post("/login", controller.postLoginPage)

router.post("/logout", controller.postLogout)

module.exports = router