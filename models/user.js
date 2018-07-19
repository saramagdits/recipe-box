var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Recipe = require("./recipe.js");

var UserSchema = mongoose.Schema({ username: String, displayName: String, password: String, recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }] });
//the populateFields option will populate recipes on the req.user
UserSchema.plugin(passportLocalMongoose, { populateFields: "recipes" });

module.exports = mongoose.model("User", UserSchema);
