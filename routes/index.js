var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

//redirect to index
router.get("/", function(req, res) {
    var user = req.user;
    res.render("landing", {user: user});
});

// ===========================
//AUTH ROUTES
// ===========================
//show register page
router.get("/register", function(req, res) {
    var user = req.user;
    res.render("register", { user: user });
});

//register user
router.post("/register", function(req, res) {
    //register the user
    User.register({ username: req.body.username, displayName: req.body.displayName }, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("index");
        }
        //log in the new user
        req.login(user, function(err) {
            if (err) {
                return next(err);
            }
            return res.redirect("/recipes");
        });
    });
});

//show login page
router.get("/login", function(req, res) {
    var user = req.user;
    res.render("login", { user: user });
});

//handle user login
router.post("/login", passport.authenticate("local"), function(req, res) {
    res.redirect("/recipes");
});

//log out the user
router.get("/logout", isLoggedIn, function(req, res) {
    req.logout();
    res.redirect("/recipes");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;