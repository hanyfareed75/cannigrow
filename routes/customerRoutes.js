const express = require("express");
const router = express.Router();
const productSchema = require("../models/productSchm");

router.get("/profile", (req, res) => {
    res.render("../views/customers/custProfile",{title:"Customer Profile"});
});



module.exports = router;