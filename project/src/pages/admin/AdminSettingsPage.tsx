import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Loader } from '@/components/ui/Loader';
import type { StoreSettings } from '@/lib/types';

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.from('store_settings').select('*').limit(1).maybeSingle().then(({ data }) => {
      if (data) setSettings(data as StoreSettings);
      setLoading(false);
    });
  }, []);

  const update = (field: keyof StoreSettings, value: string | boolean) => {
    setSettings(prev => prev ? { ...prev, [field]: value } : prev);
    setSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError('');

    const { error } = await supabase.from('store_settings').update({
      announcement_text: settings.announcement_text,
      announcement_active: settings.announcement_active,
      hero_heading: settings.hero_heading,
      hero_subtext: settings.hero_subtext,
      hero_image_url: settings.hero_image_url,
      promo_heading: settings.promo_heading,
      promo_subtext: settings.promo_subtext,
      promo_image_url: settings.promo_image_url,
      about_heading: settings.about_heading,
      about_text: settings.about_text,
      business_name: settings.business_name,
      address: settings.address,
      phone: settings.phone,
      whatsapp_number: settings.whatsapp_number,
      whatsapp_enabled: settings.whatsapp_enabled,
      email: settings.email,
      maps_url: settings.maps_url,
      checkout_mode: settings.checkout_mode,
      delivery_enabled: settings.delivery_enabled,
    }).eq('id', settings.id);

    if (error) { setError(error.message); setSaving(false); return; }
    setSaving(false);
    setSaved(true);
  };

  if (loading) return <Loader label="Loading settings..." />;

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl text-charcoal">Store Settings</h1>
      <p className="mt-1 text-sm text-gray-500">Configure your store information, homepage content, and contact details.</p>

      {settings && (
        <form onSubmit={handleSave} className="mt-8 space-y-8">
          {/* Announcement Bar */}
          <section className="border border-gray-100 bg-white p-6">
            <h2 className="font-serif text-lg text-charcoal">Announcement Bar</h2>
            <div className="mt-4 space-y-3">
              <Input
                label="Announcement Text"
                value={settings.announcement_text ?? ''}
                onChange={e => update('announcement_text', e.target.value)}
              />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={settings.announcement_active} onChange={e => update('announcement_active', e.target.checked)} className="h-4 w-4 accent-gold" />
                Show announcement bar
              </label>
            </div>
          </section>

          {/* Homepage */}
          <section className="border border-gray-100 bg-white p-6">
            <h2 className="font-serif text-lg text-charcoal">Homepage Content</h2>
            <div className="mt-4 space-y-3">
              <Input label="Hero Heading" value={settings.hero_heading} onChange={e => update('hero_heading', e.target.value)} />
              <Textarea label="Hero Subtext" rows={2} value={settings.hero_subtext ?? ''} onChange={e => update('hero_subtext', e.target.value)} />
              <Input label="Hero Image URL" value={settings.hero_image_url ?? ''} onChange={e => update('hero_image_url', e.target.value)} />
              <Input label="Promo Heading" value={settings.promo_heading ?? ''} onChange={e => update('promo_heading', e.target.value)} />
              <Textarea label="Promo Subtext" rows={2} value={settings.promo_subtext ?? ''} onChange={e => update('promo_subtext', e.target.value)} />
              <Input label="Promo Image URL" value={settings.promo_image_url ?? ''} onChange={e => update('promo_image_url', e.target.value)} />
              <Input label="About Heading" value={settings.about_heading ?? ''} onChange={e => update('about_heading', e.target.value)} />
              <Textarea label="About Text" rows={4} value={settings.about_text ?? ''} onChange={e => update('about_text', e.target.value)} />
            </div>
          </section>

          {/* Business Info */}
          <section className="border border-gray-100 bg-white p-6">
            <h2 className="font-serif text-lg text-charcoal">Business Information</h2>
            <div className="mt-4 space-y-3">
              <Input label="Business Name" value={settings.business_name} onChange={e => update('business_name', e.target.value)} />
              <Textarea label="Address" rows={2} value={settings.address} onChange={e => update('address', e.target.value)} />
              <Input label="Phone" value={settings.phone} onChange={e => update('phone', e.target.value)} />
              <Input label="Email" value={settings.email ?? ''} onChange={e => update('email', e.target.value)} />
              <Input label="Google Maps URL" value={settings.maps_url} onChange={e => update('maps_url', e.target.value)} />
            </div>
          </section>

          {/* WhatsApp */}
          <section className="border border-gray-100 bg-white p-6">
            <h2 className="font-serif text-lg text-charcoal">WhatsApp</h2>
            <div className="mt-4 space-y-3">
              <Input label="WhatsApp Number (digits only)" value={settings.whatsapp_number} onChange={e => update('whatsapp_number', e.target.value)} placeholder="23057722069" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={settings.whatsapp_enabled} onChange={e => update('whatsapp_enabled', e.target.checked)} className="h-4 w-4 accent-gold" />
                Enable WhatsApp contact feature (only enable if confirmed with the business owner)
              </label>
            </div>
          </section>

          {/* Checkout */}
          <section className="border border-gray-100 bg-white p-6">
            <h2 className="font-serif text-lg text-charcoal">Checkout Mode</h2>
            <div className="mt-4 space-y-3">
              <Select label="Checkout Mode" value={settings.checkout_mode} onChange={e => update('checkout_mode', e.target.value)}>
                <option value="enquiry">Product Enquiry (customers enquire before ordering)</option>
                <option value="ordering">Online Ordering (customers can submit orders)</option>
              </Select>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={settings.delivery_enabled} onChange={e => update('delivery_enabled', e.target.checked)} className="h-4 w-4 accent-gold" />
                Enable delivery (requires address fields at checkout)
              </label>
            </div>
          </section>

          {error && <p className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {saved && <p className="border border-green-200 bg-green-50 p-3 text-sm text-green-700">Settings saved successfully.</p>}

          <Button type="submit" loading={saving}>Save Settings</Button>
        </form>
      )}
    </div>
  );
}
