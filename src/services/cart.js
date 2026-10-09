const { store } = require("../data/store");
const { calculateTotals } = require("./pricing");

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

function setQuantity(productId, quantity) {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("quantity must be a positive integer");
  }
  const existing = store.cart.find((item) => item.productId === productId);
  if (!existing) {
    throw new Error("cart item not found");
  }
  existing.quantity = quantity;
  return getCart();
}

function getCartView(coupons = []) {
  const items = getCart().map((item) => {
    const product = store.products.find((candidate) => candidate.id === item.productId);
    return {
      ...item,
      name: product.name,
      priceCents: product.priceCents,
      lineTotalCents: product.priceCents * item.quantity,
    };
  });
  return {
    items,
    totals: calculateTotals(store.cart, coupons),
  };
}

module.exports = { getCart, addItem, removeItem, setQuantity, getCartView };
