import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap [&_svg:not([class*='size-'])]:size-3",
  {
    variants: {
      variant: {
        default: 'bg-brand-soft text-brand-strong',
        secondary: 'bg-paper text-ink-muted',
        outline: 'border border-line-strong text-ink',
        success: 'bg-success-soft text-success',
        destructive: 'bg-danger-soft text-danger',
        /** Sorotan aksen di balik teks Tinta. */
        highlight: 'bg-highlight text-highlight-ink',
        ink: 'bg-ink text-white',
        /** Kode data: subtes, voucher, nomor. */
        mono: 'bg-paper font-mono font-medium tracking-normal text-ink-muted',
        solid: 'bg-brand text-brand-ink',
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
