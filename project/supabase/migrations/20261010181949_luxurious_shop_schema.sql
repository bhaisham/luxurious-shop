/*
# Luxurious Shop — Full E-Commerce Schema

## Overview
Creates the complete database schema for the Luxurious Shop e-commerce platform,
including product catalogue, categories, orders, contact enquiries, and store settings.

## New Tables

1. **categories** — Product category grouping (Fashion, Bags, Jewellery, etc.)
   - id, name, slug, description, image_url, sort_order, is_visible, timestamps

2. **products** — Full product catalogue with pricing, images, variants, stock
   - id, name, slug, sku, category_id (FK), description, price, sale_price,
     images (jsonb array), variants (jsonb), stock_quantity, availability,
     is_featured, is_new_arrival, search_keywords, is_active, is_sample,
     timestamps

3. **orders** — Customer order/enquiry records
   - id, order_number, customer_name, email, phone, delivery_address, town,
     notes, fulfilment_method, status, subtotal, total, order_type, timestamps

4. **order_items** — Individual items within an order
   - id, order_id (FK CASCADE), product_id (FK SET NULL), product_name,
     quantity, unit_price, created_at

5. **contact_enquiries** — Contact form submissions
   - id, name, email, phone, subject, message, status, created_at

6. **store_settings** — Single-row configurable store configuration
   - Announcement bar, hero, promo, about content, business info, WhatsApp,
     opening hours, checkout mode, delivery settings, social links, maps URL

## Security (RLS)

- **categories**: Public read (anon+authenticated), admin write (authenticated only)
- **products**: Public read (anon+authenticated), admin write (authenticated only)
- **orders**: Public insert (anyone can submit), admin read/update/delete (authenticated only)
- **order_items**: Public insert, admin read (authenticated only)
- **contact_enquiries**: Public insert, admin read/update (authenticated only)
- **store_settings**: Public read, admin write (authenticated only)

## Notes
1. Sample products are seeded with is_sample=true to distinguish demo data from real inventory.
2. Store settings seeded with business info from the listing (pending verification).
3. Opening hours stored as JSONB for flexible day-by-day configuration.
4. Order numbers auto-generated as LS-YYYYMMDD-XXXX format.
*/

-- ============ CATEGORIES ============
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_categories" ON categories;
CREATE POLICY "admin_insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_categories" ON categories;
CREATE POLICY "admin_update_categories" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_categories" ON categories;
CREATE POLICY "admin_delete_categories" ON categories FOR DELETE
  TO authenticated USING (true);

-- ============ PRODUCTS ============
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  sku text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  description text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  sale_price numeric(10,2),
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  variants jsonb NOT NULL DEFAULT '[]'::jsonb,
  stock_quantity int NOT NULL DEFAULT 0,
  availability text NOT NULL DEFAULT 'in_stock',
  is_featured boolean NOT NULL DEFAULT false,
  is_new_arrival boolean NOT NULL DEFAULT false,
  search_keywords text,
  is_active boolean NOT NULL DEFAULT true,
  is_sample boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products" ON products FOR DELETE
  TO authenticated USING (true);

-- ============ ORDERS ============
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  delivery_address text,
  town text,
  notes text,
  fulfilment_method text,
  status text NOT NULL DEFAULT 'pending',
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  order_type text NOT NULL DEFAULT 'enquiry',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_orders" ON orders;
CREATE POLICY "public_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_orders" ON orders;
CREATE POLICY "admin_read_orders" ON orders FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_orders" ON orders;
CREATE POLICY "admin_update_orders" ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_orders" ON orders;
CREATE POLICY "admin_delete_orders" ON orders FOR DELETE
  TO authenticated USING (true);

-- ============ ORDER ITEMS ============
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_order_items" ON order_items;
CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_order_items" ON order_items;
CREATE POLICY "admin_read_order_items" ON order_items FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_order_items" ON order_items;
CREATE POLICY "admin_update_order_items" ON order_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_order_items" ON order_items;
CREATE POLICY "admin_delete_order_items" ON order_items FOR DELETE
  TO authenticated USING (true);

-- ============ CONTACT ENQUIRIES ============
CREATE TABLE IF NOT EXISTS contact_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_enquiries" ON contact_enquiries;
CREATE POLICY "public_insert_enquiries" ON contact_enquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_enquiries" ON contact_enquiries;
CREATE POLICY "admin_read_enquiries" ON contact_enquiries FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_enquiries" ON contact_enquiries;
CREATE POLICY "admin_update_enquiries" ON contact_enquiries FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_enquiries" ON contact_enquiries;
CREATE POLICY "admin_delete_enquiries" ON contact_enquiries FOR DELETE
  TO authenticated USING (true);

