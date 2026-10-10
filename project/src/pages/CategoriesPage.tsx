import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SEO, useScrollTop } from '@/components/ui/SEO';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickView } from '@/components/product/QuickView';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCategories, useProducts } from '@/lib/hooks';
import { FALLBACK_IMAGE } from '@/lib/constants';
import type { Product } from '@/lib/types';

export function CategoriesPage() {
  useScrollTop();
  const { slug } = useParams();
  const { categories, loading: catLoading } = useCategories();
  const { products, loading: prodLoading } = useProducts();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (catLoading || prodLoading) {
    return (
      <>
        <SEO title="Categories" path="/categories" />
        <Loader label="Loading categories..." />
      </>
    );
  }

  if (slug) {
    const category = categories.find(c => c.slug === slug);
    if (!category) {
      return (
        <>
          <SEO title="Category Not Found" path="/categories" />
          <EmptyState
            title="Category not found"
            description="This category may have been removed."
            action={<Link to="/categories" className="text-sm font-medium text-gold hover:underline">View all categories</Link>}
          />
        </>
      );
    }

    const categoryProducts = products.filter(p => p.category_id === category.id);

    return (
      <>
        <SEO title={category.name} description={category.description ?? undefined} path={`/categories/${slug}`} />
        <div className="border-b border-gray-100 bg-ivory py-12 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.4em] text-gold">Category</p>
          <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">{category.name}</h1>
          {category.description && <p className="mt-3 max-w-xl mx-auto text-sm text-gray-500">{category.description}</p>}
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          {categoryProducts.length === 0 ? (
            <EmptyState title="No products in this category yet" description="Please check back soon or browse other categories." action={<Link to="/shop" className="text-sm font-medium text-gold hover:underline">Browse all products</Link>} />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
              {categoryProducts.map(product => (
                <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          )}
        </div>
        <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      </>
    );
  }

  const categoriesWithProducts = categories.filter(cat =>
    products.some(p => p.category_id === cat.id),
  );

  return (
    <>
      <SEO title="Categories" description="Browse all product categories at Luxurious Shop." path="/categories" />
      <div className="border-b border-gray-100 bg-ivory py-12 text-center">
        <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">Categories</h1>
        <p className="mt-3 text-sm text-gray-500">Find exactly what you're looking for.</p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {categoriesWithProducts.length === 0 ? (
          <EmptyState title="No categories available yet" description="Please check back soon." />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoriesWithProducts.map(cat => {
              const count = products.filter(p => p.category_id === cat.id).length;
              return (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.slug}`}
                  className="group relative aspect-[4/3] overflow-hidden bg-ivory"
                >
                  <img
                    src={cat.image_url || FALLBACK_IMAGE}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-serif text-xl text-white">{cat.name}</h3>
                    <p className="mt-1 text-xs text-white/70">{count} product{count !== 1 ? 's' : ''}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
