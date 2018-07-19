var express = require("express");
var router = express.Router();
var multer = require("multer");
var fs = require("fs");
var upload = multer({ dest: './public/uploads/' });
var Recipe = require("../models/recipe");

//index route
router.get("/", isLoggedIn, function(req, res) {
    var user = req.user;
    res.render("index", { user: user });
});

//NEW ROUTE
//shows new recipe form.
router.get("/new", isLoggedIn, function(req, res) {
    var user = req.user;
    res.render("new", { user: user });
});

//CREATE ROUTE
//creates a new recipe from form submission and adds it to db. redirects to show route
router.post("/", isLoggedIn, upload.single("img"), function(req, res) {


    var imgFileName = req.file.filename;
    var imgMimeType = req.file.mimetype;
    var imgOriginalName = req.file.originalname;
    var title = req.body.title;
    var ingredientList = req.body.ingredients;
    var instructions = req.body.instructions;

    Recipe.create({ title: title, img: { imgFileName: imgFileName, imgMimeType: imgMimeType, imgOriginalName: imgOriginalName }, ingredientList: ingredientList, instructions: instructions }, function(err, recipe) {
        if (err) {
            console.log(err);
        }
        else {
            req.user.recipes.push(recipe);
            req.user.save(function(err, data) {
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
router.get("/:id", isLoggedIn, function(req, res) {
    var id = req.params.id;
    var user = req.user;
    Recipe.findById(id, function(err, recipe) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("show", { user: user, recipe: recipe });
        }
    });
});

//EDIT ROUTE
//shows the form to edit an individual recipe
router.get("/:id/edit", isLoggedIn, function(req, res) {
    var id = req.params.id;
    var user = req.user;
    Recipe.findById(id, function(err, recipe) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("edit", { recipe: recipe, user: user });
        }
    });
});

//UPDATE ROUTE
//updates an indivdual recipe and reroutes to show route
router.put("/:id", isLoggedIn, upload.single("img"), function(req, res) {

    var id = req.params.id;
    Recipe.findById(id, function(err, recipe) {
        if (err) {
            console.log(err);
        }
        else {
            if (typeof req.file != 'undefined') {
                var imgFileName = req.file.filename;
                var imgMimeType = req.file.mimetype;
                var imgOriginalName = req.file.originalname;
                var imgPreviousPath = "./public/uploads/" + recipe.img.imgFileName;
                fs.unlink(imgPreviousPath, (err) => {
                    if (err) throw err;
                });
                recipe.update({
                        title: req.body.title,
                        img: { imgFileName: imgFileName, imgMimeType: imgMimeType, imgOriginalName: imgOriginalName },
                        ingredientList: req.body.ingredients,
                        instructions: req.body.instructions
                    },
                    function() {
                        var url = "/recipes/" + id;
                        res.redirect(url);
                    });
            }
            else {
                recipe.update({
                        title: req.body.title,
                        ingredientList: req.body.ingredients,
                        instructions: req.body.instructions
                    },
                    function() {
                        var url = "/recipes/" + id;
                        res.redirect(url);
                    });
            }
        }
    });
});

//DESTROY ROUTE
//removes an individual recipe and reroutes to index
router.delete("/:id", isLoggedIn, function(req, res) {
    var id = req.params.id;
    var imgPreviousPath = "./public/uploads/";
    Recipe.findById(id, function(err, recipe) {
        if (err) {
            console.log(err);
        }
        else {
            imgPreviousPath += recipe.img.imgFileName;
        }
    });
    Recipe.findByIdAndRemove(id, function(err) {
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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;