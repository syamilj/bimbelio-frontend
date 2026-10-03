'use client';

import { PageLoader } from '@/components/patterns/page-loader';
import { useSession } from '@/components/provider/provider-session-auth';
import { Button } from '@/components/ui/button';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { adminPath, appPath, useTrackId } from '@/lib/track';
import { useQueryClient } from '@tanstack/react-query';
import { RotateCw } from 'lucide-react';
import { useEffect } from 'react';
import { invalidateTryout, useTryout } from '../api';
import { useServerNow } from '../hooks/use-clock';
import { deriveExamPhase } from '../model/machine';
import { clockOffset } from '../model/timer';
import type { ExamMode } from '../types';
import { ExamBreak } from './exam-break';
import { ExamGate } from './exam-gate';
import { ExamIntro } from './exam-intro';
import { ExamRoom } from './exam-room';
import { ResultView } from './result/result-view';

export type ExamPageProps = {
  tryoutId: string;
  mode: ExamMode;
  /** Quiz BimArena: volume tempat quiz berada. */
  volumeId?: string | null;
  /** Mode uji admin (`/admin/tryout/testing/try-out/[id]`). */
  testing?: boolean;
};

/**
 * Mesin ujian tunggal (tryout & quiz BimArena). Fase diturunkan dari data
 * server — lihat `model/machine.ts`. Dokumentasi API: `features/exam/README.md`.
 */
export function ExamPage({ tryoutId, mode, volumeId, testing }: ExamPageProps) {
  const qc = useQueryClient();
  const trackId = useTrackId();
  const { data: session } = useSession();
  const user = session?.user;
  const query = useTryout({ tryoutId, userId: user?.id, volumeId });
  const tryout = query.data;
  const offset = tryout ? clockOffset(tryout.serverTime, tryout.receivedAt) : 0;
  // Fase gerbang (jadwal buka/tutup) cukup dicek ulang tiap 15 detik.
  const now = useServerNow(offset, 15_000);

  useEffect(() => {
    trackUnifiedEvent({
      eventName: 'ViewContent',
      customData: {
        content_name: 'Tryout Detail',
        content_type: 'page',
        content_id: `tryout_detail_${tryoutId}`,
      },
      user: user
        ? {
            email: user.email,
            phone: user.phone || undefined,
            userId: user.id,
            firstName: user.name?.split(' ')[0],
            lastName: user.name?.split(' ').slice(1).join(' '),
          }
        : undefined,
    });
  }, [tryoutId, user]);

  const backHref = testing
    ? adminPath(trackId, 'tryout/testing/try-out')
    : appPath(trackId, `bimarena/${mode}`);
  const selfPath = testing
    ? adminPath(trackId, `tryout/testing/try-out/${tryoutId}`)
    : appPath(
        trackId,
        mode === 'quiz'
          ? `bimarena/quiz/${volumeId}/${tryoutId}`
          : `bimarena/try-out/${tryoutId}`,
      );

  if (!user || query.isPending) return <PageLoader />;

  if (query.isError || !tryout) {
    const notFound = query.error?.status === 404;
    return (
      <ExamGate
        label={mode === 'quiz' ? 'quiz' : 'try out'}
        title={notFound ? 'Try out tidak ditemukan' : 'Try out belum bisa dimuat'}
        description={
          notFound
            ? 'Mungkin tautannya sudah tidak berlaku. Cek lagi daftar try out-mu.'
            : (query.error?.message ?? 'Coba muat ulang sebentar lagi.')
        }
        lio="netral"
        backHref={backHref}
        action={
          notFound ? undefined : (
            <Button
              onClick={() => query.refetch()}
              loading={query.isRefetching}
            >
              {!query.isRefetching && <RotateCw aria-hidden />}
              Coba lagi
            </Button>
          )
        }
      />
    );
  }

  const phase = deriveExamPhase(tryout, {
    mode,
    testing,
    quizFeature: user.feature?.quiz,
    volumeId,
    now,
  });
  const refetch = () => void invalidateTryout(qc, tryoutId);
  const noun = mode === 'quiz' ? 'Quiz' : 'Try out';

  switch (phase.kind) {
    case 'belum-dibuka':
      return (
        <ExamGate
          label={tryout.title}
          title={`${noun} belum dibuka`}
          description="Kamu bisa mulai sesuai jadwal. Siapkan alat tulis dan koneksi yang stabil."
          lio="fokus"
          backHref={backHref}
          countdownTo={phase.startDate}
        />
      );
    case 'tidak-terdaftar':
      return (
        <ExamGate
          label={tryout.title}
          title="Kamu belum terdaftar di try out ini"
          description="Daftar dulu dari halaman try out, lalu kembali ke sini."
          backHref={backHref}
        />
      );
    case 'terkunci':
      return (
        <ExamGate
          label={tryout.title}
          title="Quiz ini masih terkunci"
          description="Quiz pertama di tiap volume gratis. Untuk quiz berikutnya, aktifkan paket yang berisi BimArena Quiz."
          backHref={backHref}
          action={
            <Button asChild>
              <a href={appPath(trackId, 'plans')}>Lihat paket</a>
            </Button>
          }
        />
      );
    case 'berakhir':
      return (
        <ExamGate
          label={tryout.title}
          title="Quiz ini sudah berakhir"
          description="Waktu pengerjaannya sudah lewat. Coba quiz lain di volume ini, yuk."
          backHref={backHref}
          countdownTo={phase.endDate}
        />
      );
    case 'kosong':
      return (
        <ExamGate
          label={tryout.title}
          title="Belum ada soal"
          description="Subtes untuk try out ini belum disiapkan."
          backHref={backHref}
        />
      );
    case 'belum-mulai':
      return (
        <ExamIntro
          tryout={tryout}
          userId={user.id}
          mode={mode}
          exitHref={backHref}
        />
      );
    case 'sesi':
      return (
        <ExamRoom
          key={tryout.TryoutSession[phase.index].id}
          tryout={tryout}
          index={phase.index}
          userId={user.id}
          mode={mode}
          offsetMs={offset}
          exitHref={backHref}
          onStale={refetch}
        />
      );
    case 'istirahat':
      return (
        <ExamBreak
          key={tryout.TryoutSession[phase.index].id}
          tryout={tryout}
          index={phase.index}
          userId={user.id}
          offsetMs={offset}
        />
      );
    case 'hasil':
      return (
        <ResultView
          tryout={tryout}
          mode={mode}
          userId={user.id}
          testing={testing}
          backHref={backHref}
          selfPath={selfPath}
        />
      );
  }
}
