export const FREE_SHIPPING_THRESHOLD = 75;
export const FLAT_RATE = 5.99;

export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_RATE;
}

export function getShippingMessage(subtotal: number): string {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return "You qualify for free shipping!";
  }
  const remaining = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2);
  return `Add $${remaining} more for free shipping`;
}
