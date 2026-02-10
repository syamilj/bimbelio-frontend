'use client';

import { cn } from '@/lib/utils';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';

export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button style variant. Default: 'primary' */
  variant?: 'primary' | 'outline' | 'ghost';
  /** Button size. Default: 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Render as child element (for wrapping Link, etc.) */
  asChild?: boolean;
}

const sizeClasses = {
  sm: 'h-9 text-xs px-4',
  md: 'h-12 text-sm px-6',
  lg: 'h-14 text-base px-8',
} as const;

/**
 * Primary CTA button with tenant gradient.
 * Supports primary (gradient bg), outline (tenant border), and ghost (tenant text) variants.
 */
export const GradientButton = forwardRef<
  HTMLButtonElement,
  GradientButtonProps
>(function GradientButton(
  {
    variant = 'primary',
    size = 'md',
    asChild = false,
    className,
    style,
    disabled,
    ...props
  },
  ref,
) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const Comp = asChild ? Slot : 'button';

  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 font-semibold rounded-3xl transition-all duration-300',
    'disabled:opacity-50 disabled:pointer-events-none',
    sizeClasses[size],
  );

  const variantStyles: React.CSSProperties = (() => {
    switch (variant) {
      case 'primary':
        return {
          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          color: 'white',
          ...style,
        };
      case 'outline':
        return {
          borderWidth: '2px',
          borderColor: mainColor,
          color: mainColor,
          ...style,
        };
      case 'ghost':
        return {
          color: mainColor,
          ...style,
        };
      default:
        return { ...style };
    }
  })();

  const variantClasses = cn(
    variant === 'primary' && 'shadow-md hover:shadow-lg hover:scale-105',
    variant === 'outline' && 'bg-white hover:bg-slate-50',
    variant === 'ghost' && 'hover:bg-slate-50',
  );

  return (
    <Comp
      ref={ref}
      className={cn(baseClasses, variantClasses, className)}
      style={variantStyles}
      disabled={disabled}
      {...props}
    />
  );
});
