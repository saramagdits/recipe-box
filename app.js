//REQUIREMENTS
var express = require("express"),
    app = express(),
    User = require("./models/user.js"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    session = require("express-session");

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

//STATIC RESOURCE CONFIGURATION
app.use(express.static("public"));

//DATABASE CONFIGURATION
mongoose.connect("mongodb://localhost/recipe_box_3");

//ROUTE REQUIREMENTS
var indexRoutes = require("./routes/index");
var recipeRoutes = require("./routes/recipes");
//ROUTE CONFIGURATION
app.use(indexRoutes);
app.use("/recipes", recipeRoutes);

//LISTENER FUNCTION
app.listen(3000, "127.0.0.1", function () {
    console.log("Server successfully started.........");
});
