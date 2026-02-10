'use client';

import { cn } from '@/lib/utils';

export interface PageShellProps {
  children: React.ReactNode;
  /** Background class. Default: "bg-slate-50/50" */
  bgClassName?: string;
  /** Max width constraint. Default: "max-w-7xl" */
  maxWidth?: string;
  /** Additional classes on the inner container */
  className?: string;
  /** Skip inner horizontal padding (px-4 md:px-6) */
  noPadding?: boolean;
}

/**
 * Consistent page wrapper for all user pages.
 * Provides: min-h-screen + bg + pb-12 outer, max-w-7xl + mx-auto + padding inner.
 */
export function PageShell({
  children,
  bgClassName = 'bg-slate-50/50',
  maxWidth = 'max-w-7xl',
  className,
  noPadding = false,
}: PageShellProps) {
  return (
    <div className={cn('min-h-screen pb-12', bgClassName)}>
      <div
        className={cn(
          maxWidth,
          'mx-auto',
          !noPadding && 'px-4 md:px-6',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
