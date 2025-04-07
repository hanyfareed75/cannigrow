
const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerctrl");

router.get("/api/checkemail/:email", registerController.checkEmailAvilability);

//register new user
router.post("/register", registerController.register);

// check the verfication link sent by email
router.get("/verify", registerController.verifyEmail);

module.exports = router;
