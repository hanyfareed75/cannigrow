
const express = require("express");
const router = express.Router();
const signinCTRL = require("../controllers/signinCtrl");
const passport = require("../strategies/localStrategy");


router.get("/api/auth/login",(req,res)=>{
  console.log(req.session);
  res.render("../views/signin");
});

// تسجيل الدخول
router.post(
  "/api/auth/login",
  passport.authenticate("local"),
  signinCTRL.signin
);


router.get("/signout", signinCTRL.signout);

module.exports = router;