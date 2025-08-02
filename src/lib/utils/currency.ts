export const formatIDR = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
};
export function getPriceByDiscountPercentage(
  value: number,
  discountPercentage: number,
) {
  const discountAmount = (value * discountPercentage) / 100;
  const finalPrice = value - discountAmount;

  return finalPrice;
}

export function getPriceByDiscountFixedAmount(
  value: number,
  fixedAmount: number,
) {
  return value - fixedAmount;
}
