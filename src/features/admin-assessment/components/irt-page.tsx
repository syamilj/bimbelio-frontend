'use client';

import { Disclaimer } from '@/components/brand/disclaimer';
import { ErrorState } from '@/components/patterns/error-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminPageHeader } from '@/features/admin/components/admin-page-header';
import { downloadText } from '@/features/admin/lib/export';
import { toApiError } from '@/lib/api/client';
import { adminPath, useTrackId } from '@/lib/track';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Clock,
  Cpu,
  Download,
  LoaderCircle,
  RotateCw,
  Save,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { processIrt, saveIrt, useTryoutForIrt } from '../api';
import { buildIrtMarkdown, sessionIrtDone } from '../model/irt';
import type { IrtResult, TryoutForIrt } from '../model/types';
import { IrtResults } from './irt-results';

type Status = 'idle' | 'processing' | 'done' | 'error' | 'saving' | 'saved';
type SessionState = {
  id: string;
  label: string;
  participants: number;
  wasDone: boolean;
  status: Status;
  result: IrtResult | null;
  error: string | null;
  open: boolean;
};

const build = (data: TryoutForIrt): SessionState[] =>
  data.TryoutSession.map((s) => ({
    id: s.id,
    label: `${s.TryoutCategory.name} — ${s.TryoutSubCategory.name}`,
    participants: s.TryoutSessionParticipant.length,
    wasDone: sessionIrtDone(s),
    status: 'idle',
    result: null,
    error: null,
    open: false,
  }));

function StatusBadge({ s }: { s: SessionState }) {
  const map: Record<
    Status,
    {
      label: string;
      icon: typeof Clock;
      spin?: boolean;
      variant:
        'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'ink';
    }
  > = {
    processing: {
      label: 'Memproses…',
      icon: LoaderCircle,
      spin: true,
      variant: 'default',
    },
    saving: {
      label: 'Menyimpan…',
      icon: LoaderCircle,
      spin: true,
      variant: 'default',
    },
    saved: { label: 'Tersimpan', icon: CircleCheck, variant: 'success' },
    done: {
      label: 'Diproses, belum disimpan',
      icon: CircleCheck,
      variant: 'ink',
    },
    error: { label: 'Gagal', icon: CircleAlert, variant: 'destructive' },
    idle: s.wasDone
      ? { label: 'Sudah di-IRT', icon: CircleCheck, variant: 'secondary' }
      : { label: 'Belum di-IRT', icon: Clock, variant: 'outline' },
  };
  const { label, icon: Icon, spin, variant } = map[s.status];
  return (
    <Badge variant={variant}>
      <Icon
        className={cn(spin && 'animate-spin')}
        aria-hidden
      />
      {label}
    </Badge>
  );
}

