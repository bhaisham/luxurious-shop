import { SEO, useScrollTop } from '@/components/ui/SEO';

const SECTIONS = [
  {
    title: 'Information We Collect',
    body: 'We collect information that you provide directly to us, including your name, email address, phone number, and any messages you send through our contact form or checkout enquiry. We also collect technical information such as your IP address and browser type for security and analytics purposes.',
  },
  {
    title: 'How We Use Your Information',
    body: 'We use your information to respond to your enquiries, process product enquiries and orders, communicate with you about your requests, and improve our website and services. We do not sell or rent your personal information to third parties.',
  },
  {
    title: 'Cookies and Local Storage',
    body: 'Our website uses local storage to remember items in your shopping cart and wishlist between visits. This data is stored on your device and is not transmitted to us unless you submit an enquiry or order.',
  },
  {
    title: 'Data Security',
    body: 'We take reasonable measures to protect your personal information. Data is transmitted over encrypted connections and stored securely. We do not collect or store payment card details through this website. Sensitive customer data is handled in accordance with applicable data protection laws in Mauritius.',
  },
  {
    title: 'Third-Party Services',
    body: 'We may use third-party services such as Google Maps for location features. These services have their own privacy policies, and we encourage you to review them. We do not share your personal information with these services unless you interact with their features directly.',
  },
  {
    title: 'Your Rights',
    body: 'You have the right to request access to, correction of, or deletion of your personal information. To exercise these rights, please contact us using the details on our Contact Us page.',
  },
  {
    title: 'Children\'s Privacy',
    body: 'Our website is not directed to children under 16, and we do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can remove it.',
  },
  {
    title: 'Changes to This Policy',
    body: 'We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this page periodically.',
  },
];

export function PrivacyPage() {
  useScrollTop();
  return (
    <>
      <SEO title="Privacy Policy" description="Privacy Policy for Luxurious Shop, Port Louis, Mauritius." path="/privacy" />

      <div className="border-b border-gray-100 bg-ivory py-12 text-center">
        <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">Privacy Policy</h1>
        <p className="mt-3 text-xs text-gray-400">Last updated: October 2026 · Draft content — subject to confirmation</p>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
        <p className="mb-8 text-sm italic text-gray-500">
          This is draft privacy policy content. The business owner should review and confirm it before publication,
          ideally with legal counsel familiar with Mauritian data protection regulations.
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
