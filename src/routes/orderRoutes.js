const express = require("express");
const router = express.Router();
const isAuthenticated = require("../utils/isAuthenticated");
const Order = require("../models/orderModel");
const isAdmin = require("../utils/isAdmin");

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({});
    res.send(orders);
  } catch (error) {
    return res.send({ msg: error.message });
  }
});

router.get("/mine", isAuthenticated, async (req, res) => {
  try {
    console.log("what happens in here", req.user._id);
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  } catch (error) {
    return res.send({ msg: error.message });
  }
});

router.get("/:id", isAuthenticated, async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id });
  if (order) {
    res.send(order);
  } else {
    res.status(404).send("Order Not Found.");
  }
});

router.post("/", isAuthenticated, async (req, res) => {
  console.log("is in here at all?");
  try {
    console.log(req.body);
    const newOrder = new Order({
      orderItems: req.body.orderItems,
      user: req.user._id,
      shipping: req.body.shipping,
      payment: req.body.payment,
      itemsPrice: req.body.itemsPrice,
      taxPrice: req.body.taxPrice,
      shippingPrice: req.body.shippingPrice,
      totalPrice: req.body.totalPrice,
    });

    const newOrderCreated = await newOrder.save();
    res
      .status(201)
      .send({ message: "New Order Created", data: newOrderCreated });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.put("/:id/pay", isAuthenticated, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.payment = {
      paymentMethod: "paypal",
      paymentResult: {
        payerID: req.body.payerID,
        orderID: req.body.orderID,
        paymentID: req.body.paymentID,
      },
    };
    const updatedOrder = await order.save();
    res.send({ message: "Order Paid.", order: updatedOrder });
  } else {
    res.status(404).send({ message: "Order not found." });
  }
});

router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
  const deletedOrder = await Order.findById(req.params.id);
  if (deletedOrder) {
    await deletedOrder.remove();
    res.send({ message: "Order Deleted" });
  } else {
    res.send("Error in Deletion.");
  }
});

module.exports = router;
