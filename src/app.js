const express = require("express");
const cartRoutes = require("./routes/cart");
const checkoutRoutes = require("./routes/checkout");
const orderRoutes = require("./routes/orders");
const productRoutes = require("./routes/products");

const app = express();

app.use(express.json());
app.get("/health", (_request, response) => response.json({ ok: true }));
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/orders", orderRoutes);

app.use((error, _request, response, _next) => {
  response.status(400).json({ error: error.message });
});

module.exports = app;
