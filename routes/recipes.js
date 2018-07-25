const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const upload = multer({dest: './public/uploads/'});
const mongoose = require("mongoose");
const RecipeSchema = require("../models/recipe");
const Recipe = mongoose.model('Recipe', RecipeSchema);
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
//creates a new recipe from form submission and adds it to db. redirects to show route
router.post("/", upload.single("img"), function (req, res) {
    let recipe = {
        title: req.body.title,
        img: {imgFileName: req.file.filename, imgMimeType: req.file.mimetype, imgOriginalName: req.file.originalname},
        ingredientList: req.body.ingredients,
        instructions: req.body.instructions
    };
    Recipe.create(recipe, function (err, newRecipe) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
            req.user.recipes.push(newRecipe);
            req.user.save(function (err) {
                if (err) {
                    req.flash("error", err.message);
                    res.redirect("back");
                } else {
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
    let recipe = user.recipes.id(id);
    //will reject both a "null" and "undefined" recipe
    if (typeof recipe === 'undefined' || !recipe) {
        req.flash("error", "Hmm.. That recipe could not be found.");
        res.redirect("/recipes");
    } else {
        res.render("show", {user: user, recipe: recipe});
    }
});

//EDIT ROUTE
//shows the form to edit an individual recipe
router.get("/:id/edit", function (req, res) {
    let id = req.params.id;
    let user = req.user;
    let recipe = user.recipes.id(id);
    if (typeof recipe !== "undefined") {
        res.render("edit", {user: user, recipe: recipe});
    } else {
        req.flash("error", "Hmm.. That recipe could not be found.");
        res.redirect("back");
    }
});

//UPDATE ROUTE
//updates an individual recipe and reroutes to show route
router.put("/:id", upload.single("img"), function (req, res) {
    let id = req.params.id;
    let user = req.user;
    let recipe = user.recipes.id(id);
    if (typeof recipe !== "undefined") {
        recipe.title = req.body.title;
        recipe.ingredientList = req.body.ingredients;
        recipe.instructions = req.body.instructions;
        //check if a new image was passed in
        if (typeof req.file !== 'undefined') {
            //set the image path to be deleted to the previous image
            let imgPreviousPath = "public/uploads/" + recipe.img.imgFileName;
            //if an image was provided, update the recipe image attributes
            recipe.img = {
                imgFileName: req.file.filename,
                imgMimeType: req.file.mimetype,
                imgOriginalName: req.file.originalname
            };
            //remove the previous image
            fs.unlink(imgPreviousPath, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        //save the user, including its updated recipe
        user.save(function (err) {
            if (err) {
                req.flash("error", "There was an error updating your recipe. Please try again.");
                res.redirect("back");
            } else {
                req.flash("success", "Your recipe was successfully updated!");
                res.redirect("/recipes/" + id);
            }
        });
    } else {
        req.flash("error", "Hmm.. That recipe could not be found.");
        res.redirect("back");
    }
});

//DESTROY ROUTE
//removes an individual recipe and reroutes to index
router.delete("/:id", function (req, res) {
    let id = req.params.id;
    let user = req.user;
    let recipe = user.recipes.id(id);
    let imgPreviousPath = "public/uploads/" + recipe.img.imgFileName;

    user.recipes.id(id).remove();
    user.save(function (err) {
        if (err) {
            res.flash("error", "Hmm.. Something went wrong, please try again.");
            res.redirect("back");
        } else {
            fs.unlink(imgPreviousPath, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            req.flash("success", "Your recipe was successfully deleted.");
            res.redirect("/recipes");
        }
    });
});

module.exports = router;