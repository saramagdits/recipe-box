const mongoose = require("mongoose"),
      passportLocalMongoose = require("passport-local-mongoose"),
      RecipeSchema = require("./recipe.js");

const UserSchema = new mongoose.Schema({
    username: String,
    displayName: String,
    password: String,
    recipes: [RecipeSchema]
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
