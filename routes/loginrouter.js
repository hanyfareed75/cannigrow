
const express = require("express");
const router = express.Router();


const loginCTRL = require("../controllers/loginctrl");

// تسجيل الدخول
router.post("/login",loginCTRL.login );

module.exports = router;