const express = require("express");
const router = express.Router();
const productSchema = require("../models/productSchm");


 

router.get("/", (req, res) => {

  res.render("../views/index");
});
//Products
router.get("/productsview", async (req, res) => {
  const products = await productSchema.find();

  res.render("../views/products/productsview", { products: products });
});


module.exports = router;
