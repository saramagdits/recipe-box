const mongoose = require("mongoose");
const recipeSchema = new mongoose.Schema({
    title: String,
    //TODO refactor this to use ref and then .populate() images later when needed
    //see user model for reference
    img: {imgFileName: String, imgMimeType: String, imgOriginalName: String},
    date: {type: Date, default: Date.now},
    ingredientList: [{type: String}],
    instructions: String
});

module.exports = mongoose.model("Recipe", recipeSchema);
