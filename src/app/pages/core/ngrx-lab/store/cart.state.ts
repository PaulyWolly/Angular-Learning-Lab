/** Feature key must match provideState(...) on the NgRx lab route. */
export const LAB_CART_FEATURE_KEY = 'labCart';

export interface CatalogItem {
  id: string;
  name: string;
  price: number;
}

export interface CartItem extends CatalogItem {
  qty: number;
}

export type CartStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface CartState {
  items: CartItem[];
  status: CartStatus;
  error: string | null;
}

export const CATALOG: CatalogItem[] = [
  { id: 'chips', name: 'Chips', price: 3 },
  { id: 'soda', name: 'Soda', price: 2 },
  { id: 'cookie', name: 'Cookie', price: 4 },
  { id: 'apple', name: 'Apple', price: 1 },
];

/** Pretend API payload for the effects demo. */
export const SEED_CART: CartItem[] = [
  { id: 'chips', name: 'Chips', price: 3, qty: 2 },
  { id: 'soda', name: 'Soda', price: 2, qty: 1 },
];

export const initialCartState: CartState = {
  items: [],
  status: 'idle',
  error: null,
};

export function addToCart(items: CartItem[], product: CatalogItem): CartItem[] {
  const existing = items.find((item) => item.id === product.id);
  if (existing) {
    return items.map((item) =>
      item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
    );
  }
  return [...items, { ...product, qty: 1 }];
}

export function decrementCart(items: CartItem[], id: string): CartItem[] {
  return items
    .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
    .filter((item) => item.qty > 0);
}

export function removeFromCart(items: CartItem[], id: string): CartItem[] {
  return items.filter((item) => item.id !== id);
}

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((n, item) => n + item.qty, 0);
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}
