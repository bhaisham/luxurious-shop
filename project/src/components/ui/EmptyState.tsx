import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-20 px-4 text-center',
        className,
      )}
    >
      {icon && <div className="mb-4 text-gray-300">{icon}</div>}
      <h3 className="text-lg font-serif text-charcoal">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
