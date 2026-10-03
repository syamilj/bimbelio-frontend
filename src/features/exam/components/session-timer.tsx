'use client';

import { cn } from '@/lib/utils';
import { AlarmClock, Clock } from 'lucide-react';
import { formatClock, spokenClock, timerLevel } from '../model/timer';

type Props = {
  remainingMs: number;
  totalMs: number;
  className?: string;
};

/**
 * Timer sesi DM Mono di bar atas Tinta. Tanpa animasi berdenyut dan tanpa
 * aksen (ruang ujian tenang); peringatan = pil terbalik + ikon alarm + teks
 * pembaca layar.
 */
export function SessionTimer({ remainingMs, totalMs, className }: Props) {
  const level = timerLevel(remainingMs, totalMs);
  const Icon = level === 'normal' ? Clock : AlarmClock;
  const minuteMark = Math.ceil(remainingMs / 60_000);
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-full px-3 py-1.5',
        level === 'kritis' && 'bg-white text-ink',
        level === 'peringatan' && 'ring-1 ring-on-dark-muted',
        className,
      )}
    >
      <Icon
        className="size-4"
        aria-hidden
      />
      <span
        role="timer"
        aria-label={`Sisa waktu ${spokenClock(remainingMs)}`}
        className="font-mono text-lg font-medium tabular-nums sm:text-xl"
      >
        {formatClock(remainingMs)}
      </span>
      {/* Diumumkan per menit di 5 menit terakhir, bukan tiap detik. */}
      <span
        className="sr-only"
        aria-live="polite"
      >
        {level === 'kritis' && minuteMark <= 5
          ? `Sisa waktu ${minuteMark} menit`
          : ''}
      </span>
    </div>
  );
}
