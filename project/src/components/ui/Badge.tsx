import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'gold' | 'sale' | 'new' | 'out' | 'dark';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    gold: 'bg-gold text-white',
    sale: 'bg-red-600 text-white',
    new: 'bg-charcoal text-white',
    out: 'bg-gray-300 text-gray-600',
    dark: 'bg-charcoal/80 text-white backdrop-blur-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
