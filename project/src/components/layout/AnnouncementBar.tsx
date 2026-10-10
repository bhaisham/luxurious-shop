import { Megaphone, X } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export function AnnouncementBar() {
  const { settings } = useSettings();

  if (!settings.announcement_active || !settings.announcement_text) return null;

  return (
    <div className="bg-charcoal text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2.5 text-center">
        <Megaphone className="hidden h-3.5 w-3.5 shrink-0 text-gold sm:block" />
        <p className="text-xs font-medium tracking-wide">{settings.announcement_text}</p>
      </div>
    </div>
  );
}
