'use client';

import { Disclaimer } from '@/components/brand/disclaimer';
import { Highlight } from '@/components/brand/highlight';
import { Lio } from '@/components/brand/lio';
import { MonoLabel } from '@/components/brand/mono-label';
import { BubbleBars } from '@/components/charts/bubble/bubble-bars';
import { BubbleLadder } from '@/components/charts/bubble/bubble-ladder';
import { BubbleSpread } from '@/components/charts/bubble/bubble-spread';
import { AnswerBubble, optionLetter } from '@/components/patterns/answer-bubble';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  CircleCheck,
  CircleX,
  Lock,
  Minus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  aboveShare,
  barsMax,
  focusSubtests,
  formatScore,
  ladderPer,
  scoreLio,
  topShare,
  type ScoreTrend,
  type SubtestRow,
} from '../../model/result';
import type { ExamMode, TryoutAnalysis } from '../../types';
import { UpgradeTryoutButton } from '../upgrade-dialog';
import { ShareRaporButton } from './share-rapor';

type Props = {
  title: string;
  tryoutId: string;
  mode: ExamMode;
  analysis: TryoutAnalysis;
  rows: SubtestRow[];
  unlocked: boolean;
  trend: ScoreTrend | null;
  onReviewSubtest: (name: string) => void;
};

function DeltaStatus({ delta, previous }: { delta: number; previous: string | null }) {
  const up = delta > 0;
  const Icon = up ? TrendingUp : delta < 0 ? TrendingDown : Minus;
  const text = up
    ? `naik ${delta}`
    : delta < 0
      ? `turun ${Math.abs(delta)}`
      : 'sama';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-semibold',
        up ? 'bg-success text-white' : 'bg-white/10 text-on-dark',
      )}
    >
      <Icon
        className="size-4"
        aria-hidden
      />
      <span aria-hidden>{up ? `▲ +${delta}` : delta < 0 ? `▼ ${delta}` : '= 0'}</span>
      <span className="sr-only">
        Skor {text} dari {previous ?? 'tryout sebelumnya'}
      </span>
    </span>
  );
}

/** Kalimat kakak tingkat: angka disebut, lalu langkah berikutnya. */
function nextStepLine(
  score: number,
  delta: number | null,
  focus: SubtestRow | undefined,
) {
  const s = formatScore(score);
  const where = focus ? ` ${focus.code} yang paling perlu dikejar.` : '';
  if (delta === null) return `Skormu ${s}.${where}`;
  if (delta > 0) return `Skormu ${s}, naik ${delta} dari TO sebelumnya.${where}`;
  if (delta < 0)
    return `Skormu ${s}, turun ${Math.abs(delta)} dari TO sebelumnya.${where} Mulai dari situ, yuk.`;
  return `Skormu ${s}, sama dengan TO sebelumnya.${where}`;
}

