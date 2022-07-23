const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.kinn93w.mongodb.net/LibraryDB?w=majority`;

const app = express();

app.set('view-engine', 'ejs');
app.set('views', 'views');


//static folders
app.use(express.static(path.join(__dirname, './public/css')));
app.use(express.static(path.join(__dirname, './public/javascript')));
app.use(express.static(path.join(__dirname, './public/assets')));

app.use(bodyParser.urlencoded({ extended: false }));

const home = require('./routes/home');
const clientRoutes = require('./routes/client')

app.use(home);
app.use("/client",clientRoutes)


app.use((req, res, next) => {
    res.status(404).render('error404.ejs', { pageTitle: "Error 404" });
});


mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(result => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
});