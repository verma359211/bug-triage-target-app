const coupons = {
  SAVE30: 30,
  VIP30: 30,
  SAVE10: 10,
};

function combinedDiscountPercent(codes = []) {
  const combined = codes.reduce((total, code) => {
    const percent = coupons[code];
    if (percent === undefined) {
      throw new Error(`unknown coupon: ${code}`);
    }
    return total + percent;
  }, 0);

  return Math.min(combined, 50);
}

module.exports = { combinedDiscountPercent };

