//ENVIRONMENT CONFIGURATION
//configuration requires the dotenv package to be installed. the .env file contains the necessary environmental variables
//in deployment environment, use config vars instead
//be sure that .env file is added to .gitignore to protect data
require('dotenv').config();
const DB_URL = process.env.DB_URL;
// const IP = process.env.IP || "127.0.0.1";
const PORT= process.env.PORT;
const SESSION_SECRET = process.env.SESSION_SECRET;

//REQUIREMENTS
const express = require("express"),
    app = express(),
    User = require("./models/user.js"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    session = require("express-session"),
    flash = require("connect-flash");

//APP CONFIGURATION
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(session({secret: SESSION_SECRET, resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req, res, next) {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//STATIC RESOURCE CONFIGURATION
app.use(express.static("public"));

//DATABASE CONFIGURATION
mongoose.connect(DB_URL);

//ROUTE REQUIREMENTS
const indexRoutes = require("./routes/index");
const recipeRoutes = require("./routes/recipes");
//ROUTE CONFIGURATION
app.use(indexRoutes);
app.use("/recipes", recipeRoutes);

//LISTENER FUNCTION
app.listen(PORT, function () {
    console.log("Server successfully started.........");
});
