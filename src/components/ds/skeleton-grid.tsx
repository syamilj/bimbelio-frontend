'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { CardGrid, type CardGridProps } from './card-grid';
import { cn } from '@/lib/utils';

export interface SkeletonGridProps {
  /** Number of skeleton items. Default: 6 */
  count?: number;
  /** Height class for each skeleton card. Default: "h-[420px]" */
  cardHeight?: string;
  /** Grid columns (passed to CardGrid) */
  cols?: CardGridProps['cols'];
  /** Enable horizontal scroll on mobile. Default: true */
  scrollOnMobile?: boolean;
}

/**
 * Standardized skeleton loading state for card grids.
 * Uses CardGrid for consistent responsive behavior.
 */
export function SkeletonGrid({
  count = 6,
  cardHeight = 'h-[420px]',
  cols,
  scrollOnMobile = true,
}: SkeletonGridProps) {
  return (
    <CardGrid cols={cols} scrollOnMobile={scrollOnMobile}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            cardHeight,
            'rounded-3xl',
            // Mobile scroll sizing (when scrollOnMobile=true)
            scrollOnMobile &&
              'min-w-[85%] sm:min-w-[350px] md:min-w-0 snap-center flex-shrink-0',
          )}
        />
      ))}
    </CardGrid>
  );
}
