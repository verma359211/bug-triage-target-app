const initialProducts = [
  {
    id: "mug",
    name: "Coffee Mug",
    description: "A weighty ceramic mug for long debugging sessions.",
    category: "Desk",
    accent: "clay",
    priceCents: 1999,
    stock: 5,
  },
  {
    id: "notebook",
    name: "Grid Notebook",
    description: "Lay-flat pages for diagrams, notes, and loose ideas.",
    category: "Paper",
    accent: "sand",
    priceCents: 1250,
    stock: 10,
  },
  {
    id: "sticker",
    name: "Trace Sticker",
    description: "A small weatherproof mark for your favorite machine.",
    category: "Extras",
    accent: "violet",
    priceCents: 101,
    stock: 20,
  },
  {
    id: "pin",
    name: "Enamel Pin",
    description: "Hard enamel, polished metal, and one tiny breakpoint.",
    category: "Extras",
    accent: "ink",
    priceCents: 101,
    stock: 8,
  },
  {
    id: "tote",
    name: "Canvas Tote",
    description: "A sturdy carry-all for cables, notebooks, and coffee.",
    category: "Carry",
    accent: "sage",
    priceCents: 2400,
    stock: 0,
  },
  {
    id: "deskmat",
    name: "Felt Desk Mat",
    description: "A quiet, soft surface sized for a keyboard and mouse.",
    category: "Desk",
    accent: "blue",
    priceCents: 3200,
    stock: 4,
  },
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
