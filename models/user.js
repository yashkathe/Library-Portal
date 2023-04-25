const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: "String",
        requied: true
    },
    pid: {
        type: "String",
        required: true
    },
    password: {
        type: "String",
        required: true
    },
    isAdmin: {
        type: "Boolean",
        default: false
    },
    booksIssued: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book"
        }
    ]
});

module.exports = mongoose.model('User', userSchema);