const monngoose = require("mongoose")

const userSchema = new monngoose.Schema({
    pid:{
        type:"String",
        required:true
    },
    password:{
        type:"String",
        required:true
    }
})