//jshint esversion:6
const express = require("express")
const ejs = require("ejs")
const mongoose = require("mongoose")
const md5 = require("md5")
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
const userSchema = require("./models/user")
const Note = require("./models/note")

const app = express();

app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.use(session({
    secret: "Alongstringofmychoosing",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

mongoose.connect("mongodb://localhost:27017/userDB",
    err => {
        if(err) throw err;
        console.log('connected to MongoDB')
    })

userSchema.plugin(passportLocalMongoose)

const User = new mongoose.model("User", userSchema)

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.set('view engine', 'ejs');

app.get("/", function(req, res) {
    res.render("home")
})

app.get("/login", function(req, res) {
    res.render("login")
})

app.get("/register", function(req, res) {
    res.render("register")
})

app.get("/main", function(req, res){
    res.render("main")
})

app.get("/exercises", function(req, res){
    res.render("exercises")
})

app.get("/profile", function(req, res){
    res.render("profile")
})

app.get("/note", function(req, res){
    res.render("note")
})

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { 
        return next(err)
        }
      res.redirect('/')
      console.log("User logged out")
    })
  })

app.post("/register", function(req, res) {
        const newUser = new User({
        firstName: req.body.firstName,
        surname: req.body.surname,
        email: req.body.username, 
        password: md5(req.body.password)
       })

    newUser.save(function(err){
    if(err){
        if(err.name = "")
        console.log(err)
        }
    else {
        res.render("main")
        console.log("user was saved")
        }
    })

})

app.post("/login", function(req, res){
    
    const username = req.body.username
    const password = md5(req.body.password)
    var sid = req.sessionID

    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        } 
        else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("main")
                    User.update({_id: foundUser._id}, {$set:{"session" : sid}})
                    console.log("User was loggen in successfully and take to the main page")
                }
            }
        }
    })
})

// app.post("/profile", function(req, res){
//     let name = req.body.name
//     let surname = req.body.surname
    
// })

app.post("/note", function(req, res){

    const newNote = new Note({
        content: req.body.textarea,
        author: req.params.userId
    })
 
    newNote.save(function(err){
        if(err){
            console.log(err)
            }
        else {
            // res.status(200).send('saved')
            res.render("note")
            console.log("note was saved")
            }
    })
})


app.listen(3000, function() {
console.log("Server started on port 3000")
})
