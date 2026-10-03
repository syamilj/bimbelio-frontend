'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

/** Sisa milidetik menuju `target`, diperbarui tiap detik. Tidak pernah negatif. */
export function useCountdown(
  target: Date | string | number | null | undefined,
) {
  const targetMs = target == null ? null : new Date(target).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (targetMs == null) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  if (targetMs == null || Number.isNaN(targetMs)) return null;
  return Math.max(0, targetMs - now);
}

/** 3725000 → "01:02:05"; di bawah satu jam → "02:05". */
export function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

type CountdownProps = {
  target: Date | string | number;
  /** Di bawah ambang ini (ms) angka berubah merah sebagai peringatan. */
  warnBelowMs?: number;
  className?: string;
};

export function Countdown({
  target,
  warnBelowMs = 5 * 60_000,
  className,
}: CountdownProps) {
  const remaining = useCountdown(target);
  if (remaining == null) return null;
  return (
    <time
      aria-label={`Sisa waktu ${formatDuration(remaining)}`}
      className={cn(
        'font-mono font-medium tabular-nums',
        remaining <= warnBelowMs && 'text-danger',
        className,
      )}
    >
      {formatDuration(remaining)}
    </time>
  );
}
