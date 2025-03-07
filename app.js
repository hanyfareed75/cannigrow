const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

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

//live reload 
const path  = require("path");
const liveReload = require("livereload");
const lrserver = liveReload.createServer();
lrserver.watch(path.join(__dirname, "public"));
lrserver.server.once("connection", () => {
  setTimeout(() => {
    lrserver.refresh("/");
  }, 100);
});


app.get("/", (req, res) => {
  res.render("index");
});
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
app.get("/products", async (req, res) => {
  const products = await productSchema.find();
  res.json(products);
  console.log(products);
});
app.put("/edit/:id", async (req, res) => {
  await productSchema.findByIdAndUpdate(req.body.id, {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image,
    category: req.body.category,
    quantity: req.body.quantity ,
    status: req.body.status
  });
  res.redirect("/addProduct");
});
app.get("/product/:id", async (req, res) => {
  const { id } = req.params;
  const product = await productSchema.findById(id);
  res.json(product);
});
app.get("/edit/:id",  (req, res) => {
  const { id } = req.params;
  const product =  productSchema.findById(id);
   
  console.log(req.body);
  res.render("adminPortal/edit", { product });

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