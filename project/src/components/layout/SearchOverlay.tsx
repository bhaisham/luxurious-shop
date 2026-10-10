import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import { formatMUR, getEffectivePrice } from '@/lib/format';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { FALLBACK_IMAGE } from '@/lib/constants';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
      setSearched(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_active', true)
        .or(`name.ilike.%${query}%,search_keywords.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(8);

      setResults((data as Product[]) ?? []);
      setSearched(true);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-x-0 top-0 bg-white shadow-2xl">
        <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && query.trim()) {
                  navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
                  onClose();
                }
              }}
              placeholder="Search products..."
              className="flex-1 bg-transparent text-lg text-charcoal placeholder:text-gray-400 focus:outline-none"
            />
            <button onClick={onClose} aria-label="Close search" className="text-charcoal hover:text-gold">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <Loader label="Searching..." />
            ) : searched && results.length === 0 ? (
              <EmptyState
                title="No products found"
                description={`No results for "${query}". Try a different search term.`}
              />
            ) : results.length > 0 ? (
              <div className="space-y-2">
                {results.map(product => (
                  <Link
                    key={product.id}
                    to={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-2 transition-colors hover:bg-ivory"
                  >
                    <img
                      src={product.images[0] ?? FALLBACK_IMAGE}
                      alt={product.name}
                      className="h-16 w-14 object-cover bg-ivory"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-charcoal">{product.name}</p>
                      {product.category && (
                        <p className="text-xs text-gray-400">{product.category.name}</p>
                      )}
                    </div>
                    <span className="text-sm font-medium text-charcoal">
                      {formatMUR(getEffectivePrice(product))}
                    </span>
                  </Link>
                ))}
                <Link
                  to={`/shop?q=${encodeURIComponent(query.trim())}`}
                  onClick={onClose}
                  className="block py-3 text-center text-sm font-medium text-gold hover:underline"
                >
                  View all results
                </Link>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-400">
                  Search by product name, category, or keyword.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
