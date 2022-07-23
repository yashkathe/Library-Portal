const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session)

const User = require('./models/user')
URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.kinn93w.mongodb.net/LibraryDB?w=majority`;

const app = express();

const store = new MongoDBStore({
    uri:URI,
    collection:"sessions"
})

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
const clientRoutes = require('./routes/client')

//setting up sessions
app.use(session({
    secret:"utLHDQAfmyz2xnYpiCsv4EPFo",
    resave:false,//dont save session on every req res
    saveUninitialized:false,
    store:store
}))

//setting user in session
app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

//using the routes
app.use(home);
app.use("/client",clientRoutes)


app.use((req, res, next) => {
    res.status(404).render('error404.ejs', { pageTitle: "Error 404" });
});


mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(result => {
    app.listen(process.env.PORT || 3000);
}).catch(err => {
    console.log(err);
});