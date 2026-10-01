'use client';

import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/lib/utils';

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn('grid gap-2', className)}
      {...props}
    />
  );
}

/** Radio = bubble lembar jawaban: lingkaran yang terisi penuh saat dipilih. */
function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        'relative size-5 shrink-0 rounded-full border-[1.5px] border-line-strong bg-surface transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger data-[state=checked]:border-brand-strong',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="absolute inset-[3px] animate-in rounded-full bg-brand-strong duration-150 zoom-in-50" />
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
