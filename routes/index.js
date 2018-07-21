const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const mw = require("../middleware/middleware.js");

router.use(mw.onlyOn("/logout", mw.isLoggedIn));
//TODO require flash messages

//redirect to index
router.get("/", function (req, res) {
    let user = req.user;
    res.render("landing", {user: user});
});

// ===========================
//AUTH ROUTES
// ===========================
//show register page
router.get("/register", function (req, res) {
    let user = req.user;
    res.render("register", {user: user});
});

//register user
router.post("/register", function (req, res) {
    //register the user
    User.register({
        username: req.body.username,
        displayName: req.body.displayName
    }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("index");
        }
        //log in the new user
        req.login(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect("/recipes");
        });
    });
});

//show login page
//TODO user should not be able to see login page if logged in
router.get("/login", function (req, res) {
    let user = req.user;
    res.render("login", {user: user});
});

//TODO fix bad request error when logging in without password
//TODO handle unauthorized error when incorrect password given
//TODO user should not be able to log in if already logged in
//handle user login
router.post("/login", passport.authenticate("local"), function (req, res) {
    res.redirect("/recipes");
});

//log out the user
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/recipes");
});

//TODO fix bad request error when logging in without password

module.exports = router;