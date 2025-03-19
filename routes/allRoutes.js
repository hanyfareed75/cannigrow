const express = require("express");
const router = express.Router();
const productSchema = require("../models/productSchm");
const varifyToken = require("../middlewares/varifyToken");

 

router.get("/", (req, res) => {

  res.render("../views/index");
});
//Products
router.get("/productsview", varifyToken,async (req, res) => {
  console.log("productsview");	
  const products = await productSchema.find();

  res.render("../views/products/productsview", { products: products });
});


module.exports = router;
