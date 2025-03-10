const express = require("express");
const router = express.Router();
const productSchema = require("../models/productSchm");
const mongoose = require("mongoose");
const userSchema = require("../models/userSchm");

const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

 

router.get("/", (req, res) => {
  res.render("index");
});
//Products
router.get("/productsview", async (req, res) => {
  const products = await productSchema.find();

  res.render("../views/products/productsview", { products: products });
});


module.exports = router;
