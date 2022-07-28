const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")
const Note = require("./models/note")

const User =  mongoose.Schema({
    firstName: String,
    surname: String,
    email: String, 
    password: String,
    notes:{
        type:Array
    }
})

User.plugin(passportLocalMongoose)



module.exports = mongoose.model('User',User)

