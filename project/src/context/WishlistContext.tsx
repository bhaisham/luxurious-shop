import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';

interface WishlistContextValue {
  items: string[];
  toggleItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);
const STORAGE_KEY = 'luxurious_shop_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const toggleItem = useCallback((productId: string) => {
    setItems(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId],
    );
  }, []);

  const hasItem = useCallback((productId: string) => items.includes(productId), [items]);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(id => id !== productId));
  }, []);

  const clearWishlist = useCallback(() => setItems([]), []);

  return (
    <WishlistContext.Provider value={{ items, toggleItem, hasItem, removeItem, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
