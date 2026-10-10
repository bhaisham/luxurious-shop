import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Header({ onSearchOpen }: { onSearchOpen: () => void }) {
  const { itemCount, openCart } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b transition-all duration-300',
          scrolled
            ? 'border-gray-200 bg-white/95 backdrop-blur-md shadow-sm'
            : 'border-transparent bg-white',
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-charcoal" />
            </button>
            <Link to="/" className="flex flex-col leading-none">
              <span className="font-serif text-xl font-bold tracking-[0.15em] text-charcoal sm:text-2xl">
                LUXURIOUS
              </span>
              <span className="text-[9px] font-medium tracking-[0.4em] text-gold sm:text-[10px]">
                SHOP
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-sm font-medium tracking-wide transition-colors hover:text-gold',
                  location.pathname === link.path ? 'text-gold' : 'text-charcoal',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 sm:gap-5">
            <button
              onClick={onSearchOpen}
              aria-label="Search"
              className="text-charcoal transition-colors hover:text-gold"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative text-charcoal transition-colors hover:text-gold"
            >
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center bg-gold px-1 text-[10px] font-bold text-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link
              to="/admin"
              aria-label="Admin"
              className="hidden text-charcoal transition-colors hover:text-gold sm:block"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              onClick={openCart}
              aria-label="Cart"
              className="relative text-charcoal transition-colors hover:text-gold"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center bg-gold px-1 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <span className="font-serif text-lg font-bold tracking-wider text-charcoal">Menu</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5 text-charcoal" />
              </button>
            </div>
            <nav className="flex flex-col py-2">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'border-b border-gray-50 px-5 py-3.5 text-sm font-medium transition-colors',
                    location.pathname === link.path ? 'text-gold' : 'text-charcoal hover:text-gold',
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/wishlist" className="border-b border-gray-50 px-5 py-3.5 text-sm font-medium text-charcoal hover:text-gold">
                Wishlist
              </Link>
              <Link to="/cart" className="border-b border-gray-50 px-5 py-3.5 text-sm font-medium text-charcoal hover:text-gold">
                Shopping Cart
              </Link>
              <Link to="/admin" className="px-5 py-3.5 text-sm font-medium text-charcoal hover:text-gold">
                Admin Dashboard
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
