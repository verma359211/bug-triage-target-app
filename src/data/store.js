const initialProducts = [
  { id: "mug", name: "Coffee Mug", priceCents: 1999, stock: 5 },
  { id: "notebook", name: "Notebook", priceCents: 1250, stock: 10 },
  { id: "sticker", name: "Sticker", priceCents: 101, stock: 20 },
  { id: "pin", name: "Enamel Pin", priceCents: 101, stock: 8 },
];

const store = {
  products: initialProducts.map((product) => ({ ...product })),
  cart: [],
  orders: [],
};

function resetStore() {
  store.products = initialProducts.map((product) => ({ ...product }));
  store.cart = [];
  store.orders = [];
}

module.exports = { store, resetStore };

