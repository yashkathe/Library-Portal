const bcrypt = require("bcryptjs");
const QRCode = require("qrcode");
const User = require("../models/user");

exports.getSignUpPage = (req, res, next) => {
    res.render("../views/client/usersignup.ejs",
        {
            pageTitle: "Create a new account",
            routeFor: "auth"
        });
};

exports.getLoginPage = (req, res, next) => {
    res.render("../views/client/userlogin.ejs",
        {
            pageTitle: "Login into your account",
            routeFor: "auth"
        });
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
                            res.redirect("/client/home");
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

exports.getUserHomePage = async (req, res, next) => {
    const userID = req.session.user._id.toString();
    try {
        const user = await User.findById(userID);
        res.render("../views/client/clienthome.ejs",
            {
                pageTitle: "Client Home Page",
                id: user,
                routeFor: "client"
            });
    }
    catch {
        err => {
            console.log(err);
        };
    }
};

exports.getUserProfile = async (req, res, next) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        res.render('../views/client/clientProfile.ejs', {
            pageTitle: " User profile ",
            user,
            routeFor: "client"
        });

    } catch {
        err => {
            console.log(err);
        };
    }
};

exports.getUserBarcode = async (req, res, next) => {
    const userID = req.params.id;
    const barcodeURL = await QRCode.toDataURL(userID);
    res.render('../views/client/clientBarcode.ejs', {
        pageTitle: "Barcode",
        barcodeURL,
        routeFor: "client"
    });
};
