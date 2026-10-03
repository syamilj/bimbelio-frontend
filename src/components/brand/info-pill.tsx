import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

/** Pil info: jadwal, kategori, skor kecil. Isi solid atau garis (hlm. 58). */
export const infoPillVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full font-semibold whitespace-nowrap tabular-nums [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        solid: 'bg-brand text-brand-ink',
        outline: 'border-[2px] border-brand text-brand-strong',
        ink: 'bg-ink text-white',
        soft: 'bg-brand-soft text-brand-strong',
        light: 'bg-white text-ink',
      },
      size: {
        sm: 'h-7 px-3 text-xs',
        md: 'h-9 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: { variant: 'solid', size: 'md' },
  },
);

export function InfoPill({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof infoPillVariants>) {
  return (
    <span
      data-slot="info-pill"
      className={cn(infoPillVariants({ variant, size }), className)}
      {...props}
    />
  );
}
