const express = require("express");
const { ProductModel } = require("../models/product.model");
const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  const products = await ProductModel.find();
  res.send(products);
});

productRouter.post("/add", async (req, res) => {
  const payload = req.body;
  try {
    const new_product = new ProductModel(payload);
    await new_product.save();
    res.send("Product is added to the Database");
  } catch (error) {
    res.send({ Message: "Something went wrong" });
  }
});

productRouter.patch("/update/:id", async (req, res) => {
  const payload = req.body;
  const id = req.params.id;
  const product = await ProductModel.findOne({ _id: id });
  console.log("product:", product);
  const adminID_in_product = product.adminID;
  const adminID_who_making_request = req.body.adminID;

  try {
    if (adminID_who_making_request == adminID_in_product) {
      await ProductModel.findByIdAndUpdate({ _id: id }, payload);
      res.send("Updated the product");
    } else {
      res.send("Sorry, You are not authorize");
    }
  } catch (error) {
    console.log(err);
    res.send({ message: "something went wrong" });
  }
});

productRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const product = await ProductModel.findOne({ _id: id });
  const adminID_in_product = product.adminID;
  const adminID_who_making_request = req.body.adminID;

  try {
    if (adminID_who_making_request == adminID_in_product) {
      await ProductModel.findByIdAndRemove({ _id: id });
      res.send("Deleted the product");
    } else {
      res.send("Sorry, You are not authorize");
    }
  } catch (error) {
    console.log(err);
    res.send({ message: "something went wrong" });
  }
});

module.exports = {
  productRouter,
};
