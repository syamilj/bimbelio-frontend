'use client';

import { cn } from '@/lib/utils';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import type { LucideIcon } from 'lucide-react';

export interface GradientCTACardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Button text. If omitted, no button is rendered. */
  buttonText?: string;
  /** Button click handler. Required when buttonText is provided. */
  onAction?: () => void;
  /** 'main' uses tenant colors, 'premium' uses amber/orange gradient. Default: 'main' */
  variant?: 'main' | 'premium';
  className?: string;
  /** Additional content below the main row */
  children?: React.ReactNode;
}

/**
 * Upsell/upgrade banner card with gradient background.
 * Uses tenant colors for 'main' variant, amber/orange for 'premium' variant.
 */
export function GradientCTACard({
  icon: Icon,
  title,
  description,
  buttonText,
  onAction,
  variant = 'main',
  className,
  children,
}: GradientCTACardProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const isPremium = variant === 'premium';

  const bgStyle: React.CSSProperties = isPremium
    ? {
        background:
          'linear-gradient(135deg, #f59e0b, #f97316, #ef4444)',
      }
    : {
        background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
      };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl p-6 lg:p-8',
        className,
      )}
      style={bgStyle}
    >
      {/* Decorative large icon */}
      <div className="absolute -right-4 -bottom-4 opacity-10">
        <Icon className="w-32 h-32" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
        {/* Icon */}
        <div className="w-14 h-14 rounded-3xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-7 h-7 text-white" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-black text-white">{title}</h3>
          <p className="text-sm text-white/80 mt-1">{description}</p>
        </div>

        {/* CTA Button */}
        {buttonText && (
          <button
            onClick={onAction}
            className={cn(
              'w-full md:w-auto bg-white/20 hover:bg-white/30',
              'border border-white/30 text-white font-semibold',
              'px-4 md:px-6 py-2 md:py-3 rounded-3xl',
              'transition-all duration-200 hover:scale-105',
              'flex-shrink-0',
            )}
          >
            {buttonText}
          </button>
        )}
      </div>

      {children && <div className="relative z-10 mt-4">{children}</div>}
    </div>
  );
}
