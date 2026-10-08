const { store } = require("../data/store");

function validateStock(items) {
  for (const item of items) {
    const product = store.products.find((candidate) => candidate.id === item.productId);
    if (!product) {
      throw new Error(`product not found: ${item.productId}`);
    }
    if (item.quantity > product.stock) {
      throw new Error(`not enough stock for ${item.productId}`);
    }
  }
}

function reserveStock(items) {
  for (const item of items) {
    const product = store.products.find((candidate) => candidate.id === item.productId);
    product.stock -= item.quantity;
  }
}

module.exports = { validateStock, reserveStock };

