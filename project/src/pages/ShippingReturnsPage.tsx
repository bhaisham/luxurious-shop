import { SEO, useScrollTop } from '@/components/ui/SEO';
import { Truck, RotateCcw, CreditCard, MapPin } from 'lucide-react';

export function ShippingReturnsPage() {
  useScrollTop();
  return (
    <>
      <SEO title="Shipping & Returns" description="Shipping and returns information for Luxurious Shop, Port Louis, Mauritius." path="/shipping-returns" />

      <div className="border-b border-gray-100 bg-ivory py-12 text-center">
        <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">Shipping &amp; Returns</h1>
        <p className="mt-3 text-xs text-gray-400">Draft content — subject to confirmation by the business owner</p>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
        <div className="mb-8 rounded-none border border-gold/30 bg-gold/5 p-6">
          <p className="text-sm text-gray-700">
            <strong className="text-charcoal">Important:</strong> Shipping, delivery, return, refund, and exchange policies
            have not yet been confirmed by the business owner. The content below is draft text for guidance only.
            Please do not consider these as official policies until they are confirmed and published.
          </p>
        </div>

        <div className="space-y-10">
          <section>
            <div className="flex items-center gap-3">
              <Truck className="h-6 w-6 text-gold" />
              <h2 className="font-serif text-xl text-charcoal">Delivery</h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              <span className="text-xs italic text-gray-400">[Draft — pending confirmation]</span>
              <br />
              Delivery options, coverage areas, and fees within Mauritius have not yet been confirmed.
              Once established, this section will include information about delivery zones (Port Louis,
              Plaines Wilhems, and other regions), estimated delivery times, and any applicable delivery charges.
              In-store collection may also be available by arrangement.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-6 w-6 text-gold" />
              <h2 className="font-serif text-xl text-charcoal">Returns &amp; Exchanges</h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              <span className="text-xs italic text-gray-400">[Draft — pending confirmation]</span>
              <br />
              Return and exchange policies have not yet been confirmed. Once established, this section will
              include information about the return period, condition requirements for returned items,
              exchange procedures, and any applicable restocking fees. We are committed to ensuring customer
              satisfaction and will work with you to resolve any concerns.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-gold" />
              <h2 className="font-serif text-xl text-charcoal">Payment Methods</h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              <span className="text-xs italic text-gray-400">[Draft — pending confirmation]</span>
              <br />
              Accepted payment methods have not yet been confirmed. We do not collect or process card details
              through this website. Once payment arrangements are confirmed, they will be listed here.
              Potential options may include cash, bank transfer, or secure online payment — but none of these
              are confirmed until the business owner publishes them.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-gold" />
              <h2 className="font-serif text-xl text-charcoal">In-Store Collection</h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              <span className="text-xs italic text-gray-400">[Draft — pending confirmation]</span>
              <br />
              You may be able to collect products in person at our store at 8 Jummah Mosque Street, Port Louis.
              Please contact the shop in advance to confirm availability and arrange collection during our
              opening hours (Mon–Fri 10:30 AM–5:00 PM, Sat 10:00 AM–5:00 PM — pending verification).
            </p>
          </section>
        </div>

        <div className="mt-12 rounded-none bg-ivory p-6 text-center">
          <p className="text-sm text-gray-600">
            Questions about shipping or returns?
          </p>
          <a href="/contact" className="mt-2 inline-block text-sm font-medium text-gold hover:underline">
            Contact Us
          </a>
        </div>
      </div>
    </>
  );
}
