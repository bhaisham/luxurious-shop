import { MapPin, Phone, Clock, Navigation, ExternalLink } from 'lucide-react';
import { SEO, useScrollTop } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';
import { useSettings } from '@/context/SettingsContext';
import { BUSINESS } from '@/lib/constants';

export function AboutPage() {
  useScrollTop();
  const { settings } = useSettings();

  return (
    <>
      <SEO title="About Us" description="Learn about Luxurious Shop in Port Louis, Mauritius." path="/about" />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/8386651/pexels-photo-8386651.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt="Luxurious Shop interior"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/50" />
        <div className="relative flex h-full items-center justify-center px-4 text-center text-white">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.4em] text-gold">About Us</p>
            <h1 className="font-serif text-4xl sm:text-5xl">{settings.about_heading || 'Discover Something Special.'}</h1>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-base leading-relaxed text-gray-600">
            {settings.about_text}
          </p>
        </div>
      </section>

      {/* Story / Products / Values */}
      <section className="bg-ivory py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div>
              <h3 className="font-serif text-2xl text-charcoal">Our Story</h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                <span className="text-xs italic text-gray-400">[Draft content — to be confirmed by the business owner]</span>
                <br />
                Located in the heart of Port Louis, Luxurious Shop opened its doors to offer a curated
                shopping experience for the people of Mauritius. Our journey is rooted in a passion for
                quality and a commitment to helping customers find something special.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-2xl text-charcoal">Our Products</h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                <span className="text-xs italic text-gray-400">[Draft content — product categories to be confirmed]</span>
                <br />
                Our collection spans a range of categories, from fashion and accessories to gifts and
                lifestyle products. We are continually updating our catalogue with new finds. Visit our
                store or browse online to explore what's available.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-2xl text-charcoal">Our Values</h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                <span className="text-xs italic text-gray-400">[Draft content — to be confirmed by the business owner]</span>
                <br />
                We believe in offering a welcoming shopping environment, honest customer service, and a
                selection that reflects quality and style. Your satisfaction is our priority, and we
                welcome your feedback and enquiries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Info */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-serif text-3xl text-charcoal">Visit Us</h2>
          <p className="mt-4 text-gray-600">
            We'd love to welcome you to our store in Port Louis.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2">
              <MapPin className="h-6 w-6 text-gold" />
              <p className="text-sm font-medium text-charcoal">Address</p>
              <p className="text-sm text-gray-600">{settings.address || BUSINESS.address}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Phone className="h-6 w-6 text-gold" />
              <p className="text-sm font-medium text-charcoal">Phone</p>
              <a href={`tel:${settings.phone || BUSINESS.phoneRaw}`} className="text-sm text-gray-600 hover:text-gold">
                {settings.phone || BUSINESS.phone}
              </a>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Clock className="h-6 w-6 text-gold" />
              <p className="text-sm font-medium text-charcoal">Hours</p>
              <p className="text-sm text-gray-600">Mon–Fri: 10:30–17:00</p>
              <p className="text-sm text-gray-600">Sat: 10:00–17:00</p>
            </div>
          </div>
          <div className="mt-8">
            <Button to="/store-location" variant="primary">
              <Navigation className="h-4 w-4" /> Find Our Store
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
