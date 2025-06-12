import { Product } from '../types';

export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;
  
  const searchTerm = query.toLowerCase().trim();
  
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );
}

export function filterByCategory(products: Product[], category: string): Product[] {
  if (category === 'all') return products;
  return products.filter(product => product.category === category);
}

export function filterByPrice(products: Product[], minPrice: number, maxPrice: number): Product[] {
  return products.filter(product => product.price >= minPrice && product.price <= maxPrice);
}

export function sortProducts(products: Product[], sortBy: string): Product[] {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    case 'featured':
    default:
      return sorted.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
  }
}
