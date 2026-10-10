import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { SEO, useScrollTop } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { formatMUR } from '@/lib/format';
import { BUSINESS, WHATSAPP_DEFAULT_MESSAGE, FALLBACK_IMAGE } from '@/lib/constants';
import { MessageCircle } from 'lucide-react';

export function CartPage() {
  useScrollTop();
  const { items, updateQuantity, removeItem, clearCart, subtotal, itemCount } = useCart();
  const { settings } = useSettings();

  const cartWhatsAppMsg = encodeURIComponent(
    `${WHATSAPP_DEFAULT_MESSAGE}\n\nItems I'm interested in:\n${items.map(i => `• ${i.name} x${i.quantity} — ${formatMUR(i.price * i.quantity)}`).join('\n')}`,
  );

  return (
    <>
      <SEO title="Shopping Cart" description="Review items in your shopping cart at Luxurious Shop." path="/cart" />

      <div className="border-b border-gray-100 bg-ivory py-12 text-center">
        <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">Shopping Cart</h1>
        <p className="mt-3 text-sm text-gray-500">
          {itemCount > 0 ? `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart` : 'Your cart is ready for your selections.'}
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {items.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="h-12 w-12" />}
            title="Your cart is empty"
            description="Browse our collection and add items to your cart."
            action={<Button to="/shop">Explore Products</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map(item => (
                  <div
                    key={`${item.product_id}-${item.variant ?? ''}`}
                    className="flex gap-4 border border-gray-100 p-4"
                  >
                    <Link to={`/product/${item.slug}`} className="shrink-0">
                      <img
                        src={item.image || FALLBACK_IMAGE}
                        alt={item.name}
                        className="h-28 w-24 object-cover bg-ivory"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <Link to={`/product/${item.slug}`} className="font-serif text-base text-charcoal hover:text-gold">
                        {item.name}
                      </Link>
                      {item.variant && <p className="text-xs text-gray-500">{item.variant}</p>}
                      <span className="mt-1 text-sm font-medium text-charcoal">{formatMUR(item.price)}</span>

                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center border border-gray-300">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.variant)}
                            className="px-3 py-1.5 text-gray-600 hover:bg-ivory"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-4 py-1.5 text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant)}
                            className="px-3 py-1.5 text-gray-600 hover:bg-ivory"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-charcoal">
                            {formatMUR(item.price * item.quantity)}
                          </span>
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
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between">
                <Button to="/shop" variant="outline" size="sm">Continue Shopping</Button>
                <button
                  onClick={clearCart}
                  className="text-sm text-gray-500 hover:text-red-500"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 p-6">
                <h2 className="font-serif text-xl text-charcoal">Order Summary</h2>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                    <span className="font-medium text-charcoal">{formatMUR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span className="text-gray-500">To be confirmed</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-medium text-charcoal">Total</span>
                    <span className="font-serif text-xl text-charcoal">{formatMUR(subtotal)}</span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-400">
                  Delivery fees and taxes, if any, will be confirmed at checkout. We do not collect card details in this application.
                </p>

                <div className="mt-6 space-y-2">
                  <Button to="/checkout" className="w-full">
                    Proceed to Checkout <ArrowRight className="h-4 w-4" />
                  </Button>
                  {settings.whatsapp_enabled && (
                    <a
                      href={`https://wa.me/${settings.whatsapp_number}?text=${cartWhatsAppMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" className="w-full">
                        <MessageCircle className="h-4 w-4" /> Enquire via WhatsApp
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
