'use client';

import { AnswerBubble } from '@/components/patterns/answer-bubble';
import { useConfirm } from '@/components/patterns/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  CloudCheck,
  CloudOff,
  Grid3x3,
  HardDrive,
  LoaderCircle,
  LogOut,
  RotateCw,
  Send,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useFinishSession } from '../api';
import { useServerNow } from '../hooks/use-clock';
import { useAnswerSheet } from '../hooks/use-answer-sheet';
import { useExamShortcuts } from '../hooks/use-exam-shortcuts';
import { useLeaveGuard } from '../hooks/use-leave-guard';
import { QUESTION_TYPE_LABEL, sheetStats, toSubmitAnswers } from '../model/answers';
import type { AutosaveStatus } from '../model/autosave';
import { clearLocal } from '../model/storage';
import { sessionDeadline } from '../model/timer';
import type { ExamMode, ExamTryout } from '../types';
import { OptionGroup } from './option-group';
import { QuestionNavigator } from './question-navigator';
import { RichContent } from './rich-content';
import { SessionTimer } from './session-timer';
import { SubmitDialog } from './submit-dialog';

type Props = {
  tryout: ExamTryout;
  index: number;
  userId: string;
  mode: ExamMode;
  offsetMs: number;
  exitHref: string;
  /** Sesi sudah selesai di server (409 autosave) → tarik ulang data. */
  onStale: () => void;
};

const SAVE_LABEL: Record<AutosaveStatus, string> = {
  idle: 'Jawaban tersimpan otomatis',
  pending: 'Menyimpan…',
  saving: 'Menyimpan…',
  saved: 'Tersimpan',
  local: 'Tersimpan di perangkat',
  offline: 'Offline · tersimpan di perangkat',
};

function SaveStatus({ status }: { status: AutosaveStatus }) {
  const Icon =
    status === 'saving' || status === 'pending'
      ? LoaderCircle
      : status === 'offline'
        ? CloudOff
        : status === 'local'
          ? HardDrive
          : CloudCheck;
  return (
    <p
      className="flex items-center gap-1.5 text-xs text-on-dark-muted"
      aria-live="polite"
    >
      <Icon
        className={cn('size-3.5', status === 'saving' && 'animate-spin')}
        aria-hidden
      />
      <span>{SAVE_LABEL[status]}</span>
    </p>
  );
}

/**
 * Ruang ujian: bar atas Tinta (subtes mono, timer DM Mono, tombol kumpulkan),
 * soal di kartu putih lebar baca, navigator bubble. Tanpa Lio/coretan/aksen.
 */
