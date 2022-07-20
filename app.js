const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")

const app = express()

app.set('view-engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({extended: false}))

//static folders
app.use(express.static(path.join(__dirname, './public/css')));
app.use(express.static(path.join(__dirname, './public/javascript')));

const home = require('./routes/home')
app.use( home)

app.listen(3000)