'use client';

import { AnswerBubble, optionLetter } from '@/components/patterns/answer-bubble';
import { cn } from '@/lib/utils';
import type { ExamOption } from '../types';
import { RichContent } from './rich-content';

type Props = {
  name: string;
  options: ExamOption[];
  value: string;
  onSelect: (optionId: string) => void;
  /** id elemen judul soal (label grup). */
  labelledBy: string;
  disabled?: boolean;
};

/**
 * Opsi jawaban = radiogroup bubble A–E. Radio asli (sr-only) memberi semantik
 * & panah atas/bawah dari browser; bubble hanya tampilan. Klik/Spasi pada opsi
 * yang sudah terpilih membatalkan pilihan (perilaku lama).
 * Pintasan huruf A–E dipasang di ruang ujian (lihat `useExamShortcuts`).
 */
export function OptionGroup({
  name,
  options,
  value,
  onSelect,
  labelledBy,
  disabled,
}: Props) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      className="flex flex-col gap-2.5"
    >
      {options.map((option, i) => {
        const checked = value === option.id;
        const letter = optionLetter(i);
        const id = `${name}-${option.id}`;
        return (
          <label
            key={option.id}
            htmlFor={id}
            className={cn(
              'group flex cursor-pointer items-start gap-3 rounded-md border bg-surface p-3 transition-colors sm:p-4',
              'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand has-[:focus-visible]:ring-offset-2',
              checked
                ? 'border-brand bg-brand-soft'
                : 'border-line hover:border-line-strong hover:bg-paper',
              disabled && 'cursor-not-allowed opacity-60',
            )}
          >
            <input
              id={id}
              type="radio"
              name={name}
              value={option.id}
              checked={checked}
              disabled={disabled}
              className="sr-only"
              aria-keyshortcuts={letter}
              onChange={() => onSelect(option.id)}
              onClick={() => {
                if (checked) onSelect(option.id);
              }}
            />
            <AnswerBubble
              aria-hidden
              label={letter}
              state={checked ? 'filled' : 'empty'}
              size="md"
              className="mt-0.5"
            />
            <span className="sr-only">{`Opsi ${letter}: `}</span>
            <RichContent
              html={option.answer}
              className="flex-1 pt-1.5 text-base leading-relaxed"
              fallback="(opsi kosong)"
            />
          </label>
        );
      })}
    </div>
  );
}
