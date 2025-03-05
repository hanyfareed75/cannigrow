const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: String,
    category: String,
    quantity: Number,
  });

  module.exports = mongoose.model("Product", productSchema);
  