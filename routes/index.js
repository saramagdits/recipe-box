const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const mw = require("../middleware/middleware.js");

// router.use(mw.onlyOn("/logout", mw.isLoggedIn));

//redirect to index
router.get("/", function (req, res) {

    // let user = req.user;
    // res.render("landing", {user: user});
    res.render("landing");
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
    User.register({
        username: req.body.username,
        displayName: req.body.displayName
    }, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        //log in the new user
        req.login(user, function (err) {
            if (err) {
                req.flash("error", err.message);
                return next(err);
            }
            req.flash("success", "Welcome to Recipe Box. Congrats!");
            return res.redirect("/recipes");
        });
    });
});

//show login page
router.get("/login", function (req, res) {
    let user = req.user;
    if(!user){
        res.render("login", {user: user});
    }
    else {
        res.redirect("/recipes");
    }
});

//handle user login
router.post("/login", passport.authenticate("local", {
    failureRedirect: '/login',
    failureFlash: true
}), function (req, res) {
    req.flash("success", "Welcome back " + req.user.displayName + "!");
    res.redirect("/recipes");
});

//log out the user
router.get("/logout", function (req, res) {
    let user = req.user;
    if (user){
        req.logout();
        //not in use
        // req.flash("success", "Successfully logged out");
    }
    res.redirect("/");
});


module.exports = router;