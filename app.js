require("dotenv").config();
const express = require("express");

const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");

const MongoStore = require("connect-mongo");
const app = express();
const port = process.env.PORT;
const connstring = process.env.DB_URL;

const userSchema = require("./models/userSchm");

const path = require("path");


const allRoutes = require("./routes/allRoutes");
const productRoutes = require("./routes/productRoutes");
const custProfile = require("./routes/customerRoutes");

var methodOverride = require("method-override");

app.use(express.static("public"));
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");

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

//live reload

const liveReload = require("livereload");
const { render } = require("ejs");
const { all } = require("./routes/allRoutes");
const lrserver = liveReload.createServer();
lrserver.watch(path.join(__dirname, "public"));
lrserver.server.once("connection", () => {
  setTimeout(() => {
    lrserver.refresh("/");
  }, 100);
});

// **إعداد الجلسات باستخدام MongoDB**
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
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

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// المعالجة بعد تسجيل الدخول
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

// صفحة الملف الشخصي
app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.send(`
        <h1>مرحبًا، ${req.user.displayName}</h1>
        <img src="${req.user.photo}" width="100" />
        <p>Email: ${req.user.email}</p>
        <a href="/logout">تسجيل الخروج</a>
    `);
});

// تسجيل الخروج
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

app.use(allRoutes);
app.use(productRoutes);
app.use(custProfile);
