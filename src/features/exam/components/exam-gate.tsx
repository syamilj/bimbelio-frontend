'use client';

import { Lio, type LioExpression } from '@/components/brand/lio';
import { MonoLabel } from '@/components/brand/mono-label';
import { formatDuration, useCountdown } from '@/components/patterns/countdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Props = {
  title: string;
  description: React.ReactNode;
  lio?: LioExpression;
  label?: string;
  backHref: string;
  /** Hitung mundur menuju waktu ini (mis. jadwal mulai). */
  countdownTo?: Date;
  action?: React.ReactNode;
};

const dateTime = (d: Date) =>
  d.toLocaleString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

/** Layar status satu pesan + satu jalan keluar (belum dibuka, terkunci, dst.). */
export function ExamGate({
  title,
  description,
  lio = 'netral',
  label,
  backHref,
  countdownTo,
  action,
}: Props) {
  const remaining = useCountdown(countdownTo ?? null);
  return (
    <main
      id="konten"
      className="flex min-h-dvh items-center justify-center px-4 py-10"
    >
      <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-md border border-line bg-surface p-8 text-center">
        <Lio
          expression={lio}
          size="m"
        />
        <div className="flex flex-col gap-2">
          {label && <MonoLabel>{label}</MonoLabel>}
          <h1 className="font-display text-2xl font-bold tracking-display text-balance">
            {title}
          </h1>
          <div className="text-sm text-ink-muted">{description}</div>
        </div>
        {countdownTo && (
          <div className="flex flex-col gap-1">
            {remaining !== null && remaining > 0 && (
              <p
                role="timer"
                className="font-mono text-2xl font-medium tabular-nums"
              >
                {remaining >= 86_400_000
                  ? `${Math.floor(remaining / 86_400_000)} hari ${formatDuration(remaining % 86_400_000)}`
                  : formatDuration(remaining)}
              </p>
            )}
            <p className="text-xs text-ink-muted">{dateTime(countdownTo)}</p>
          </div>
        )}
        <div className="flex flex-col items-center gap-2">
          {action}
          <Button
            variant="ghost"
            asChild
          >
            <Link href={backHref}>
              <ArrowLeft aria-hidden />
              Kembali
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
