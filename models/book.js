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
        type: "String"
    },
    issuedBy: [ {
        type: "String"
    }
    ]
});
module.exports = mongoose.model('Book', bookSchema);