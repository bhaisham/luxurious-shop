import { useState } from 'react';
import { MapPin, Phone, Clock, Mail, Send, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { SEO, useScrollTop } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { useSettings } from '@/context/SettingsContext';
import { supabase } from '@/lib/supabase';
import { BUSINESS } from '@/lib/constants';

export function ContactPage() {
  useScrollTop();
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email';
    if (!form.message.trim()) e.message = 'Message is required';
    if (!form.consent) e.consent = 'Please accept the privacy consent to continue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError('');

    const { error } = await supabase.from('contact_enquiries').insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      subject: form.subject || null,
      message: form.message,
      status: 'new',
    });

    if (error) {
      setSubmitError('We could not send your message. Please try again or call us directly.');
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setSubmitting(false);
    setForm({ name: '', email: '', phone: '', subject: '', message: '', consent: false });
  };

  return (
    <>
      <SEO title="Contact Us" description="Contact Luxurious Shop in Port Louis, Mauritius. Send us a message, call, or visit our store." path="/contact" />

      <div className="border-b border-gray-100 bg-ivory py-12 text-center">
        <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">Contact Us</h1>
        <p className="mt-3 text-sm text-gray-500">We'd love to hear from you.</p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-2xl text-charcoal">Get in Touch</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Whether you have a question about a product, need assistance with an order, or simply
              want to say hello, our team is here to help.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center bg-ivory">
                  <MapPin className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Address</p>
                  <p className="text-sm text-gray-600">{settings.address || BUSINESS.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center bg-ivory">
                  <Phone className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Telephone</p>
                  <a href={`tel:${settings.phone || BUSINESS.phoneRaw}`} className="text-sm text-gray-600 hover:text-gold">
                    {settings.phone || BUSINESS.phone}
                  </a>
                  <p className="text-xs italic text-gray-400">Pending verification</p>
                </div>
              </div>

              {settings.email && (
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center bg-ivory">
                    <Mail className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal">Email</p>
                    <a href={`mailto:${settings.email}`} className="text-sm text-gray-600 hover:text-gold">
                      {settings.email}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center bg-ivory">
                  <Clock className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Opening Hours</p>
                  <div className="mt-1 space-y-0.5 text-sm text-gray-600">
                    <p>Monday – Friday: 10:30 AM – 5:00 PM</p>
                    <p>Saturday: 10:00 AM – 5:00 PM</p>
                    <p>Sunday: Not confirmed</p>
                    <p className="text-xs italic text-gray-400">Hours pending verification</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <a href={settings.maps_url || BUSINESS.mapsUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" /> Get Directions
                  </Button>
                </a>
                <a href={`tel:${settings.phone || BUSINESS.phoneRaw}`}>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" /> Call Now
                  </Button>
                </a>
              </div>
            </div>

            <a
              href={settings.maps_url || BUSINESS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 relative block overflow-hidden border border-gray-100"
            >
              <img
                src="https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Map of 8 Jummah Mosque Street, Port Louis, Mauritius"
                className="h-[300px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-charcoal/50">
                <MapPin className="h-8 w-8 text-gold" />
                <p className="mt-2 font-serif text-base text-white">View on Google Maps</p>
                <p className="mt-1 text-xs text-white/70">8 Jummah Mosque Street, Port Louis</p>
              </div>
            </a>
          </div>

          {/* Contact Form */}
          <div>
            <div className="border border-gray-100 p-6 lg:p-8">
              <h2 className="font-serif text-2xl text-charcoal">Send a Message</h2>

              {success ? (
                <div className="mt-6 flex flex-col items-center py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                  <p className="mt-4 text-sm text-gray-600">
                    Thank you! Your message has been received. We'll get back to you soon.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-6"
                    onClick={() => setSuccess(false)}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      label="Name *"
                      name="name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      error={errors.name}
                    />
                    <Input
                      label="Email *"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      error={errors.email}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      label="Phone (optional)"
                      name="phone"
                      type="tel"
                      placeholder="+230 ..."
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    />
                    <Input
                      label="Subject"
                      name="subject"
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    />
                  </div>
                  <Textarea
                    label="Message *"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    error={errors.message}
                  />
                  <div>
                    <label className="flex items-start gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={e => setForm(f => ({ ...f, consent: e.target.checked }))}
                        className="mt-1 h-4 w-4 accent-gold"
                      />
                      <span>
                        I agree that my submitted information will be used solely to respond to my enquiry,
                        in accordance with the <a href="/privacy" className="text-gold hover:underline">Privacy Policy</a>.
                      </span>
                    </label>
                    {errors.consent && <p className="mt-1 text-xs text-red-600">{errors.consent}</p>}
                  </div>

                  {submitError && (
                    <div className="flex items-center gap-2 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {submitError}
                    </div>
                  )}

                  <Button type="submit" loading={submitting} className="w-full">
                    <Send className="h-4 w-4" /> Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
