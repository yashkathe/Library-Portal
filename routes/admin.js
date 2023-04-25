const express = require("express")
const router = express.Router()

const controller = require("../controllers/admin")

router.get("/", controller.getLoginPage)

router.get("/home", controller.getHomePage)

router.get("/search-books", controller.getSearchBooks)

router.get("/search-users", controller.getSearchUsers)

router.post("/login", controller.postLogin)

router.post("/logout", controller.postLogout)

module.exports = router