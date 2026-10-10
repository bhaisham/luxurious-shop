import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Minus, Plus, Heart, ShoppingCart, ChevronRight, MessageCircle, Phone } from 'lucide-react';
import { SEO, useScrollTop } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProductCard } from '@/components/product/ProductCard';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useSettings } from '@/context/SettingsContext';
import { formatMUR, isOnSale, getEffectivePrice } from '@/lib/format';
import { BUSINESS, WHATSAPP_DEFAULT_MESSAGE, FALLBACK_IMAGE } from '@/lib/constants';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

const RECENTLY_VIEWED_KEY = 'luxurious_shop_recently_viewed';

export function ProductDetailPage() {
  useScrollTop();
  const { slug } = useParams();
  const { addItem } = useCart();
  const { hasItem, toggleItem } = useWishlist();
  const { settings } = useSettings();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()
      .then(({ data }) => {
        const p = data as Product | null;
        setProduct(p);
        setLoading(false);

        if (p) {
          // Track recently viewed
          try {
            const stored = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) ?? '[]');
            const updated = [p.id, ...stored.filter((id: string) => id !== p.id)].slice(0, 10);
            localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
          } catch { /* noop */ }

          // Load related products
          if (p.category_id) {
            supabase
              .from('products')
              .select('*, category:categories(*)')
              .eq('is_active', true)
              .eq('category_id', p.category_id)
              .neq('id', p.id)
              .limit(4)
              .then(({ data: relData }) => setRelated((relData as Product[]) ?? []));
          }
        }
      });
  }, [slug]);

  if (loading) {
    return (
      <>
        <SEO title="Product" />
        <Loader label="Loading product..." />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <SEO title="Product Not Found" />
        <EmptyState
          title="Product not found"
          description="This product may have been removed or is no longer available."
          action={<Button to="/shop">Browse Products</Button>}
        />
      </>
    );
  }

  const wished = hasItem(product.id);
  const onSale = isOnSale(product.price, product.sale_price);
  const outOfStock = product.availability === 'out_of_stock' || product.stock_quantity <= 0;
  const price = getEffectivePrice(product);
  const images = product.images.length > 0 ? product.images : [FALLBACK_IMAGE];
  const hasVariants = product.variants && product.variants.length > 0;

  const whatsappMsg = encodeURIComponent(
    `Hello Luxurious Shop, I'd like to enquire about: ${product.name} (SKU: ${product.sku ?? 'N/A'})`,
  );

  return (
    <>
      <SEO
        title={product.name}
        description={product.description ?? undefined}
        path={`/product/${product.slug}`}
        image={images[0]}
      />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
        <nav className="flex items-center gap-1 text-xs text-gray-400">
          <Link to="/" className="hover:text-gold">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" className="hover:text-gold">Shop</Link>
          {product.category && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link to={`/categories/${product.category.slug}`} className="hover:text-gold">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="text-charcoal">{product.name}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square overflow-hidden bg-ivory">
              <img src={images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      'h-20 w-16 shrink-0 overflow-hidden border-2 transition-colors',
                      activeImage === i ? 'border-gold' : 'border-transparent',
                    )}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {product.category && (
              <p className="text-xs font-medium uppercase tracking-widest text-gold">
                {product.category.name}
              </p>
            )}
            <h1 className="mt-1 font-serif text-3xl text-charcoal sm:text-4xl">{product.name}</h1>
            {product.sku && <p className="mt-1.5 text-xs text-gray-400">SKU: {product.sku}</p>}

            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-medium text-charcoal">{formatMUR(price)}</span>
              {onSale && (
                <span className="text-base text-gray-400 line-through">{formatMUR(product.price)}</span>
              )}
            </div>

            <div className="mt-3 flex gap-1.5">
              {product.is_new_arrival && <Badge variant="new">New Arrival</Badge>}
              {onSale && <Badge variant="sale">On Sale</Badge>}
              {product.is_sample && <Badge variant="gold">Demo Data</Badge>}
              {outOfStock ? (
                <Badge variant="out">Out of Stock</Badge>
              ) : product.stock_quantity <= 5 ? (
                <Badge variant="default">Only {product.stock_quantity} left</Badge>
              ) : (
                <Badge variant="default">In Stock</Badge>
              )}
            </div>

            {product.description && (
              <p className="mt-6 text-sm leading-relaxed text-gray-600">{product.description}</p>
            )}

            {/* Variants */}
            {hasVariants && (
              <div className="mt-6 space-y-3">
                {product.variants.map((variant, i) => (
                  <div key={i}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-charcoal">
                      {variant.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => setSelectedVariant(opt)}
                          className={cn(
                            'border px-4 py-2 text-sm transition-colors',
                            selectedVariant === opt
                              ? 'border-gold bg-gold text-white'
                              : 'border-gray-300 text-charcoal hover:border-charcoal',
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity & Add to Cart */}
            {!outOfStock && (
              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-4 py-3 text-gray-600 hover:bg-ivory"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-5 py-3 text-sm font-medium">{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(product.stock_quantity, q + 1))}
                    className="px-4 py-3 text-gray-600 hover:bg-ivory"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  onClick={() => addItem(product, qty, selectedVariant)}
                  size="lg"
                  className="flex-1"
                >
                  <ShoppingCart className="h-5 w-5" /> Add to Cart
                </Button>
              </div>
            )}

            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={() => toggleItem(product.id)}
                className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-charcoal"
              >
                <Heart className={cn('h-4 w-4', wished && 'fill-red-500 text-red-500')} />
                {wished ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Contact enquiries */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-charcoal">
                Have a question about this product?
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                {settings.whatsapp_enabled && (
                  <a
                    href={`https://wa.me/${settings.whatsapp_number}?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4" /> WhatsApp Enquiry
                    </Button>
                  </a>
                )}
                <a href={`tel:${settings.phone || BUSINESS.phoneRaw}`}>
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" /> Call the Shop
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8 text-center font-serif text-3xl text-charcoal">You May Also Like</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-8">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
