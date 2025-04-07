const passport = require("passport");

var localStrategy = require("passport-local").Strategy;
const userSchema = require("../models/User");
const bcrypt = require("bcryptjs");

passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await userSchema.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;