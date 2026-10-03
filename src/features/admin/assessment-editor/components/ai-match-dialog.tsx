'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toApiError } from '@/lib/api/client';
import { cn } from '@/lib/utils';
import {
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  Play,
  Settings2,
  Sparkles,
  Square,
} from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { MultiSelect } from '../../resource-form/fields';
import {
  fetchMatchCategories,
  matchQuestions,
  useWebCategories,
  type QuestionMatch,
} from '../api';
import type { EditorSession } from '../model/types';

type Status = 'processing' | 'done' | 'error';
type RunProgress = {
  status: Status;
  questions: number;
  matched: number;
  stats: { name: string; count: number }[];
  error?: string;
};
type SessionCfg = { source: string; categoryIds: string[] };

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const fmtEta = (ms: number) =>
  ms < 60_000
    ? `±${Math.ceil(ms / 1000)} dtk`
    : `±${Math.ceil(ms / 60_000)} mnt`;

/** Terapkan hasil AI Match ke soal sesi (kategori, subkategori, bab). */
export function applyMatches(
  session: EditorSession,
  matches: QuestionMatch[],
): EditorSession {
  if (matches.length === 0) return session;
  return {
    ...session,
    Questions: session.Questions.map((q, i) => {
      const m = matches.find((x) => x.questionIndex === i);
      return m
        ? {
            ...q,
            categoryId: m.categoryId,
            subCategory: m.categoryName?.trim()
              ? m.categoryName
              : q.subCategory,
            courseChapterIds: m.courseChapterIds,
          }
        : q;
    }),
  };
}

/**
 * AI mencocokkan setiap soal ke kategori & bab materi. Bisa per sesi atau
 * sekaligus (berurutan, bisa dibatalkan), dengan sumber track & filter
 * kategori per sesi.
 */
