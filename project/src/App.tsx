import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AuthProvider } from '@/context/AuthContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { SearchOverlay } from '@/components/layout/SearchOverlay';

import { HomePage } from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { NewArrivalsPage } from '@/pages/NewArrivalsPage';
import { FeaturedPage } from '@/pages/FeaturedPage';
import { WishlistPage } from '@/pages/WishlistPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { StoreLocationPage } from '@/pages/StoreLocationPage';
import { FAQPage } from '@/pages/FAQPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { TermsPage } from '@/pages/TermsPage';
import { ShippingReturnsPage } from '@/pages/ShippingReturnsPage';

import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminEnquiriesPage } from '@/pages/admin/AdminEnquiriesPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';

function StoreLayout({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AnnouncementBar />
      <Header onSearchOpen={() => setSearchOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <SettingsProvider>
          <WishlistProvider>
            <CartProvider>
              <BrowserRouter>
                <Routes>
                  {/* Admin routes (no store layout) */}
                  <Route path="/admin" element={<AdminLoginPage />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route path="products" element={<AdminProductsPage />} />
                    <Route path="orders" element={<AdminOrdersPage />} />
                    <Route path="enquiries" element={<AdminEnquiriesPage />} />
                    <Route path="settings" element={<AdminSettingsPage />} />
                  </Route>

                  {/* Storefront routes */}
                  <Route path="/" element={<StoreLayout><HomePage /></StoreLayout>} />
                  <Route path="/shop" element={<StoreLayout><ShopPage /></StoreLayout>} />
                  <Route path="/categories" element={<StoreLayout><CategoriesPage /></StoreLayout>} />
                  <Route path="/categories/:slug" element={<StoreLayout><CategoriesPage /></StoreLayout>} />
                  <Route path="/product/:slug" element={<StoreLayout><ProductDetailPage /></StoreLayout>} />
                  <Route path="/new-arrivals" element={<StoreLayout><NewArrivalsPage /></StoreLayout>} />
                  <Route path="/featured" element={<StoreLayout><FeaturedPage /></StoreLayout>} />
                  <Route path="/wishlist" element={<StoreLayout><WishlistPage /></StoreLayout>} />
                  <Route path="/cart" element={<StoreLayout><CartPage /></StoreLayout>} />
                  <Route path="/checkout" element={<StoreLayout><CheckoutPage /></StoreLayout>} />
                  <Route path="/about" element={<StoreLayout><AboutPage /></StoreLayout>} />
                  <Route path="/contact" element={<StoreLayout><ContactPage /></StoreLayout>} />
                  <Route path="/store-location" element={<StoreLayout><StoreLocationPage /></StoreLayout>} />
                  <Route path="/faq" element={<StoreLayout><FAQPage /></StoreLayout>} />
                  <Route path="/privacy" element={<StoreLayout><PrivacyPage /></StoreLayout>} />
                  <Route path="/terms" element={<StoreLayout><TermsPage /></StoreLayout>} />
                  <Route path="/shipping-returns" element={<StoreLayout><ShippingReturnsPage /></StoreLayout>} />
                </Routes>
              </BrowserRouter>
            </CartProvider>
          </WishlistProvider>
        </SettingsProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