/** Rapor TO — momen "Wrapped": skor raksasa, posisi, profil subtes, fokus A–C. */
export function RaporTab({
  title,
  tryoutId,
  mode,
  analysis,
  rows,
  unlocked,
  trend,
  onReviewSubtest,
}: Props) {
  const score = analysis.userScore ?? 0;
  const participants = analysis.totalParticipants ?? 0;
  const ranking = analysis.choiceAnalisis?.rankingTryout ?? 0;
  const above = aboveShare(ranking, participants);
  const focus = focusSubtests(rows);
  const delta = trend?.delta ?? null;
  const totals = rows.reduce(
    (acc, r) => ({
      total: acc.total + r.total,
      correct: acc.correct + r.correct,
    }),
    { total: 0, correct: 0 },
  );
  const accuracy = totals.total ? Math.round((totals.correct / totals.total) * 100) : 0;
  const noun = mode === 'quiz' ? 'quiz' : 'TO';

  return (
    <div className="flex flex-col gap-6">
      {/* Skor raksasa */}
      <section
        data-surface="ink"
        aria-labelledby="skor-rapor"
        className="relative overflow-hidden rounded-lg p-6 sm:p-10"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-3">
            <MonoLabel>rapor {noun} · {title}</MonoLabel>
            <h2
              id="skor-rapor"
              className="sr-only"
            >
              Skor kamu
            </h2>
            <p className="font-display text-[clamp(4rem,12vw,10rem)] leading-[0.85] font-extrabold tracking-score text-highlight tabular-nums">
              {formatScore(score)}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-base sm:text-lg">
              {unlocked && above !== null ? (
                <p className="font-display font-bold">
                  di atas <Highlight tone="text">{above}%</Highlight> peserta
                </p>
              ) : mode === 'try-out' ? (
                <UpgradeTryoutButton tryoutId={tryoutId}>
                  <Button
                    variant="outline-light"
                    size="sm"
                  >
                    <Lock aria-hidden />
                    Lihat posisimu
                  </Button>
                </UpgradeTryoutButton>
              ) : null}
              {delta !== null && (
                <DeltaStatus
                  delta={delta}
                  previous={trend?.previousName ?? null}
                />
              )}
            </div>
            <p className="max-w-xl text-sm text-on-dark-muted sm:text-base">
              {nextStepLine(score, delta, focus[0])}
            </p>
          </div>
          <Lio
            expression={scoreLio(delta)}
            props={delta !== null && delta > 0 ? ['kilau'] : []}
            tone="white"
            size="m"
            className="hidden shrink-0 sm:block"
          />
        </div>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Disclaimer className="max-w-md" />
          <ShareRaporButton
            title={title}
            score={score}
            above={unlocked ? above : null}
            delta={delta}
            rows={rows}
            focusCode={focus[0]?.code}
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        {/* Profil subtes */}
        {rows.length > 0 && (
          <Card>
            <CardHeader>
              <MonoLabel>profil subtes</MonoLabel>
              <CardTitle>
                {focus[0] ? (
                  <>
                    Fokus: <Highlight>{focus[0].code}</Highlight>
                  </>
                ) : (
                  'Skor per subtes'
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <BubbleBars
                data={rows.map((r) => ({ label: r.code, value: r.score }))}
                focus={focus[0]?.code}
                max={barsMax(rows)}
              />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>subtes</TableHead>
                    <TableHead className="text-right">skor</TableHead>
                    <TableHead className="text-right">benar</TableHead>
                    <TableHead className="text-right">peringkat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <span className="font-mono text-xs text-ink-muted">
                          {r.code}
                        </span>{' '}
                        <span className="sr-only sm:not-sr-only">{r.name}</span>
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {formatScore(r.score)}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {r.correct}/{r.total}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {unlocked ? (
                          <>
                            {r.ranking}/{r.participants}
                            {topShare(r.ranking, r.participants) !== null && (
                              <span className="block text-xs text-ink-muted">
                                top {topShare(r.ranking, r.participants)}%
                              </span>
                            )}
                          </>
                        ) : (
                          <UpgradeTryoutButton tryoutId={tryoutId}>
                            <Button
                              variant="link"
                              size="xs"
                            >
                              <Lock aria-hidden />
                              Buka
                            </Button>
                          </UpgradeTryoutButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Disclaimer />
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-6">
          {/* Fokus A–C */}
          {focus.length > 0 && (
            <section
              data-surface="ink"
              aria-labelledby="fokus"
              className="flex flex-col gap-4 rounded-md p-5"
            >
              <div className="flex flex-col gap-1">
                <MonoLabel>langkah berikutnya</MonoLabel>
                <h2
                  id="fokus"
                  className="font-display text-xl font-bold"
                >
                  Fokus {focus.length > 1 ? `A–${optionLetter(focus.length - 1)}` : 'A'}
                </h2>
              </div>
              <ol className="flex flex-col gap-3">
                {focus.map((f, i) => (
                  <li
                    key={f.id}
                    className="flex items-center gap-3"
                  >
                    <AnswerBubble
                      aria-hidden
                      label={optionLetter(i)}
                      state={i === 0 ? 'filled' : 'empty'}
                      size="md"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="truncate font-semibold">{f.name}</p>
                      <p className="font-mono text-xs text-on-dark-muted">
                        skor {formatScore(f.score)} · {f.correct}/{f.total} benar
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-on-dark hover:bg-white/10"
                      aria-label={`Bahas soal ${f.name}`}
                      onClick={() => onReviewSubtest(f.name)}
                    >
                      <ArrowRight aria-hidden />
                    </Button>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Statistik */}
          <Card>
            <CardHeader>
              <MonoLabel>statistik</MonoLabel>
              <CardTitle>{totals.total} soal dikerjakan</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-3 gap-3 text-center">
                <div className="flex flex-col items-center gap-1 rounded-sm bg-success-soft p-3">
                  <dt className="flex items-center gap-1 text-xs font-semibold text-success">
                    <CircleCheck
                      className="size-3.5"
                      aria-hidden
                    />
                    Benar
                  </dt>
                  <dd className="font-display text-2xl font-bold tabular-nums">
                    {totals.correct}
                  </dd>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-sm bg-danger-soft p-3">
                  <dt className="flex items-center gap-1 text-xs font-semibold text-danger">
                    <CircleX
                      className="size-3.5"
                      aria-hidden
                    />
                    Salah/kosong
                  </dt>
                  <dd className="font-display text-2xl font-bold tabular-nums">
                    {totals.total - totals.correct}
                  </dd>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-sm bg-paper p-3">
                  <dt className="text-xs font-semibold text-ink-muted">
                    Akurasi
                  </dt>
                  <dd className="font-display text-2xl font-bold tabular-nums">
                    {accuracy}%
                  </dd>
                </div>
              </dl>
              {unlocked && participants > 0 && ranking > 0 && (
                <p className="mt-4 text-sm text-ink-muted">
                  Peringkat{' '}
                  <span className="font-mono font-medium text-ink tabular-nums">
                    {ranking}
                  </span>{' '}
                  dari{' '}
                  <span className="font-mono tabular-nums">{participants}</span>{' '}
                  peserta.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sebaran: hanya bila API mengirim distribusi — tidak dikarang. */}
      {unlocked && analysis.distribution && analysis.distribution.length > 0 && (
        <Card>
          <CardHeader>
            <MonoLabel>sebaran peserta</MonoLabel>
            <CardTitle>Posisimu di antara peserta</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <BubbleSpread
              bins={analysis.distribution}
              you={score}
            />
            <Disclaimer />
          </CardContent>
        </Card>
      )}

      {trend && trend.scores.length >= 2 && (
        <Card>
          <CardHeader>
            <MonoLabel>riwayat skor</MonoLabel>
            <CardTitle>Skormu dari TO ke TO</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {/* Lebar mengikuti jumlah TO agar 2–3 TO tidak jadi raksasa. */}
            <div style={{ maxWidth: `${trend.scores.length * 4.5}rem` }}>
              <BubbleLadder
                scores={trend.scores}
                labels={trend.labels}
                per={ladderPer(trend.scores)}
              />
            </div>
            <p className="font-mono text-xs text-ink-muted">
              1 bubble = {ladderPer(trend.scores)} poin kenaikan dari TO pertama
            </p>
            <Disclaimer />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
