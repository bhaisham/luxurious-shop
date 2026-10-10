import { Link } from 'react-router-dom';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatMUR } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { FALLBACK_IMAGE } from '@/lib/constants';

export function CartDrawer() {
  const { items, isCartOpen, closeCart, updateQuantity, removeItem, subtotal, itemCount } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={closeCart} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-charcoal" />
            <span className="font-serif text-lg text-charcoal">
              Cart {itemCount > 0 && `(${itemCount})`}
            </span>
          </div>
          <button onClick={closeCart} aria-label="Close cart" className="text-charcoal hover:text-gold">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col">
            <EmptyState
              icon={<ShoppingBag className="h-12 w-12" />}
              title="Your cart is empty"
              description="Browse our collection and add items to your cart."
              action={<Button to="/shop" onClick={closeCart}>Explore Products</Button>}
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.map(item => (
                <div
                  key={`${item.product_id}-${item.variant ?? ''}`}
                  className="flex gap-4 border-b border-gray-100 py-4"
                >
                  <Link to={`/product/${item.slug}`} onClick={closeCart} className="shrink-0">
                    <img
                      src={item.image || FALLBACK_IMAGE}
                      alt={item.name}
                      className="h-24 w-20 object-cover bg-ivory"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <Link
                      to={`/product/${item.slug}`}
                      onClick={closeCart}
                      className="font-serif text-sm text-charcoal hover:text-gold"
                    >
                      {item.name}
                    </Link>
                    {item.variant && <p className="text-xs text-gray-500">{item.variant}</p>}
                    <span className="mt-1 text-sm font-medium text-charcoal">
                      {formatMUR(item.price)}
                    </span>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-gray-300">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.variant)}
                          className="px-2 py-1 text-gray-600 hover:bg-ivory"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 py-1 text-xs font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant)}
                          className="px-2 py-1 text-gray-600 hover:bg-ivory"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product_id, item.variant)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 px-5 py-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Subtotal</span>
                <span className="font-serif text-lg text-charcoal">{formatMUR(subtotal)}</span>
              </div>
              <p className="mb-3 text-xs text-gray-400">
                Delivery fees and taxes, if any, will be confirmed at checkout.
              </p>
              <div className="flex flex-col gap-2">
                <Button to="/cart" onClick={closeCart} className="w-full">
                  View Cart
                </Button>
                <Button to="/checkout" variant="outline" onClick={closeCart} className="w-full">
                  Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
