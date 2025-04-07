const express = require("express");
const router = express.Router();
const session = require("express-session");
const productSchema = require("../models/productSchm");
const user = require("../models/User");
const varifyToken = require("../middlewares/varifyToken");
const validationMW = require("../middlewares/validationMW");
const { render } = require("../app");
jwt = require("jsonwebtoken");

router.get("/", validationMW.requireAuth, (req, res) => {
  if (!req.session.passport) {
    console.log("not authenticated");
    return res.redirect("/api/auth/login");

  }
  res.render("../views/index");
});
//Products
router.get("/productsview", validationMW.isAuthenticated, async (req, res) => {
  const products = await productSchema.find();
  const token = req.cookies.auth_token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
    } else {
      console.log(decoded.email);
    }
  });
  res.render("../views/products/productsview", { products: products });
});

module.exports = router;
