const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email:{
        type:"String",
        requied:true
    },
    pid:{
        type:"String",
        required:true
    },
    password:{
        type:"String",
        required:true
    },
    name:{
        name:"String"
    }
})

module.exports = mongoose.model('User', userSchema)