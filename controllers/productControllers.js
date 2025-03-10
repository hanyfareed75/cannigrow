 

const productSchema = require("../models/productSchm");

const getproducts = async (req, res) => {
  const products = await productSchema.find();
  res.render("../views/adminPortal/addProduct", {
    title: "Add Product",
    prod: products,
  });
};
const addproduct = async (req, res) => {
  const product = new productSchema(req.body);

  await product
    .save()
    .then((result) => {
      res.redirect("/addProduct");
    })
    .catch((err) => console.log(err));
};
const deleteproduct = async (req, res) => {
  await productSchema.findByIdAndDelete(req.params.id);
  res.redirect("/addProduct");
};

const editProduct = async (req, res) => {
  const { id } = req.params;
  await productSchema.findByIdAndUpdate(id, req.body);
  res.redirect("/addProduct");
};

const findproductByID = async (req, res) => {
  const { id } = req.params;
  const product = await productSchema.findById(id);
  res.render("../views/adminPortal/edit", { title: "Edit Product", product });
};
module.exports = { getproducts, addproduct ,deleteproduct,editProduct,findproductByID};
