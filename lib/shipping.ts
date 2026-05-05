export const FREE_SHIPPING_THRESHOLD = 5_000_000;
export const STANDARD_SHIPPING = 50_000;

export function calculateShipping(subtotal: number): number {
  return subtotal > FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
}
