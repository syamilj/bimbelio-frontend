'use client';

import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export type StatColor =
  | 'emerald'
  | 'blue'
  | 'amber'
  | 'purple'
  | 'red'
  | 'violet'
  | 'orange'
  | 'pink'
  | 'rose';

// Color mappings for each stat color
const colorMap: Record<
  StatColor,
  {
    bg: string;
    iconBg: string;
    iconText: string;
    text: string;
  }
> = {
  emerald: {
    bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
    iconBg: 'bg-emerald-500',
    iconText: 'text-white',
    text: 'text-emerald-600',
  },
  blue: {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    iconBg: 'bg-blue-500',
    iconText: 'text-white',
    text: 'text-blue-600',
  },
  amber: {
    bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
    iconBg: 'bg-amber-500',
    iconText: 'text-white',
    text: 'text-amber-600',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
    iconBg: 'bg-purple-500',
    iconText: 'text-white',
    text: 'text-purple-600',
  },
  red: {
    bg: 'bg-gradient-to-br from-red-50 to-red-100',
    iconBg: 'bg-red-500',
    iconText: 'text-white',
    text: 'text-red-600',
  },
  violet: {
    bg: 'bg-gradient-to-br from-violet-50 to-violet-100',
    iconBg: 'bg-violet-500',
    iconText: 'text-white',
    text: 'text-violet-600',
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
    iconBg: 'bg-orange-500',
    iconText: 'text-white',
    text: 'text-orange-600',
  },
  pink: {
    bg: 'bg-gradient-to-br from-pink-50 to-pink-100',
    iconBg: 'bg-pink-500',
    iconText: 'text-white',
    text: 'text-pink-600',
  },
  rose: {
    bg: 'bg-gradient-to-br from-rose-50 to-rose-100',
    iconBg: 'bg-rose-500',
    iconText: 'text-white',
    text: 'text-rose-600',
  },
};

/** Icon color map — reused by SectionHeader, EmptyState, etc. */
export const iconColorMap: Record<
  StatColor,
  { bg: string; text: string }
> = {
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  red: { bg: 'bg-red-100', text: 'text-red-600' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-600' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-600' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600' },
};

export interface StatCardProps {
  icon: LucideIcon;
  color: StatColor;
  value: string | number;
  label: React.ReactNode;
  /** Unit text displayed next to the value (e.g. "jam", "tryout") */
  unit?: string;
  /** Smaller subtitle text below label */
  subtitle?: string;
  trend?: { value: number; label?: string };
  className?: string;
}

/**
 * Colored stat card with icon, value, label, and optional trend indicator.
 * Extracted from BimArena Try-Out TryoutQuickStats pattern.
 */
export function StatCard({
  icon: Icon,
  color,
  value,
  label,
  unit,
  subtitle,
  trend,
  className,
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div
      className={cn(
        'rounded-3xl p-4 border border-white/50 shadow-sm',
        'hover:shadow-md transition-all group hover:scale-[1.03]',
        colors.bg,
        className,
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'w-10 h-10 rounded-3xl flex items-center justify-center mb-3',
          'shadow-sm group-hover:scale-110 transition-transform',
          colors.iconBg,
        )}
      >
        <Icon className={cn('w-5 h-5', colors.iconText)} />
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        <span className="text-2xl md:text-3xl font-black text-slate-800">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-semibold text-slate-500">{unit}</span>
        )}
      </div>

      {/* Label */}
      <div
        className={cn(
          'text-[10px] font-bold uppercase tracking-wide mt-1',
          colors.text,
        )}
      >
        {label}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs text-slate-500 font-medium mt-0.5">{subtitle}</p>
      )}

      {/* Trend */}
      {trend && (
        <div
          className={cn(
            'flex items-center gap-1 mt-2 text-[10px] font-bold',
            trend.value > 0 ? 'text-emerald-600' : 'text-red-500',
          )}
        >
          <span>
            {trend.value > 0 ? '+' : ''}
            {trend.value}
          </span>
          {trend.label && <span className="text-slate-400">{trend.label}</span>}
        </div>
      )}
    </div>
  );
}
