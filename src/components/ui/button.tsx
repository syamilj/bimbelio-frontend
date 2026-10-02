import { cva, type VariantProps } from 'class-variance-authority';
import { LoaderCircle } from 'lucide-react';
import { Slot } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-semibold whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-2 aria-invalid:ring-danger/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-brand-strong text-brand-ink hover:bg-brand-strong/90',
        marker: 'bg-marker text-ink hover:bg-marker/85',
        destructive: 'bg-danger text-white hover:bg-danger/90',
        outline: 'border border-line-strong bg-surface text-ink hover:bg-paper',
        secondary: 'bg-brand-soft text-brand-strong hover:bg-brand-muted',
        ghost: 'text-ink hover:bg-ink/5',
        link: 'h-auto! px-0! text-brand-strong underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 has-[>svg]:px-3.5',
        xs: "h-7 gap-1 rounded-sm px-2 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: 'h-8 gap-1.5 rounded-sm px-3',
        lg: 'h-12 px-6 text-base',
        icon: 'size-10',
        'icon-xs': "size-7 rounded-sm [&_svg:not([class*='size-'])]:size-3.5",
        'icon-sm': 'size-8 rounded-sm',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    /** Tampilkan spinner dan nonaktifkan tombol selama aksi berjalan. */
    loading?: boolean;
  };

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading && (
            <LoaderCircle
              className="animate-spin"
              aria-hidden
            />
          )}
          {children}
        </>
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
