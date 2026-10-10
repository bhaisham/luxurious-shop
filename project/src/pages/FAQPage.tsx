import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SEO, useScrollTop } from '@/components/ui/SEO';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: 'Where is Luxurious Shop located?',
    a: 'We are located at 8 Jummah Mosque Street, Port Louis, Mauritius. You can find directions on our Find Our Store page.',
  },
  {
    q: 'What are your opening hours?',
    a: 'Our listed hours are Monday to Friday 10:30 AM–5:00 PM, and Saturday 10:00 AM–5:00 PM. Sunday hours are not yet confirmed. These hours are pending verification — please call ahead to confirm before visiting.',
  },
  {
    q: 'How can I contact the shop?',
    a: 'You can reach us by phone at +230 5772 2069, or by using the contact form on our Contact Us page. If WhatsApp is enabled, a WhatsApp enquiry option will also be available.',
  },
  {
    q: 'Can I buy products online?',
    a: 'Currently, our website supports product enquiries. Once the shop owner enables online ordering and confirms payment and delivery arrangements, full checkout will be available. In the meantime, you can submit an enquiry and our team will contact you to arrange your purchase.',
  },
  {
    q: 'Do you offer delivery?',
    a: 'Delivery options have not yet been confirmed. Please contact the shop directly to enquire about delivery arrangements for your area.',
  },
  {
    q: 'Are the products shown on the website actual stock?',
    a: 'Products displayed may include demonstration data clearly labelled as "Demo Data." These are sample products and not actual inventory. Once the shop owner adds real products through the admin dashboard, they will replace the demo items.',
  },
  {
    q: 'How do I make a product enquiry?',
    a: 'You can submit an enquiry by adding products to your cart and proceeding to checkout, by using the contact form, or by calling the shop directly. If WhatsApp is enabled, you can also send a prefilled enquiry message.',
  },
  {
    q: 'What payment methods are available?',
    a: 'Payment methods have not yet been confirmed. We do not collect card details through this website. Once payment arrangements are confirmed, they will be displayed here and integrated securely.',
  },
];

export function FAQPage() {
  useScrollTop();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <SEO title="Frequently Asked Questions" description="Find answers to common questions about Luxurious Shop, our products, and services." path="/faq" />

      <div className="border-b border-gray-100 bg-ivory py-12 text-center">
        <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">FAQ</h1>
        <p className="mt-3 text-sm text-gray-500">Answers to frequently asked questions.</p>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-gray-100">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <span className="font-serif text-base text-charcoal">{faq.q}</span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 text-gold transition-transform duration-200',
                    open === i && 'rotate-180',
                  )}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm leading-relaxed text-gray-600 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-none bg-ivory p-6 text-center">
          <p className="text-sm text-gray-600">Still have questions?</p>
          <Link to="/contact" className="mt-2 inline-block text-sm font-medium text-gold hover:underline">
            Contact Us
          </Link>
        </div>
      </div>
    </>
  );
}
