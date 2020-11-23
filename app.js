
//Level 1: store data into database / login
//Level 2: mongoose encryption. register - encrypt password / login - de-crypt
//level 2: environment variables/file (.env)

//jshint esversion:6
const express = require("express");
const app = express();
app.use(express.static("public"));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

const ejs = require("ejs");
app.set("view engine", "ejs");

require("dotenv").config(); // make use of .env

const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true, useUnifiedTopology: true});

//mongoose encryption Schema changes the schema and specific code
const userAccountSchema = new mongoose.Schema({
  email: String,
  password: String
});

//mongoose encryption
//const secret = "Thisisourlittlesecret"; // encryption key moved to .env
// encription 'encrypt' package to user schema, define secret (from file .env) to encrypt password, field we want to encrypt
userAccountSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:["password"] });

const User = new mongoose.model("User", userAccountSchema);


app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })

  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
      console.log(err);
    }
  })
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username}, function(err, foundUser){
    if(!err){
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
          console.log("successful!")
        }
      }
    }else{
      console.log(err);
    }
  })
})

app.listen(3000, function(err){
  if(!err){
    console.log("Successfully connected to port 3000");
  }else{
    console.log(err);
  }
})
