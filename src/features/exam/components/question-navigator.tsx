'use client';

import { AnswerBubble } from '@/components/patterns/answer-bubble';
import { cn } from '@/lib/utils';
import { isAnswered, type AnswerSheet } from '../model/answers';

type Props = {
  sheet: AnswerSheet;
  current: number;
  onJump: (index: number) => void;
  className?: string;
};

export const entryState = (entry: AnswerSheet[number] | undefined) =>
  entry?.notSure ? 'flagged' : isAnswered(entry) ? 'filled' : 'empty';

const STATE_LABEL = {
  filled: 'terjawab',
  flagged: 'ragu-ragu',
  empty: 'belum dijawab',
} as const;

/**
 * Navigator soal = grid bubble LJK: kosong (belum), terisi (terjawab),
 * setengah (ragu), cincin (soal aktif).
 */
export function QuestionNavigator({ sheet, current, onJump, className }: Props) {
  return (
    <nav
      aria-label="Navigasi soal"
      className={cn('flex flex-col gap-4', className)}
    >
      <ol className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-5">
        {sheet.map((entry, i) => {
          const state = entryState(entry);
          const active = i === current;
          return (
            <li key={entry.questionId}>
              <button
                type="button"
                onClick={() => onJump(i)}
                aria-current={active ? 'step' : undefined}
                aria-label={`Soal ${i + 1}, ${STATE_LABEL[state]}${active ? ', sedang dibuka' : ''}`}
                className="rounded-full p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <AnswerBubble
                  label={i + 1}
                  state={state}
                  current={active}
                  size="md"
                />
              </button>
            </li>
          );
        })}
      </ol>
      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-muted">
        <li className="flex items-center gap-1.5">
          <AnswerBubble
            aria-hidden
            state="filled"
            size="xs"
          />
          Terjawab
        </li>
        <li className="flex items-center gap-1.5">
          <AnswerBubble
            aria-hidden
            state="flagged"
            size="xs"
          />
          Ragu-ragu
        </li>
        <li className="flex items-center gap-1.5">
          <AnswerBubble
            aria-hidden
            state="empty"
            size="xs"
          />
          Belum
        </li>
      </ul>
    </nav>
  );
}
