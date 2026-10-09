const express = require("express");
const cart = require("../services/cart");
const { createOrder } = require("../services/orders");

const router = express.Router();

router.post("/preview", (request, response, next) => {
  try {
    response.json({
      ...cart.getCartView(request.body.coupons || []),
      coupons: request.body.coupons || [],
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", (request, response, next) => {
  try {
    const order = createOrder(request.body.coupons || []);
    response.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
