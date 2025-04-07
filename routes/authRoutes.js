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

module.exports = router;
