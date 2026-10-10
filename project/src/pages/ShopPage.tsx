import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Search as SearchIcon } from 'lucide-react';
import { SEO, useScrollTop } from '@/components/ui/SEO';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickView } from '@/components/product/QuickView';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input, Select } from '@/components/ui/Input';
import { useProducts, useCategories } from '@/lib/hooks';
import { formatMUR } from '@/lib/format';
import type { Product } from '@/lib/types';

export function ShopPage() {
  useScrollTop();
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const searchQuery = searchParams.get('q') ?? '';
  const categoryFilter = searchParams.get('category') ?? '';
  const sort = searchParams.get('sort') ?? 'newest';
  const minPrice = searchParams.get('minPrice') ?? '';
  const maxPrice = searchParams.get('maxPrice') ?? '';

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const filtered = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          (p.search_keywords ?? '').toLowerCase().includes(q) ||
          (p.description ?? '').toLowerCase().includes(q),
      );
    }

    if (categoryFilter) {
      const cat = categories.find(c => c.slug === categoryFilter);
      if (cat) result = result.filter(p => p.category_id === cat.id);
    }

    if (minPrice) result = result.filter(p => p.price >= Number(minPrice));
    if (maxPrice) result = result.filter(p => p.price <= Number(maxPrice));

    if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sort === 'newest') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return result;
  }, [products, searchQuery, categoryFilter, sort, minPrice, maxPrice, categories]);

  const hasFilters = !!(searchQuery || categoryFilter || minPrice || maxPrice);

  const clearFilters = () => setSearchParams(new URLSearchParams());

  return (
    <>
      <SEO
        title="Shop All"
        description="Browse the full collection at Luxurious Shop. Filter by category and price to find exactly what you're looking for."
        path="/shop"
      />

      <div className="border-b border-gray-100 bg-ivory py-12 text-center">
        <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">Shop All</h1>
        <p className="mt-3 text-sm text-gray-500">
          Explore our complete collection of products.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className={`lg:w-64 lg:shrink-0 ${showFilters ? 'fixed inset-0 z-[80] lg:relative lg:z-auto' : 'hidden lg:block'}`}>
            {showFilters && (
              <div className="absolute inset-0 bg-charcoal/30 lg:hidden" onClick={() => setShowFilters(false)} />
            )}
            <div className={`relative z-10 h-full overflow-y-auto bg-white p-6 lg:bg-transparent lg:p-0 ${showFilters ? 'w-80 max-w-[85vw]' : ''}`}>
              <div className="mb-6 flex items-center justify-between lg:hidden">
                <h2 className="font-serif text-lg text-charcoal">Filters</h2>
                <button onClick={() => setShowFilters(false)}><X className="h-5 w-5" /></button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-charcoal">Search</h3>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => updateParam('q', e.target.value)}
                      placeholder="Search..."
                      className="w-full border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-charcoal">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => updateParam('category', '')}
                      className={`block text-sm ${!categoryFilter ? 'font-medium text-gold' : 'text-gray-600 hover:text-charcoal'}`}
                    >
                      All Categories
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => updateParam('category', cat.slug)}
                        className={`block text-sm ${categoryFilter === cat.slug ? 'font-medium text-gold' : 'text-gray-600 hover:text-charcoal'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-charcoal">Price Range (Rs)</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={e => updateParam('minPrice', e.target.value)}
                      placeholder="Min"
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-gold focus:outline-none"
                    />
                    <span className="text-gray-400">—</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={e => updateParam('maxPrice', e.target.value)}
                      placeholder="Max"
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gold hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center gap-1.5 text-sm text-charcoal lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </button>
                <p className="text-sm text-gray-500">
                  {loading ? 'Loading...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
                </p>
              </div>
              <Select
                value={sort}
                onChange={e => updateParam('sort', e.target.value)}
                className="w-auto"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </Select>
            </div>

            {loading ? (
              <Loader label="Loading products..." />
            ) : filtered.length === 0 ? (
              <EmptyState
                title="No products found"
                description="Try adjusting your filters or search terms."
                action={hasFilters ? <button onClick={clearFilters} className="text-sm font-medium text-gold hover:underline">Clear filters</button> : undefined}
              />
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-8">
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}
