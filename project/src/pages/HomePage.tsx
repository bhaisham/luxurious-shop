import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, MapPin, Clock, Eye } from 'lucide-react';
import { SEO, useScrollTop } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickView } from '@/components/product/QuickView';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSettings } from '@/context/SettingsContext';
import { useProducts, useCategories, useFeaturedProducts, useNewArrivals } from '@/lib/hooks';
import { BUSINESS, FALLBACK_IMAGE } from '@/lib/constants';
import type { Product } from '@/lib/types';

const HERO_IMAGE = 'https://images.pexels.com/photos/8201177/pexels-photo-8201177.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const PROMO_IMAGE = 'https://images.pexels.com/photos/5872362/pexels-photo-5872362.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const CATEGORY_IMAGES: Record<string, string> = {
  'fashion-accessories': 'https://images.pexels.com/photos/37392115/pexels-photo-37392115.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'bags-wallets': 'https://images.pexels.com/photos/5531013/pexels-photo-5531013.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'jewellery-watches': 'https://images.pexels.com/photos/34968267/pexels-photo-34968267.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'beauty-personal-care': 'https://images.pexels.com/photos/12969358/pexels-photo-12969358.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'gifts-lifestyle': 'https://images.pexels.com/photos/11949990/pexels-photo-11949990.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

