const express = require("express");
const Product = require("../models/productModel");
const router = express.Router();

const genAuthToken = require("../utils/genAuthToken");
const isAuthenticated = require("../utils/isAuthenticated");
const isAdmin = require("../utils/isAdmin");
// the above middleware is used to protect all the route;

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.send(products);
  } catch (err) {
    res.send({ msg: err.message });
  }
});

router.get("/:id", async (req, res) => {
  console.log(req.params);
  try {
    const product = await Product.findOne({ _id: req.params.id });
    res.send(product);
  } catch (err) {
    res.send({ msg: err.message });
  }
});

router.post("/", isAuthenticated, isAdmin, async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    brand: req.body.brand,
    category: req.body.category,
    countInStock: req.body.countInStock,
    description: req.body.description,
  });
  try {
    const newProduct = await product.save();
    //why if(newProduct) {res.status.send({msg:"new message created is better?"})}
    res.status(201).send({ msg: "new product created", data: newProduct });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Error in creating product" });
  }
});

router.put("/:id", isAuthenticated, isAdmin, async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);
    product.name = req.body.name;
    product.price = req.body.price;
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.category = req.body.category;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    const updatedProduct = await product.save();
    res.send({
      msg: `Product ${productId} is successfully updated`,
      data: updatedProduct,
    });
  } catch (err) {
    res.status(500).send({ msg: `Error in updating the product ${productId}` });
  }
});

router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
  const deletedProduct = await Product.findById(req.params.id);
  if (deletedProduct) {
    await deletedProduct.remove();
    res.send({ message: "Product Deleted" });
  } else {
    res.send("Error in Deletion.");
  }
});

module.exports = router;