-- ============ STORE SETTINGS ============
CREATE TABLE IF NOT EXISTS store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_text text,
  announcement_active boolean NOT NULL DEFAULT false,
  hero_heading text NOT NULL DEFAULT 'Discover Your Style.',
  hero_subtext text,
  hero_image_url text,
  promo_heading text,
  promo_subtext text,
  promo_image_url text,
  about_heading text,
  about_text text,
  business_name text NOT NULL DEFAULT 'Luxurious Shop',
  address text NOT NULL DEFAULT '8 Jummah Mosque Street, Port Louis, Mauritius',
  phone text NOT NULL DEFAULT '+230 5772 2069',
  whatsapp_number text NOT NULL DEFAULT '23057722069',
  whatsapp_enabled boolean NOT NULL DEFAULT false,
  email text,
  opening_hours jsonb NOT NULL DEFAULT '[
    {"day":"Monday","open":"10:30","close":"17:00","closed":false},
    {"day":"Tuesday","open":"10:30","close":"17:00","closed":false},
    {"day":"Wednesday","open":"10:30","close":"17:00","closed":false},
    {"day":"Thursday","open":"10:30","close":"17:00","closed":false},
    {"day":"Friday","open":"10:30","close":"17:00","closed":false},
    {"day":"Saturday","open":"10:00","close":"17:00","closed":false},
    {"day":"Sunday","open":"","close":"","closed":true}
  ]'::jsonb,
  maps_url text NOT NULL DEFAULT 'https://www.google.com/maps/search/?api=1&query=8+Jummah+Mosque+Street+Port+Louis+Mauritius',
  social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  checkout_mode text NOT NULL DEFAULT 'enquiry',
  delivery_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_settings" ON store_settings;
CREATE POLICY "public_read_settings" ON store_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_settings" ON store_settings;
CREATE POLICY "admin_insert_settings" ON store_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_settings" ON store_settings;
CREATE POLICY "admin_update_settings" ON store_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_settings" ON store_settings;
CREATE POLICY "admin_delete_settings" ON store_settings FOR DELETE
  TO authenticated USING (true);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_is_new_arrival ON products(is_new_arrival) WHERE is_new_arrival = true;
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_contact_enquiries_status ON contact_enquiries(status);

-- ============ SEED: STORE SETTINGS ============
INSERT INTO store_settings (id, announcement_text, announcement_active, hero_subtext, promo_heading, promo_subtext, about_heading, about_text)
SELECT gen_random_uuid(), 'New arrivals now available to explore', true,
  'Explore carefully selected finds and discover something special at Luxurious Shop, Port Louis.',
  'Something Special Awaits.',
  'Visit our store in Port Louis or contact us to learn more about our collection.',
  'Style Meets Discovery.',
  'Welcome to Luxurious Shop, located in the heart of Port Louis, Mauritius. Explore our curated collection, discover products that match your style, and contact our team for assistance with your shopping enquiries. We invite you to visit our store or browse online to find something special.'
WHERE NOT EXISTS (SELECT 1 FROM store_settings);

-- ============ SEED: CATEGORIES ============
INSERT INTO categories (name, slug, description, sort_order, is_visible)
SELECT * FROM (VALUES
  ('Fashion & Accessories', 'fashion-accessories', 'Clothing, scarves, and fashion accessories', 1, true),
  ('Bags & Wallets', 'bags-wallets', 'Bags, wallets, and leather goods', 2, true),
  ('Jewellery & Watches', 'jewellery-watches', 'Jewellery, watches, and timepieces', 3, true),
  ('Beauty & Personal Care', 'beauty-personal-care', 'Beauty products and personal care items', 4, true),
  ('Gifts & Lifestyle', 'gifts-lifestyle', 'Gift items and lifestyle products', 5, true)
)
AS v(name, slug, description, sort_order, is_visible)
WHERE NOT EXISTS (SELECT 1 FROM categories);

-- ============ SEED: SAMPLE PRODUCTS ============
-- These are clearly marked as sample/demo data (is_sample = true)
INSERT INTO products (name, slug, sku, category_id, description, price, sale_price, images, stock_quantity, availability, is_featured, is_new_arrival, search_keywords, is_active, is_sample)
SELECT
  v.name, v.slug, v.sku, c.id, v.description, v.price, v.sale_price,
  jsonb_build_array(v.image), v.stock, v.availability, v.featured, v.new_arrival,
  v.keywords, true, true
