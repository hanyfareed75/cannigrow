const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");


const userSchema = new mongoose.Schema({
  googleId: String,
  displayName: String,
  photo: String,
  email: { type: String, unique: true },
  password: { type: String },
  active: { type: Boolean, default: false },
  verificationToken: { type: String, required: false },
});
userSchema.methods.generateJWT = function () {
  return jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

module.exports = mongoose.model("User", userSchema);