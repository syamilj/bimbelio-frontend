'use client';

import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { iconColorMap, type StatColor } from './stat-card';

export interface EmptyStateProps {
  icon: LucideIcon;
  color: StatColor;
  title: string;
  description?: string;
  /** Optional action element (e.g. a button) */
  action?: React.ReactNode;
  className?: string;
}

/**
 * Unified empty state component.
 * Centered layout with colored icon container, title, description, and optional action.
 */
export function EmptyState({
  icon: Icon,
  color,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const colors = iconColorMap[color];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className,
      )}
    >
      <div
        className={cn(
          'w-20 h-20 rounded-3xl flex items-center justify-center mb-4',
          colors.bg,
        )}
      >
        <Icon className={cn('w-10 h-10', colors.text)} />
      </div>
      <h4 className="text-base font-bold text-slate-700 mb-1">{title}</h4>
      {description && (
        <p className="text-sm text-slate-400 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
