'use client';

import { MonoLabel } from '@/components/brand/mono-label';
import { useCountdown } from '@/components/patterns/countdown';
import { ErrorState } from '@/components/patterns/error-state';
import { SectionLoader } from '@/components/patterns/page-loader';
import { useSession } from '@/components/provider/provider-session-auth';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { adminPath, appPath, useTrackId } from '@/lib/track';
import { ArrowLeft, Calculator, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  useScoreHistory,
  useTestAgain,
  useTryoutAccount,
  useTryoutAnalysis,
  useTryoutUnlock,
} from '../../api';
import { scoreTrend, subtestRows } from '../../model/result';
import type { ExamMode, ExamTryout } from '../../types';
import { ExamGate } from '../exam-gate';
import { AnalysisTab } from './analysis-tab';
import { RaporTab } from './rapor-tab';
import { ReviewTab } from './review-tab';

type Tab = 'ringkasan' | 'review' | 'analisis';
const TABS: Tab[] = ['ringkasan', 'review', 'analisis'];

type Props = {
  tryout: ExamTryout;
  mode: ExamMode;
  userId: string;
  testing?: boolean;
  backHref: string;
  /** URL halaman ini (untuk menyimpan tab di `?tab=`). */
  selfPath: string;
};

/** Hasil: menunggu `resultDate`, lalu Rapor + Pembahasan + Analisis. */
export function ResultView(props: Props) {
  const resultDate = new Date(props.tryout.resultDate);
  const remaining = useCountdown(props.testing ? null : resultDate);
  if (!props.testing && remaining !== null && remaining > 0) {
    return (
      <ExamGate
        label="hasil belum keluar"
        title="Jawabanmu sudah terkumpul"
        description="Rapor keluar sesuai jadwal pengumuman. Sambil menunggu, istirahat dulu — kamu sudah menyelesaikan semua subtes."
        lio="senang"
        backHref={props.backHref}
        countdownTo={resultDate}
      />
    );
  }
  return <ResultTabs {...props} />;
}

