import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatMUR, isOnSale, getEffectivePrice } from '@/lib/format';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { FALLBACK_IMAGE } from '@/lib/constants';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { hasItem, toggleItem } = useWishlist();
  const { addItem } = useCart();
  const wished = hasItem(product.id);
  const onSale = isOnSale(product.price, product.sale_price);
  const outOfStock = product.availability === 'out_of_stock' || product.stock_quantity <= 0;
  const price = getEffectivePrice(product);

  return (
    <div className="group relative flex flex-col bg-white">
      <div className="relative aspect-[3/4] overflow-hidden bg-ivory">
        <Link to={`/product/${product.slug}`}>
          <img
            src={product.images[0] ?? FALLBACK_IMAGE}
            alt={product.name}
            loading="lazy"
            className={cn(
              'h-full w-full object-cover transition-transform duration-700 group-hover:scale-105',
              outOfStock && 'opacity-60',
            )}
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.is_new_arrival && <Badge variant="new">New</Badge>}
          {onSale && <Badge variant="sale">Sale</Badge>}
          {outOfStock && <Badge variant="out">Sold Out</Badge>}
          {product.is_sample && <Badge variant="gold">Demo</Badge>}
        </div>

        <button
          onClick={() => toggleItem(product.id)}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-sm transition-all hover:bg-white"
        >
          <Heart className={cn('h-4 w-4', wished && 'fill-red-500 text-red-500')} />
        </button>

        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="flex flex-1 items-center justify-center gap-1.5 bg-white/95 py-2.5 text-xs font-medium uppercase tracking-wider text-charcoal transition-colors hover:bg-white"
            >
              <Eye className="h-3.5 w-3.5" /> Quick View
            </button>
          )}
          {!outOfStock && (
            <button
              onClick={() => addItem(product, 1)}
              className="flex flex-1 items-center justify-center gap-1.5 bg-charcoal py-2.5 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-charcoal/90"
            >
              <ShoppingCart className="h-3.5 w-3.5" /> Add
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        {product.category && (
          <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
            {product.category.name}
          </p>
        )}
        <Link to={`/product/${product.slug}`} className="mt-1">
          <h3 className="font-serif text-sm leading-snug text-charcoal transition-colors hover:text-gold">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-medium text-charcoal">{formatMUR(price)}</span>
          {onSale && (
            <span className="text-xs text-gray-400 line-through">{formatMUR(product.price)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
