'use client';

import axiosInstanceWithToken from '@/lib/axios/axiosInstanceWithToken';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Loader2,
  RefreshCw,
  Settings2,
  Sparkles,
  X,
} from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SessionProps } from '../edit/[tryoutId]/page';

/* ─── types ──────────────────────────────────────────────────────────── */

interface WebsiteSubCategory {
  id: string;
  name: string;
}

interface WebsiteCategory {
  id: string;
  name: string;
  WebsiteSubCategory: WebsiteSubCategory[];
}

type SessionStatus = 'idle' | 'processing' | 'done' | 'error';
interface CategoryStat {
  name: string;
  count: number;
}
interface MatchCategory {
  id: string;
  name: string;
}
interface SessionCfg {
  sourceWebsubId: string;
  categoryIds: string[]; // empty = all categories
}
interface SessionProgress {
  index: number;
  name: string;
  questions: number;
  status: SessionStatus;
  matchedCount: number;
  categoryStats: CategoryStat[];
  errorMsg?: string;
}

interface Props {
  sessions: SessionProps[];
  setSessions: Dispatch<SetStateAction<SessionProps[]>>;
  currentWebsubId: string;
  children: React.ReactNode; // trigger element
}

/* ─── helpers ────────────────────────────────────────────────────────── */

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const fmtEta = (ms: number) =>
  ms < 60_000
    ? `~${Math.ceil(ms / 1000)} dtk`
    : `~${Math.ceil(ms / 60_000)} mnt`;

/* ─── component ─────────────────────────────────────────────────────── */

