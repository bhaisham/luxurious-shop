import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { StoreSettings } from '@/lib/types';
import { BUSINESS } from '@/lib/constants';

interface SettingsContextValue {
  settings: StoreSettings;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

const DEFAULT_SETTINGS: StoreSettings = {
  id: '',
  announcement_text: 'New arrivals now available to explore',
  announcement_active: true,
  hero_heading: 'Discover Your Style.',
  hero_subtext:
    'Explore carefully selected finds and discover something special at Luxurious Shop, Port Louis.',
  hero_image_url: null,
  promo_heading: 'Something Special Awaits.',
  promo_subtext:
    'Visit our store in Port Louis or contact us to learn more about our collection.',
  promo_image_url: null,
  about_heading: 'Style Meets Discovery.',
  about_text:
    'Welcome to Luxurious Shop, located in the heart of Port Louis, Mauritius. Explore our curated collection, discover products that match your style, and contact our team for assistance with your shopping enquiries. We invite you to visit our store or browse online to find something special.',
  business_name: BUSINESS.name,
  address: BUSINESS.address,
  phone: BUSINESS.phone,
  whatsapp_number: BUSINESS.whatsappNumber,
  whatsapp_enabled: false,
  email: null,
  opening_hours: [
    { day: 'Monday', open: '10:30', close: '17:00', closed: false },
    { day: 'Tuesday', open: '10:30', close: '17:00', closed: false },
    { day: 'Wednesday', open: '10:30', close: '17:00', closed: false },
    { day: 'Thursday', open: '10:30', close: '17:00', closed: false },
    { day: 'Friday', open: '10:30', close: '17:00', closed: false },
    { day: 'Saturday', open: '10:00', close: '17:00', closed: false },
    { day: 'Sunday', open: '', close: '', closed: true },
  ],
  maps_url: BUSINESS.mapsUrl,
  social_links: {},
  checkout_mode: 'enquiry',
  delivery_enabled: false,
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data } = await supabase.from('store_settings').select('*').limit(1).maybeSingle();
    if (data) setSettings(data as StoreSettings);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