function PredictionPopup() {
  const trackId = useTrackId();
  const [open, setOpen] = useState(true);
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gabungkan nilai UTBK & SIMAK UI</DialogTitle>
          <DialogDescription>
            Lihat perkiraan peluangmu masuk UI dari gabungan skor UTBK dan SIMAK
            UI.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Nanti saja
          </Button>
          <Button asChild>
            <Link href={appPath(trackId, 'prediction/step?step=new')}>
              Mulai prediksi
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ResultTabs({ tryout, mode, userId, testing, backHref, selfPath }: Props) {
  const router = useRouter();
  const trackId = useTrackId();
  const { data: session } = useSession();
  const role = session?.user.role;
  const isStaff = !!role && role !== 'USER';
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get('tab') as Tab | null;
  const [tab, setTab] = useState<Tab>(
    initialTab && TABS.includes(initialTab) && !(mode === 'quiz' && initialTab === 'analisis')
      ? initialTab
      : 'ringkasan',
  );
  const [reviewIndex, setReviewIndex] = useState(0);

  const analysis = useTryoutAnalysis(tryout.id, userId);
  const unlockQuery = useTryoutUnlock(tryout.id, userId, mode === 'try-out' && !isStaff);
  const unlocked = mode === 'quiz' || isStaff || !!unlockQuery.data;
  const account = useTryoutAccount(userId);
  const history = useScoreHistory(userId, mode === 'try-out');
  const testAgain = useTestAgain();

  const rows = useMemo(
    () => (analysis.data ? subtestRows(analysis.data) : []),
    [analysis.data],
  );
  const trend = useMemo(
    () =>
      mode === 'try-out' && analysis.data && history.data
        ? scoreTrend(history.data, tryout.title, analysis.data.userScore ?? 0)
        : null,
    [mode, analysis.data, history.data, tryout.title],
  );

  const sessions = tryout.TryoutSession.map((s) => ({
    id: s.id,
    name: s.TryoutSubCategory?.name || s.name,
    participantId: s.TryoutSessionParticipant?.id ?? '',
  }));

  const changeTab = (next: string) => {
    const t = next as Tab;
    setTab(t);
    // Simpan tab di URL tanpa navigasi ulang (perilaku lama: replaceState).
    window.history.replaceState(null, '', `${selfPath}?tab=${t}`);
  };

  const reviewSubtest = (name: string) => {
    const i = sessions.findIndex((s) => s.name === name);
    setReviewIndex(Math.max(0, i));
    changeTab('review');
  };

  const onTestAgain = () =>
    testAgain.mutate(
      { userId, tryoutId: tryout.id },
      {
        onSuccess: () => {
          toast.success('Data uji coba direset');
          router.push(adminPath(trackId, 'tryout/testing/try-out'));
        },
      },
    );

  const loading =
    analysis.isPending || (mode === 'try-out' && !isStaff && unlockQuery.isPending);
  const error = analysis.error ?? unlockQuery.error;

  return (
    <div className="min-h-dvh bg-paper">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <Link href={backHref}>
              <ArrowLeft aria-hidden />
              Kembali
            </Link>
          </Button>
          <div className="flex min-w-0 flex-1 flex-col">
            <MonoLabel>hasil {mode === 'quiz' ? 'quiz' : 'try out'}</MonoLabel>
            <h1 className="truncate font-display text-lg font-bold">
              {tryout.title}
            </h1>
          </div>
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={onTestAgain}
              loading={testAgain.isPending}
            >
              {!testAgain.isPending && <RotateCcw aria-hidden />}
              Uji ulang
            </Button>
          )}
          {trackId === 'simak-ui' && (
            <Button
              size="sm"
              asChild
            >
              <Link
                href={appPath(trackId, `prediction/step?tryoutId=${tryout.id}&step=new`)}
              >
                <Calculator aria-hidden />
                Prediksi tryout ini
              </Link>
            </Button>
          )}
        </div>
      </header>
      {trackId === 'simak-ui' && <PredictionPopup />}

      <main
        id="konten"
        className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6"
      >
        <Tabs
          value={tab}
          onValueChange={changeTab}
          className="flex flex-col gap-2"
        >
          <TabsList
            className="self-start"
            aria-label="Bagian hasil"
          >
            <TabsTrigger value="ringkasan">Rapor</TabsTrigger>
            <TabsTrigger value="review">Pembahasan</TabsTrigger>
            {mode === 'try-out' && (
              <TabsTrigger value="analisis">Analisis</TabsTrigger>
            )}
          </TabsList>

          {loading ? (
            <SectionLoader />
          ) : error || !analysis.data ? (
            <ErrorState
              error={error}
              title="Hasil tidak dapat dimuat"
              onRetry={() => {
                void analysis.refetch();
                void unlockQuery.refetch();
              }}
            />
          ) : (
            <>
              <TabsContent value="ringkasan">
                <RaporTab
                  title={tryout.title}
                  tryoutId={tryout.id}
                  mode={mode}
                  analysis={analysis.data}
                  rows={rows}
                  unlocked={unlocked}
                  trend={trend}
                  onReviewSubtest={reviewSubtest}
                />
              </TabsContent>
              <TabsContent value="review">
                <ReviewTab
                  userId={userId}
                  sessions={sessions}
                  sessionIndex={reviewIndex}
                  onSessionChange={setReviewIndex}
                />
              </TabsContent>
              {mode === 'try-out' && (
                <TabsContent value="analisis">
                  <AnalysisTab
                    tryoutId={tryout.id}
                    userId={userId}
                    analysis={analysis.data}
                    unlocked={unlocked}
                    account={account.data}
                  />
                </TabsContent>
              )}
            </>
          )}
        </Tabs>
        {testing && (
          <p className="text-xs text-ink-muted">
            Mode uji admin: jadwal pengumuman diabaikan.
          </p>
        )}
      </main>
    </div>
  );
}
