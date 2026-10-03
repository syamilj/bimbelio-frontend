import * as React from 'react';

import { cn } from '@/lib/utils';

/** Kelas bersama untuk semua kontrol isian (input, textarea, trigger select). */
export const fieldClassName =
  'bg-surface border-line-strong text-ink placeholder:text-ink-subtle w-full min-w-0 rounded-sm border text-base transition-colors outline-none sm:text-sm focus-visible:border-brand focus-visible:ring-brand/25 focus-visible:ring-3 disabled:bg-paper disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-danger aria-invalid:ring-danger/20 aria-invalid:ring-3';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        fieldClassName,
        'h-11 px-3.5 file:mr-3 file:h-full file:border-0 file:bg-transparent file:text-sm file:font-semibold',
        className,
      )}
      {...props}
    />
  );
}

export type InputProps = React.ComponentProps<'input'>;

export { Input };