FROM (VALUES
  ('Silk Scarf — Ivory Floral', 'silk-scarf-ivory-floral', 'LS-001',
   'fashion-accessories', 'An elegant silk scarf with a delicate floral pattern. Perfect for adding a touch of sophistication to any outfit.', 1290.00, NULL,
   'https://images.pexels.com/photos/1306248/pexels-photo-1306248.jpeg',
   15, 'in_stock', true, true, 'scarf silk floral ivory fashion accessory', 1, 1),
  ('Leather Tote Bag — Cognac', 'leather-tote-bag-cognac', 'LS-002',
   'bags-wallets', 'A premium leather tote bag in a warm cognac shade. Spacious interior with multiple compartments for everyday essentials.', 3890.00, 3290.00,
   'https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg',
   8, 'in_stock', true, false, 'leather bag tote cognac premium', 2, 1),
  ('Minimalist Wristwatch — Gold', 'minimalist-wristwatch-gold', 'LS-003',
   'jewellery-watches', 'A sleek minimalist wristwatch with a gold-tone case and leather strap. Timeless design for everyday elegance.', 2490.00, NULL,
   'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg',
   5, 'in_stock', true, true, 'watch wristwatch gold minimalist leather strap', 3, 1),
  ('Pearl Drop Earrings', 'pearl-drop-earrings', 'LS-004',
   'jewellery-watches', 'Classic pearl drop earrings with a refined gold-tone setting. An elegant accessory for special occasions.', 890.00, NULL,
   'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg',
   20, 'in_stock', false, true, 'earrings pearl drop gold jewellery', 3, 1),
  ('Botanical Skincare Set', 'botanical-skincare-set', 'LS-005',
   'beauty-personal-care', 'A curated skincare set featuring botanical ingredients. Includes cleanser, toner, and moisturizer.', 1750.00, NULL,
   'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg',
   12, 'in_stock', true, false, 'skincare beauty botanical set cleanser moisturizer', 4, 1),
  ('Scented Candle — Vanilla Amber', 'scented-candle-vanilla-amber', 'LS-006',
   'gifts-lifestyle', 'A luxury scented candle with warm vanilla and amber notes. Long-lasting burn time in an elegant glass jar.', 650.00, NULL,
   'https://images.pexels.com/photos/3270223/pexels-photo-3270223.jpeg',
   30, 'in_stock', false, true, 'candle scented vanilla amber gift lifestyle', 5, 1),
  ('Cashmere Blend Wrap — Charcoal', 'cashmere-blend-wrap-charcoal', 'LS-007',
   'fashion-accessories', 'A soft cashmere blend wrap in versatile charcoal. Lightweight warmth with a luxurious feel.', 2150.00, 1790.00,
   'https://images.pexels.com/photos/2065200/pexels-photo-2065200.jpeg',
   10, 'in_stock', false, false, 'cashmere wrap shawl charcoal fashion accessory', 1, 1),
  ('Leather Bifold Wallet — Brown', 'leather-bifold-wallet-brown', 'LS-008',
   'bags-wallets', 'A handcrafted leather bifold wallet in rich brown. Multiple card slots and a compact design.', 990.00, NULL,
   'https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg',
   18, 'in_stock', false, true, 'wallet leather bifold brown cards', 2, 1),
  ('Gold Bangle Bracelet', 'gold-bangle-bracelet', 'LS-009',
   'jewellery-watches', 'A sleek gold-tone bangle bracelet with a polished finish. A versatile piece for everyday wear or special occasions.', 1190.00, NULL,
   'https://images.pexels.com/photos/1191533/pexels-photo-1191533.jpeg',
   14, 'in_stock', true, false, 'bangle bracelet gold jewellery', 3, 1),
  ('Luxury Fragrance — Oud Rose', 'luxury-fragrance-oud-rose', 'LS-010',
   'beauty-personal-care', 'An exquisite fragrance blending oud and rose notes. A sophisticated scent that lingers throughout the day.', 2890.00, NULL,
   'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg',
   7, 'in_stock', true, false, 'fragrance perfume oud rose luxury beauty', 4, 1),
  ('Decorative Glass Vase — Amber', 'decorative-glass-vase-amber', 'LS-011',
   'gifts-lifestyle', 'A handcrafted decorative glass vase in warm amber tones. An elegant addition to any home decor.', 790.00, NULL,
   'https://images.pexels.com/photos/3593447/pexels-photo-3593447.jpeg',
   22, 'in_stock', false, false, 'vase glass amber decorative home lifestyle gift', 5, 1),
  ('Aviator Sunglasses — Gold Frame', 'aviator-sunglasses-gold-frame', 'LS-012',
   'fashion-accessories', 'Classic aviator sunglasses with a gold-tone frame and gradient lenses. UV protection with timeless style.', 1450.00, 1190.00,
   'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg',
   0, 'out_of_stock', false, true, 'sunglasses aviator gold frame fashion accessory UV', 1, 1)
)
AS v(name, slug, sku, cat_slug, description, price, sale_price, image, stock, availability, featured, new_arrival, keywords, sort_order, tmp)
JOIN categories c ON c.slug = v.cat_slug
WHERE NOT EXISTS (SELECT 1 FROM products WHERE products.slug = v.slug);
