import { cva, type VariantProps } from 'class-variance-authority';
import { Check, X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Bubble lembar jawaban — elemen khas sistem desain Bimbelio.
 * Dipakai hanya untuk hal yang memang "diisi": opsi jawaban, navigator soal,
 * progres modul. Jangan dipakai sebagai dekorasi.
 */
export const bubbleVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-full border-[1.5px] leading-none font-bold tabular-nums transition-[background-color,border-color,color,transform] duration-150 select-none',
  {
    variants: {
      state: {
        empty: 'border-line-strong bg-surface text-ink-muted',
        filled: 'border-brand-strong bg-brand-strong text-brand-ink',
        flagged: 'border-marker bg-marker text-ink',
        correct: 'border-success bg-success text-white',
        wrong: 'border-danger bg-danger text-white',
        missed: 'border-dashed border-success bg-success-soft text-success',
        disabled: 'border-line bg-paper text-ink-subtle',
      },
      size: {
        xs: 'size-5 text-xs',
        sm: 'size-7 text-xs',
        md: 'size-9 text-sm',
        lg: 'size-11 text-base',
      },
      current: {
        true: 'ring-2 ring-brand ring-offset-2 ring-offset-surface',
        false: '',
      },
    },
    defaultVariants: {
      state: 'empty',
      size: 'md',
      current: false,
    },
  },
);

export type BubbleState = NonNullable<
  VariantProps<typeof bubbleVariants>['state']
>;

type AnswerBubbleProps = Omit<React.ComponentProps<'span'>, 'children'> &
  VariantProps<typeof bubbleVariants> & {
    /** Huruf (A–E) atau nomor soal di dalam bubble. */
    label?: React.ReactNode;
  };

export function AnswerBubble({
  className,
  state,
  size,
  current,
  label,
  ...props
}: AnswerBubbleProps) {
  const icon =
    label === undefined && state === 'correct' ? (
      <Check
        className="size-[55%]"
        strokeWidth={3}
      />
    ) : label === undefined && state === 'wrong' ? (
      <X
        className="size-[55%]"
        strokeWidth={3}
      />
    ) : null;

  return (
    <span
      data-slot="answer-bubble"
      data-state={state}
      className={cn(bubbleVariants({ state, size, current }), className)}
      {...props}
    >
      {label ?? icon}
    </span>
  );
}

/** Huruf opsi jawaban dari indeks: 0 → A, 1 → B, ... */
export const optionLetter = (index: number) => String.fromCharCode(65 + index);
