import { useState } from 'react';
import { SEO, useScrollTop } from '@/components/ui/SEO';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickView } from '@/components/product/QuickView';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { useFeaturedProducts } from '@/lib/hooks';
import type { Product } from '@/lib/types';

export function FeaturedPage() {
  useScrollTop();
  const { products, loading } = useFeaturedProducts();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <>
      <SEO title="Featured Products" description="Explore our handpicked featured products at Luxurious Shop, Port Louis." path="/featured" />

      <div className="border-b border-gray-100 bg-ivory py-12 text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.4em] text-gold">Handpicked</p>
        <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">Featured Products</h1>
        <p className="mt-3 text-sm text-gray-500">Our carefully selected favourites.</p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {loading ? (
          <Loader label="Loading featured products..." />
        ) : products.length === 0 ? (
          <EmptyState title="No featured products yet" description="Featured products will appear here once they are selected." />
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
