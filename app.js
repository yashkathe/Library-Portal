const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const User = require('./models/user');
URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.kinn93w.mongodb.net/LibraryDB?w=majority`;

const app = express();

const store = new MongoDBStore({
    uri: URI,
    collection: "sessions"
});

app.set('view-engine', 'ejs');
app.set('views', 'views');

//body parser
app.use(bodyParser.urlencoded({ extended: false }));

//static folders
app.use(express.static(path.join(__dirname, './public/css')));
app.use(express.static(path.join(__dirname, './public/javascript')));
app.use(express.static(path.join(__dirname, './public/assets')));

//setting up routes
const home = require('./routes/home');
const clientRoutes = require('./routes/client');
const adminRoutes = require('./routes/admin');

//setting up sessions
app.use(session({
    secret: "utLHDQAfmyz2xnYpiCsv4EPFo",
    resave: false,//dont save session on every req res
    saveUninitialized: false,
    store: store,
}));

app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if(!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            throw new Error(err);
        });
});

//using the routes
app.use(home);
app.use("/client", clientRoutes);
app.use("/admin", adminRoutes);

const accessLogStram = fs.createWriteStream(path.join(
    __dirname, 'access.log'),
    { flags: 'a' });

app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStram }));


app.use((req, res, next) => {
    res.status(404).render('error404.ejs', { pageTitle: "Error 404" });
});


mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(result => {
    app.listen(process.env.PORT || 5000);
    console.log(`started server on port ${process.env.PORT || 5000}`);
}).catch(err => {
    console.log(err);
});