const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: "String"
    },
    description: {
        type: "String"
    },
    image: {
        type: "String"
    },
    authors: {
        type: "String"
    },
    pageCount: {
        type: "String"
    },
    language: {
        type: "String"
    },
    quantity: {
        type: "Number"
    },
    isbn: {
        type: "Number"
    },
    issuedBy: [
        {   
            user:{type: mongoose.Schema.Types.ObjectId,ref: "User"},
            time: {type:"String",required: true}
        } ]
});
module.exports = mongoose.model('Book', bookSchema);