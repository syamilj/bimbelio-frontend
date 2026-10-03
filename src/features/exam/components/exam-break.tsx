'use client';

import { Lio } from '@/components/brand/lio';
import { MonoLabel } from '@/components/brand/mono-label';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Play } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { useFinishSession, useStartSession } from '../api';
import { useServerNow } from '../hooks/use-clock';
import { toSubmitAnswers } from '../model/answers';
import { readLocal } from '../model/storage';
import {
  CLAMP_TO_TRYOUT_END,
  formatClock,
  restDeadline,
  spokenClock,
} from '../model/timer';
import type { ExamTryout } from '../types';
import { SessionSteps } from './session-steps';

type Props = {
  tryout: ExamTryout;
  index: number;
  userId: string;
  offsetMs: number;
};

/**
 * Istirahat antar subtes: permukaan Tinta, hitung mundur Parkinsans raksasa,
 * Lio ngantuk. Saat waktu habis subtes berikutnya dimulai otomatis.
 */
export function ExamBreak({ tryout, index, userId, offsetMs }: Props) {
  const now = useServerNow(offsetMs);
  // Bila endSession sebelumnya tak tercatat, istirahat penuh dihitung dari saat dibuka.
  const deadline = useMemo(
    () => restDeadline(tryout, index, Date.now() + offsetMs),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sekali per jeda
    [tryout.id, index],
  );
  const remaining = Math.max(0, deadline - now);
  const next = tryout.TryoutSession[index];
  const start = useStartSession(tryout.id);
  const finishLate = useFinishSession(tryout.id);
  const autoStarted = useRef(false);

  const begin = () => {
    if (start.isPending) return;
    start.mutate({ sessionId: next.id, userId });
  };

  // Istirahat habis → mulai otomatis (sekali; bila gagal, tombol tetap ada).
  useEffect(() => {
    if (remaining > 0 || autoStarted.current) return;
    autoStarted.current = true;
    begin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  // Tryout tertentu ditutup di endDate: subtes tersisa diselesaikan otomatis.
  const closed = useRef(false);
  useEffect(() => {
    if (closed.current || !CLAMP_TO_TRYOUT_END.has(tryout.id)) return;
    if (now < new Date(tryout.endDate).getTime()) return;
    closed.current = true;
    const saved = readLocal(next.id)?.answers ?? [];
    finishLate.mutate({
      late: true,
      sessionId: next.id,
      userId,
      answer: toSubmitAnswers(
        saved.map((a, i) => ({
          number: a.number ?? i + 1,
          questionId: a.questionId ?? '',
          answerId: a.answerId ?? '',
          answer: a.answer ?? '',
          type: a.type ?? 'OBJECTIVE_5',
          notSure: !!a.notSure,
        })),
      ),
    });
  }, [now, tryout, next.id, userId, finishLate]);

  const restTotal = tryout.restTime * 60_000;
  const progress = restTotal ? 1 - remaining / restTotal : 1;

  return (
    <main
      id="konten"
      data-surface="ink"
      className="flex min-h-dvh flex-col"
    >
      <div className="mx-auto grid w-full max-w-5xl flex-1 gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_20rem] lg:items-center lg:py-16">
        <section
          aria-labelledby="istirahat"
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-3">
            <Lio
              expression="ngantuk"
              props={['zzz']}
              tone="white"
              size="s"
            />
            <MonoLabel>
              istirahat · subtes {index}/{tryout.TryoutSession.length} selesai
            </MonoLabel>
          </div>
          <h1
            id="istirahat"
            className="font-display text-3xl font-bold tracking-display text-balance sm:text-4xl"
          >
            Tarik napas dulu. Minum, regangkan badan, istirahatkan mata.
          </h1>
          <div className="flex flex-col gap-1">
            <p
              role="timer"
              aria-label={`Sisa istirahat ${spokenClock(remaining)}`}
              className="font-display text-[clamp(4rem,14vw,9rem)] leading-none font-extrabold tracking-score tabular-nums"
            >
              {formatClock(remaining)}
            </p>
            <div
              className="mt-3 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-on-dark-line"
              aria-hidden
            >
              <div
                className="h-full rounded-full bg-highlight transition-[width] duration-1000 ease-linear"
                style={{ width: `${Math.min(100, progress * 100)}%` }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              variant="accent"
              size="lg"
              onClick={begin}
              loading={start.isPending}
            >
              {!start.isPending && <Play aria-hidden />}
              Lanjut sekarang
            </Button>
            <p className="text-sm text-on-dark-muted">
              Atau tunggu, subtes berikutnya mulai otomatis.
            </p>
          </div>
        </section>

        <aside className="flex flex-col gap-5 rounded-md border border-on-dark-line p-5">
          <div className="flex flex-col gap-1">
            <MonoLabel>berikutnya</MonoLabel>
            <p className="font-display text-xl font-bold">
              {next.TryoutSubCategory?.name || next.name}
            </p>
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-on-dark-muted">
              <span className="inline-flex items-center gap-1.5">
                <Clock
                  className="size-4"
                  aria-hidden
                />
                {next.duration} menit
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BookOpen
                  className="size-4"
                  aria-hidden
                />
                {next.TryoutQuestion.length} soal
              </span>
            </p>
          </div>
          <SessionSteps
            sessions={tryout.TryoutSession}
            active={index}
          />
        </aside>
      </div>
    </main>
  );
}
