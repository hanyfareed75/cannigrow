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
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // بريد المرسل
    pass: process.env.EMAIL_PASS, // كلمة مرور التطبيق
  },
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cors({ origin: "http://localhost:3000", credentials: true } ));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());


app.set("view engine", "ejs");

app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: text,
    };

    const info = await transporter.sendMail(mailOptions);
    res.json({ message: "تم إرسال البريد بنجاح", info });
  } catch (error) {
    res
      .status(500)
      .json({ error: "فشل في إرسال البريد", details: error.message });
  }
});

//Routers
const allRoutes = require("./routes/allRoutes");
const productRoutes = require("./routes/productRoutes");
const custProfile = require("./routes/customerRoutes");
const authRouter = require("./routes/authRouter");
const authRoutes = require("./routes/authRoutes");
const registerRoutes = require("./routes/registerRoutes");
const loginRouter = require("./routes/loginrouter");



//Google Auth
authCTRL.googleauth(app,passport,userSchema,GoogleStrategy,session,MongoStore,connstring);
//Local Auth
authCTRL.localAuth(app,passport,userSchema,LocalStrategy,session,MongoStore,connstring,bcrypt);
//Connect MongoDB
connectDB();
//use Routers
app.use(allRoutes);
app.use(productRoutes);
app.use(custProfile);
app.use(authRouter);
app.use("/api/auth", authRoutes);
app.use(authRoutes);
app.use(registerRoutes);
app.use(loginRouter);
module.exports = app;
