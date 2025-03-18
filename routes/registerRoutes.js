const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerctrl");

router.get("/api/checkemail/:email", registerController.checkEmailAvilability);

router.post("/register", registerController.register);
module.exports = router;
