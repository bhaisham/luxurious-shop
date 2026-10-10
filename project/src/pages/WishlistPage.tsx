import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { SEO, useScrollTop } from '@/components/ui/SEO';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickView } from '@/components/product/QuickView';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useWishlist } from '@/context/WishlistContext';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';

export function WishlistPage() {
  useScrollTop();
  const { items } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_active', true)
      .in('id', items)
      .then(({ data }) => {
        setProducts((data as Product[]) ?? []);
        setLoading(false);
      });
  }, [items]);

  return (
    <>
      <SEO title="Wishlist" description="Your saved favourite products at Luxurious Shop." path="/wishlist" />

      <div className="border-b border-gray-100 bg-ivory py-12 text-center">
        <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">My Wishlist</h1>
        <p className="mt-3 text-sm text-gray-500">
          {items.length > 0 ? `${items.length} item${items.length !== 1 ? 's' : ''} saved` : 'Products you love, saved for later.'}
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {loading ? (
          <Loader label="Loading wishlist..." />
        ) : products.length === 0 ? (
          <EmptyState
            icon={<Heart className="h-12 w-12" />}
            title="Your wishlist is empty"
            description="Save products you love by clicking the heart icon on any product."
            action={<Button to="/shop">Browse Products</Button>}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        )}
      </div>

      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}
