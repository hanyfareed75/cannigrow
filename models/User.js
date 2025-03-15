const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  googleId: String,
  displayName: String,
  photo: String,
  email: { type: String,  unique: true },
  password: { type: String },
});


module.exports = mongoose.model("User", userSchema);