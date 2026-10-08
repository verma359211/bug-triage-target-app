const express = require("express");
const { createOrder } = require("../services/orders");

const router = express.Router();

router.post("/", (request, response, next) => {
  try {
    const order = createOrder(request.body.coupons || []);
    response.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

