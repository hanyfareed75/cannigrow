require("dotenv").config();
const express = require("express");

const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const app = express();
app.use(express.static("public"));
const cookieParser = require("cookie-parser");
const port = process.env.PORT;
const connstring = process.env.DB_URL;

const userSchema = require("./models/userSchm");



//Routers
const allRoutes = require("./routes/allRoutes");
const productRoutes = require("./routes/productRoutes");
const custProfile = require("./routes/customerRoutes");
const authRouter = require("./routes/authRouter");

let methodOverride = require("method-override");


app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());
//Connect to DB
mongoose
  .connect(connstring)
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));



// **إعداد الجلسات باستخدام MongoDB**
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
     cookie: { secure: false },
    store: MongoStore.create({ mongoUrl: connstring }),
  })
);

// **إعداد Passport**
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
 

    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userSchema.findOne({ googleId: profile.id });

        if (!user) {
          user = await userSchema.create({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// **حفظ بيانات المستخدم في الجلسة**
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userSchema.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.get("/api/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});



app.use(allRoutes);
app.use(productRoutes);
app.use(custProfile);
app.use(authRouter);
