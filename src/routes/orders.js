const express = require("express");
const { getOrder } = require("../services/orders");

const router = express.Router();

router.get("/:id", (request, response) => {
  const order = getOrder(request.params.id);
  if (!order) {
    response.status(404).json({ error: "order not found" });
    return;
  }
  response.json(order);
});

module.exports = router;

