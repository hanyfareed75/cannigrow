require("dotenv").config();
const express = require("express");
const session = require("express-session");
LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const MongoStore = require("connect-mongo");
const app = express();
const cookieParser = require("cookie-parser");
const connstring = process.env.DB_URL;
const userSchema = require("./models/User");
let methodOverride = require("method-override");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const morgan = require("morgan");
const connectDB = require("./config/database");
const authCTRL = require("./controllers/authCTRL");


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cors({ origin: "http://localhost:3000", credentials: true } ));

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());


app.set("view engine", "ejs");
//Routers
const allRoutes = require("./routes/allRoutes");
const productRoutes = require("./routes/productRoutes");
const custProfile = require("./routes/customerRoutes");
const authRouter = require("./routes/authRouter");
const authRoutes = require("./routes/authRoutes");





authCTRL.googleauth(app,passport,userSchema,GoogleStrategy,session,MongoStore,connstring);
authCTRL.localAuth(app,passport,userSchema,LocalStrategy,session,MongoStore,connstring,bcrypt);

connectDB();

app.use(allRoutes);
app.use(productRoutes);
app.use(custProfile);
app.use(authRouter);
app.use("/api/auth", authRoutes);
app.use(authRoutes);
module.exports = app;
