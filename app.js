require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash");
const encrypt = require("mongoose-encryption");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// DB connection
mongoose.connect('mongodb://localhost:27017/secretsDB', {useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify: false});

//Setting up DB Model
//Db Schema for Home route
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

//Password Encryption
userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});

//Main Code
app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.get("/secrets", function(req,res){
  res.render("secrets");
});

app.post("/register", function(req,res){

  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      res.send(err);
    }else{
      res.redirect("secrets");
    }
  });
});

app.post("/login", function(req,res){

  const usr = _.toLower(req.body.username);
  const pwd = req.body.password;

  User.findOne({email:usr}, function(err, foundUser){
    console.log(foundUser);
    if(err){
      res.send(err);
    }else{
      if(foundUser.password === pwd){
        res.redirect("secrets");
      }else{
        res.send("User Not found");
      }

    }
  });
});

app.listen(8082, function() {
  console.log("Server started on port 8082");
});
