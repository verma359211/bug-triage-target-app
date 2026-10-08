const request = require("supertest");
const app = require("../src/app");
const { resetStore } = require("../src/data/store");

beforeEach(resetStore);

test("adds an item to the cart", async () => {
  const response = await request(app)
    .post("/cart/items")
    .send({ productId: "mug", quantity: 2 })
    .expect(201);

  expect(response.body.items).toEqual([{ productId: "mug", quantity: 2 }]);
});

test("rejects an unknown product", async () => {
  const response = await request(app)
    .post("/cart/items")
    .send({ productId: "missing", quantity: 1 })
    .expect(400);

  expect(response.body.error).toBe("product not found");
});