export function HomePage() {
  useScrollTop();
  const { settings } = useSettings();
  const { products: allProducts } = useProducts();
  const { categories, loading: catLoading } = useCategories();
  const { products: featured, loading: featLoading } = useFeaturedProducts();
  const { products: newArrivals, loading: newLoading } = useNewArrivals();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const heroImage = settings.hero_image_url || HERO_IMAGE;
  const promoImage = settings.promo_image_url || PROMO_IMAGE;

  const categoriesWithProducts = categories.filter(cat =>
    allProducts.some(p => p.category_id === cat.id),
  );

  return (
    <>
      <SEO
        title="Home"
        description="Discover your style at Luxurious Shop in Port Louis, Mauritius. Explore carefully selected products and contact us for enquiries."
        path="/"
      />

      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
        <img src={heroImage} alt="Luxurious Shop collection" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/30 to-charcoal/60" />
        <div className="relative flex h-full items-center justify-center px-4">
          <div className="max-w-2xl text-center text-white animate-fade-up">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.4em] text-gold">
              Port Louis · Mauritius
            </p>
            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              {settings.hero_heading}
            </h1>
            {settings.hero_subtext && (
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                {settings.hero_subtext}
              </p>
            )}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button to="/shop" size="lg" variant="secondary">
                Explore the Collection <ArrowRight className="h-4 w-4" />
              </Button>
              <Button to="/contact" size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-charcoal">
                Contact the Shop
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Introduction */}
      <section className="bg-ivory py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.4em] text-gold">
            Welcome
          </p>
          <h2 className="font-serif text-3xl text-charcoal sm:text-4xl">
            {settings.about_heading || 'Style Meets Discovery.'}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-gray-600">
            {settings.about_text}
          </p>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.4em] text-gold">
              Browse by Category
            </p>
            <h2 className="font-serif text-3xl text-charcoal sm:text-4xl">Featured Categories</h2>
          </div>

          {catLoading ? (
            <Loader label="Loading categories..." />
          ) : categoriesWithProducts.length === 0 ? (
            <EmptyState title="No categories available yet" description="Please check back soon." />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
              {categoriesWithProducts.slice(0, 6).map(cat => (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.slug}`}
                  className="group relative aspect-[4/5] overflow-hidden bg-ivory"
                >
                  <img
                    src={cat.image_url || CATEGORY_IMAGES[cat.slug] || FALLBACK_IMAGE}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-serif text-lg text-white sm:text-xl">{cat.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-white/70 transition-colors group-hover:text-gold">
                      Shop Now <ArrowRight className="h-3 w-3" />
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-ivory py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.4em] text-gold">
                Handpicked
              </p>
              <h2 className="font-serif text-3xl text-charcoal sm:text-4xl">Featured Products</h2>
            </div>
            <Link to="/featured" className="hidden items-center gap-1 text-sm font-medium text-charcoal hover:text-gold sm:flex">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {featLoading ? (
            <Loader label="Loading products..." />
          ) : featured.length === 0 ? (
            <EmptyState title="No featured products yet" description="Featured products will appear here once they are added." />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
              {featured.slice(0, 8).map(product => (
                <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.4em] text-gold">
                Just Arrived
              </p>
              <h2 className="font-serif text-3xl text-charcoal sm:text-4xl">New Arrivals</h2>
            </div>
            <Link to="/new-arrivals" className="hidden items-center gap-1 text-sm font-medium text-charcoal hover:text-gold sm:flex">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {newLoading ? (
            <Loader label="Loading new arrivals..." />
          ) : newArrivals.length === 0 ? (
            <EmptyState title="No new arrivals yet" description="New products will appear here once they are added." />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
              {newArrivals.slice(0, 8).map(product => (
                <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          )}
          <div className="mt-10 text-center sm:hidden">
            <Button to="/new-arrivals" variant="outline">View All New Arrivals</Button>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="relative h-[400px] overflow-hidden">
        <img src={promoImage} alt="Promotion" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-charcoal/50" />
        <div className="relative flex h-full items-center justify-center px-4">
          <div className="max-w-xl text-center text-white">
            <h2 className="font-serif text-3xl sm:text-4xl">
              {settings.promo_heading || 'Something Special Awaits.'}
            </h2>
            {settings.promo_subtext && (
              <p className="mt-4 text-white/80">{settings.promo_subtext}</p>
            )}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button to="/shop" variant="secondary">Browse Collection</Button>
              <Button to="/store-location" variant="outline" className="border-white text-white hover:bg-white hover:text-charcoal">
                Visit Our Store
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Store Location Section */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.4em] text-gold">
                Find Us
              </p>
              <h2 className="font-serif text-3xl text-charcoal sm:text-4xl">Visit Us in Port Louis</h2>
              <p className="mt-4 text-gray-600">
                Located in the heart of Mauritius' capital, we welcome you to explore our collection
                in person. Our team is ready to assist with any enquiries.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <div>
                    <p className="text-sm font-medium text-charcoal">Address</p>
                    <p className="text-sm text-gray-600">{settings.address || BUSINESS.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <div>
                    <p className="text-sm font-medium text-charcoal">Telephone</p>
                    <a href={`tel:${settings.phone || BUSINESS.phoneRaw}`} className="text-sm text-gray-600 hover:text-gold">
                      {settings.phone || BUSINESS.phone}
                    </a>
                    <p className="text-xs italic text-gray-400">Pending verification</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <div>
                    <p className="text-sm font-medium text-charcoal">Opening Hours</p>
                    <p className="text-sm text-gray-600">Mon–Fri: 10:30 AM–5:00 PM</p>
                    <p className="text-sm text-gray-600">Sat: 10:00 AM–5:00 PM</p>
                    <p className="text-xs italic text-gray-400">Hours pending verification</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button to="/store-location" variant="primary">
                  <MapPin className="h-4 w-4" /> Get Directions
                </Button>
                <a href={`tel:${settings.phone || BUSINESS.phoneRaw}`}>
                  <Button variant="outline">
                    <Phone className="h-4 w-4" /> Call the Shop
                  </Button>
                </a>
              </div>
            </div>

            <a
              href={settings.maps_url || BUSINESS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden shadow-lg"
            >
              <img
                src="https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Map of 8 Jummah Mosque Street, Port Louis, Mauritius"
                className="h-[450px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-charcoal/50">
                <MapPin className="h-10 w-10 text-gold" />
                <p className="mt-3 font-serif text-lg text-white">View on Google Maps</p>
                <p className="mt-1 text-xs text-white/70">8 Jummah Mosque Street, Port Louis</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}