export function AiMatchDialog({
  sessions,
  trackId,
  onApply,
  children,
}: {
  sessions: EditorSession[];
  trackId: string;
  onApply: (sessionIndex: number, matches: QuestionMatch[]) => void;
  children: React.ReactNode;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState(trackId);
  const [cfgs, setCfgs] = useState<Map<number, SessionCfg>>(new Map());
  const [openCfg, setOpenCfg] = useState<number | null>(null);
  const [catCache, setCatCache] = useState<
    Map<string, { id: string; name: string }[]>
  >(new Map());
  const [progress, setProgress] = useState<Map<number, RunProgress>>(new Map());
  const [running, setRunning] = useState<Set<number>>(new Set());
  const cancelRef = useRef(false);
  const times = useRef<number[]>([]);
  const [avg, setAvg] = useState<number | null>(null);
  const sessionsRef = useRef(sessions);
  sessionsRef.current = sessions;
  const webCategories = useWebCategories(open);

  useEffect(() => {
    if (!open) return;
    setSource(trackId);
    setCfgs(new Map());
    setOpenCfg(null);
    setProgress(new Map());
    setRunning(new Set());
    times.current = [];
    setAvg(null);
    cancelRef.current = false;
  }, [open, trackId]);

  const eligible = sessions
    .map((s, i) => (s.Questions.length > 0 ? i : -1))
    .filter((i) => i >= 0);
  const isRunning = running.size > 0;
  const finished = eligible.filter((i) => {
    const p = progress.get(i);
    return p?.status === 'done' || p?.status === 'error';
  });
  const pending = eligible.filter((i) => {
    const p = progress.get(i);
    return !p || p.status === 'error';
  });
  const errors = eligible.filter((i) => progress.get(i)?.status === 'error');
  const allDone = eligible.length > 0 && finished.length === eligible.length;
  const pct = eligible.length
    ? Math.round((finished.length / eligible.length) * 100)
    : 0;
  const remaining = eligible.length - finished.length;
  const eta =
    avg !== null && isRunning && remaining > 0 ? avg * remaining : null;
  const tracks = (webCategories.data ?? []).flatMap((c) =>
    c.WebsiteSubCategory.map((s) => ({ ...s, group: c.name })),
  );
  const trackName = (tid: string) =>
    tracks.find((t) => t.id === tid)?.name ?? tid;

  const cfgFor = (i: number): SessionCfg =>
    cfgs.get(i) ?? { source, categoryIds: [] };

  const loadCategories = async (tid: string) => {
    if (catCache.has(tid)) return;
    try {
      const cats = await fetchMatchCategories(trackId, tid);
      setCatCache((prev) => new Map(prev).set(tid, cats));
    } catch {
      setCatCache((prev) => new Map(prev).set(tid, []));
    }
  };

  const runOne = async (i: number) => {
    const session = sessionsRef.current[i];
    if (!session || session.Questions.length === 0) return;
    setRunning((prev) => new Set(prev).add(i));
    setProgress((prev) =>
      new Map(prev).set(i, {
        status: 'processing',
        questions: session.Questions.length,
        matched: 0,
        stats: [],
      }),
    );
    const t0 = Date.now();
    try {
      const cfg = cfgFor(i);
      const matches = await matchQuestions(
        trackId,
        cfg.source,
        cfg.categoryIds,
        session.Questions.map((q, index) => ({
          index,
          text: stripHtml(q.question || ''),
        })),
      );
      onApply(i, matches);
      const counts = new Map<string, number>();
      for (const m of matches) {
        const n = m.categoryName || 'Tanpa kategori';
        counts.set(n, (counts.get(n) ?? 0) + 1);
      }
      setProgress((prev) =>
        new Map(prev).set(i, {
          status: 'done',
          questions: session.Questions.length,
          matched: matches.length,
          stats: [...counts.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([name, count]) => ({ name, count })),
        }),
      );
      times.current.push(Date.now() - t0);
      setAvg(times.current.reduce((a, b) => a + b, 0) / times.current.length);
    } catch (err) {
      setProgress((prev) =>
        new Map(prev).set(i, {
          status: 'error',
          questions: session.Questions.length,
          matched: 0,
          stats: [],
          error: toApiError(err).message,
        }),
      );
    } finally {
      setRunning((prev) => {
        const next = new Set(prev);
        next.delete(i);
        return next;
      });
    }
  };

  const runMany = async (indices: number[]) => {
    if (isRunning) return;
    cancelRef.current = false;
    for (const i of indices) {
      if (cancelRef.current) break;
      await runOne(i);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !isRunning && setOpen(v)}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Match kategori & materi</DialogTitle>
          <DialogDescription>
            AI mencocokkan setiap soal ke kategori dan bab materi. Jalankan per
            sesi atau sekaligus; hasilnya langsung mengisi draf.
          </DialogDescription>
        </DialogHeader>

        {!isRunning && finished.length === 0 && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-source`}>Sumber materi (semua sesi)</Label>
            <Select
              value={source}
              onValueChange={setSource}
            >
              <SelectTrigger
                id={`${id}-source`}
                className="h-11"
              >
                <SelectValue placeholder="Pilih track sumber" />
              </SelectTrigger>
              <SelectContent>
                {(webCategories.data ?? []).map((c) => (
                  <SelectGroup key={c.id}>
                    <SelectLabel>{c.name}</SelectLabel>
                    {c.WebsiteSubCategory.map((s) => (
                      <SelectItem
                        key={s.id}
                        value={s.id}
                      >
                        {s.name}
                        {s.id === trackId ? ' (track ini)' : ''}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
                {!webCategories.data && (
                  <SelectItem value={trackId}>{trackId}</SelectItem>
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-ink-subtle">
              Tiap sesi bisa memakai sumber & filter kategori sendiri lewat
              tombol pengaturan.
            </p>
          </div>
        )}

        {(isRunning || finished.length > 0) && (
          <div
            className="flex flex-col gap-2 rounded-md border border-line bg-paper p-3"
            aria-live="polite"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-semibold text-ink">
                {allDone
                  ? errors.length === 0
                    ? 'Semua sesi selesai dicocokkan.'
                    : `${finished.length - errors.length} sesi berhasil, ${errors.length} gagal.`
                  : `${finished.length}/${eligible.length} sesi selesai`}
              </span>
              {eta !== null && (
                <span className="font-mono text-xs text-ink-muted">
                  sisa {fmtEta(eta)}
                </span>
              )}
            </div>
            <Progress
              value={pct}
              aria-label="Progres AI Match"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-auto text-sm text-ink-muted">
            {eligible.length} sesi berisi soal
            {pending.length > 0 && pending.length < eligible.length
              ? ` · ${pending.length} belum diproses`
              : ''}
          </span>
          {isRunning ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                cancelRef.current = true;
              }}
            >
              <Square />
              Hentikan setelah sesi ini
            </Button>
          ) : (
            <>
              {finished.length > 0 && pending.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void runMany(pending)}
                >
                  Proses yang belum ({pending.length})
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                disabled={eligible.length === 0}
                onClick={() => {
                  times.current = [];
                  setAvg(null);
                  void runMany(eligible);
                }}
              >
                <Sparkles />
                {allDone ? 'Jalankan ulang semua' : 'Jalankan semua'}
              </Button>
            </>
          )}
        </div>

        <ol className="flex flex-col gap-2">
          {sessions.map((session, i) => {
            const p = progress.get(i);
            const busy = running.has(i);
            const hasQ = session.Questions.length > 0;
            const cfg = cfgFor(i);
            const customSource = cfg.source !== source;
            const cats = catCache.get(cfg.source);
            return (
              <li
                key={i}
                className={cn(
                  'flex flex-col gap-2 rounded-md border border-line bg-surface p-3',
                  !hasQ && 'opacity-60',
                  p?.status === 'error' && 'border-danger/30',
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-line-strong font-mono text-xs"
                    aria-hidden
                  >
                    {busy ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : p?.status === 'done' ? (
                      <CircleCheck className="size-4 text-success" />
                    ) : p?.status === 'error' ? (
                      <CircleAlert className="size-4 text-danger" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">
                      {session.name || `Sesi ${i + 1}`}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {session.Questions.length} soal
                      {!hasQ && ' · belum ada soal'}
                      {busy && ' · sedang diproses'}
                      {p?.status === 'done' &&
                        ` · ${p.matched}/${p.questions} cocok`}
                      {p?.status === 'error' && ` · gagal: ${p.error}`}
                      {(customSource || cfg.categoryIds.length > 0) &&
                        ` · ${customSource ? trackName(cfg.source) : ''}${cfg.categoryIds.length ? ` ${cfg.categoryIds.length} kategori` : ''}`}
                    </p>
                  </div>
                  {hasQ && !busy && p?.status !== 'done' && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-expanded={openCfg === i}
                      aria-label={`Pengaturan AI Match ${session.name || `sesi ${i + 1}`}`}
                      onClick={() => {
                        setOpenCfg(openCfg === i ? null : i);
                        void loadCategories(cfg.source);
                      }}
                    >
                      <Settings2 />
                    </Button>
                  )}
                  {hasQ && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={busy || isRunning}
                      onClick={() => void runOne(i)}
                    >
                      <Play />
                      {p ? 'Ulang' : 'Jalankan'}
                    </Button>
                  )}
                </div>
                {openCfg === i && !busy && (
                  <div className="grid gap-3 rounded-sm bg-paper p-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor={`${id}-src-${i}`}>Sumber</Label>
                      <Select
                        value={cfg.source}
                        onValueChange={(v) => {
                          setCfgs((prev) =>
                            new Map(prev).set(i, {
                              source: v,
                              categoryIds: [],
                            }),
                          );
                          void loadCategories(v);
                        }}
                      >
                        <SelectTrigger
                          id={`${id}-src-${i}`}
                          size="sm"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tracks.map((t) => (
                            <SelectItem
                              key={t.id}
                              value={t.id}
                            >
                              {t.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-semibold text-ink">
                        Kategori (kosong = semua)
                      </span>
                      {cats ? (
                        <MultiSelect
                          aria-label="Filter kategori"
                          value={cfg.categoryIds}
                          onChange={(v) =>
                            setCfgs((prev) =>
                              new Map(prev).set(i, { ...cfg, categoryIds: v }),
                            )
                          }
                          options={cats.map((c) => ({
                            value: c.id,
                            label: c.name,
                          }))}
                          placeholder="Semua kategori"
                        />
                      ) : (
                        <p className="text-xs text-ink-muted">
                          Memuat kategori…
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {p?.status === 'done' && p.stats.length > 0 && (
                  <ul
                    className="flex flex-wrap gap-1.5"
                    aria-label="Sebaran kategori"
                  >
                    {p.stats.map((s) => (
                      <li key={s.name}>
                        <Badge variant="secondary">
                          {s.name}
                          <span className="font-mono">{s.count}</span>
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>
      </DialogContent>
    </Dialog>
  );
}
