'use client';

import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { iconColorMap, type StatColor } from './stat-card';

export interface SectionHeaderProps {
  icon: LucideIcon;
  iconColor: StatColor;
  title: string;
  subtitle?: string;
  /** Trailing element (badges, "See all" link, count). Rendered with ml-auto. */
  trailing?: React.ReactNode;
  /** Size variant. 'sm' = compact (default from tryout), 'lg' = explore-style bigger header */
  size?: 'sm' | 'lg';
  className?: string;
}

/**
 * Consistent section header with colored icon, title, subtitle, and optional trailing element.
 * Extracted from BimArena Try-Out section header pattern.
 */
export function SectionHeader({
  icon: Icon,
  iconColor,
  title,
  subtitle,
  trailing,
  size = 'sm',
  className,
}: SectionHeaderProps) {
  const colors = iconColorMap[iconColor];
  const isLg = size === 'lg';

  return (
    <div className={cn('flex items-center gap-2', !isLg && 'mb-4', isLg && 'gap-4', className)}>
      <div
        className={cn(
          'rounded-3xl flex items-center justify-center',
          isLg ? 'w-12 h-12 shadow-sm' : 'w-8 h-8',
          colors.bg,
        )}
      >
        <Icon className={cn(isLg ? 'w-6 h-6' : 'w-4 h-4', colors.text)} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h3 className={cn(
            'font-black text-slate-800',
            isLg ? 'text-2xl text-gray-900' : 'text-base',
          )}>{title}</h3>
          {trailing && <div className={cn(!isLg && 'ml-auto')}>{trailing}</div>}
        </div>
        {subtitle && (
          <p className={cn(
            'text-slate-400 font-medium',
            isLg ? 'text-sm text-gray-500 mt-1' : 'text-xs',
          )}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}
