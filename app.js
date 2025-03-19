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
const twilio = require("twilio");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // يجب أن يكون `false` عند استخدام المنفذ 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
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
console.log(req.body);
    const mailOptions = {
      from: "hanyfareed75@gmail.com",
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

const crypto = require("crypto");

// تخزين OTPs بشكل مؤقت
const otpStorage = {};

// مسار لإنشاء وإرسال OTP عبر Brevo SMTP
app.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString(); // إنشاء OTP عشوائي

    otpStorage[email] = otp; // حفظ OTP مؤقتًا
console.log(otpStorage[email]);
    const mailOptions = {
      from: "hanyfareed75@gmail.com",
      to: email,
      subject: "رمز التحقق OTP",
      text: `رمز التحقق الخاص بك هو: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "تم إرسال OTP بنجاح" });
  } catch (error) {
    res.status(500).json({ error: "حدث خطاء اثناء ارسال OTP" + error.message });
  }
});

// إعداد Twilio
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// مسار لإرسال رسالة WhatsApp
app.post("/send-whatsapp", async (req, res) => {
  try {
    const { to, message } = req.body;
    
    const response = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${to}`, // يجب أن يكون رقم المستقبل بصيغة `whatsapp:+countrycodeXXXX`
      body: message
    });

    res.json({ message: "تم إرسال رسالة WhatsApp بنجاح", response });
  } catch (error) {
    res.status(500).json({ error: "فشل في إرسال رسالة WhatsApp", details: error.message });
  }
});


const otpStorage2 = {};

// مسار لإنشاء وإرسال OTP عبر WhatsApp
app.post("/send-whatsapp-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString(); // إنشاء OTP عشوائي

    otpStorage2[phone] = otp; // حفظ OTP مؤقتًا

    const response = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${phone}`,
      body: `رمز التحقق الخاص بك هو: ${otp}`,
    });

    res.json({ message: "تم إرسال OTP عبر WhatsApp", response });
  } catch (error) {
    res
      .status(500)
      .json({ error: "فشل في إرسال OTP عبر WhatsApp", details: error.message });
  }
});

// مسار للتحقق من OTP
app.post("/verify-whatsapp-otp", (req, res) => {
  const { phone, otp } = req.body;

  if (otpStorage2[phone] === otp) {
    delete otpStorage2[phone]; // حذف OTP بعد الاستخدام
    res.json({ message: "تم التحقق بنجاح" });
  } else {
    res.status(400).json({ error: "OTP غير صحيح" });
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
