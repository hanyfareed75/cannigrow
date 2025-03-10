const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const port = process.env.PORT 
const connstring = process.env.DB_URL;
const productSchema = require("./models/productSchm");
const path = require("path");
var methodOverride = require("method-override");

app.use(express.static("public"));
app.set("views", "./views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set('view engine', 'ejs');


//Connect to DB
mongoose
  .connect(connstring)
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

//live reload 

const liveReload = require("livereload");
const { render } = require("ejs");
const lrserver = liveReload.createServer();
lrserver.watch(path.join(__dirname, "public"));
lrserver.server.once("connection", () => {
  setTimeout(() => {
    lrserver.refresh("/");
  }, 100);
});

//Home
app.get("/", (req, res) => {
  res.render("index");
});
//Products
app.get("/productsview", async (req, res) => {
  const products = await productSchema.find();
  
  res.render("products/productsview",{products:products});
});
//add product
app.get("/addProduct", async (req, res) => {
   const products = await productSchema.find();
  res.render("adminPortal/addProduct", { title: "Add Product",prod: products });
});

app.post("/addproduct", async (req, res) => {
  const product = new productSchema(req.body);
  console.log(product);
  await product.save().then((result) => res.redirect("/addProduct")).catch((err) => console.log(err));
 

});
app.post("/delete/:id", async (req, res) => {
  await productSchema.findByIdAndDelete(req.params.id);
  res.redirect("/addProduct");
});

app.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const product = await productSchema.findById(id);
  res.render("adminPortal/edit", { title: "Edit Product", product });
});

app.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  await productSchema.findByIdAndUpdate(id, req.body);
  res.redirect("/addProduct");
});

app.get("/product/:id", async (req, res) => {
  const { id } = req.params;
  const product = await productSchema.findById(id);
  res.json(product);
});


app.delete("/product/:id", async (req, res) => {  
  const { id } = req.params;
  await productSchema.findByIdAndDelete(id);
  res.json({ message: "Product deleted" });
}); 

app.post("/update", async (req, res) => {
  const { id, field, value } = req.body;
  try {
    await productSchema.findByIdAndUpdate(id, { [field]: value });
    res.send("تم التحديث بنجاح");
  } catch (error) {
    res.status(500).send("خطأ في التحديث");
  }
});