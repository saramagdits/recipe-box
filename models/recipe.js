const mongoose = require("mongoose");

let RecipeSchema = new mongoose.Schema({
    title: String,
    img: {imgFileName: String, imgMimeType: String, imgOriginalName: String},
    date: {type: Date, default: Date.now},
    ingredientList: [{type: String}],
    instructions: String
});

module.exports = RecipeSchema;
