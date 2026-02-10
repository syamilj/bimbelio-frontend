'use client';

import { cn } from '@/lib/utils';

export interface CardGridProps {
  children: React.ReactNode;
  /** Grid columns per breakpoint. Default: { md: 2, lg: 3 } */
  cols?: { sm?: number; md?: number; lg?: number; xl?: number };
  /** Enable horizontal scroll on mobile. Default: true */
  scrollOnMobile?: boolean;
  className?: string;
}

const colClasses: Record<string, Record<number, string>> = {
  sm: { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-4' },
  md: { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' },
  lg: { 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' },
  xl: { 1: 'xl:grid-cols-1', 2: 'xl:grid-cols-2', 3: 'xl:grid-cols-3', 4: 'xl:grid-cols-4' },
};

function getColClasses(cols: CardGridProps['cols']) {
  if (!cols) return 'md:grid-cols-2 lg:grid-cols-3';

  const classes: string[] = [];
  for (const [bp, count] of Object.entries(cols)) {
    const bpClasses = colClasses[bp];
    if (bpClasses && count in bpClasses) {
      classes.push(bpClasses[count]);
    }
  }
  return classes.join(' ');
}

/**
 * Responsive card grid.
 * Mobile: horizontal scroll with snap (scrollOnMobile=true).
 * Desktop: CSS grid with specified columns.
 *
 * Children should include `min-w-[85%] sm:min-w-[350px] md:min-w-0 snap-center`
 * classes when scrollOnMobile is true for proper mobile behavior.
 */
export function CardGrid({
  children,
  cols,
  scrollOnMobile = true,
  className,
}: CardGridProps) {
  if (!scrollOnMobile) {
    return (
      <div
        className={cn(
          'grid gap-4 md:gap-5',
          getColClasses(cols),
          className,
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        // Mobile: horizontal scroll
        'flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory',
        // Desktop: grid
        'md:grid md:overflow-visible md:pb-0 md:mx-0 md:px-0 md:gap-5',
        getColClasses(cols),
        className,
      )}
      style={
        { scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
