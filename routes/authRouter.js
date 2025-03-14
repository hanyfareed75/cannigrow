const express = require("express");
const router = express.Router();
const passport = require("passport");

//Google Router
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// المعالجة بعد تسجيل الدخول
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
     res.cookie("auth_token", req.user.accessToken, {
       httpOnly: true, // Secure cookie (not accessible by JavaScript)
       secure: false, // Change to `true` in production (HTTPS)
       maxAge: 24 * 60 * 60 * 1000, // 1 day
     });
   res.redirect("/");
  }
);

// صفحة الملف الشخصي
router.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    console.log("not authenticated");
    return res.redirect("/");
  }
  /* res.send(`
        <h1>مرحبًا، ${req.user.displayName}</h1>
        <img src="${req.user.photo}" width="100" />
        <p>Email: ${req.user.email}</p>
        <a href="/logout">تسجيل الخروج</a>
        console.log(req.user);
    `); */
  res.render("../views/index", {
    username: req.user.displayName,
    photo: req.user.photo,
  });
});

// تسجيل الخروج
router.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy((err) => {
      res.redirect("/"); // Redirect to home or login page
    });
  });
});

//email and password
router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
  console.log(user);
});

router.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
  console.log(user);
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  await user.save();
  res.redirect("/login");
  console.log(user);
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/profile");
    console.log(req.user);
  }
);

module.exports = router;
