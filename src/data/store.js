const { AsyncLocalStorage } = require("node:async_hooks");

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

const sessionContext = new AsyncLocalStorage();
const sessions = new Map();
const SESSION_TTL_MS = 2 * 60 * 60 * 1000;
const MAX_SESSIONS = 500;

function createStore() {
  return {
    products: initialProducts.map((product) => ({ ...product })),
    cart: [],
    orders: [],
  };
}

const defaultStore = createStore();

function removeExpiredSessions() {
  const cutoff = Date.now() - SESSION_TTL_MS;
  for (const [id, session] of sessions) {
    if (session.updatedAt < cutoff) sessions.delete(id);
  }
  while (sessions.size >= MAX_SESSIONS) {
    sessions.delete(sessions.keys().next().value);
  }
}

function getSessionStore(sessionId) {
  removeExpiredSessions();
  const existing = sessions.get(sessionId);
  if (existing) {
    existing.updatedAt = Date.now();
    return existing.store;
  }
  const session = { store: createStore(), updatedAt: Date.now() };
  sessions.set(sessionId, session);
  return session.store;
}

function currentStore() {
  const sessionId = sessionContext.getStore();
  return sessionId ? getSessionStore(sessionId) : defaultStore;
}

const store = new Proxy({}, {
  get: (_target, property) => currentStore()[property],
  set: (_target, property, value) => {
    currentStore()[property] = value;
    return true;
  },
});

function runWithSession(sessionId, callback) {
  return sessionContext.run(sessionId, callback);
}

function resetStore() {
  const active = currentStore();
  const fresh = createStore();
  active.products = fresh.products;
  active.cart = fresh.cart;
  active.orders = fresh.orders;
}

module.exports = { store, resetStore, runWithSession };
