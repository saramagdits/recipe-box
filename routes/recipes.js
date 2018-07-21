//TODO fix the findById() bug like on YelpCamp

const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const upload = multer({dest: './public/uploads/'});
const Recipe = require("../models/recipe");

//index route
router.get("/", isLoggedIn, function (req, res) {
    let user = req.user;
    res.render("index", {user: user});
});

//NEW ROUTE
//shows new recipe form.
router.get("/new", isLoggedIn, function (req, res) {
    let user = req.user;
    res.render("new", {user: user});
});

//CREATE ROUTE
//creates a new recipe from form submission and adds it to db. redirects to show route
router.post("/", isLoggedIn, upload.single("img"), function (req, res) {

    //TODO refactor this
    let imgFileName = req.file.filename;
    let imgMimeType = req.file.mimetype;
    let imgOriginalName = req.file.originalname;
    let title = req.body.title;
    let ingredientList = req.body.ingredients;
    let instructions = req.body.instructions;

    Recipe.create({
        title: title,
        img: {imgFileName: imgFileName, imgMimeType: imgMimeType, imgOriginalName: imgOriginalName},
        ingredientList: ingredientList,
        instructions: instructions
    }, function (err, recipe) {
        if (err) {
            console.log(err);
        }
        else {
            req.user.recipes.push(recipe);
            req.user.save(function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.redirect("/recipes");
                }
            });
        }
    });
});

//SHOW ROUTE
//show details for an individual recipe
router.get("/:id", isLoggedIn, function (req, res) {
    let id = req.params.id;
    let user = req.user;
    //TODO fix findById() error like on YelpCamp
    Recipe.findById(id, function (err, recipe) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("show", {user: user, recipe: recipe});
        }
    });
});

//EDIT ROUTE
//shows the form to edit an individual recipe
router.get("/:id/edit", isLoggedIn, function (req, res) {
    let id = req.params.id;
    let user = req.user;
    //TODO fix findById() error like on YelpCamp
    Recipe.findById(id, function (err, recipe) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("edit", {recipe: recipe, user: user});
        }
    });
});

//UPDATE ROUTE
//updates an individual recipe and reroutes to show route
router.put("/:id", isLoggedIn, upload.single("img"), function (req, res) {
    let id = req.params.id;
    //TODO fix findById() error like on YelpCamp
    Recipe.findById(id, function (err, recipe) {
        if (err) {
            console.log(err);
        }
        else {
            if (typeof req.file !== 'undefined') {
                //TODO refactor this
                let imgFileName = req.file.filename;
                let imgMimeType = req.file.mimetype;
                let imgOriginalName = req.file.originalname;
                let imgPreviousPath = "./public/uploads/" + recipe.img.imgFileName;
                fs.unlink(imgPreviousPath, (err) => {
                    if (err) throw err;
                });
                recipe.update({
                        title: req.body.title,
                        img: {imgFileName: imgFileName, imgMimeType: imgMimeType, imgOriginalName: imgOriginalName},
                        ingredientList: req.body.ingredients,
                        instructions: req.body.instructions
                    },
                    function () {
                        let url = "/recipes/" + id;
                        res.redirect(url);
                    });
            }
            else {
                recipe.update({
                        title: req.body.title,
                        ingredientList: req.body.ingredients,
                        instructions: req.body.instructions
                    },
                    function () {
                        let url = "/recipes/" + id;
                        res.redirect(url);
                    });
            }
        }
    });
});

//DESTROY ROUTE
//removes an individual recipe and reroutes to index
router.delete("/:id", isLoggedIn, function (req, res) {
    let id = req.params.id;
    let imgPreviousPath = "./public/uploads/";
    //TODO fix findById() error like on YelpCamp
    Recipe.findById(id, function (err, recipe) {
        if (err) {
            console.log(err);
        }
        else {
            imgPreviousPath += recipe.img.imgFileName;
        }
    });
    //TODO fix findById() error like on YelpCamp
    Recipe.findByIdAndRemove(id, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            fs.unlink(imgPreviousPath, (err) => {
                if (err) throw err;
            });
            res.redirect("/recipes");
        }
    });
});

//TODO refactor this
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;