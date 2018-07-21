const mongoose = require("mongoose"),
      passportLocalMongoose = require("passport-local-mongoose"),
      User = require("./user.js");

const recipeSchema = new mongoose.Schema({
    title: String,
    //TODO refactor this to use ref and then .populate() images later when needed
    //see user model for reference
    img: {imgFileName: String, imgMimeType: String, imgOriginalName: String},
    date: {type: Date, default: Date.now},
    ingredientList: [{type: String}],
    instructions: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
});
recipeSchema.plugin(passportLocalMongoose, {populateFields: "user"});
module.exports = mongoose.model("Recipe", recipeSchema);
