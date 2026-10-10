export function formatMUR(amount: number): string {
  const formatted = new Intl.NumberFormat('en-MU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
  return `Rs ${formatted}`;
}

export function getProductPrice(price: number, salePrice: number | null): number {
  return salePrice !== null && salePrice < price ? salePrice : price;
}

export function isOnSale(price: number, salePrice: number | null): boolean {
  return salePrice !== null && salePrice < price;
}

export function getEffectivePrice(product: { price: number; sale_price: number | null }): number {
  return getProductPrice(product.price, product.sale_price);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateOrderNumber(): string {
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const rand = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `LS-${ymd}-${rand}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-MU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
