'use client';

import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';

export interface TrendBadgeProps {
  /** Trend value (positive = up, negative = down) */
  value: number;
  /** Optional descriptive label (e.g. "dari sebelumnya") */
  label?: string;
  className?: string;
}

/**
 * Trend indicator badge.
 * Auto-selects emerald (positive) or red (negative) with appropriate icon.
 */
export function TrendBadge({ value, label, className }: TrendBadgeProps) {
  const isPositive = value > 0;

  return (
    <div
      className={cn(
        'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold',
        isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500',
        className,
      )}
    >
      {isPositive ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      <span>
        {isPositive ? '+' : ''}
        {value}
      </span>
      {label && <span className="text-slate-400 font-medium">{label}</span>}
    </div>
  );
}
