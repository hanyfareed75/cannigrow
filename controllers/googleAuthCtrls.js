const express = require("express");

const passport = require("passport");


const googlegetAuth = () => {
    passport.authenticate("google", {
      scope: ["profile", "email"],
    });
    console.log("googlegetAuth");
}

module.exports = { googlegetAuth };