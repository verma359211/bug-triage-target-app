const express = require("express");
const cartRoutes = require("./routes/cart");

const app = express();

app.use(express.json());
app.get("/health", (_request, response) => response.json({ ok: true }));
app.use("/cart", cartRoutes);

app.use((error, _request, response, _next) => {
  response.status(400).json({ error: error.message });
});

module.exports = app;

