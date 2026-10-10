import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { CartItem, Product } from '@/lib/types';
import { getEffectivePrice } from '@/lib/format';

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, quantity: number, variant?: string) => void;
  removeItem: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = 'luxurious_shop_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, quantity: number, variant?: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.product_id === product.id && i.variant === variant);
      if (existing) {
        const maxQty = Math.max(1, product.stock_quantity);
        const newQty = Math.min(existing.quantity + quantity, maxQty);
        return prev.map(i =>
          i.product_id === product.id && i.variant === variant
            ? { ...i, quantity: newQty }
            : i,
        );
      }
      const newItem: CartItem = {
        product_id: product.id,
        name: product.name,
        slug: product.slug,
        price: getEffectivePrice(product),
        sale_price: product.sale_price,
        image: product.images[0] ?? '',
        quantity: Math.min(quantity, Math.max(1, product.stock_quantity)),
        variant,
        stock_quantity: product.stock_quantity,
      };
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, variant?: string) => {
    setItems(prev => prev.filter(i => !(i.product_id === productId && i.variant === variant)));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, variant?: string) => {
    if (quantity < 1) return;
    setItems(prev =>
      prev.map(i =>
        i.product_id === productId && i.variant === variant
          ? { ...i, quantity: Math.min(quantity, Math.max(1, i.stock_quantity)) }
          : i,
      ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
