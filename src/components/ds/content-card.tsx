'use client';

import { cn } from '@/lib/utils';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';

export interface ContentCardProps {
  children: React.ReactNode;
  /** Show gradient accent bar at top using tenant colors */
  accentBar?: boolean;
  /** Enable hover effects (shadow-md, scale) */
  hoverable?: boolean;
  className?: string;
  /** 'default': border-2 border-gray-100, 'subtle': border border-slate-200/80 */
  borderVariant?: 'default' | 'subtle';
  /** Inner padding: none | sm (p-4) | md (p-5 md:p-6) | lg (p-6 lg:p-8). Default: 'md' */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-5 md:p-6',
  lg: 'p-6 lg:p-8',
} as const;

const borderMap = {
  default: 'border-2 border-gray-100',
  subtle: 'border border-slate-200/80',
} as const;

/**
 * Base card component matching BimArena Try-Out reference design.
 * Consistent rounded-3xl white card with optional accent bar and hover effects.
 */
export function ContentCard({
  children,
  accentBar = false,
  hoverable = false,
  className,
  borderVariant = 'subtle',
  padding = 'md',
  onClick,
}: ContentCardProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl bg-white shadow-sm',
        borderMap[borderVariant],
        hoverable &&
          'hover:shadow-md transition-all duration-300 hover:scale-[1.01] cursor-pointer',
        paddingMap[padding],
        className,
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {accentBar && (
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
          }}
        />
      )}
      {children}
    </div>
  );
}
