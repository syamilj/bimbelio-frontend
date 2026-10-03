'use client';

import { InfoPill } from '@/components/brand/info-pill';
import { MonoLabel } from '@/components/brand/mono-label';
import {
  AnswerBubble,
  optionLetter,
  type BubbleState,
} from '@/components/patterns/answer-bubble';
import { ErrorState } from '@/components/patterns/error-state';
import { SectionLoader } from '@/components/patterns/page-loader';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { appPath, useTrackId } from '@/lib/track';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleMinus,
  CircleX,
  Gem,
  Grid3x3,
  Lightbulb,
  MessageCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useId, useMemo, useState } from 'react';
import { useSessionReview } from '../../api';
import {
  correctOption,
  formatScore,
  reviewStats,
  reviewStatus,
  sortedReview,
  type ReviewStatus,
} from '../../model/result';
import type { ReviewAnswer } from '../../types';
import { RichContent } from '../rich-content';
import { TryoutAI } from './tryout-ai';

export type ReviewSessionOption = {
  id: string;
  name: string;
  participantId: string;
};

type Props = {
  userId: string;
  sessions: ReviewSessionOption[];
  sessionIndex: number;
  onSessionChange: (index: number) => void;
};

const STATUS: Record<
  ReviewStatus,
  { label: string; icon: typeof CircleCheck; bubble: BubbleState; text: string }
> = {
  benar: { label: 'Benar', icon: CircleCheck, bubble: 'correct', text: 'text-success' },
  salah: { label: 'Salah', icon: CircleX, bubble: 'wrong', text: 'text-danger' },
  kosong: { label: 'Kosong', icon: CircleMinus, bubble: 'disabled', text: 'text-ink-muted' },
};

function StatusLabel({ status }: { status: ReviewStatus }) {
  const s = STATUS[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm font-semibold', s.text)}>
      <s.icon
        className="size-4"
        aria-hidden
      />
      {s.label}
    </span>
  );
}

