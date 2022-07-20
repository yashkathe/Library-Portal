exports.getSignupPage = (req,res,next) => {
    res.render("../views/client/usersignup.ejs")
}

exports.getLoginPage = (req, res, next) => {
    res.render("../views/client/userlogin.ejs")
}