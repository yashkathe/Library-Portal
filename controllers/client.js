const bcrypt = require("bcryptjs")
const User = require("../models/user")

exports.getSignUpPage = (req,res,next) => {
    res.render("../views/client/usersignup.ejs", {pageTitle: "Create a new account"})
}

exports.getLoginPage = (req, res, next) => {
    res.render("../views/client/userlogin.ejs")
}

exports.postSignUpPage = (req,res,next) => {
    const email = req.body.email
    const pid = req.body.pid
    const password = req.body.password
    const Cpassword = req.body.Cpassword
    
    User.findOne({email:email, pid:pid}).then(
        userDoc => {
            if(userDoc){
                return res.redirect('/client/usersignup')
            }
            if(password !== Cpassword){
                return res.redirect('/client/usersignup')
            }
            return bcrypt.hash(password,8).then(
                hashedPassword => {
                    const user = new User({
                        email,
                        pid,
                        password:hashedPassword
                    })
                return user.save()
                }
            ).then(results => {
                res.redirect("/client/userlogin")
            })
        }
    )
}