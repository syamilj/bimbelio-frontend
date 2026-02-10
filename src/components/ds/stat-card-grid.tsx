'use client';

import { cn } from '@/lib/utils';

export interface StatCardGridProps {
  children: React.ReactNode;
  /** Number of grid columns on desktop. Default: 4 */
  cols?: number;
  className?: string;
}

const colsMap: Record<number, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
};

/**
 * Container for StatCards.
 * Mobile: horizontal scroll with snap.
 * Desktop: CSS grid with specified columns.
 */
export function StatCardGrid({
  children,
  cols = 4,
  className,
}: StatCardGridProps) {
  return (
    <div
      className={cn(
        // Mobile: horizontal scroll
        'flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory -mx-4 px-4',
        // Desktop: grid
        'md:grid md:overflow-visible md:pb-0 md:mx-0 md:px-0 md:gap-4',
        colsMap[cols] || 'md:grid-cols-4',
        className,
      )}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

/**
 * Wrapper for individual items inside StatCardGrid to handle mobile sizing.
 * Use this to wrap each StatCard for proper mobile scroll behavior.
 */
export function StatCardGridItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex-shrink-0 w-40 snap-start md:w-auto',
        className,
      )}
    >
      {children}
    </div>
  );
}
