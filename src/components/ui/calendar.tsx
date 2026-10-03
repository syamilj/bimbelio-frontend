'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { id } from 'react-day-picker/locale';

import { cn } from '@/lib/utils';
import { buttonVariants } from './button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={id}
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'relative flex flex-col gap-4 sm:flex-row',
        month: 'flex flex-col gap-4',
        month_caption: 'flex h-8 items-center justify-center',
        caption_label: 'text-sm font-semibold',
        nav: 'absolute inset-x-0 top-0 flex items-center justify-between',
        button_previous: cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'size-8',
        ),
        button_next: cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'size-8',
        ),
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday: 'text-ink-muted w-9 text-xs font-medium',
        week: 'mt-1 flex w-full',
        day: 'relative size-9 p-0 text-center text-sm',
        day_button:
          'hover:bg-paper focus-visible:ring-brand size-9 rounded-md font-medium tabular-nums transition-colors focus-visible:ring-2 focus-visible:outline-none',
        selected:
          '[&>button]:bg-brand [&>button]:text-brand-ink [&>button]:hover:bg-brand-strong',
        range_start: 'bg-brand-soft rounded-l-md',
        range_middle:
          'bg-brand-soft [&>button]:bg-transparent! [&>button]:text-ink! rounded-none',
        range_end: 'bg-brand-soft rounded-r-md',
        today: '[&>button]:ring-line-strong [&>button]:ring-1',
        outside: 'text-ink-subtle',
        disabled: 'text-ink-subtle opacity-50',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: iconClassName }) =>
          orientation === 'left' ? (
            <ChevronLeft className={cn('size-4', iconClassName)} />
          ) : (
            <ChevronRight className={cn('size-4', iconClassName)} />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar };
