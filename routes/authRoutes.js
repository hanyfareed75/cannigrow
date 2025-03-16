const express = require("express");
const authController = require("../controllers/authController");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const authenticateToken = require("../middlewares/authMiddleware");
const { route } = require("./allRoutes");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authenticateToken, getUserProfile);
router.get("/register", (req, res) => {
  console.log("Signup");
  res.render("../views/register.ejs");
});
router.get("/api/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user , cookies: req.cookies , session: req.session , headers: req.headers , query: req.query, body: req.body , params: req.params , files: req.files , originalUrl: req.originalUrl , protocol: req.protocol , subdomains: req.subdomains , secure: req.secure , ip: req.ip , method: req.method , xhr: req.xhr , baseUrl: req.baseUrl , route: req.route , fresh: req.fresh , stale: req.stale , originalMethod: req.originalMethod, headersSent: req.headersSent  });
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
