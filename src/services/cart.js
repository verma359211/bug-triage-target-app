const { store } = require("../data/store");

function getCart() {
  return store.cart.map((item) => ({ ...item }));
}

function addItem(productId, quantity) {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("quantity must be a positive integer");
  }

  const product = store.products.find((candidate) => candidate.id === productId);
  if (!product) {
    throw new Error("product not found");
  }

  const existing = store.cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    store.cart.push({ productId, quantity });
  }

  return getCart();
}

function removeItem(productId) {
  store.cart = store.cart.filter((item) => item.productId !== productId);
  return getCart();
}

module.exports = { getCart, addItem, removeItem };

