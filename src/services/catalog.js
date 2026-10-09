const { store } = require("../data/store");

function listProducts() {
  return store.products.map((product) => ({
    ...product,
    inStock: product.stock > 0,
  }));
}

module.exports = { listProducts };