/** Proses & simpan IRT 3PL per sesi try out, plus laporan Markdown. */
export function IrtPage({ tryoutId }: { tryoutId: string }) {
  const trackId = useTrackId();
  const query = useTryoutForIrt(tryoutId);
  const [sessions, setSessions] = useState<SessionState[]>([]);
  const [batch, setBatch] = useState(false);

  // Bangun sekali saat data datang; refetch setelah simpan tidak mereset status.
  useEffect(() => {
    if (query.data)
      setSessions((prev) => (prev.length ? prev : build(query.data)));
  }, [query.data]);

  const patch = (id: string, p: Partial<SessionState>) =>
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, ...p } : s)));

  const runProcess = async (id: string) => {
    patch(id, { status: 'processing', error: null });
    try {
      const result = await processIrt(id, tryoutId);
      patch(id, { status: 'done', result, open: false });
      return true;
    } catch (err) {
      const message = toApiError(err).message || 'Gagal memproses sesi';
      patch(id, { status: 'error', error: message });
      toast.error(message);
      return false;
    }
  };

  const runSave = async (s: SessionState) => {
    if (!s.result) return;
    patch(s.id, { status: 'saving' });
    try {
      await saveIrt(s.id, tryoutId, s.result);
      patch(s.id, { status: 'saved' });
      toast.success(`Sesi "${s.label}" tersimpan.`);
    } catch (err) {
      const message = toApiError(err).message || 'Gagal menyimpan sesi';
      patch(s.id, { status: 'error', error: message });
      toast.error(message);
    }
  };

  const pending = sessions.filter(
    (s) => s.status === 'idle' || s.status === 'error',
  );
  const doneCount = sessions.filter(
    (s) => s.status === 'done' || s.status === 'saved',
  ).length;
  const savedCount = sessions.filter((s) => s.status === 'saved').length;
  const unsaved = sessions.filter((s) => s.status === 'done' && s.result);
  const withResult = sessions.filter(
    (s) => s.result && (s.status === 'done' || s.status === 'saved'),
  );

  const processAll = async () => {
    if (pending.length === 0) {
      toast.info('Tidak ada sesi yang perlu diproses.');
      return;
    }
    setBatch(true);
    for (const s of pending) await runProcess(s.id);
    setBatch(false);
    toast.success('Semua sesi selesai diproses.');
  };

  const saveAll = async () => {
    if (unsaved.length === 0) {
      toast.info('Tidak ada hasil yang perlu disimpan.');
      return;
    }
    setBatch(true);
    for (const s of unsaved) await runSave(s);
    setBatch(false);
    void query.refetch();
  };

  const exportReport = () => {
    if (withResult.length === 0) {
      toast.info('Belum ada sesi yang diproses.');
      return;
    }
    const now = new Date();
    const title = query.data?.title ?? tryoutId;
    downloadText(
      buildIrtMarkdown(
        title,
        withResult.map((s) => ({ label: s.label, result: s.result! })),
        now,
      ),
      `IRT_${title}_${now.toISOString().slice(0, 10)}.md`,
      'text/markdown',
    );
    toast.success(`Laporan IRT (${withResult.length} sesi) diunduh.`);
  };

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        back={{ href: adminPath(trackId, 'tryout'), label: 'Daftar try out' }}
        meta="irt · model 3PL (three-parameter logistic)"
        title={
          query.data ? `Penilaian IRT: ${query.data.title}` : 'Penilaian IRT'
        }
        description="Proses setiap sesi dengan model IRT 3PL, periksa hasilnya, lalu simpan agar skor peserta diperbarui."
      />

      {query.isPending ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-28 w-full rounded-md" />
          <Skeleton className="h-20 w-full rounded-md" />
          <Skeleton className="h-20 w-full rounded-md" />
        </div>
      ) : query.error ? (
        <ErrorState
          error={query.error}
          title="Data try out tidak dapat dimuat"
          onRetry={() => query.refetch()}
        />
      ) : (
        <>
          <section
            aria-label="Kontrol batch"
            className="flex flex-col gap-4 rounded-md border border-line bg-surface p-4 sm:p-5"
          >
            <dl className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-ink-muted">
              <div className="flex gap-1">
                <dt>sesi</dt>
                <dd className="text-ink">{sessions.length}</dd>
              </div>
              <div className="flex gap-1">
                <dt>diproses</dt>
                <dd className="text-ink">{doneCount}</dd>
              </div>
              <div className="flex gap-1">
                <dt>tersimpan</dt>
                <dd className="text-ink">{savedCount}</dd>
              </div>
              <div className="flex gap-1">
                <dt>menunggu</dt>
                <dd className="text-ink">{pending.length}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={processAll}
                disabled={batch || pending.length === 0}
                loading={batch}
              >
                {!batch && <Cpu />}
                Proses semua sesi
                {pending.length > 0 && (
                  <span className="font-mono">({pending.length})</span>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={saveAll}
                disabled={batch || unsaved.length === 0}
              >
                <Save />
                Simpan semua hasil
              </Button>
              <Button
                variant="outline"
                onClick={exportReport}
                disabled={batch || withResult.length === 0}
              >
                <Download />
                Unduh laporan (.md)
              </Button>
              <Button
                variant="ghost"
                onClick={async () => {
                  const fresh = await query.refetch();
                  if (fresh.data) setSessions(build(fresh.data));
                }}
                disabled={batch}
              >
                <RotateCw />
                Muat ulang
              </Button>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-ink-muted">
                <span>Progres</span>
                <span className="font-mono">
                  {doneCount}/{sessions.length} sesi diproses
                </span>
              </div>
              <Progress
                value={
                  sessions.length ? (doneCount / sessions.length) * 100 : 0
                }
                aria-label="Progres pemrosesan IRT"
              />
            </div>
          </section>

          <ol className="flex flex-col gap-3">
            {sessions.map((s, i) => (
              <li
                key={s.id}
                className={cn(
                  'rounded-md border border-line bg-surface',
                  (s.status === 'processing' || s.status === 'saving') &&
                    'border-brand-muted',
                )}
              >
                <div className="flex flex-wrap items-start gap-3 p-4">
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line-strong font-mono text-xs"
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-base font-bold tracking-display text-ink">
                      {s.label}
                    </h2>
                    <p className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
                      <span className="inline-flex items-center gap-1">
                        <Users
                          className="size-3.5"
                          aria-hidden
                        />
                        <span className="font-mono">{s.participants}</span>{' '}
                        peserta
                      </span>
                      <StatusBadge s={s} />
                    </p>
                    {s.status === 'processing' && (
                      <p
                        className="mt-2 text-xs text-ink-muted"
                        aria-live="polite"
                      >
                        Menjalankan model IRT 3PL… bisa butuh beberapa menit.
                      </p>
                    )}
                    {s.status === 'error' && s.error && (
                      <p
                        role="alert"
                        className="mt-2 flex items-start gap-1.5 text-sm text-danger"
                      >
                        <CircleAlert
                          className="mt-0.5 size-4 shrink-0"
                          aria-hidden
                        />
                        {s.error}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={batch || s.status === 'processing'}
                      loading={s.status === 'processing'}
                      onClick={() => void runProcess(s.id)}
                    >
                      {s.status !== 'processing' && <Cpu />}
                      {s.wasDone && s.status === 'idle'
                        ? 'Proses ulang'
                        : 'Proses'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={
                        batch ||
                        !s.result ||
                        s.status === 'saving' ||
                        s.status === 'saved'
                      }
                      loading={s.status === 'saving'}
                      onClick={() => void runSave(s)}
                    >
                      {s.status !== 'saving' && <Save />}
                      Simpan
                    </Button>
                    {s.result && (
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-expanded={s.open}
                        aria-controls={`irt-${s.id}`}
                        onClick={() => patch(s.id, { open: !s.open })}
                      >
                        <ChevronDown
                          className={cn(
                            'transition-transform',
                            s.open && 'rotate-180',
                          )}
                        />
                        {s.open ? 'Tutup hasil' : 'Lihat hasil'}
                      </Button>
                    )}
                  </div>
                </div>
                {s.open && s.result && (
                  <div
                    id={`irt-${s.id}`}
                    className="border-t border-line bg-paper p-4"
                  >
                    <IrtResults
                      result={s.result}
                      label={s.label}
                    />
                  </div>
                )}
              </li>
            ))}
          </ol>
          <Disclaimer>
            Skor IRT adalah perkiraan dari data try out, bukan jaminan hasil
            seleksi.
          </Disclaimer>
        </>
      )}
    </div>
  );
}
