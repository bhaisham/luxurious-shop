import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, MessageCircle } from 'lucide-react';
import { SEO, useScrollTop } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { formatMUR, generateOrderNumber } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import { BUSINESS, WHATSAPP_DEFAULT_MESSAGE, FALLBACK_IMAGE } from '@/lib/constants';

export function CheckoutPage() {
  useScrollTop();
  const { items, subtotal, itemCount, clearCart } = useCart();
  const { settings } = useSettings();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', town: '', notes: '', fulfilment: 'enquiry',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [submitError, setSubmitError] = useState('');

  const isOrderingMode = settings.checkout_mode === 'ordering';
  const cartWhatsAppMsg = encodeURIComponent(
    `${WHATSAPP_DEFAULT_MESSAGE}\n\nItems:\n${items.map(i => `• ${i.name} x${i.quantity} — ${formatMUR(i.price * i.quantity)}`).join('\n')}\n\nTotal: ${formatMUR(subtotal)}`,
  );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^\+?[\d\s-]+$/.test(form.phone)) e.phone = 'Please enter a valid phone number';
    if (isOrderingMode && settings.delivery_enabled) {
      if (!form.address.trim()) e.address = 'Delivery address is required';
      if (!form.town.trim()) e.town = 'Town is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError('');

    const ordNum = generateOrderNumber();
    const orderType = isOrderingMode ? 'order' : 'enquiry';

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: ordNum,
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        delivery_address: form.address || null,
        town: form.town || null,
        notes: form.notes || null,
        fulfilment_method: form.fulfilment,
        subtotal,
        total: subtotal,
        order_type: orderType,
        status: 'pending',
      })
      .select('id')
      .maybeSingle();

    if (orderError || !orderData) {
      setSubmitError('We could not submit your request. Please try again or contact us directly.');
      setSubmitting(false);
      return;
    }

    const orderItems = items.map(item => ({
      order_id: orderData.id,
      product_id: item.product_id,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      setSubmitError('Your order was created but some items could not be saved. Please contact us to confirm.');
      setSubmitting(false);
      return;
    }

    setOrderNumber(ordNum);
    setSuccess(true);
    clearCart();
    setSubmitting(false);
  };

  if (success) {
    return (
      <>
        <SEO title="Checkout" path="/checkout" />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
          <h1 className="mt-6 font-serif text-3xl text-charcoal">
            {isOrderingMode ? 'Order Submitted!' : 'Enquiry Submitted!'}
          </h1>
          <p className="mt-4 text-gray-600">
            Thank you, {form.name}. Your {isOrderingMode ? 'order' : 'enquiry'} has been received.
            Our team will contact you shortly to confirm details.
          </p>
          <div className="mt-6 rounded-none border border-gray-200 bg-ivory p-4">
            <p className="text-xs uppercase tracking-widest text-gray-400">Reference Number</p>
            <p className="mt-1 font-serif text-xl text-charcoal">{orderNumber}</p>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Please save this reference number for your records.
          </p>
          <div className="mt-8">
            <Button to="/">Return Home</Button>
          </div>
        </div>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <SEO title="Checkout" path="/checkout" />
        <EmptyState
          title="Your cart is empty"
          description="Add products to your cart before proceeding to checkout."
          action={<Button to="/shop">Browse Products</Button>}
        />
      </>
    );
  }

  return (
    <>
      <SEO title="Checkout" path="/checkout" />

      <div className="border-b border-gray-100 bg-ivory py-12 text-center">
        <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">
          {isOrderingMode ? 'Checkout' : 'Product Enquiry'}
        </h1>
        <p className="mt-3 text-sm text-gray-500">
          {isOrderingMode
            ? 'Complete your order below.'
            : 'Submit your enquiry and our team will contact you to confirm details.'}
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border border-gray-100 p-6">
                <h2 className="mb-4 font-serif text-lg text-charcoal">Contact Information</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Full Name *"
                    name="name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    error={errors.name}
                  />
                  <Input
                    label="Email Address *"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    error={errors.email}
                  />
                  <Input
                    label="Phone Number *"
                    name="phone"
                    type="tel"
                    placeholder="+230 ..."
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    error={errors.phone}
                  />
                  <Select
                    label="Fulfilment Method"
                    name="fulfilment"
                    value={form.fulfilment}
                    onChange={e => setForm(f => ({ ...f, fulfilment: e.target.value }))}
                  >
                    <option value="enquiry">General Enquiry</option>
                    <option value="in-store">In-Store Collection</option>
                    {settings.delivery_enabled && <option value="delivery">Delivery</option>}
                  </Select>
                </div>
              </div>

              {isOrderingMode && settings.delivery_enabled && (
                <div className="border border-gray-100 p-6">
                  <h2 className="mb-4 font-serif text-lg text-charcoal">Delivery Address</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <Input
                      label="Street Address *"
                      name="address"
                      value={form.address}
                      onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      error={errors.address}
                    />
                    <Input
                      label="Town / Locality *"
                      name="town"
                      value={form.town}
                      onChange={e => setForm(f => ({ ...f, town: e.target.value }))}
                      error={errors.town}
                    />
                  </div>
                </div>
              )}

              <div className="border border-gray-100 p-6">
                <Textarea
                  label="Order Notes (optional)"
                  name="notes"
                  rows={4}
                  placeholder="Any special requests or questions..."
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                />
              </div>

              {submitError && (
                <div className="flex items-center gap-2 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {submitError}
                </div>
              )}

              <Button type="submit" loading={submitting} size="lg" className="w-full">
                {isOrderingMode ? 'Place Order' : 'Submit Enquiry'}
              </Button>

              {settings.whatsapp_enabled && (
                <div className="text-center">
                  <p className="text-xs text-gray-400">or</p>
                  <a
                    href={`https://wa.me/${settings.whatsapp_number}?text=${cartWhatsAppMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-gold hover:underline"
                  >
                    <MessageCircle className="h-4 w-4" /> Send enquiry via WhatsApp instead
                  </a>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 p-6">
              <h2 className="font-serif text-xl text-charcoal">Order Summary</h2>
              <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
                {items.map(item => (
                  <div key={`${item.product_id}-${item.variant ?? ''}`} className="flex gap-3">
                    <img
                      src={item.image || FALLBACK_IMAGE}
                      alt={item.name}
                      className="h-16 w-14 object-cover bg-ivory"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-charcoal line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      <p className="text-xs font-medium text-charcoal">{formatMUR(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                  <span className="font-medium">{formatMUR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-gray-400">To be confirmed</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between">
                  <span className="font-medium text-charcoal">Total</span>
                  <span className="font-serif text-lg text-charcoal">{formatMUR(subtotal)}</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-400">
                No payment is processed through this website. We will contact you to confirm arrangements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
