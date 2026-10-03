import { AnswerBubble } from '@/components/patterns/answer-bubble';
import { cn } from '@/lib/utils';
import { sessionSteps } from '../model/machine';
import type { ExamSession } from '../types';

const STATUS_LABEL = {
  selesai: 'selesai',
  aktif: 'berikutnya',
  menunggu: 'menunggu',
} as const;

/** Progres subtes sebagai deret bubble: terisi = selesai, cincin = berikutnya. */
export function SessionSteps({
  sessions,
  active,
  className,
}: {
  sessions: ExamSession[];
  active: number;
  className?: string;
}) {
  const steps = sessionSteps(sessions, active);
  return (
    <ol className={cn('flex flex-col gap-2', className)}>
      {steps.map((step, i) => (
        <li
          key={step.id}
          className="flex items-center gap-3"
          aria-current={step.status === 'aktif' ? 'step' : undefined}
        >
          <AnswerBubble
            aria-hidden
            label={i + 1}
            size="sm"
            state={step.status === 'selesai' ? 'filled' : 'empty'}
            current={step.status === 'aktif'}
          />
          <span
            className={cn(
              'flex-1 text-sm',
              step.status === 'aktif' && 'font-semibold',
            )}
          >
            {step.name}
          </span>
          <span className="font-mono text-xs text-ink-muted in-data-[surface]:text-on-dark-muted">
            {STATUS_LABEL[step.status]}
          </span>
        </li>
      ))}
    </ol>
  );
}
