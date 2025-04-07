require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const app = express();
const cookieParser = require("cookie-parser");
const userSchema = require("./models/User");
let methodOverride = require("method-override");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/database");

const allRoutes = require("./routes/allRoutes");
const productRoutes = require("./routes/productRoutes");
const custProfile = require("./routes/customerRoutes");
const authRouter = require("./routes/authRouter");
const authRoutes = require("./routes/authRoutes");
const registerRoutes = require("./routes/registerRoutes");
const signinRouter = require("./routes/signinRoutes");
const validationRouters = require("./routes/validationRoutes");

//Connect MongoDB
connectDB();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      
      maxAge: 24 * 60 * 60 * 1000,
      
    },
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "ejs");


// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serialize & Deserialize user
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

//Routers


//use Routers
app.use(allRoutes);
app.use(productRoutes);
app.use(custProfile);
app.use(authRouter);
app.use("/api/auth", authRoutes);
app.use(authRoutes);
app.use(registerRoutes);
app.use(signinRouter);
app.use(validationRouters);
module.exports = app;
