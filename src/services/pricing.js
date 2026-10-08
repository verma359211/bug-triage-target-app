const { store } = require("../data/store");
const { combinedDiscountPercent } = require("./coupons");

const TAX_RATE = 0.0825;
const FREE_SHIPPING_THRESHOLD_CENTS = 5000;
const SHIPPING_CENTS = 799;

function cartLines(items) {
  return items.map((item) => {
    const product = store.products.find((candidate) => candidate.id === item.productId);
    if (!product) {
      throw new Error(`product not found: ${item.productId}`);
    }
    return { ...item, priceCents: product.priceCents };
  });
}

function calculateTotals(items, couponCodes = []) {
  const lines = cartLines(items);
  const subtotalCents = lines.reduce(
    (total, line) => total + line.priceCents * line.quantity,
    0,
  );
  const discountPercent = combinedDiscountPercent(couponCodes);
  const discountCents = Math.round((subtotalCents * discountPercent) / 100);
  const discountedSubtotalCents = subtotalCents - discountCents;
  const taxCents = Math.round(discountedSubtotalCents * TAX_RATE);
  const shippingCents =
    discountedSubtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_CENTS;

  return {
    subtotalCents,
    discountPercent,
    discountCents,
    taxCents,
    shippingCents,
    totalCents: discountedSubtotalCents + taxCents + shippingCents,
  };
}

module.exports = { calculateTotals };

