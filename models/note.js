const mongoose = require("mongoose")
const userSchema = require("./models/user")

const Created = new mongoose.Schema({
    content: {type: String, required: true},
    // author: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User"
    //   }
    author: req.userId
    })

module.exports = mongoose.model('Notes', Created) 