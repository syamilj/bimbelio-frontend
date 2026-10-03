import { cva, type VariantProps } from 'class-variance-authority';
import { LoaderCircle } from 'lucide-react';
import { Slot } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-2 aria-invalid:ring-danger/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-brand text-brand-ink hover:bg-brand-strong',
        /** Lime + teks Tinta. Hanya di permukaan Biru/Tinta (`data-surface`). */
        accent: 'bg-highlight text-highlight-ink hover:bg-highlight/85',
        destructive: 'bg-danger text-white hover:bg-danger/90',
        outline:
          'border-[1.5px] border-ink/80 bg-transparent text-ink hover:bg-ink/5',
        /** Garis putih untuk permukaan Biru/Tinta. */
        'outline-light':
          'border-[1.5px] border-white/80 bg-transparent text-white hover:bg-white/10',
        secondary: 'bg-brand-soft text-brand-strong hover:bg-brand-muted/60',
        ghost: 'text-ink hover:bg-ink/5',
        link: 'h-auto! px-0! text-brand-strong underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-5 has-[>svg]:px-4',
        xs: "h-7 gap-1 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: 'h-9 gap-1.5 px-3.5',
        lg: 'h-13 px-7 text-base',
        icon: 'size-11',
        'icon-xs': "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        'icon-sm': 'size-9',
        'icon-lg': 'size-13',
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
