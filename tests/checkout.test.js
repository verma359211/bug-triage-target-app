const request = require("supertest");
const app = require("../src/app");
const { resetStore } = require("../src/data/store");

beforeEach(resetStore);

async function addMugs(quantity) {
  await request(app)
    .post("/cart/items")
    .send({ productId: "mug", quantity })
    .expect(201);
}

test("applies one percentage coupon", async () => {
  await addMugs(2);

  const response = await request(app)
    .post("/checkout")
    .send({ coupons: ["SAVE30"] })
    .expect(201);

  expect(response.body).toMatchObject({
    subtotalCents: 3998,
    discountPercent: 30,
    discountCents: 1199,
    taxCents: 231,
    shippingCents: 799,
    totalCents: 3829,
  });
});

test("creates an order that can be fetched", async () => {
  await addMugs(1);
  const checkout = await request(app).post("/checkout").send({}).expect(201);

  const response = await request(app).get(`/orders/${checkout.body.id}`).expect(200);
  expect(response.body.items).toEqual([{ productId: "mug", quantity: 1 }]);
});

