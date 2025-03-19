const express = require("express");
const authController = require("../controllers/authController");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const authenticateToken = require("../middlewares/authMiddleware");


const router = express.Router();


//router.post("/login", loginUser);
router.get("/profile", authenticateToken, getUserProfile);
router.get("/register", (req, res) => {
  console.log("Signup");
  res.render("../views/register.ejs");
});
router.get("/api/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user  });
   } else {
    res.json({ authenticated: false });
  }
});
router.get("/signin", (req, res) => {
  
  res.render("./signin.ejs");
});
router.post("/signin", authController.loginUser, (req, res) => {
  console.log("req.user", req.user);
  res.render("./signin.ejs");
});
module.exports = router;
