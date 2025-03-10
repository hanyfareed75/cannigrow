const express = require("express");
const router = express.Router();
const productSchema = require("../models/productSchm");
const productControllers = require("../controllers/productControllers");

//add product
router.get("/addProduct", productControllers.getproducts);

router.post("/addproduct", productControllers.addproduct);
//delete product
router.post("/delete/:id", productControllers.deleteproduct);

router.put("/edit/:id", productControllers.editProduct);

router.get("/edit/:id", productControllers.findproductByID);



module.exports = router;