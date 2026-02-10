'use client';

import { cn } from '@/lib/utils';
import { ContentCard } from './content-card';

export interface HeroSummaryCardProps {
  /** Page/section title */
  title: React.ReactNode;
  /** Subtitle text */
  subtitle?: string;
  /** Badge element rendered above the title */
  badge?: React.ReactNode;
  /** Stats row rendered below the title (e.g. StatCardGrid) */
  stats?: React.ReactNode;
  /** Trailing element on the right side (e.g. rank card, chart) */
  trailing?: React.ReactNode;
  /** Show gradient accent bar at top. Default: true */
  accentBar?: boolean;
  className?: string;
  /** Override title classes (default: text-slate-800) */
  titleClassName?: string;
  /** Inline style for title */
  titleStyle?: React.CSSProperties;
  /** Additional body content below stats */
  children?: React.ReactNode;
}

/**
 * Summary header card used at the top of pages.
 * Extracted from BimArena Try-Out summary pattern.
 *
 * Structure: accent bar → badge row → title → stats → children
 */
export function HeroSummaryCard({
  title,
  subtitle,
  badge,
  stats,
  trailing,
  accentBar = true,
  className,
  titleClassName,
  titleStyle,
  children,
}: HeroSummaryCardProps) {
  return (
    <ContentCard
      accentBar={accentBar}
      borderVariant="subtle"
      padding="none"
      className={className}
    >
      <div className="relative z-10 p-5 md:p-6 pt-4">
        {/* Badge row */}
        {badge && <div className="mb-2">{badge}</div>}

        {/* Title + Trailing layout */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className={cn('text-xl md:text-2xl font-black', titleClassName || 'text-slate-800')} style={titleStyle}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-slate-400 font-medium mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {trailing && <div className="flex-shrink-0">{trailing}</div>}
        </div>

        {/* Stats row */}
        {stats && <div className="mt-4">{stats}</div>}

        {/* Additional content */}
        {children}
      </div>
    </ContentCard>
  );
}
