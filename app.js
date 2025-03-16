require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const MongoStore = require("connect-mongo");
const app = express();
const cookieParser = require("cookie-parser");
const connstring = process.env.DB_URL;
const userSchema = require("./models/User");
let methodOverride = require("method-override");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const connectDB = require("./config/database");
const authCTRL = require("./controllers/authCTRL");


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(cors({ origin: "http://localhost:3000", credentials: true } ));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

//Routers
const allRoutes = require("./routes/allRoutes");
const productRoutes = require("./routes/productRoutes");
const custProfile = require("./routes/customerRoutes");
const authRouter = require("./routes/authRouter");
const authRoutes = require("./routes/authRoutes");



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




connectDB();

app.use(allRoutes);
app.use(productRoutes);
app.use(custProfile);
app.use(authRouter);
app.use("/api/auth", authRoutes);
app.use(authRoutes);
module.exports = app;
