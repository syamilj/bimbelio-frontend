'use client';

import { cn } from '@/lib/utils';

interface BimBrandProps {
  /**
   * The brand name suffix after "Bim" (e.g., "Arena", "Board", "Course", "belio")
   */
  suffix: string;
  /**
   * Additional className for styling
   */
  className?: string;
  /**
   * Optional inline style
   */
  style?: React.CSSProperties;
}

/**
 * BimBrand Component
 *
 * Renders branded text like "BimArena", "BimBoard" with Playfair Display font
 * "Bimbelio" uses default Inter font
 *
 * @example
 * <BimBrand suffix="Arena" />      // BimArena - Playfair Display
 * <BimBrand suffix="Board" />      // BimBoard - Playfair Display
 * <BimBrand suffix="belio" />      // Bimbelio - Inter (default)
 */
export function BimBrand({ suffix, className, style }: BimBrandProps) {
  const isBimbelio = suffix.toLowerCase() === 'belio';

  return (
    <span
      className={cn(
        'font-semibold',
        !isBimbelio && 'font-playfair',
        className
      )}
      style={style}
    >
      Bim{suffix}
    </span>
  );
}

/**
 * Pre-configured branded components for convenience
 */
export function BimArena({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <BimBrand suffix="Arena" className={className} style={style} />;
}

export function BimBoard({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <BimBrand suffix="Board" className={className} style={style} />;
}

export function BimCourse({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <BimBrand suffix="Course" className={className} style={style} />;
}

export function BimLive({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <BimBrand suffix="Live" className={className} style={style} />;
}

export function BimBot({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <BimBrand suffix="Bot" className={className} style={style} />;
}

export function BimPrediction({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <BimBrand suffix="Prediction" className={className} style={style} />;
}

export function BimInsight({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <BimBrand suffix="Insight" className={className} style={style} />;
}

export function Bimbelio({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <BimBrand suffix="belio" className={className} style={style} />;
}

export default BimBrand;
