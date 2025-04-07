require("dotenv").config();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const user = require("../models/User");
const {
  ConversationPage,
} = require("twilio/lib/rest/conversations/v1/conversation");
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // يجب أن يكون `false` عند استخدام المنفذ 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmailValidationLink(to, subject, token) {
  const verificationLink = `http://localhost:3000/verify?token=${token}`;
  const mailOptions = {
    from: "hanyfareed75@gmail.com",
    to: to,
    subject: subject,
    text: `<h3>Welcome!</h3>
             <p>Click the link below to verify your account:</p>
             <a href="${verificationLink}">Verify My Account</a>`,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}
const verifyToken = (req, res, next) => {
  if (!req.cookies.auth_token) {
    req.session.returnTo = req.originalUrl; // Save the current URL
    return res.redirect("/signin");
  }

  next();
};

const requireAuth = async (req, res, next) => {
  try {
    if (!req.session.passport) {
      req.session.returnTo = req.originalUrl;
      
      next();
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}

module.exports = {
  sendEmailValidationLink,
  verifyToken,
  requireAuth,
  isAuthenticated,
};
