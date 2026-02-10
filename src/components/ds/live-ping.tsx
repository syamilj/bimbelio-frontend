'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { cn } from '@/lib/utils';

export interface LivePingProps {
  className?: string;
}

/**
 * Pulsing live indicator dot using tenant mainColor.
 */
export function LivePing({ className }: LivePingProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  return (
    <span className={cn('relative flex h-2 w-2', className)}>
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ backgroundColor: mainColor }}
      />
      <span
        className="relative inline-flex rounded-full h-2 w-2"
        style={{ backgroundColor: mainColor }}
      />
    </span>
  );
}
