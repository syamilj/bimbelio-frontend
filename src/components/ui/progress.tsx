'use client';

import { Progress as ProgressPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/lib/utils';

function Progress({
  className,
  classNameThumb,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  classNameThumb?: string;
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-line',
        className,
      )}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          'h-full w-full flex-1 bg-brand transition-transform',
          classNameThumb,
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
