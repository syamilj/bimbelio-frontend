'use client';

import { Lio } from '@/components/brand/lio';
import { MonoLabel } from '@/components/brand/mono-label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Clock, Play, Save, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useStartSession } from '../api';
import type { ExamMode, ExamTryout } from '../types';
import { SessionSteps } from './session-steps';

type Props = {
  tryout: ExamTryout;
  userId: string;
  mode: ExamMode;
  exitHref: string;
};

/** Belum mulai: aturan, persetujuan, lalu mulai subtes pertama. */
export function ExamIntro({ tryout, userId, mode, exitHref }: Props) {
  const [agreed, setAgreed] = useState(false);
  const start = useStartSession(tryout.id);
  const sessions = tryout.TryoutSession;
  const first = sessions[0];
  const totalQuestions = sessions.reduce(
    (n, s) => n + s.TryoutQuestion.length,
    0,
  );
  const totalMinutes = sessions.reduce((n, s) => n + s.duration, 0);
  const noun = mode === 'quiz' ? 'quiz' : 'try out';

  const rules = [
    {
      icon: Clock,
      title: `Waktu tiap subtes terbatas`,
      body: `Subtes pertama ${first.duration} menit dan tidak bisa diperpanjang. Saat waktu habis, jawabanmu dikumpulkan otomatis.`,
    },
    {
      icon: ShieldCheck,
      title: 'Kerjakan sendiri',
      body: 'Jangan buka tab lain, minta bantuan, atau kerja sama. Hasil yang jujur bikin posisimu terbaca jujur juga.',
    },
    {
      icon: Save,
      title: 'Jawaban tersimpan otomatis',
      body: 'Tiap jawaban disimpan di perangkat dan server. Pastikan koneksi stabil supaya aman.',
    },
  ];

  return (
    <main
      id="konten"
      className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10"
    >
      <Link
        href={exitHref}
        className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-ink-muted hover:text-ink"
      >
        <ArrowLeft
          className="size-4"
          aria-hidden
        />
        Kembali
      </Link>

      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <MonoLabel>
            {noun} · {sessions.length} subtes
          </MonoLabel>
          <h1 className="font-display text-2xl font-bold tracking-display text-balance sm:text-3xl">
            {tryout.title}
          </h1>
          <p className="text-ink-muted">
            {totalQuestions} soal · {totalMinutes} menit pengerjaan
            {sessions.length > 1 && tryout.restTime > 0
              ? ` · istirahat ${tryout.restTime} menit antar subtes`
              : ''}
          </p>
        </div>
        <Lio
          expression="fokus"
          size="s"
          className="hidden sm:block"
        />
      </header>

      <section
        aria-labelledby="urutan-subtes"
        className="flex flex-col gap-3 rounded-md border border-line bg-surface p-5"
      >
        <h2
          id="urutan-subtes"
          className="font-display text-lg font-bold"
        >
          Urutan subtes
        </h2>
        <SessionSteps
          sessions={sessions}
          active={0}
        />
      </section>

      <section
        aria-labelledby="aturan"
        className="flex flex-col gap-4 rounded-md border border-line bg-surface p-5"
      >
        <h2
          id="aturan"
          className="font-display text-lg font-bold"
        >
          Sebelum mulai
        </h2>
        <ul className="flex flex-col gap-4">
          {rules.map((rule) => (
            <li
              key={rule.title}
              className="flex gap-3"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-strong">
                <rule.icon
                  className="size-4"
                  aria-hidden
                />
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="font-semibold">{rule.title}</p>
                <p className="text-sm text-ink-muted">{rule.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <label className="flex cursor-pointer items-start gap-3 rounded-sm border border-line p-3">
          <Checkbox
            checked={agreed}
            onCheckedChange={(v) => setAgreed(v === true)}
            className="mt-0.5"
          />
          <span className="text-sm">
            Aku sudah membaca aturannya dan siap mengerjakan {noun} ini dengan
            jujur.
          </span>
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-muted">
            Pintasan di ruang ujian: A–E pilih jawaban, N/P pindah soal, R
            tandai ragu.
          </p>
          <Button
            size="lg"
            disabled={!agreed}
            loading={start.isPending}
            onClick={() => start.mutate({ sessionId: first.id, userId })}
          >
            {!start.isPending && <Play aria-hidden />}
            Mulai subtes 1
          </Button>
        </div>
      </section>
    </main>
  );
}
