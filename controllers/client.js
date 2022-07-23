const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.getSignUpPage = (req, res, next) => {
    res.render("../views/client/usersignup.ejs", { pageTitle: "Create a new account" });
};

exports.getLoginPage = (req, res, next) => {
    res.render("../views/client/userlogin.ejs", { pageTitle: "Login into your account" });
};

exports.postSignUpPage = (req, res, next) => {
    const email = req.body.email;
    const pid = req.body.pid;
    const password = req.body.password;
    const Cpassword = req.body.Cpassword;

    User.findOne({ email: email, pid: pid }).then(
        userDoc => {
            if(userDoc) {
                return res.redirect('/client/usersignup');
            }
            if(password !== Cpassword) {
                return res.redirect('/client/usersignup');
            }
            return bcrypt.hash(password, 8).then(
                hashedPassword => {
                    const user = new User({
                        email,
                        pid,
                        password: hashedPassword
                    });
                    return user.save();
                }
            ).then(results => {
                res.redirect("/client/userlogin");
            });
        }
    );
};

exports.postLoginPage = (req, res, next) => {
    const uname = req.body.uname;
    const password = req.body.password;

    User.findOne({ $or: [ { email: uname }, { pid: uname } ] }).then(
        user => {
            if(!user) {
                return res.redirect('/client/userlogin');
            }

            bcrypt.compare(password, user.password).then(
                doPasswordsMatch => {
                    if(doPasswordsMatch) {
                        req.session.isLoggedIn = true,
                        req.session.user = user;
                        return req.session.save(err => {
                            if(err) {
                                console.log(err);
                            }
                            res.redirect("/");
                        });
                    }
                    //passwords dont match
                    res.redirect("/client/userlogin");
                });
        }
    ).catch(err => {
        //email or pid doesnt exist
        console.log(err);
        res.redirect("/client/login");
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
        }
        res.redirect("/");
    });
};
