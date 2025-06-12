export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDiscount(originalPrice: number, currentPrice: number): number {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

export function calculateTotal(items: { price: number; quantity: number }[]): number {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function calculateTax(subtotal: number, taxRate: number = 0.08): number {
  return subtotal * taxRate;
}

export function isEligibleForFreeShipping(total: number, threshold: number = 50): boolean {
  return total >= threshold;
}
