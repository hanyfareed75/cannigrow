const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const connstring =
  "mongodb+srv://hanyfareed75:8j5pWGdSizQl9cnw@cluster0.eogch.mongodb.net/all-data?retryWrites=true&w=majority&appName=Cluster0";
const productSchema = require("./models/productSchm");

mongoose
  .connect(connstring)
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.sendFile("./views/index.html", { root: __dirname });
});
app.get("/addProduct", (req, res) => {
  res.sendFile("./views/adminPortal/addProduct.html", { root: __dirname });
});

app.post("/addproduct", async (req, res) => {
  const product = new productSchema(req.body);
  console.log(product);
  await product.save().then((result) => res.redirect("/addProduct")).catch((err) => console.log(err));
 

});

app.get("/products", async (req, res) => {
  const products = await productSchema.find();
  res.json(products);
  console.log(products);
});

app.get("/product/:id", async (req, res) => {
  const { id } = req.params;
  const product = await productSchema.findById(id);
  res.json(product);
});

app.put("/product/:id", async (req, res) => {
  const { id } = req.params;  
  const { name, price, description, image, category, quantity } = req.body;
  const product = await productSchema.findById(id);
  product.name = name;
  product.price = price;
  product.description = description;
  product.image = image;
  product.category = category;
  product.quantity = quantity;
  await product.save();
  res.json(product);
}); 

app.delete("/product/:id", async (req, res) => {  
  const { id } = req.params;
  await productSchema.findByIdAndDelete(id);
  res.json({ message: "Product deleted" });
}); 
