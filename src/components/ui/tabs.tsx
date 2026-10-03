'use client';

import { Tabs as TabsPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List> & {
  /** `segmented` (default) untuk pilihan ringkas, `line` untuk navigasi halaman. */
  variant?: 'segmented' | 'line';
};

function TabsList({
  className,
  variant = 'segmented',
  ...props
}: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        'group/tabs-list inline-flex items-center text-ink-muted',
        variant === 'segmented' && 'h-11 gap-1 rounded-full bg-ink/5 p-1',
        variant === 'line' &&
          'scrollbar-none w-full justify-start gap-5 overflow-x-auto border-b border-line',
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center gap-1.5 text-sm font-semibold whitespace-nowrap transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4",
        'group-data-[variant=segmented]/tabs-list:h-full group-data-[variant=segmented]/tabs-list:rounded-full group-data-[variant=segmented]/tabs-list:px-4 group-data-[variant=segmented]/tabs-list:data-[state=active]:bg-ink group-data-[variant=segmented]/tabs-list:data-[state=active]:text-white',
        '-mb-px border-b-2 border-transparent group-data-[variant=line]/tabs-list:pb-3 group-data-[variant=segmented]/tabs-list:border-b-0 group-data-[variant=line]/tabs-list:data-[state=active]:border-brand',
        'data-[state=active]:text-ink',
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('mt-4 focus-visible:outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
