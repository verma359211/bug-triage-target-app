const request = require("supertest");
const app = require("../src/app");
const { resetStore } = require("../src/data/store");

beforeEach(resetStore);

test("adds an item to the cart", async () => {
  const response = await request(app)
    .post("/cart/items")
    .send({ productId: "mug", quantity: 2 })
    .expect(201);

  expect(response.body.items).toEqual([
    expect.objectContaining({
      productId: "mug",
      name: "Coffee Mug",
      quantity: 2,
      lineTotalCents: 3998,
    }),
  ]);
  expect(response.body.totals.subtotalCents).toBe(3998);
});

test("rejects an unknown product", async () => {
  const response = await request(app)
    .post("/cart/items")
    .send({ productId: "missing", quantity: 1 })
    .expect(400);

  expect(response.body.error).toBe("product not found");
});

test("lists the product catalog", async () => {
  const response = await request(app).get("/products").expect(200);

  expect(response.body.products).toHaveLength(6);
  expect(response.body.products[0]).toMatchObject({
    id: "mug",
    name: "Coffee Mug",
    stock: 5,
    inStock: true,
  });
});

test("updates a cart item quantity", async () => {
  await request(app)
    .post("/cart/items")
    .send({ productId: "notebook", quantity: 1 })
    .expect(201);

  const response = await request(app)
    .patch("/cart/items/notebook")
    .send({ quantity: 2 })
    .expect(200);

  expect(response.body.items[0]).toMatchObject({ productId: "notebook", quantity: 2 });
});
