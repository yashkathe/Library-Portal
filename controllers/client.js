const bcrypt = require("bcryptjs");
const QRCode = require("qrcode");
const User = require("../models/user");
const Book = require("../models/book");

exports.getSignUpPage = (req, res, next) => {
    res.render("../views/auth/usersignup.ejs",
        {
            pageTitle: "Create a new account",
            headerTitle: "Sign Up",
            routeFor: "auth",
            errorMessage: null
        });
};

exports.getLoginPage = (req, res, next) => {
    res.render("../views/auth/userlogin.ejs",
        {
            pageTitle: "Login into your account",
            headerTitle: "Log In",
            routeFor: "auth",
            errorMessage: null
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
                return res.status(500).render("../views/auth/usersignup.ejs",
                    {
                        pageTitle: "Create a new account",
                        headerTitle: "Sign Up",
                        routeFor: "auth",
                        errorMessage: "User already exists",
                        email,
                        pid,
                        password,
                        Cpassword
                    });
            }
            if(password !== Cpassword) {
                return res.status(500).render("../views/auth/usersignup.ejs",
                    {
                        pageTitle: "Create a new account",
                        headerTitle: "Sign Up",
                        routeFor: "auth",
                        errorMessage: "Passwords do not match",
                        email,
                        pid,
                        password,
                        Cpassword
                    });
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
                res.redirect("/client/login");
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
                return res.status(500).render("../views/auth/userlogin.ejs",
                    {
                        pageTitle: "Create a new account",
                        headerTitle: "Sign Up",
                        routeFor: "auth",
                        errorMessage: "No such user exists",
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
                                res.render("../views/errorPage.ejs", { error: err });
                            }
                            res.redirect("/client/home");
                        });
                    }
                    //passwords dont match
                    return res.status(500).render("../views/auth/userlogin.ejs",
                        {
                            pageTitle: "Create a new account",
                            headerTitle: "Sign Up",
                            routeFor: "auth",
                            errorMessage: "Invalid username or password entered",
                            uname,
                            password,
                        });
                });
        }
    ).catch(err => {
        return res.status(500).render("../views/auth/userlogin.ejs",
            {
                pageTitle: "Create a new account",
                headerTitle: "Sign Up",
                routeFor: "auth",
                errorMessage: "No such user exists",
                uname,
                password,
            });
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
            res.render("../views/errorPage.ejs", { error: err });
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
                headerTitle: `Welcome ${user.email.split('@')[ 0 ].charAt(0).toLocaleUpperCase()}${user.email.split('@')[ 0 ].slice(1)}`,
                id: user._id,
                routeFor: "client"
            });
    }
    catch {
        err => {
            console.log(err);
            res.render("../views/errorPage.ejs", { error: err });
        };
    }
};

exports.getUserBarcode = async (req, res, next) => {
    const userID = req.params.id;
    const barcodeURL = await QRCode.toDataURL(userID);
    res.render('../views/client/clientBarcode.ejs', {
        pageTitle: "Barcode",
        headerTitle: "Login Barcode",
        barcodeURL,
        routeFor: "client",
        info: "Use this QRcode when you want to issue a book"
    });
};

exports.getIssuedBooksById = async (req, res, next) => {
    const userID = req.params.id;
    const books = await Book.find({ issuedBy: {$elemMatch: {user: userID}} }).populate({ path: "issuedBy.user" });
    res.render('../views/client/clientIssuedBooks.ejs', {
        pageTitle: "Issued Books",
        headerTitle: "Return Books",
        routeFor: "client",
        books
    });
};

exports.getSearchBooksPage = async (req, res, next) => {
    try {

        let search = "";
        if(req.query.search) {
            search = req.query.search;
        }

        let page = 1;
        if(req.query.page) {
            page = req.query.page;
        }

        const limit = 4;

        const books = await Book.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { description: { $regex: '.*' + search + '.*', $options: 'i' } },
                { authors: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        })
            .limit(limit * 1)
            .skip(((page - 1) * limit))
            .exec();

        const count = await Book.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { description: { $regex: '.*' + search + '.*', $options: 'i' } },
                { authors: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).countDocuments();


        res.render('../views/client/clientBookSearch.ejs', {
            pageTitle: "Search Books",
            headerTitle: "Search Books",
            routeFor: "client",
            books,
            search,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        }
        );

    } catch(err) {
        console.log(err);
        res.render("../views/errorPage.ejs", { error: err });
    }
};


exports.getReturnBookBarcode = async (req, res, next) => {
    try {
        const userId = req.user._id.toString();
        const isbn = req.params.id;
        const barcodeURL = await QRCode.toDataURL(`${userId}@${isbn}`);
        const book = await Book.find({ isbn: isbn });
        res.render('../views/client/clientBarcode.ejs', {
            pageTitle: "Barcode",
            headerTitle: book[ 0 ].title,
            barcodeURL,
            routeFor: "client",
            info: `Use this QRcode to return your ${book[ 0 ].title} book`
        });
    } catch(err) {
        console.log(err);
        res.render("../views/errorPage.ejs", { error: err });
    }
};