export default function DialogAIMatch({
  sessions,
  setSessions,
  currentWebsubId,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  // websub picker
  const [allWebCategories, setAllWebCategories] = useState<WebsiteCategory[]>(
    [],
  );
  const [sourceWebsubId, setSourceWebsubId] = useState<string>(currentWebsubId);
  const [websubOpen, setWebsubOpen] = useState(false);
  const websubRef = useRef<HTMLDivElement>(null);

  // per-session running tracker (allows parallel / independent execution)
  const [runningSet, setRunningSet] = useState<Set<number>>(new Set());
  const batchCancelRef = useRef(false);
  // always-fresh reference to latest sessions prop — avoids stale closures in async loops
  const sessionsRef = useRef(sessions);
  sessionsRef.current = sessions;

  // per-session config overrides (websub + category filter)
  const [sessionCfgs, setSessionCfgs] = useState<Map<number, SessionCfg>>(
    new Map(),
  );
  const [expandedCfg, setExpandedCfg] = useState<Set<number>>(new Set());
  const [catCache, setCatCache] = useState<Map<string, MatchCategory[]>>(
    new Map(),
  );
  const [catLoadingSet, setCatLoadingSet] = useState<Set<string>>(new Set());

  // progress
  const [progress, setProgress] = useState<SessionProgress[]>([]);
  const sessionTimesRef = useRef<number[]>([]);
  const [avgSessionTime, setAvgSessionTime] = useState<number | null>(null);

  /* fetch websubs when dialog opens */
  useEffect(() => {
    if (!open) return;
    axiosInstanceWithToken
      .get('/website-category/getWebsiteCategory')
      .then((res) => {
        const data: WebsiteCategory[] = res.data?.data ?? [];
        setAllWebCategories(data);
      })
      .catch(() => {});
  }, [open]);

  /* reset state ONLY when dialog opens (not on every sessions/websub change) */
  const prevOpenRef = useRef(false);
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      setSourceWebsubId(currentWebsubId);
      setProgress([]);
      setRunningSet(new Set());
      batchCancelRef.current = false;
      sessionTimesRef.current = [];
      setAvgSessionTime(null);
      setSessionCfgs(new Map());
      setExpandedCfg(new Set());
      setCatCache(new Map());
      setCatLoadingSet(new Set());
    }
    prevOpenRef.current = open;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (websubRef.current && !websubRef.current.contains(e.target as Node)) {
        setWebsubOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const allSubCategories = allWebCategories.flatMap((wc) =>
    wc.WebsiteSubCategory.map((sub) => ({ ...sub, categoryName: wc.name })),
  );
  const selectedSubName =
    allSubCategories.find((s) => s.id === sourceWebsubId)?.name ??
    'Pilih sumber...';
  const eligibleIndices = sessions
    .map((s, i) => (s.Questions && s.Questions.length > 0 ? i : -1))
    .filter((i) => i !== -1);
  const sessionsWithQ = eligibleIndices.length;

  // runtime helpers
  const isAnyRunning = runningSet.size > 0;

  // computed progress stats (relative to ALL eligible sessions)
  const doneCount = progress.filter((p) => p.status === 'done').length;
  const errorCount = progress.filter((p) => p.status === 'error').length;
  const processedCount = doneCount + errorCount;
  const totalToProcess = eligibleIndices.length;
  const totalMatched = progress.reduce((acc, p) => acc + p.matchedCount, 0);
  const totalQInRun = progress.reduce((acc, p) => acc + p.questions, 0);
  const overallPct =
    totalToProcess > 0
      ? Math.round((processedCount / totalToProcess) * 100)
      : 0;
  const remaining = totalToProcess - processedCount;
  const etaMs =
    avgSessionTime != null && remaining > 0 && isAnyRunning
      ? avgSessionTime * remaining
      : null;
  const isAllDone =
    sessionsWithQ > 0 &&
    eligibleIndices.every((i) => {
      const p = progress.find((pp) => pp.index === i);
      return p?.status === 'done' || p?.status === 'error';
    });
  // sessions not yet processed (never run, or errored)
  const pendingIndices = eligibleIndices.filter((i) => {
    const p = progress.find((pp) => pp.index === i);
    return !p || p.status === 'error';
  });

  /* ── per-session config helpers ── */
  const getCfg = (idx: number): SessionCfg =>
    sessionCfgs.get(idx) ?? { sourceWebsubId, categoryIds: [] };

  const updateSessionCfg = (idx: number, patch: Partial<SessionCfg>) => {
    setSessionCfgs((prev) => {
      const current = prev.get(idx) ?? { sourceWebsubId, categoryIds: [] };
      return new Map(prev).set(idx, { ...current, ...patch });
    });
  };

  const fetchCategoriesForWebsub = async (websubId: string) => {
    if (catCache.has(websubId) || catLoadingSet.has(websubId)) return;
    setCatLoadingSet((prev) => {
      const n = new Set(prev);
      n.add(websubId);
      return n;
    });
    try {
      const res = await axiosInstanceWithToken.get(
        `/ai/getMatchCategories?website_sub_category_id=${currentWebsubId}&source_website_sub_category_id=${websubId}`,
      );
      const cats: MatchCategory[] = res.data?.data?.categories ?? [];
      setCatCache((prev) => new Map(prev).set(websubId, cats));
    } catch {
      /* silently ignore */
    } finally {
      setCatLoadingSet((prev) => {
        const n = new Set(prev);
        n.delete(websubId);
        return n;
      });
    }
  };

  const toggleCfgPanel = (idx: number, effectiveWebsubId: string) => {
    setExpandedCfg((prev) => {
      const n = new Set(prev);
      if (n.has(idx)) {
        n.delete(idx);
      } else {
        n.add(idx);
        void fetchCategoriesForWebsub(effectiveWebsubId);
      }
      return n;
    });
  };

  /* ── core: process one session ── */
  const runSingleSession = async (sIdx: number) => {
    // use ref to always work with the latest sessions — prevents stale-closure crashes
    const session = sessionsRef.current[sIdx];
    if (!session || !session.Questions || session.Questions.length === 0)
      return;

    // add to runningSet
    setRunningSet((prev) => {
      const n = new Set(prev);
      n.add(sIdx);
      return n;
    });

    // initialise / reset progress entry
    setProgress((prev) => {
      const entry: SessionProgress = {
        index: sIdx,
        name: session.name || `Sesi ${sIdx + 1}`,
        questions: session.Questions?.length ?? 0,
        status: 'processing',
        matchedCount: 0,
        categoryStats: [],
        errorMsg: undefined,
      };
      const exists = prev.some((p) => p.index === sIdx);
      return exists
        ? prev.map((p) => (p.index === sIdx ? entry : p))
        : [...prev, entry];
    });

    const t0 = Date.now();
    try {
      const questions = session.Questions.map((q, qIdx) => ({
        index: qIdx,
        text: stripHtml(q?.question || ''),
      }));
      const cfg = getCfg(sIdx);
      const catParam =
        cfg.categoryIds.length > 0
          ? `&category_ids=${cfg.categoryIds.join(',')}`
          : '';
      const res = await axiosInstanceWithToken.post(
        `/ai/matchQuestionCategory?website_sub_category_id=${currentWebsubId}&source_website_sub_category_id=${cfg.sourceWebsubId}${catParam}`,
        { questions },
      );
      const matches: {
        questionIndex: number;
        categoryId: string;
        categoryName: string;
        courseChapterIds: string[];
      }[] = res.data?.data?.matches ?? [];

      if (matches.length > 0) {
        setSessions((prev) =>
          prev.map((s, idx) => {
            if (idx !== sIdx) return s;
            return {
              ...s,
              Questions: s.Questions.map((q, qIdx) => {
                const m = matches.find((m) => m.questionIndex === qIdx);
                return m
                  ? {
                      ...q,
                      categoryId: m.categoryId,
                      subCategory:
                        m.categoryName && m.categoryName.trim().length > 0
                          ? m.categoryName
                          : q.subCategory,
                      courseChapterIds: m.courseChapterIds,
                    }
                  : q;
              }),
            };
          }),
        );
      }

      // category distribution
      const catMap = new Map<string, number>();
      for (const m of matches) {
        const n = m.categoryName || 'Tanpa Kategori';
        catMap.set(n, (catMap.get(n) ?? 0) + 1);
      }
      const categoryStats: CategoryStat[] = Array.from(catMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count }));

      setProgress((prev) =>
        prev.map((p) =>
          p.index === sIdx
            ? {
                ...p,
                status: 'done',
                matchedCount: matches.length,
                categoryStats,
              }
            : p,
        ),
      );

      const elapsed = Date.now() - t0;
      sessionTimesRef.current.push(elapsed);
      setAvgSessionTime(
        sessionTimesRef.current.reduce((a, b) => a + b, 0) /
          sessionTimesRef.current.length,
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setProgress((prev) =>
        prev.map((p) =>
          p.index === sIdx ? { ...p, status: 'error', errorMsg: msg } : p,
        ),
      );
    } finally {
      // remove from runningSet regardless of outcome
      setRunningSet((prev) => {
        const n = new Set(prev);
        n.delete(sIdx);
        return n;
      });
    }
  };

  /* ── run a single session (fire-and-forget from button click) ── */
  const handleRunOne = (sIdx: number) => {
    void runSingleSession(sIdx);
  };

  /* ── run ALL eligible sessions sequentially ── */
  const handleRunAll = async () => {
    if (isAnyRunning) return;
    batchCancelRef.current = false;
    sessionTimesRef.current = [];
    setAvgSessionTime(null);
    // recompute from ref so we always use latest sessions list
    const indices = sessionsRef.current
      .map((s, i) => (s.Questions && s.Questions.length > 0 ? i : -1))
      .filter((i) => i !== -1);
    for (const sIdx of indices) {
      if (batchCancelRef.current) break;
      try {
        await runSingleSession(sIdx);
      } catch {
        /* errors already handled inside */
      }
    }
  };

  /* ── run only pending (never-run or errored) sessions sequentially ── */
  const handleRunPending = async () => {
    if (isAnyRunning) return;
    batchCancelRef.current = false;
    const pending = sessionsRef.current
      .map((s, i) => (s.Questions && s.Questions.length > 0 ? i : -1))
      .filter((i) => i !== -1)
      .filter((i) => {
        const p = progress.find((pp) => pp.index === i);
        return !p || p.status === 'error';
      });
    for (const sIdx of pending) {
      if (batchCancelRef.current) break;
      try {
        await runSingleSession(sIdx);
      } catch {
        /* errors already handled inside */
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!isAnyRunning) setOpen(v);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-2xl w-full p-0 gap-0 overflow-hidden rounded-3xl">
        {/* Header */}
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-3 text-base font-semibold text-gray-900">
            <div
              className={cn(
                'h-10 w-10 rounded-3xl flex items-center justify-center shrink-0 shadow-md transition-all duration-500',
                isAllDone
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                  : 'bg-gradient-to-br from-purple-500 to-violet-600',
              )}
            >
              {isAllDone ? (
                <CheckCircle2 className="h-5 w-5 text-white" />
              ) : (
                <Sparkles className="h-5 w-5 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              AI Auto-Match Kategori &amp; Materi
              <p className="text-xs text-gray-400 font-normal mt-0.5">
                Jalankan per-sesi atau sekaligus — AI mencocokkan setiap soal ke
                kategori &amp; bab materi.
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Overall progress bar — visible while running */}
        {isAnyRunning && totalToProcess > 0 && (
          <div className="px-6 py-3 bg-purple-50 border-b border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-purple-700">
                <span className="text-purple-600">{runningSet.size}</span> sesi
                sedang berjalan
                {processedCount > 0 && (
                  <span className="text-purple-400 ml-1.5">
                    · {processedCount}/{totalToProcess} selesai
                  </span>
                )}
              </span>
              <div className="flex items-center gap-3 text-[11px] text-purple-400">
                {etaMs != null && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {fmtEta(etaMs)} tersisa
                  </span>
                )}
              </div>
            </div>
            <div className="h-2 rounded-full bg-purple-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-500 transition-all duration-700 ease-out"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>
        )}

        {/* All-done celebration banner */}
        {!isAnyRunning && isAllDone && (
          <div
            className={cn(
              'px-6 py-4 border-b flex items-center gap-4',
              errorCount === 0
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200',
            )}
          >
            <div
              className={cn(
                'h-11 w-11 rounded-3xl flex items-center justify-center shrink-0 shadow-sm',
                errorCount === 0 ? 'bg-green-500' : 'bg-amber-500',
              )}
            >
              {errorCount === 0 ? (
                <CheckCircle2 className="h-6 w-6 text-white" />
              ) : (
                <AlertCircle className="h-6 w-6 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  'text-sm font-bold',
                  errorCount === 0 ? 'text-green-800' : 'text-amber-800',
                )}
              >
                {errorCount === 0
                  ? 'Semua sesi berhasil di-match! 🎉'
                  : `${doneCount} sesi berhasil, ${errorCount} gagal`}
              </p>
              <p
                className={cn(
                  'text-xs mt-0.5',
                  errorCount === 0 ? 'text-green-600' : 'text-amber-600',
                )}
              >
                <span className="font-semibold">{totalMatched}</span> dari{' '}
                <span className="font-semibold">{totalQInRun}</span> soal
                berhasil dicocokkan ke kategori &amp; materi
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setProgress([]);
                setRunningSet(new Set());
                sessionTimesRef.current = [];
                setAvgSessionTime(null);
              }}
              className={cn(
                'shrink-0 text-[11px] font-medium border rounded-3xl px-3 py-1.5 transition-colors',
                errorCount === 0
                  ? 'text-green-700 border-green-300 hover:bg-green-100'
                  : 'text-amber-700 border-amber-300 hover:bg-amber-100',
              )}
            >
              Ulang
            </button>
          </div>
        )}

        <div className="px-6 py-4 flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
          {/* Websub picker — only before any session is run */}
          {!isAnyRunning && processedCount === 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Default Sumber — Semua Sesi
              </label>
              <p className="text-[11px] text-gray-400 -mt-1">
                Pilih platform/websub default — tiap sesi bisa di-override
                secara individual
              </p>
              <div
                ref={websubRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() => setWebsubOpen((v) => !v)}
                  className="w-full flex items-center justify-between gap-2 h-9 rounded-3xl border border-gray-200 bg-white px-3 text-sm text-gray-700 hover:border-gray-300 transition-colors"
                >
                  <span className="truncate">{selectedSubName}</span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-gray-400 shrink-0 transition-transform',
                      websubOpen && 'rotate-180',
                    )}
                  />
                </button>
                {websubOpen && (
                  <div className="absolute z-50 top-full mt-1 left-0 right-0 rounded-3xl border border-gray-200 bg-white shadow-lg max-h-52 overflow-y-auto">
                    {allWebCategories.length === 0 ? (
                      <div className="px-4 py-6 flex items-center justify-center gap-2 text-sm text-gray-400">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />{' '}
                        Memuat...
                      </div>
                    ) : (
                      allWebCategories.map((wc) => (
                        <div key={wc.id}>
                          <div className="px-3 pt-2.5 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {wc.name}
                          </div>
                          {wc.WebsiteSubCategory.map((sub) => (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => {
                                setSourceWebsubId(sub.id);
                                setWebsubOpen(false);
                              }}
                              className={cn(
                                'w-full text-left px-4 py-2 text-sm flex items-center justify-between gap-2 hover:bg-gray-50 transition-colors',
                                sourceWebsubId === sub.id &&
                                  'bg-purple-50 text-purple-700',
                              )}
                            >
                              <span>{sub.name}</span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {sub.id === currentWebsubId && (
                                  <span className="text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
                                    current
                                  </span>
                                )}
                                {sourceWebsubId === sub.id && (
                                  <Check className="w-3.5 h-3.5 text-purple-600" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Batch actions row */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <p className="text-xs text-gray-500 font-medium">
              {isAllDone ? (
                <span
                  className={cn(
                    'font-semibold',
                    errorCount === 0 ? 'text-green-600' : 'text-amber-600',
                  )}
                >
                  {doneCount}/{sessionsWithQ} selesai
                </span>
              ) : (
                <>
                  {sessionsWithQ} sesi tersedia
                  {pendingIndices.length > 0 &&
                    pendingIndices.length < sessionsWithQ && (
                      <span className="ml-1 text-amber-500">
                        · {pendingIndices.length} belum diproses
                      </span>
                    )}
                </>
              )}
            </p>
            <div className="flex items-center gap-2 shrink-0">
              {isAnyRunning && (
                <button
                  type="button"
                  onClick={() => {
                    batchCancelRef.current = true;
                  }}
                  className="text-xs font-medium text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-3xl px-3 py-1.5 transition-colors"
                >
                  Batalkan
                </button>
              )}
              {!isAnyRunning &&
                !isAllDone &&
                pendingIndices.length > 0 &&
                processedCount > 0 && (
                  <button
                    type="button"
                    onClick={handleRunPending}
                    className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-800 border border-amber-200 hover:border-amber-300 bg-amber-50 rounded-3xl px-3 py-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Yang Belum ({pendingIndices.length})
                  </button>
                )}
              <button
                type="button"
                disabled={isAnyRunning}
                onClick={handleRunAll}
                className={cn(
                  'inline-flex items-center gap-1.5 text-xs font-semibold rounded-3xl px-3 py-1.5 transition-all duration-200 shadow-sm',
                  isAllDone
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                    : 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white',
                  'disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none',
                )}
              >
                {isAnyRunning ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" /> Berjalan...
                  </>
                ) : isAllDone ? (
                  <>
                    <RefreshCw className="h-3 w-3" /> Jalankan Ulang
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3" /> Jalankan Semua (
                    {sessionsWithQ})
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Session list — each card has its own individual Run button */}
          <div className="flex flex-col gap-1.5">
            {sessions.map((session, idx) => {
              const qCount = session.Questions?.length ?? 0;
              const hasQ = qCount > 0;
              const prog = progress.find((p) => p.index === idx);
              const isSessionRunning = runningSet.has(idx);
              const matchPct =
                prog && prog.questions > 0
                  ? Math.round((prog.matchedCount / prog.questions) * 100)
                  : 0;

              // per-session config
              const cfg = getCfg(idx);
              const cfgWebsubName =
                allSubCategories.find((s) => s.id === cfg.sourceWebsubId)
                  ?.name ?? '';
              const hasCustomWebsub = cfg.sourceWebsubId !== sourceWebsubId;
              const hasCustomCfg =
                hasCustomWebsub || cfg.categoryIds.length > 0;
              const isCfgOpen = expandedCfg.has(idx);

              return (
                <div
                  key={idx}
                  className={cn(
                    'flex items-start gap-3 rounded-3xl border p-3.5 transition-all duration-300',
                    !hasQ && 'opacity-40 bg-gray-50 border-gray-100',
                    hasQ &&
                      !prog &&
                      !isSessionRunning &&
                      'border-gray-200 bg-white',
                    isSessionRunning &&
                      'border-purple-300 bg-purple-50/80 ring-1 ring-purple-200/50',
                    !isSessionRunning &&
                      prog?.status === 'done' &&
                      'border-green-300 bg-green-50 ring-1 ring-green-200/60',
                    !isSessionRunning &&
                      prog?.status === 'error' &&
                      'border-red-200 bg-red-50/60',
                  )}
                >
                  {/* Circular status indicator */}
                  <div
                    className={cn(
                      'shrink-0 mt-0.5 h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300',
                      !hasQ && 'bg-gray-100 text-gray-400',
                      hasQ &&
                        !prog &&
                        !isSessionRunning &&
                        'bg-gray-100 text-gray-500',
                      isSessionRunning && 'bg-purple-200 text-purple-700',
                      !isSessionRunning &&
                        prog?.status === 'done' &&
                        'bg-green-500 text-white shadow-sm',
                      !isSessionRunning &&
                        prog?.status === 'error' &&
                        'bg-red-100 text-red-500',
                    )}
                  >
                    {isSessionRunning ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : prog?.status === 'done' ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : prog?.status === 'error' ? (
                      <AlertCircle className="h-3.5 w-3.5" />
                    ) : (
                      idx + 1
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Row 1: name + per-session action button */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            'text-sm font-semibold truncate',
                            isSessionRunning && 'text-purple-700',
                            !isSessionRunning &&
                              prog?.status === 'done' &&
                              'text-green-700',
                            !isSessionRunning &&
                              prog?.status === 'error' &&
                              'text-red-600',
                            (!prog ||
                              (!isSessionRunning &&
                                prog.status !== 'done' &&
                                prog.status !== 'error')) &&
                              !isSessionRunning &&
                              'text-gray-800',
                          )}
                        >
                          {session.name || `Sesi ${idx + 1}`}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {qCount} soal
                          {!hasQ && ' · belum ada soal'}
                          {!isSessionRunning &&
                            prog?.status === 'error' &&
                            ' · gagal diproses'}
                        </p>
                        {/* Config summary + toggle — hidden once this session is done */}
                        {hasQ &&
                          !isSessionRunning &&
                          prog?.status !== 'done' && (
                            <div className="mt-1 flex items-center gap-1.5">
                              {hasCustomCfg && (
                                <span className="text-[10px] text-purple-500 font-medium">
                                  {hasCustomWebsub && cfgWebsubName}
                                  {cfg.categoryIds.length > 0 &&
                                    ` · ${cfg.categoryIds.length} kat`}
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  toggleCfgPanel(idx, cfg.sourceWebsubId)
                                }
                                className={cn(
                                  'flex items-center gap-0.5 text-[10px] font-medium transition-colors',
                                  hasCustomCfg
                                    ? 'text-purple-500 hover:text-purple-700'
                                    : 'text-gray-400 hover:text-purple-600',
                                )}
                              >
                                <Settings2 className="w-2.5 h-2.5" />
                                {isCfgOpen
                                  ? 'Tutup'
                                  : hasCustomCfg
                                    ? 'Ubah config'
                                    : 'Atur config'}
                              </button>
                            </div>
                          )}
                        {/* Per-session config panel */}
                        {hasQ && isCfgOpen && !isSessionRunning && (
                          <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex flex-col gap-3">
                            {/* Websub row */}
                            <div>
                              <p className="text-[10px] font-semibold text-purple-600 mb-1.5">
                                Sumber platform
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {allSubCategories.map((sub) => {
                                  const isActive =
                                    cfg.sourceWebsubId === sub.id;
                                  return (
                                    <button
                                      key={sub.id}
                                      type="button"
                                      onClick={() => {
                                        updateSessionCfg(idx, {
                                          sourceWebsubId: sub.id,
                                          categoryIds: [],
                                        });
                                        void fetchCategoriesForWebsub(sub.id);
                                      }}
                                      className={cn(
                                        'text-[10px] font-medium rounded-3xl px-2 py-0.5 border transition-all',
                                        isActive
                                          ? 'bg-purple-600 text-white border-purple-600'
                                          : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-700',
                                      )}
                                    >
                                      {sub.name}
                                      {sub.id === currentWebsubId && (
                                        <span className="ml-1 text-[9px] opacity-60">
                                          current
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            {/* Category filter */}
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <p className="text-[10px] font-semibold text-purple-600">
                                  Filter kategori
                                  <span className="text-gray-400 font-normal ml-1">
                                    (kosong = semua)
                                  </span>
                                </p>
                                {cfg.categoryIds.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateSessionCfg(idx, { categoryIds: [] })
                                    }
                                    className="text-[10px] text-red-400 hover:text-red-600 flex items-center gap-0.5 transition-colors"
                                  >
                                    <X className="w-2.5 h-2.5" /> Reset
                                  </button>
                                )}
                              </div>
                              {catLoadingSet.has(cfg.sourceWebsubId) ? (
                                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                  <Loader2 className="w-3 h-3 animate-spin" />{' '}
                                  Memuat kategori...
                                </span>
                              ) : (catCache.get(cfg.sourceWebsubId) ?? [])
                                  .length === 0 ? (
                                <span className="text-[10px] text-gray-400">
                                  Belum ada kategori tersedia
                                </span>
                              ) : (
                                <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto pr-0.5">
                                  {(catCache.get(cfg.sourceWebsubId) ?? []).map(
                                    (cat) => {
                                      const isSelected =
                                        cfg.categoryIds.includes(cat.id);
                                      return (
                                        <button
                                          key={cat.id}
                                          type="button"
                                          onClick={() => {
                                            const updated = isSelected
                                              ? cfg.categoryIds.filter(
                                                  (id) => id !== cat.id,
                                                )
                                              : [...cfg.categoryIds, cat.id];
                                            updateSessionCfg(idx, {
                                              categoryIds: updated,
                                            });
                                          }}
                                          className={cn(
                                            'inline-flex items-center gap-0.5 text-[10px] font-medium rounded-3xl px-2 py-0.5 border transition-all',
                                            isSelected
                                              ? 'bg-emerald-600 text-white border-emerald-600'
                                              : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-700',
                                          )}
                                        >
                                          {isSelected && (
                                            <Check className="w-2.5 h-2.5 shrink-0" />
                                          )}
                                          {cat.name}
                                        </button>
                                      );
                                    },
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Per-session action — right side */}
                      {hasQ && (
                        <div className="shrink-0">
                          {isSessionRunning ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-500 bg-purple-50 border border-purple-100 rounded-3xl px-2.5 py-1">
                              <Loader2 className="w-3 h-3 animate-spin" />{' '}
                              Menganalisis...
                            </span>
                          ) : prog?.status === 'done' ? (
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {prog.matchedCount}/{prog.questions}
                              </span>
                              <button
                                type="button"
                                disabled={isAnyRunning}
                                onClick={() => handleRunOne(idx)}
                                title="Jalankan ulang sesi ini"
                                className="ml-0.5 text-[10px] font-medium text-gray-400 hover:text-purple-600 border border-gray-200 hover:border-purple-200 rounded-3xl px-1.5 py-0.5 transition-colors disabled:opacity-40"
                              >
                                <RefreshCw className="w-2.5 h-2.5 inline" />
                              </button>
                            </div>
                          ) : prog?.status === 'error' ? (
                            <button
                              type="button"
                              disabled={isAnyRunning}
                              onClick={() => handleRunOne(idx)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 bg-red-50 rounded-3xl px-2.5 py-1 transition-colors disabled:opacity-40"
                            >
                              <RefreshCw className="w-3 h-3" /> Coba Lagi
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={isAnyRunning}
                              onClick={() => handleRunOne(idx)}
                              className={cn(
                                'inline-flex items-center gap-1 text-[11px] font-semibold rounded-3xl px-2.5 py-1 transition-all duration-200',
                                'bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-sm',
                                'disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none',
                              )}
                            >
                              <Sparkles className="w-3 h-3" /> Jalankan
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Processing shimmer */}
                    {isSessionRunning && (
                      <div className="mt-2.5 h-1.5 rounded-full bg-purple-100 overflow-hidden">
                        <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-purple-300 via-violet-400 to-purple-300 animate-pulse" />
                      </div>
                    )}

                    {/* Done: match quality bar + category distribution pills */}
                    {!isSessionRunning &&
                      prog?.status === 'done' &&
                      prog.questions > 0 && (
                        <>
                          <div className="mt-2.5 flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                              <div
                                className={cn(
                                  'h-full rounded-full transition-all duration-700 ease-out',
                                  matchPct >= 80
                                    ? 'bg-green-400'
                                    : matchPct >= 50
                                      ? 'bg-amber-400'
                                      : 'bg-red-400',
                                )}
                                style={{ width: `${matchPct}%` }}
                              />
                            </div>
                            <span
                              className={cn(
                                'text-[10px] font-bold shrink-0',
                                matchPct >= 80
                                  ? 'text-green-600'
                                  : matchPct >= 50
                                    ? 'text-amber-500'
                                    : 'text-red-400',
                              )}
                            >
                              {matchPct}%
                            </span>
                          </div>
                          {prog.categoryStats.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {prog.categoryStats.slice(0, 6).map((cs, ci) => (
                                <span
                                  key={ci}
                                  className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-100 text-emerald-700 rounded-3xl px-1.5 py-0.5 border border-emerald-200/80"
                                >
                                  {cs.name}
                                  <span className="text-emerald-500 font-bold">
                                    ×{cs.count}
                                  </span>
                                </span>
                              ))}
                              {prog.categoryStats.length > 6 && (
                                <span className="text-[10px] text-gray-400 self-center">
                                  +{prog.categoryStats.length - 6} lagi
                                </span>
                              )}
                            </div>
                          )}
                        </>
                      )}

                    {/* Error detail */}
                    {!isSessionRunning &&
                      prog?.status === 'error' &&
                      prog.errorMsg && (
                        <p className="mt-1.5 text-[10px] text-red-400 line-clamp-2">
                          {prog.errorMsg}
                        </p>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          className={cn(
            'px-6 py-4 border-t flex items-center justify-between gap-3 transition-all duration-500',
            isAllDone && errorCount === 0 && 'border-green-200 bg-green-50',
            isAllDone && errorCount > 0 && 'border-amber-200 bg-amber-50',
            !isAllDone && 'border-gray-100',
          )}
        >
          <div className="min-w-0">
            {isAnyRunning && (
              <p className="text-sm text-purple-600 font-medium flex items-center gap-1.5">
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                {runningSet.size} sesi berjalan · {processedCount}/
                {totalToProcess} selesai
                {etaMs != null && (
                  <span className="text-gray-400 text-xs ml-1">
                    · {fmtEta(etaMs)}
                  </span>
                )}
              </p>
            )}
            {!isAnyRunning && isAllDone && (
              <p
                className={cn(
                  'text-sm font-semibold flex items-center gap-1.5',
                  errorCount === 0 ? 'text-green-700' : 'text-amber-700',
                )}
              >
                {errorCount === 0 ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 shrink-0" /> Hasil
                    tersimpan — klik Selesai untuk menutup
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 shrink-0" /> {doneCount}{' '}
                    berhasil · {errorCount} gagal
                  </>
                )}
              </p>
            )}
            {!isAnyRunning && !isAllDone && processedCount === 0 && (
              <p className="text-xs text-gray-400">
                {sessionsWithQ} sesi siap — klik <strong>Jalankan</strong>{' '}
                per-sesi atau <strong>Jalankan Semua</strong>
              </p>
            )}
            {!isAnyRunning && !isAllDone && processedCount > 0 && (
              <p className="text-xs text-amber-600 font-medium">
                {pendingIndices.length > 0 &&
                  `${pendingIndices.length} sesi belum diproses`}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={isAnyRunning}
            className={cn(
              'text-sm font-semibold rounded-3xl px-5 py-2 border transition-all duration-300 disabled:opacity-40',
              !isAllDone && 'text-gray-600 hover:text-gray-800 border-gray-200',
              isAllDone &&
                errorCount === 0 &&
                'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-green-500 shadow-sm',
              isAllDone &&
                errorCount > 0 &&
                'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-amber-500 shadow-sm',
            )}
          >
            {isAllDone ? 'Selesai ✓' : 'Tutup'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