function ReviewNavigator({
  items,
  current,
  onJump,
}: {
  items: ReviewAnswer[];
  current: number;
  onJump: (i: number) => void;
}) {
  return (
    <nav
      aria-label="Navigasi pembahasan"
      className="flex flex-col gap-4"
    >
      <ol className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-5">
        {items.map((item, i) => {
          const status = reviewStatus(item);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onJump(i)}
                aria-current={i === current ? 'step' : undefined}
                aria-label={`Soal ${i + 1}, ${STATUS[status].label.toLowerCase()}`}
                className="rounded-full p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <AnswerBubble
                  label={i + 1}
                  state={STATUS[status].bubble}
                  current={i === current}
                  size="md"
                />
              </button>
            </li>
          );
        })}
      </ol>
      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-muted">
        {(['benar', 'salah', 'kosong'] as const).map((s) => (
          <li
            key={s}
            className="flex items-center gap-1.5"
          >
            <AnswerBubble
              aria-hidden
              state={STATUS[s].bubble}
              size="xs"
            />
            {STATUS[s].label}
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Pembahasan: soal + jawabanmu + kunci + pembahasan, status selalu berikon. */
export function ReviewTab({
  userId,
  sessions,
  sessionIndex,
  onSessionChange,
}: Props) {
  const trackId = useTrackId();
  const selected = sessions[sessionIndex];
  const review = useSessionReview(selected?.id, userId);
  const items = useMemo(() => sortedReview(review.data), [review.data]);
  const stats = useMemo(() => reviewStats(items), [items]);
  const [index, setIndex] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const headingId = useId();

  useEffect(() => setIndex(0), [sessionIndex]);

  const item = items[Math.min(index, Math.max(0, items.length - 1))];
  const status = item ? reviewStatus(item) : 'kosong';
  const correct = item ? correctOption(item.TryoutQuestion.TryoutAnswers) : null;
  const doc = review.data?.TryoutSession?.Document;
  const go = (i: number) => setIndex(Math.max(0, Math.min(items.length - 1, i)));

  const navigator = (
    <ReviewNavigator
      items={items}
      current={index}
      onJump={(i) => {
        go(i);
        setNavOpen(false);
      }}
    />
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 rounded-md border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex flex-col gap-1">
          <MonoLabel>pembahasan</MonoLabel>
          <h2 className="font-display text-xl font-bold">
            {selected?.name ?? 'Subtes'}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={String(sessionIndex)}
            onValueChange={(v) => onSessionChange(Number(v))}
          >
            <SelectTrigger
              className="w-56"
              aria-label="Pilih subtes"
            >
              <SelectValue placeholder="Pilih subtes" />
            </SelectTrigger>
            <SelectContent>
              {sessions.map((s, i) => (
                <SelectItem
                  key={s.id}
                  value={String(i)}
                >
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setNavOpen(true)}
          >
            <Grid3x3 aria-hidden />
            Daftar soal
          </Button>
        </div>
      </div>

      {review.isPending ? (
        <SectionLoader />
      ) : review.isError ? (
        <ErrorState
          error={review.error}
          title="Pembahasan tidak dapat dimuat"
          onRetry={() => review.refetch()}
          retrying={review.isRefetching}
        />
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {[
              ['skor', formatScore(review.data?.totalScore)],
              ['akurasi', `${Math.round(stats.accuracy * 100)}%`],
              ['benar', stats.benar],
              ['salah', stats.salah],
              ['kosong', stats.kosong],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex flex-col gap-0.5 rounded-md border border-line bg-surface px-4 py-3"
              >
                <dt className="font-mono text-xs text-ink-muted">{label}</dt>
                <dd className="font-display text-xl font-bold tabular-nums">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
            {item ? (
              <article
                aria-labelledby={headingId}
                className="flex min-w-0 flex-col rounded-md border border-line bg-surface"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6">
                  <h3
                    id={headingId}
                    className="font-mono text-sm font-medium"
                  >
                    Soal {index + 1}{' '}
                    <span className="text-ink-muted">/ {items.length}</span>
                  </h3>
                  <div className="flex items-center gap-3">
                    {item.difficultyQuestion && (
                      <InfoPill variant="outline">
                        {item.difficultyQuestion.message}
                      </InfoPill>
                    )}
                    <StatusLabel status={status} />
                  </div>
                </div>

                <div className="grid gap-6 px-4 py-5 sm:px-6 xl:grid-cols-2">
                  <section className="flex min-w-0 flex-col gap-4">
                    <RichContent
                      html={item.TryoutQuestion.question}
                      fallback="Tidak ada pertanyaan."
                      className="max-w-[70ch] leading-relaxed"
                    />
                    <ul
                      className="flex flex-col gap-2"
                      aria-label="Opsi jawaban"
                    >
                      {item.TryoutQuestion.TryoutAnswers.map((o, i) => {
                        const picked = item.TryoutAnswers?.id === o.id;
                        const isKey = correct?.id === o.id;
                        const state: BubbleState = isKey
                          ? picked
                            ? 'correct'
                            : 'missed'
                          : picked
                            ? 'wrong'
                            : 'empty';
                        return (
                          <li
                            key={o.id}
                            className={cn(
                              'flex items-start gap-3 rounded-md border p-3',
                              isKey
                                ? 'border-success bg-success-soft'
                                : picked
                                  ? 'border-danger bg-danger-soft'
                                  : 'border-line',
                            )}
                          >
                            <AnswerBubble
                              aria-hidden
                              label={optionLetter(i)}
                              state={state}
                              size="sm"
                            />
                            <RichContent
                              html={o.answer}
                              className="flex-1 pt-0.5"
                            />
                            <span className="flex shrink-0 flex-col items-end gap-0.5 text-xs font-semibold">
                              {picked && (
                                <span className={isKey ? 'text-success' : 'text-danger'}>
                                  Jawabanmu
                                </span>
                              )}
                              {isKey && (
                                <span className="inline-flex items-center gap-1 text-success">
                                  <CircleCheck
                                    className="size-3.5"
                                    aria-hidden
                                  />
                                  Kunci
                                </span>
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    {!item.TryoutAnswers && (
                      <p className="text-sm text-ink-muted">
                        Kamu tidak menjawab soal ini.
                      </p>
                    )}
                  </section>

                  <section
                    aria-label="Pembahasan"
                    className="flex min-w-0 flex-col gap-4 xl:border-l xl:border-line xl:pl-6"
                  >
                    <h4 className="flex items-center gap-2 font-display text-lg font-bold">
                      <Lightbulb
                        className="size-5 text-brand"
                        aria-hidden
                      />
                      Pembahasan
                    </h4>
                    <RichContent
                      html={item.TryoutQuestion.explanation}
                      fallback="Belum ada pembahasan untuk soal ini."
                      className="leading-relaxed"
                    />
                    {!!item.TryoutQuestion.Pivot_TryoutQuestion_CourseChapter?.length && (
                      <div className="flex flex-col gap-3 rounded-md bg-paper p-4">
                        <p className="flex items-center gap-2 text-sm font-semibold">
                          <BookOpen
                            className="size-4 text-brand"
                            aria-hidden
                          />
                          Saran baca materi di BimCourse
                        </p>
                        {item.TryoutQuestion.Pivot_TryoutQuestion_CourseChapter.map(
                          (pivot) => (
                            <div
                              key={pivot.id}
                              className="flex flex-col gap-2"
                            >
                              <p className="text-sm font-semibold">
                                {pivot.CourseChapter.title}
                              </p>
                              <ul className="flex flex-wrap gap-2">
                                {pivot.CourseChapter.CourseSubChapter.map((sub) => (
                                  <li key={sub.id}>
                                    <Link
                                      href={appPath(
                                        trackId,
                                        `bimcourse/${pivot.CourseChapter.categoryId}/study?sub=${sub.id}&tab=chat`,
                                      )}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:border-brand"
                                    >
                                      {sub.title}
                                      {sub.premium && (
                                        <Gem
                                          className="size-3.5 text-brand"
                                          aria-label="premium"
                                        />
                                      )}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </section>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-3 sm:px-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => go(index - 1)}
                    disabled={index === 0}
                  >
                    <ChevronLeft aria-hidden />
                    Sebelumnya
                  </Button>
                  <TryoutAI
                    participantId={selected?.participantId ?? ''}
                    number={index + 1}
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                    >
                      <MessageCircle aria-hidden />
                      Tanya BimBot
                    </Button>
                  </TryoutAI>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => go(index + 1)}
                    disabled={index >= items.length - 1}
                  >
                    Berikutnya
                    <ChevronRight aria-hidden />
                  </Button>
                </div>
              </article>
            ) : (
              <p className="rounded-md border border-dashed border-line-strong p-8 text-center text-sm text-ink-muted">
                Tidak ada jawaban untuk ditampilkan.
              </p>
            )}

            <aside
              aria-label="Daftar soal pembahasan"
              className="hidden lg:block"
            >
              <div className="sticky top-6 flex flex-col gap-4 rounded-md border border-line bg-surface p-4">
                <MonoLabel>daftar soal</MonoLabel>
                {navigator}
                {doc && (
                  <Button
                    variant="outline"
                    asChild
                  >
                    <Link
                      href={appPath(trackId, `workspace/${doc.category.id}/${doc.id}`)}
                    >
                      <BookOpen aria-hidden />
                      Dokumen pembahasan
                    </Link>
                  </Button>
                )}
              </div>
            </aside>
          </div>
        </>
      )}

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
          </SheetHeader>
          <div className="flex flex-col gap-4 px-4 pb-6">
            {navigator}
            {doc && (
              <Button
                variant="outline"
                asChild
              >
                <Link href={appPath(trackId, `workspace/${doc.category.id}/${doc.id}`)}>
                  <BookOpen aria-hidden />
                  Dokumen pembahasan
                </Link>
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
