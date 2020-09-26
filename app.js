require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true ,useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields : ["password"]});   //addmoreEncriptionfields ["password"," " ," " ....]

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
     const newUser = new User({
         email : req.body.username,
         password :req.body.password
     });
     newUser.save(function(err){
         if(!err){
             console.log("New User Added Successfully");
             res.render("secrets");
         }else{
             console.log(err);
         }
     });
});


app.post("/login",function(req,res){
    let mail =req.body.username ;
    let pass =req.body.password ;

    User.findOne({email : mail},function(err,foundUser){
        if(foundUser){
            if (foundUser.password === pass) {
                res.render("secrets");
            }else{
                res.send("<h1>YOUR PASSWORD IS INCORRECT PLEASE CHECK AND TRY AGAIN LATER</h1>");
            }
        }else{
            res.send("<h1>YOU NOT RESISTERED YET PLEASE REGISTER AND LOGIN</h1>");
        }
    })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});