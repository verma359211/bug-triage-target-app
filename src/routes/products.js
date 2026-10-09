const express = require("express");
const { listProducts } = require("../services/catalog");

const router = express.Router();

router.get("/", (_request, response) => {
  response.json({ products: listProducts() });
});

module.exports = router;
