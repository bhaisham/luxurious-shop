export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  category_id: string | null;
  description: string | null;
  price: number;
  sale_price: number | null;
  images: string[];
  variants: ProductVariant[];
  stock_quantity: number;
  availability: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  search_keywords: string | null;
  is_active: boolean;
  is_sample: boolean;
  created_at: string;
  updated_at: string;
  category?: Category | null;
}

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface CartItem {
  product_id: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  image: string;
  quantity: number;
  variant?: string;
  stock_quantity: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  delivery_address: string | null;
  town: string | null;
  notes: string | null;
  fulfilment_method: string | null;
  status: string;
  subtotal: number;
  total: number;
  order_type: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  created_at: string;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
}

export interface OpeningHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface StoreSettings {
  id: string;
  announcement_text: string | null;
  announcement_active: boolean;
  hero_heading: string;
  hero_subtext: string | null;
  hero_image_url: string | null;
  promo_heading: string | null;
  promo_subtext: string | null;
  promo_image_url: string | null;
  about_heading: string | null;
  about_text: string | null;
  business_name: string;
  address: string;
  phone: string;
  whatsapp_number: string;
  whatsapp_enabled: boolean;
  email: string | null;
  opening_hours: OpeningHour[];
  maps_url: string;
  social_links: Record<string, string>;
  checkout_mode: 'enquiry' | 'ordering';
  delivery_enabled: boolean;
}
