const express = require("express");
const path = require("node:path");
const cartRoutes = require("./routes/cart");
const checkoutRoutes = require("./routes/checkout");
const orderRoutes = require("./routes/orders");
const productRoutes = require("./routes/products");
const { runWithSession } = require("./data/store");

const app = express();
const frontendDirectory = path.join(__dirname, "..", "frontend", "dist");

app.use(express.json());
app.use((request, response, next) => {
  const sessionId = request.get("x-demo-session");
  if (!sessionId) return next();
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(sessionId)) {
    return response.status(400).json({ error: "invalid demo session" });
  }
  return runWithSession(sessionId, next);
});
app.get("/health", (_request, response) => response.json({ ok: true }));
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/orders", orderRoutes);

app.use(express.static(frontendDirectory));
app.use((request, response, next) => {
  if (request.method === "GET" && request.accepts("html")) {
    return response.sendFile(path.join(frontendDirectory, "index.html"), (error) => {
      if (error) next(error);
    });
  }
  return next();
});

app.use((error, _request, response, _next) => {
  const status = error.code === "ENOENT" ? 404 : 400;
  response.status(status).json({ error: error.message });
});

module.exports = app;
