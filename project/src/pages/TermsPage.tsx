import { SEO, useScrollTop } from '@/components/ui/SEO';

const SECTIONS = [
  {
    title: 'Introduction',
    body: 'These Terms and Conditions govern your use of the Luxurious Shop website. By accessing or using our website, you agree to be bound by these terms. If you do not agree with any part of these terms, please do not use our website.',
  },
  {
    title: 'Products and Pricing',
    body: 'All products displayed on this website are subject to availability. Prices are listed in Mauritian Rupees (MUR) and are subject to change without notice. Products marked as "Demo Data" are sample products for demonstration purposes and do not represent actual inventory. We strive to ensure all information on this website is accurate, but we do not warrant that product descriptions, images, or other content are entirely accurate, current, or error-free.',
  },
  {
    title: 'Product Enquiries and Orders',
    body: 'Currently, this website operates in product enquiry mode. Submitting an enquiry does not constitute a confirmed order or a contract of sale. Orders are confirmed only when the shop accepts your enquiry and arrangements are agreed upon. Once online ordering is enabled, additional terms regarding order placement, confirmation, and fulfilment will apply.',
  },
  {
    title: 'Payment',
    body: 'Payment methods and arrangements have not yet been confirmed. We do not collect or process payment card details through this website. Any payment arrangements will be communicated to you directly and must be agreed upon before an order is fulfilled.',
  },
  {
    title: 'Delivery and Collection',
    body: 'Delivery options, fees, and policies have not yet been confirmed. In-store collection may be available by arrangement. Please contact the shop directly to discuss delivery or collection for your specific order.',
  },
  {
    title: 'Returns and Refunds',
    body: 'Return and refund policies have not yet been confirmed. Once established, they will be published on our Shipping and Returns page and linked here. Please contact the shop if you have any concerns about a product.',
  },
  {
    title: 'Intellectual Property',
    body: 'All content on this website, including text, graphics, logos, and design elements, is the property of Luxurious Shop or its content creators and is protected by intellectual property laws. You may not reproduce, distribute, or use any content without prior written permission.',
  },
  {
    title: 'Limitation of Liability',
    body: 'To the fullest extent permitted by law, Luxurious Shop shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of, or inability to use, this website or any products or services obtained through it.',
  },
  {
    title: 'Governing Law',
    body: 'These terms shall be governed by and construed in accordance with the laws of Mauritius. Any disputes shall be subject to the jurisdiction of the courts of Mauritius.',
  },
  {
    title: 'Changes to Terms',
    body: 'We may update these Terms and Conditions from time to time. Changes will be posted on this page with an updated revision date. Continued use of the website after changes constitutes acceptance of the revised terms.',
  },
];

export function TermsPage() {
  useScrollTop();
  return (
    <>
      <SEO title="Terms & Conditions" description="Terms and Conditions for Luxurious Shop, Port Louis, Mauritius." path="/terms" />

      <div className="border-b border-gray-100 bg-ivory py-12 text-center">
        <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">Terms &amp; Conditions</h1>
        <p className="mt-3 text-xs text-gray-400">Last updated: October 2026 · Draft content — subject to confirmation</p>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
        <p className="mb-8 text-sm italic text-gray-500">
          This is draft terms and conditions content. The business owner should review and confirm it before publication,
          ideally with legal counsel familiar with Mauritian law.
        </p>
        <div className="space-y-8">
          {SECTIONS.map((s, i) => (
            <div key={i}>
              <h2 className="font-serif text-xl text-charcoal">{i + 1}. {s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
