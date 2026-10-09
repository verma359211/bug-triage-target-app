const express = require("express");
const cart = require("../services/cart");

const router = express.Router();

router.get("/", (_request, response) => {
  response.json(cart.getCartView());
});

router.post("/items", (request, response, next) => {
  try {
    cart.addItem(request.body.productId, request.body.quantity);
    response.status(201).json(cart.getCartView());
  } catch (error) {
    next(error);
  }
});

router.delete("/items/:productId", (request, response) => {
  cart.removeItem(request.params.productId);
  response.json(cart.getCartView());
});

router.patch("/items/:productId", (request, response, next) => {
  try {
    cart.setQuantity(request.params.productId, request.body.quantity);
    response.json(cart.getCartView());
  } catch (error) {
    next(error);
  }
});

module.exports = router;
