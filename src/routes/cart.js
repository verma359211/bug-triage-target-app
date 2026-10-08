const express = require("express");
const cart = require("../services/cart");

const router = express.Router();

router.get("/", (_request, response) => {
  response.json({ items: cart.getCart() });
});

router.post("/items", (request, response, next) => {
  try {
    const items = cart.addItem(request.body.productId, request.body.quantity);
    response.status(201).json({ items });
  } catch (error) {
    next(error);
  }
});

router.delete("/items/:productId", (request, response) => {
  response.json({ items: cart.removeItem(request.params.productId) });
});

module.exports = router;

