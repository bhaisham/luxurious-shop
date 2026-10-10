import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Loader({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-20', className)}>
      <Loader2 className="h-8 w-8 animate-spin text-gold" />
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory">
      <Loader2 className="h-10 w-10 animate-spin text-gold" />
    </div>
  );
}
