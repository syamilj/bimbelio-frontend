'use client';

import { cn } from '@/lib/utils';

export type StatusVariant =
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'premium';

export interface StatusBadgeProps {
  variant: StatusVariant;
  children: React.ReactNode;
  /** Enable pulse animation (e.g. for "active" status). Default: false */
  pulse?: boolean;
  /** Badge size. Default: 'md' */
  size?: 'sm' | 'md';
  className?: string;
}

const variantMap: Record<
  StatusVariant,
  string
> = {
  success: 'bg-green-50 text-green-700 border-green-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  warning: 'bg-orange-50 text-orange-700 border-orange-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  neutral: 'bg-slate-50 text-slate-600 border-slate-200',
  premium: 'bg-purple-50 text-purple-700 border-purple-200',
};

const sizeMap = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-0.5',
} as const;

/**
 * Unified status/tag badge component.
 * Replaces inconsistent badge patterns across all pages.
 */
export function StatusBadge({
  variant,
  children,
  pulse = false,
  size = 'md',
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-bold border',
        variantMap[variant],
        sizeMap[size],
        pulse && 'animate-pulse',
        className,
      )}
    >
      {children}
    </span>
  );
}
