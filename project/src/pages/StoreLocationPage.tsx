import { MapPin, Phone, Clock, Navigation, ExternalLink } from 'lucide-react';
import { SEO, useScrollTop } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';
import { useSettings } from '@/context/SettingsContext';
import { BUSINESS } from '@/lib/constants';

export function StoreLocationPage() {
  useScrollTop();
  const { settings } = useSettings();

  return (
    <>
      <SEO title="Find Our Store" description="Visit Luxurious Shop at 8 Jummah Mosque Street, Port Louis, Mauritius. Get directions and view our opening hours." path="/store-location" />

      <div className="border-b border-gray-100 bg-ivory py-12 text-center">
        <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">Find Our Store</h1>
        <p className="mt-3 text-sm text-gray-500">Located in the heart of Port Louis, Mauritius.</p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Map */}
          <a
            href={settings.maps_url || BUSINESS.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group order-2 relative block overflow-hidden border border-gray-100 lg:order-1"
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

          {/* Info */}
          <div className="order-1 lg:order-2">
            <h2 className="font-serif text-2xl text-charcoal">Luxurious Shop</h2>
            <p className="mt-2 text-sm text-gray-600">
              Located on Jummah Mosque Street in central Port Louis, our store is easily accessible
              from across the city. We look forward to welcoming you.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="text-sm font-medium text-charcoal">Address</p>
                  <p className="text-sm text-gray-600">{settings.address || BUSINESS.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="text-sm font-medium text-charcoal">Telephone</p>
                  <a href={`tel:${settings.phone || BUSINESS.phoneRaw}`} className="text-sm text-gray-600 hover:text-gold">
                    {settings.phone || BUSINESS.phone}
                  </a>
                  <p className="text-xs italic text-gray-400">Pending verification</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="text-sm font-medium text-charcoal">Opening Hours</p>
                  <div className="mt-1 space-y-0.5 text-sm text-gray-600">
                    {settings.opening_hours.map((h, i) => (
                      <div key={i} className="flex justify-between gap-8">
                        <span>{h.day}</span>
                        <span className={h.closed ? 'text-gray-400' : ''}>
                          {h.closed ? 'Closed' : `${h.open} – ${h.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-1 text-xs italic text-gray-400">Hours pending verification</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={settings.maps_url || BUSINESS.mapsUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="primary">
                  <Navigation className="h-4 w-4" /> Get Directions
                </Button>
              </a>
              <a href={`tel:${settings.phone || BUSINESS.phoneRaw}`}>
                <Button variant="outline">
                  <Phone className="h-4 w-4" /> Call the Shop
                </Button>
              </a>
            </div>

            <div className="mt-8 rounded-none bg-ivory p-4">
              <p className="text-xs text-gray-500">
                <strong className="text-charcoal">Note:</strong> Business details shown here originate from
                an online listing and should be verified with the shop owner before publication. Additional
                branch locations can be added as the business expands.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
