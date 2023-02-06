// defining user schema
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema
const UserSchema = new Schema({
 // information we want to have for our user
 name: String,
 email: { type: String, unique: true },
 password: String,
});

// create user model
const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;