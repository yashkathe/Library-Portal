const bcrypt = require('bcryptjs')

const User = require("../models/user");
const Book = require("../models/book");

exports.getLoginPage = (req, res, next) => {
    res.render("../views/auth/adminlogin.ejs",
        {
            pageTitle: "Log into your account",
            headerTitle: "Admin Log In",
            routeFor: "auth",
            errorMessage: null
        });
};

exports.postLogin = (req, res, next) => {
    const uname = req.body.uname;
    const password = req.body.password;

    User.findOne({ $or: [ { email: uname }, { pid: uname } ] }).then(
        user => {
            if(!user) {
                return res.status(500).render("../views/auth/adminlogin.ejs",
                    {
                        pageTitle: "Log into your account",
                        headerTitle: "Admin Log In",
                        routeFor: "auth",
                        errorMessage: "No such user exists",
                        uname,
                        password,
                    });
            }

            if(!user.isAdmin || user.isAdmin === false) {
                return res.status(500).render("../views/auth/adminlogin.ejs",
                    {
                        pageTitle: "Log into your account",
                        headerTitle: "Log In",
                        routeFor: "auth",
                        errorMessage: "You are not authorised to access this page",
                        uname,
                        password,
                    });
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
                            res.redirect("/admin/home");
                        });
                    }
                    //passwords dont match
                    return res.status(500).render("../views/auth/adminlogin.ejs",
                        {
                            pageTitle: "Log into your account",
                            headerTitle: "Log In",
                            routeFor: "auth",
                            errorMessage: "Invalid username or password entered",
                            uname,
                            password,
                        });
                });
        }
    ).catch(err => {
        console.log(err);
        return res.status(500).render("../views/auth/adminlogin.ejs",
            {
                pageTitle: "Log into your account",
                headerTitle: "Log In",
                routeFor: "auth",
                errorMessage: "No such user exists",
                uname,
                password,
            });
    });
};

exports.getHomePage = async (req, res, next) => {
    const userID = req.session.user._id.toString();
    try {
        const user = await User.findById(userID);
        res.render("../views/admin/home.ejs",
            {
                pageTitle: "Client Home Page",
                headerTitle: `Welcome ${user.email.split('@')[ 0 ].charAt(0).toLocaleUpperCase()}${user.email.split('@')[ 0 ].slice(1)}`,
                id: user._id,
                routeFor: "admin"
            });
    }
    catch {
        err => {
            console.log(err);
        };
    }
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
        }
        res.redirect("/admin/");
    });
};

exports.getSearchUsers = (req,res,next) => {
    
}