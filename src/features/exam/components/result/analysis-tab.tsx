'use client';

import { Disclaimer } from '@/components/brand/disclaimer';
import { MonoLabel } from '@/components/brand/mono-label';
import { EmptyState } from '@/components/patterns/empty-state';
import { SectionLoader } from '@/components/patterns/page-loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTrackId } from '@/lib/track';
import { cn } from '@/lib/utils';
import { CircleCheck, CircleX, Lock, School, Target } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSimulation, useUniversities } from '../../api';
import { formatScore, topShare } from '../../model/result';
import type {
  ChoiceAnalysis,
  TryoutAnalysis,
  University,
  UserTryoutAccount,
} from '../../types';
import { SearchSelect } from '../search-select';
import { UpgradeTryoutButton } from '../upgrade-dialog';

type Props = {
  tryoutId: string;
  userId: string;
  analysis: TryoutAnalysis;
  unlocked: boolean;
  account: UserTryoutAccount | undefined;
};

/** Skor vs rata-rata kampus/jurusan: status + ikon, selisih poin, batang. */
function Versus({
  label,
  score,
  average,
  ranking,
  applicants,
}: {
  label: string;
  score: number;
  average: number;
  ranking?: number;
  applicants?: number;
}) {
  const above = average > 0 ? score > average : true;
  const gap = Math.round(score - average);
  const pct = average > 0 ? Math.min(100, (score / average) * 100) : 0;
  const top = ranking && applicants ? topShare(ranking, applicants) : null;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold">{label}</p>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 text-sm font-semibold',
            above ? 'text-success' : 'text-danger',
          )}
        >
          {above ? (
            <CircleCheck
              className="size-4"
              aria-hidden
            />
          ) : (
            <CircleX
              className="size-4"
              aria-hidden
            />
          )}
          {above ? 'Di atas rata-rata' : 'Di bawah rata-rata'}
        </span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-paper"
        aria-hidden
      >
        <div
          className={cn('h-full rounded-full', above ? 'bg-success' : 'bg-brand')}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-sm text-ink-muted">
        Skormu{' '}
        <span className="font-mono text-ink tabular-nums">{formatScore(score, 1)}</span>{' '}
        · rata-rata{' '}
        <span className="font-mono text-ink tabular-nums">
          {formatScore(average, 1)}
        </span>{' '}
        ({gap >= 0 ? `+${gap}` : gap} poin)
      </p>
      {!!ranking && !!applicants && (
        <p className="text-sm">
          Peringkat{' '}
          <span className="font-mono tabular-nums">
            {ranking}/{applicants}
          </span>{' '}
          pemilih{top !== null ? ` · top ${top}%` : ''}
        </p>
      )}
    </div>
  );
}

function ChoiceCard({ choice, score }: { choice: ChoiceAnalysis; score: number }) {
  return (
    <Card>
      <CardHeader>
        <MonoLabel>pilihan</MonoLabel>
        <CardTitle className="flex items-center gap-2">
          <School
            className="size-5 text-brand"
            aria-hidden
          />
          {choice.univ} · {choice.major}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <Versus
          label="Kampus"
          score={score}
          average={choice.univAverageScore}
          ranking={choice.univRanking}
          applicants={choice.univTotalAplicants}
        />
        <Versus
          label="Jurusan"
          score={score}
          average={choice.majorAverageScore}
          ranking={choice.majorRanking}
          applicants={choice.majorTotalAplicants}
        />
      </CardContent>
    </Card>
  );
}

function Locked({ tryoutId }: { tryoutId: string }) {
  return (
    <EmptyState
      icon={Lock}
      title="Analisis kampus masih terkunci"
      description="Buka rapor lengkap untuk melihat posisimu di kampus & jurusan pilihan, rekomendasi, dan simulasi."
      action={<UpgradeTryoutButton tryoutId={tryoutId} />}
    />
  );
}

/** Rekomendasi: maks. 10 jurusan yang rata-ratanya di bawah skormu. */
export function recommendations(universities: University[], score: number) {
  return universities
    .filter((u) => u.averageScore < score)
    .flatMap((u) =>
      u.studyProgramList
        .filter((p) => p.averageScore !== null && p.averageScore < score)
        .map((p) => ({
          univ: u.university,
          study: p.study,
          averageScore: p.averageScore ?? 0,
        })),
    )
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 10);
}

