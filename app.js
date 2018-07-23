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

//TODO add environmental variables for IP, PORT, MONGODB, SESSIONSECRET
//APP CONFIGURATION
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(session({secret: "cooper is a cool cat", resave: false, saveUninitialized: true}));
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

//ENVIRONMENT VARIABLES
var DATABASEURL = process.env.DATABASEURL || "mongodb://localhost/recipe_box_local";
// var HOSTIP = process.env.IP || "127.0.0.1";
var HOSTPORT = process.env.PORT || 3000;

//DATABASE CONFIGURATION
mongoose.connect(DATABASEURL);

//ROUTE REQUIREMENTS
const indexRoutes = require("./routes/index");
const recipeRoutes = require("./routes/recipes");
//ROUTE CONFIGURATION
app.use(indexRoutes);
app.use("/recipes", recipeRoutes);

//LISTENER FUNCTION
app.listen(HOSTPORT, function () {
    console.log("Server successfully started.........");
});
