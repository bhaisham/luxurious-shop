import { useState } from 'react';
import { SEO, useScrollTop } from '@/components/ui/SEO';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickView } from '@/components/product/QuickView';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { useNewArrivals } from '@/lib/hooks';
import type { Product } from '@/lib/types';

export function NewArrivalsPage() {
  useScrollTop();
  const { products, loading } = useNewArrivals();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <>
      <SEO title="New Arrivals" description="Discover the latest products added to our collection at Luxurious Shop." path="/new-arrivals" />

      <div className="border-b border-gray-100 bg-ivory py-12 text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.4em] text-gold">Just Arrived</p>
        <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">New Arrivals</h1>
        <p className="mt-3 text-sm text-gray-500">Be the first to explore our latest finds.</p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {loading ? (
          <Loader label="Loading new arrivals..." />
        ) : products.length === 0 ? (
          <EmptyState title="No new arrivals yet" description="New products will appear here once they are added to the catalogue." />
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
