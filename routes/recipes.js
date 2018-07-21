const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const upload = multer({dest: './public/uploads/'});
const Recipe = require("../models/recipe");
const mw = require("../middleware/middleware.js");

router.use(mw.isLoggedIn);
//index route
router.get("/", function (req, res) {
    let user = req.user;
    res.render("index", {user: user});
});

//NEW ROUTE
//shows new recipe form.
router.get("/new", function (req, res) {
    let user = req.user;
    res.render("new", {user: user});
});

//CREATE ROUTE
//TODO fix this error when user creates second recipe: E11000 duplicate key error collection: recipe_box_3.recipes index: username_1 dup key: { : null }
//creates a new recipe from form submission and adds it to db. redirects to show route
router.post("/", upload.single("img"), function (req, res) {

    //TODO refactor this
    let imgFileName = req.file.filename;
    let imgMimeType = req.file.mimetype;
    let imgOriginalName = req.file.originalname;
    let title = req.body.title;
    let ingredientList = req.body.ingredients;
    let instructions = req.body.instructions;
    let user = req.user._id;

    Recipe.create({
        title: title,
        img: {imgFileName: imgFileName, imgMimeType: imgMimeType, imgOriginalName: imgOriginalName},
        ingredientList: ingredientList,
        instructions: instructions,
        user: user
    }, function (err, recipe) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
            req.user.recipes.push(recipe);
            req.user.save(function (err) {
                if (err) {
                    req.flash("error", err.message);
                }
                else {
                    req.flash("success", "Your recipe was successfully created!");
                    res.redirect("/recipes");
                }
            });
        }
    });
});

//SHOW ROUTE
//show details for an individual recipe
router.get("/:id", function (req, res) {
    let id = req.params.id;
    let user = req.user;
    Recipe.findById(id, function (err, recipe) {
        if (err || !recipe) {
            req.flash("error", "Hmm.. That recipe could not be found.");
            res.redirect("back");
        }
        else {
            //check if the recipe belongs to current user
            if (user._id.equals(recipe.user)){
                res.render("show", {user: user, recipe: recipe});
            } else {
                req.flash("error", "Hmm.. That recipe could not be found.");
                res.redirect("back");
            }
        }
    });
});

//EDIT ROUTE
//shows the form to edit an individual recipe
router.get("/:id/edit", function (req, res) {
    let id = req.params.id;
    let user = req.user;
    Recipe.findById(id, function (err, recipe) {
        if (err || !recipe) {
            req.flash("error", "Hmm.. That recipe could not be found");
            res.redirect("back");
        }
        else {
            res.render("edit", {recipe: recipe, user: user});
        }
    });
});

//UPDATE ROUTE
//updates an individual recipe and reroutes to show route
router.put("/:id", upload.single("img"), function (req, res) {
    let id = req.params.id;
    Recipe.findById(id, function (err, recipe) {
        if (err || !recipe) {
            req.flash("error", "Hmm.. Something went wrong.");
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
                        req.flash("success", "Your recipe was successfully updated!");
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
                        req.flash("success", "Your recipe was successfully updated!");
                        res.redirect(url);
                    });
            }
        }
    });
});

//DESTROY ROUTE
//removes an individual recipe and reroutes to index
router.delete("/:id", function (req, res) {
    let id = req.params.id;
    let imgPreviousPath = "./public/uploads/";
    //TODO recombine this into duplicate function below?
    Recipe.findById(id, function (err, recipe) {
        if (err || !recipe) {
            req.flash("error", "Hmm.. Something went wrong.");
        }
        else {
            imgPreviousPath += recipe.img.imgFileName;
        }
    });
    Recipe.findByIdAndRemove(id, function (err, recipe) {
        if (err || !recipe) {
            req.flash("error", "Hmm..Something went wrong");
        }
        else {
            fs.unlink(imgPreviousPath, (err) => {
                if (err) throw err;
            });
            req.flash("success", "Your recipe was successfully deleted.");
            res.redirect("/recipes");
        }
    });
});
module.exports = router;