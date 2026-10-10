import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { FOOTER_LINKS, BUSINESS } from '@/lib/constants';

export function Footer() {
  const { settings } = useSettings();
  const socials = settings.social_links || {};

  return (
    <footer className="bg-charcoal text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex flex-col leading-none">
              <span className="font-serif text-xl font-bold tracking-[0.15em]">LUXURIOUS</span>
              <span className="text-[10px] font-medium tracking-[0.4em] text-gold">SHOP</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              A premium retail destination in Port Louis, Mauritius. Explore our curated collection
              and discover something special.
            </p>
            {Object.keys(socials).length > 0 && (
              <div className="mt-6 flex gap-3">
                {socials.instagram && (
                  <a href={socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-gold">
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {socials.facebook && (
                  <a href={socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-gold">
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {socials.twitter && (
                  <a href={socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-gold">
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold">Shop</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.shop.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold">Information</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.about.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
              {FOOTER_LINKS.legal.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold">Visit Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{settings.address || BUSINESS.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <a href={`tel:${settings.phone || BUSINESS.phoneRaw}`} className="hover:text-white">
                  {settings.phone || BUSINESS.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div>
                  <p>Mon–Fri: 10:30 AM–5:00 PM</p>
                  <p>Sat: 10:00 AM–5:00 PM</p>
                  <p className="text-xs italic text-gray-500">Hours pending verification</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} {settings.business_name || BUSINESS.name}. All rights reserved.
            {' '}
            <Link to="/privacy" className="hover:text-gold">Privacy</Link>
            {' · '}
            <Link to="/terms" className="hover:text-gold">Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