export function AnalysisTab({
  tryoutId,
  userId,
  analysis,
  unlocked,
  account,
}: Props) {
  const trackId = useTrackId();
  const isSnbt = trackId === 'snbt';
  const score = analysis.userScore ?? 0;
  const universities = useUniversities(unlocked);
  const [univ, setUniv] = useState('');
  const [major, setMajor] = useState('');
  const [submitted, setSubmitted] = useState<{ univ: string; major: string } | null>(
    null,
  );

  // Selain SNBT: simulasi terkunci ke pilihan pertama di akun tryout.
  useEffect(() => {
    if (isSnbt || !account?.univChoiceOne) return;
    setUniv(account.univChoiceOne);
    setMajor(account.univStudyChoiceOne ?? '');
    if (account.univStudyChoiceOne) {
      setSubmitted({ univ: account.univChoiceOne, major: account.univStudyChoiceOne });
    }
  }, [isSnbt, account]);

  const simulation = useSimulation({
    tryoutId,
    userId,
    university: submitted?.univ ?? '',
    major: submitted?.major ?? '',
    enabled: unlocked && !!submitted,
  });

  const majors = useMemo(
    () =>
      universities.data
        ?.find((u) => u.university === univ)
        ?.studyProgramList.map((p) => p.study) ?? [],
    [universities.data, univ],
  );
  const recs = useMemo(
    () => recommendations(universities.data ?? [], score),
    [universities.data, score],
  );

  if (!unlocked) return <Locked tryoutId={tryoutId} />;

  return (
    <Tabs
      defaultValue="pilihan"
      className="flex flex-col gap-2"
    >
      <TabsList className="self-start">
        <TabsTrigger value="pilihan">Pilihanmu</TabsTrigger>
        {isSnbt && <TabsTrigger value="rekomendasi">Rekomendasi</TabsTrigger>}
        <TabsTrigger value="simulasi">Simulasi</TabsTrigger>
      </TabsList>

      <TabsContent
        value="pilihan"
        className="flex flex-col gap-4"
      >
        <dl className="grid gap-3 sm:grid-cols-3">
          {[
            ['peringkat TO', analysis.choiceAnalisis?.rankingTryout, analysis.totalParticipants],
            ['estimasi peringkat kampus', analysis.choiceAnalisis?.rankingUniv, null],
            ['estimasi peringkat jurusan', analysis.choiceAnalisis?.rankingMajor, null],
          ].map(([label, value, of]) => (
            <div
              key={label as string}
              className="flex flex-col gap-1 rounded-md border border-line bg-surface p-4"
            >
              <dt className="font-mono text-xs text-ink-muted">{label}</dt>
              <dd className="font-display text-2xl font-bold tabular-nums">
                {value ? formatScore(value as number, 1) : '–'}
                {of ? (
                  <span className="text-base font-semibold text-ink-muted">
                    {' '}
                    / {of as number}
                  </span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
        {analysis.choiceAnalisis?.university?.length ? (
          analysis.choiceAnalisis.university.map((c, i) => (
            <ChoiceCard
              key={`${c.univ}-${c.major}-${i}`}
              choice={c}
              score={score}
            />
          ))
        ) : (
          <EmptyState
            icon={School}
            title="Belum ada kampus pilihan"
            description="Isi kampus & jurusan pilihan di akun tryout-mu supaya posisimu bisa dibandingkan."
          />
        )}
        <Disclaimer />
      </TabsContent>

      {isSnbt && (
        <TabsContent
          value="rekomendasi"
          className="flex flex-col gap-4"
        >
          <p className="text-sm text-ink-muted">
            Jurusan dengan rata-rata skor di bawah skormu ({formatScore(score)}).
          </p>
          {universities.isPending ? (
            <SectionLoader />
          ) : recs.length === 0 ? (
            <EmptyState
              icon={Target}
              title="Belum ada rekomendasi"
              description="Belum ada jurusan dengan rata-rata di bawah skormu. Naikkan skor di TO berikutnya, yuk."
            />
          ) : (
            <ol className="grid gap-3 md:grid-cols-2">
              {recs.map((r) => (
                <li
                  key={`${r.univ}-${r.study}`}
                  className="flex flex-col gap-2 rounded-md border border-line bg-surface p-4"
                >
                  <p className="font-semibold">{r.study}</p>
                  <p className="text-sm text-ink-muted">{r.univ}</p>
                  <p className="text-sm">
                    Rata-rata{' '}
                    <span className="font-mono tabular-nums">
                      {formatScore(r.averageScore, 1)}
                    </span>{' '}
                    ·{' '}
                    <span className="inline-flex items-center gap-1 font-semibold text-success">
                      <CircleCheck
                        className="size-3.5"
                        aria-hidden
                      />
                      +{Math.round(score - r.averageScore)} poin
                    </span>
                  </p>
                </li>
              ))}
            </ol>
          )}
          <Disclaimer />
        </TabsContent>
      )}

      <TabsContent
        value="simulasi"
        className="flex flex-col gap-4"
      >
        <Card>
          <CardHeader>
            <MonoLabel>simulasi</MonoLabel>
            <CardTitle>Bandingkan dengan kampus & jurusan lain</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (univ && major) setSubmitted({ univ, major });
              }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <SearchSelect
                  label="Kampus"
                  placeholder="Pilih kampus"
                  value={univ}
                  onChange={(v) => {
                    setUniv(v);
                    setMajor('');
                  }}
                  options={universities.data?.map((u) => u.university) ?? []}
                  disabled={!isSnbt}
                />
                <SearchSelect
                  label="Jurusan"
                  placeholder="Pilih jurusan"
                  value={major}
                  onChange={setMajor}
                  options={majors}
                  disabled={!isSnbt || !univ}
                />
              </div>
              {isSnbt && (
                <Button
                  type="submit"
                  className="self-start"
                  disabled={!univ || !major}
                  loading={simulation.isFetching}
                >
                  <Target aria-hidden />
                  Simulasikan
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
        {submitted && simulation.isPending && simulation.fetchStatus !== 'idle' && (
          <SectionLoader />
        )}
        {simulation.data && (
          <ChoiceCard
            choice={simulation.data}
            score={score}
          />
        )}
        <Disclaimer />
      </TabsContent>
    </Tabs>
  );
}