export function ExamRoom({
  tryout,
  index,
  userId,
  mode,
  offsetMs,
  exitHref,
  onStale,
}: Props) {
  const router = useRouter();
  const confirm = useConfirm();
  const session = tryout.TryoutSession[index];
  const questions = session.TryoutQuestion;
  const total = tryout.TryoutSession.length;
  const isLast = index === total - 1;
  const headingId = useId();

  const { sheet, dispatch, status, flush, stop, resume } = useAnswerSheet({
    sessionId: session.id,
    questions,
    onConflict: onStale,
  });
  const stats = useMemo(() => sheetStats(sheet), [sheet]);

  const [current, setCurrent] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const finish = useFinishSession(tryout.id);
  const [lateFailed, setLateFailed] = useState(false);
  const lateSent = useRef(false);

  const question = questions[current];
  const entry = sheet[current];

  const deadline = sessionDeadline(session, tryout);
  const now = useServerNow(offsetMs);
  const remaining = deadline === null ? 0 : Math.max(0, deadline - now);
  const totalMs = session.duration * 60_000;

  useLeaveGuard(!finish.isSuccess);

  const go = useCallback(
    (i: number) => {
      setCurrent(Math.max(0, Math.min(questions.length - 1, i)));
    },
    [questions.length],
  );

  // Fokus ke judul soal saat pindah soal (pembaca layar & keyboard).
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: false });
  }, [current]);

  const submit = useCallback(
    async (late: boolean) => {
      // Kirim draft terakhir dulu, lalu hentikan autosave agar tidak balapan.
      await flush().catch(() => undefined);
      stop();
      try {
        return await finish.mutateAsync({
          sessionId: session.id,
          userId,
          answer: toSubmitAnswers(sheet),
          late,
        });
      } catch (error) {
        resume();
        throw error;
      }
    },
    [finish, flush, stop, resume, session.id, userId, sheet],
  );

  const onSubmit = async () => {
    try {
      await submit(false);
      clearLocal(session.id);
      setSubmitOpen(false);
    } catch (error) {
      toast.error(
        (error as Error)?.message || 'Gagal mengumpulkan. Coba lagi, ya.',
      );
    }
  };

  // Waktu habis → kumpulkan otomatis sekali (finishSessionLate).
  const sendLate = useCallback(async () => {
    if (lateSent.current) return;
    lateSent.current = true;
    setLateFailed(false);
    try {
      await submit(true);
      clearLocal(session.id);
    } catch {
      lateSent.current = false;
      setLateFailed(true);
      toast.warning('Waktu habis, tapi jawaban gagal terkirim', {
        description: 'Jawabanmu masih aman di perangkat. Tekan "Kirim ulang".',
      });
    }
  }, [submit, session.id]);

  useEffect(() => {
    if (deadline !== null && remaining <= 0 && !lateSent.current && !lateFailed) {
      void sendLate();
    }
  }, [deadline, remaining, sendLate, lateFailed]);

  useExamShortcuts(
    {
      onOption: (i) => {
        const option = question?.TryoutAnswers[i];
        if (!option || question.type === 'SHORT_ANSWER') return;
        if (entry?.answerId !== option.id) {
          dispatch({ type: 'pilih', index: current, answerId: option.id });
        }
      },
      onNext: () => go(current + 1),
      onPrev: () => go(current - 1),
      onToggleFlag: () => dispatch({ type: 'ragu', index: current }),
    },
    !finish.isPending && !finish.isSuccess,
  );

  const onExit = async () => {
    const ok = await confirm({
      title: 'Keluar dari ruang ujian?',
      description:
        'Jawabanmu sudah tersimpan. Waktu tetap berjalan kalau kamu keluar.',
      confirmLabel: 'Keluar',
      cancelLabel: 'Lanjut mengerjakan',
    });
    if (!ok) return;
    await flush().catch(() => undefined);
    router.push(exitHref);
  };

  const timeUp = deadline !== null && remaining <= 0;
  const subtestName = session.TryoutSubCategory?.name || session.name;

  const navigator = (
    <QuestionNavigator
      sheet={sheet}
      current={current}
      onJump={(i) => {
        go(i);
        setNavOpen(false);
      }}
    />
  );

  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <header
        data-surface="ink"
        className="sticky top-0 z-40"
      >
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2.5 sm:gap-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-on-dark hover:bg-white/10"
            aria-label="Keluar dari ruang ujian"
            onClick={onExit}
          >
            <LogOut aria-hidden />
          </Button>
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="truncate font-mono text-xs text-on-dark-muted lowercase">
              {mode === 'quiz' ? 'quiz' : 'subtes'} {index + 1}/{total} ·{' '}
              {tryout.title}
            </p>
            <h1 className="truncate font-mono text-sm font-medium sm:text-base">
              {subtestName}
            </h1>
          </div>
          {deadline !== null && (
            <SessionTimer
              remainingMs={remaining}
              totalMs={totalMs}
            />
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-on-dark hover:bg-white/10 lg:hidden"
            aria-label="Daftar soal"
            onClick={() => setNavOpen(true)}
          >
            <Grid3x3 aria-hidden />
          </Button>
          <Button
            variant="outline-light"
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => setSubmitOpen(true)}
            disabled={finish.isPending || timeUp}
          >
            <Send aria-hidden />
            Kumpulkan
          </Button>
        </div>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 pb-2 sm:px-6">
          <SaveStatus status={status} />
          <p className="font-mono text-xs text-on-dark-muted tabular-nums">
            {stats.answered}/{stats.total} terjawab
          </p>
        </div>
      </header>

      {timeUp && (
        <div
          role="alert"
          className="border-b border-line bg-surface"
        >
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <p className="text-sm text-ink">
              {lateFailed
                ? 'Waktu habis dan jawaban belum terkirim. Jawabanmu masih aman di perangkat ini.'
                : 'Waktu habis. Jawabanmu sedang dikumpulkan…'}
            </p>
            {lateFailed && (
              <Button
                size="sm"
                onClick={() => void sendLate()}
              >
                <RotateCw aria-hidden />
                Kirim ulang
              </Button>
            )}
          </div>
        </div>
      )}

      <main
        id="konten"
        className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-3 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:py-8"
      >
        <article
          aria-labelledby={headingId}
          className="flex min-w-0 flex-col rounded-md border border-line bg-surface"
        >
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6">
            <h2
              id={headingId}
              ref={headingRef}
              tabIndex={-1}
              className="font-mono text-sm font-medium text-ink outline-none"
            >
              Soal {current + 1}{' '}
              <span className="text-ink-muted">/ {questions.length}</span>
            </h2>
            <span className="font-mono text-xs text-ink-muted lowercase">
              {question ? QUESTION_TYPE_LABEL[question.type] : ''}
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-6 px-4 py-5 sm:px-6 sm:py-6">
            <RichContent
              html={question?.question}
              fallback="Soal tidak tersedia."
              className="max-w-[70ch] text-base leading-relaxed"
            />

            {question?.type === 'SHORT_ANSWER' ? (
              <div className="flex max-w-md flex-col gap-2">
                <label
                  htmlFor={`isian-${question.id}`}
                  className="text-sm font-semibold"
                >
                  Jawabanmu
                </label>
                <Input
                  id={`isian-${question.id}`}
                  value={entry?.answer ?? ''}
                  placeholder="Ketik jawaban singkat"
                  autoComplete="off"
                  onChange={(e) =>
                    dispatch({
                      type: 'isian',
                      index: current,
                      text: e.target.value,
                      answerId: question.TryoutAnswers[0]?.id ?? '',
                    })
                  }
                />
              </div>
            ) : question ? (
              <OptionGroup
                key={question.id}
                name={`soal-${question.id}`}
                options={question.TryoutAnswers}
                value={entry?.answerId ?? ''}
                labelledBy={headingId}
                onSelect={(answerId) =>
                  dispatch({ type: 'pilih', index: current, answerId })
                }
              />
            ) : null}
          </div>

          <div className="flex flex-col gap-3 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <Button
              variant="ghost"
              size="sm"
              aria-pressed={!!entry?.notSure}
              aria-keyshortcuts="R"
              onClick={() => dispatch({ type: 'ragu', index: current })}
              className="justify-start self-start"
            >
              <AnswerBubble
                aria-hidden
                state={entry?.notSure ? 'flagged' : 'empty'}
                size="xs"
              />
              {entry?.notSure ? 'Ditandai ragu' : 'Tandai ragu'}
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => go(current - 1)}
                disabled={current === 0}
                aria-keyshortcuts="P"
              >
                <ChevronLeft aria-hidden />
                Sebelumnya
              </Button>
              {current < questions.length - 1 ? (
                <Button
                  size="sm"
                  onClick={() => go(current + 1)}
                  aria-keyshortcuts="N"
                >
                  Berikutnya
                  <ChevronRight aria-hidden />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setSubmitOpen(true)}
                  disabled={finish.isPending || timeUp}
                >
                  <Send aria-hidden />
                  Kumpulkan
                </Button>
              )}
            </div>
          </div>
        </article>

        <aside
          aria-label="Lembar jawaban"
          className="hidden lg:block"
        >
          <div className="sticky top-28 flex flex-col gap-5 rounded-md border border-line bg-surface p-4">
            <p className="font-mono text-xs text-ink-muted lowercase">
              lembar jawaban
            </p>
            {navigator}
            <p className="text-xs leading-relaxed text-ink-muted">
              Pintasan: <kbd className="font-mono">A</kbd>–
              <kbd className="font-mono">E</kbd> pilih jawaban,{' '}
              <kbd className="font-mono">N</kbd>/<kbd className="font-mono">P</kbd>{' '}
              soal berikut/sebelum, <kbd className="font-mono">R</kbd> ragu.
            </p>
            <Button
              onClick={() => setSubmitOpen(true)}
              disabled={finish.isPending || timeUp}
            >
              <Send aria-hidden />
              Kumpulkan jawaban
            </Button>
          </div>
        </aside>
      </main>

      <Sheet
        open={navOpen}
        onOpenChange={setNavOpen}
      >
        <SheetContent
          side="bottom"
          className="max-h-[80dvh] overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Daftar soal</SheetTitle>
            <SheetDescription>
              {stats.answered} dari {stats.total} terjawab · {stats.flagged}{' '}
              ragu
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 px-4 pb-6">
            {navigator}
            <Button
              onClick={() => {
                setNavOpen(false);
                setSubmitOpen(true);
              }}
              disabled={finish.isPending || timeUp}
            >
              <Send aria-hidden />
              Kumpulkan jawaban
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <SubmitDialog
        open={submitOpen}
        onOpenChange={setSubmitOpen}
        stats={stats}
        pending={finish.isPending}
        sessionName={subtestName}
        isLastSession={isLast}
        onConfirm={onSubmit}
        onJump={(i) => {
          setSubmitOpen(false);
          go(i);
        }}
      />
    </div>
  );
}
