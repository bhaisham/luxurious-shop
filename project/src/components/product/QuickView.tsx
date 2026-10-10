import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, ShoppingCart, Minus, Plus } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatMUR, isOnSale, getEffectivePrice } from '@/lib/format';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { FALLBACK_IMAGE } from '@/lib/constants';

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickView({ product, onClose }: QuickViewProps) {
  const { hasItem, toggleItem } = useWishlist();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) return null;

  const wished = hasItem(product.id);
  const onSale = isOnSale(product.price, product.sale_price);
  const outOfStock = product.availability === 'out_of_stock' || product.stock_quantity <= 0;
  const price = getEffectivePrice(product);
  const images = product.images.length > 0 ? product.images : [FALLBACK_IMAGE];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 grid max-h-[90vh] w-full max-w-4xl grid-cols-1 overflow-y-auto bg-white md:grid-cols-2">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-sm transition-colors hover:bg-white"
          aria-label="Close quick view"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="aspect-square bg-ivory md:aspect-auto">
          <img src={images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col p-6 md:p-8">
          {product.category && (
            <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
              {product.category.name}
            </p>
          )}
          <h2 className="mt-1 font-serif text-2xl text-charcoal">{product.name}</h2>
          {product.sku && <p className="mt-1 text-xs text-gray-400">SKU: {product.sku}</p>}

          <div className="mt-3 flex items-center gap-2">
            <span className="text-xl font-medium text-charcoal">{formatMUR(price)}</span>
            {onSale && (
              <span className="text-sm text-gray-400 line-through">{formatMUR(product.price)}</span>
            )}
          </div>

          <div className="mt-2 flex gap-1.5">
            {product.is_new_arrival && <Badge variant="new">New</Badge>}
            {onSale && <Badge variant="sale">Sale</Badge>}
            {outOfStock ? (
              <Badge variant="out">Out of Stock</Badge>
            ) : (
              <Badge variant="default">In Stock</Badge>
            )}
            {product.is_sample && <Badge variant="gold">Demo Data</Badge>}
          </div>

          <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-gray-600">
            {product.description}
          </p>

          {!outOfStock && (
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center border border-gray-300">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-ivory"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="px-4 py-2 text-sm font-medium">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(product.stock_quantity, q + 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-ivory"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <Button onClick={() => { addItem(product, qty); onClose(); }} className="flex-1">
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </Button>
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => toggleItem(product.id)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-charcoal"
            >
              <Heart className={cn('h-4 w-4', wished && 'fill-red-500 text-red-500')} />
              {wished ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              className="text-sm font-medium text-gold hover:underline"
            >
              View Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
