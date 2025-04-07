const express = require("express");
const router = express.Router();

const validationCTRL = require("../controllers/validationCTRL");


// send email
router.post("/send-email", validationCTRL.sendEmail);

const crypto = require("crypto");

// تخزين OTPs بشكل مؤقت
const otpStorage = {};

// مسار لإنشاء وإرسال OTP عبر Brevo SMTP
router.post("/send-otp", validationCTRL.sendOtp);
module.exports = router;