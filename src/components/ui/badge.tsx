import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-semibold whitespace-nowrap [&_svg:not([class*='size-'])]:size-3",
  {
    variants: {
      variant: {
        default: 'bg-brand-soft text-brand-strong',
        secondary: 'bg-paper text-ink-muted',
        outline: 'border border-line-strong text-ink',
        success: 'bg-success-soft text-success',
        destructive: 'bg-danger-soft text-danger',
        marker: 'bg-marker-soft text-marker-ink',
        solid: 'bg-brand-strong text-brand-ink',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type BadgeProps = React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

/** @deprecated React 19 meneruskan ref sebagai prop; pakai `Badge`. */
const BadgeWithRef = Badge;

export { Badge, badgeVariants, BadgeWithRef };
