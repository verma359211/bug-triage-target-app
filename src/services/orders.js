const { store } = require("../data/store");
const { calculateTotals } = require("./pricing");
const { validateStock, reserveStock } = require("./stock");

function createOrder(couponCodes = []) {
  if (store.cart.length === 0) {
    throw new Error("cart is empty");
  }

  validateStock(store.cart);
  const totals = calculateTotals(store.cart, couponCodes);
  const order = {
    id: String(store.orders.length + 1),
    status: "confirmed",
    createdAt: new Date().toISOString(),
    items: store.cart.map((item) => ({ ...item })),
    ...totals,
  };

  reserveStock(store.cart);
  store.orders.push(order);
  store.cart = [];
  return { ...order };
}

function getOrder(id) {
  return store.orders.find((order) => order.id === id) || null;
}

function listOrders() {
  return store.orders.map((order) => ({ ...order }));
}

module.exports = { createOrder, getOrder, listOrders };
