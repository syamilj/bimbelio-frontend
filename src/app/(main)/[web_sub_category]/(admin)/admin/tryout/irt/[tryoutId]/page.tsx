'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toaster } from '@/components/ui/toaster';
import axiosInstanceWithToken from '@/lib/axios/axiosInstanceWithToken';
import { useGet } from '@/lib/fetch-helper/useGet';
import {
  Tryout,
  TryoutAnswer,
  TryoutCategory,
  TryoutQuestion,
  TryoutSession,
  TryoutSessionParticipant,
  TryoutSubCategory,
  TryoutUserAnswer,
} from '@/types/database';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Cpu,
  Download,
  Loader2,
  RefreshCw,
  Save,
  Users,
  XCircle,
  Zap,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import ResultsOverview from '../_components/ResultsOverview';

// ─── Types ────────────────────────────────────────────────────────────────────

export type OverallStatsProps = {
  totalParticipants: number;
  averageScores: number;
  averageTheta: number;
  minScores: number;
  maxScores: number;
  medianScores: number;
  minTheta: number;
  maxTheta: number;
  transformMode?: string;
  populationMean?: number;
  populationSd?: number;
  totalPopulation?: number;
  syntheticCount?: number;
};

export type DataIRTProps = {
  participants: {
    p: string;
    theta: number;
    score: number;
  }[];
  question: {
    q: number;
    a: number | null;
    b: number | null;
    c: number | null;
  }[];
};

type TryoutDataType = Tryout & {
  TryoutSession: (TryoutSession & {
    TryoutSessionParticipant: (TryoutSessionParticipant & {
      TryoutUserAnswer: (TryoutUserAnswer & {
        TryoutQuestion: TryoutQuestion;
        TryoutAnswers: TryoutAnswer;
      })[];
    })[];
    TryoutCategory: TryoutCategory;
    TryoutSubCategory: TryoutSubCategory;
  })[];
};

type SessionBatchStatus =
  | 'idle'
  | 'processing'
  | 'done'
  | 'error'
  | 'saving'
  | 'saved';

type SessionBatchState = {
  sessionId: string;
  label: string;
  participantCount: number;
  wasIrtDone: boolean;
  status: SessionBatchStatus;
  result: (DataIRTProps & { overallStats: OverallStatsProps }) | null;
  errorMsg: string | null;
  expanded: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function checkIsIrtDone(
  session: TryoutDataType['TryoutSession'][number],
): boolean {
  for (const participant of session.TryoutSessionParticipant) {
    for (const uAnswer of participant.TryoutUserAnswer) {
      if (
        uAnswer.TryoutQuestion.a_discrimination &&
        uAnswer.TryoutQuestion.b_difficulty &&
        uAnswer.TryoutQuestion.c_guessing
      ) {
        return true;
      }
    }
  }
  return false;
}

function buildBatchStates(tryoutData: TryoutDataType): SessionBatchState[] {
  return tryoutData.TryoutSession.map((session) => ({
    sessionId: session.id,
    label: `${session.TryoutCategory.name} — ${session.TryoutSubCategory.name}`,
    participantCount: session.TryoutSessionParticipant.length,
    wasIrtDone: checkIsIrtDone(session),
    status: 'idle' as SessionBatchStatus,
    result: null,
    errorMsg: null,
    expanded: false,
  }));
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({
  status,
  wasIrtDone,
}: {
  status: SessionBatchStatus;
  wasIrtDone: boolean;
}) {
  if (status === 'processing') {
    return (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200 gap-1.5">
        <Loader2 className="h-3 w-3 animate-spin" />
        Memproses…
      </Badge>
    );
  }
  if (status === 'saving') {
    return (
      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 gap-1.5">
        <Loader2 className="h-3 w-3 animate-spin" />
        Menyimpan…
      </Badge>
    );
  }
  if (status === 'saved') {
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200 gap-1.5">
        <CheckCircle2 className="h-3 w-3" />
        Tersimpan
      </Badge>
    );
  }
  if (status === 'done') {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1.5">
        <CheckCircle2 className="h-3 w-3" />
        Diproses
      </Badge>
    );
  }
  if (status === 'error') {
    return (
      <Badge className="bg-red-100 text-red-700 border-red-200 gap-1.5">
        <XCircle className="h-3 w-3" />
        Error
      </Badge>
    );
  }
  if (wasIrtDone) {
    return (
      <Badge className="bg-green-50 text-green-600 border-green-200 gap-1.5">
        <CheckCircle2 className="h-3 w-3" />
        Sudah di-IRT
      </Badge>
    );
  }
  return (
    <Badge className="bg-orange-50 text-orange-600 border-orange-200 gap-1.5">
      <Clock className="h-3 w-3" />
      Belum di-IRT
    </Badge>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function IRTProcessorPage() {
  const params = useParams();
  const tryoutId = params?.tryoutId as string;

  const {
    data: TryoutData,
    isLoading: isTryoutLoading,
    refetch: refetchTryout,
  } = useGet<TryoutDataType>('/irt/getTryoutDataForIrt', {
    params: { tryoutId },
  });

  const [batchStates, setBatchStates] = useState<SessionBatchState[]>([]);
  const [isBatchRunning, setIsBatchRunning] = useState(false);

  // Initialise batch states on first data load
  if (TryoutData && batchStates.length === 0) {
    setBatchStates(buildBatchStates(TryoutData));
  }

  function patchSession(sessionId: string, patch: Partial<SessionBatchState>) {
    setBatchStates((prev) =>
      prev.map((s) => (s.sessionId === sessionId ? { ...s, ...patch } : s)),
    );
  }

  // ── Process single session ───────────────────────────────────────────────────
  async function processSession(sessionId: string) {
    patchSession(sessionId, { status: 'processing', errorMsg: null });
    try {
      const res = await axiosInstanceWithToken.post<{
        data: DataIRTProps & { overallStats: OverallStatsProps };
      }>('/irt/processIrtForSession', { sessionId, tryoutId });
      patchSession(sessionId, {
        status: 'done',
        result: res.data.data,
        expanded: false,
      });
    } catch (err: unknown) {
      const msg =
        (
          err as {
            response?: { data?: { message?: string } };
          }
        )?.response?.data?.message ?? 'Gagal memproses sesi';
      patchSession(sessionId, { status: 'error', errorMsg: msg });
      toaster({ title: 'Error', condition: 'warning', description: msg });
    }
  }

  // ── Save single session ──────────────────────────────────────────────────────
  async function saveSession(sessionId: string) {
    const session = batchStates.find((s) => s.sessionId === sessionId);
    if (!session?.result) return;
    patchSession(sessionId, { status: 'saving' });
    try {
      await axiosInstanceWithToken.post('/irt/saveIrtForSession', {
        sessionId,
        tryoutId,
        SaveDataIRT: {
          participants: session.result.participants,
          question: session.result.question,
        },
      });
      patchSession(sessionId, { status: 'saved' });
      toaster({
        title: 'Berhasil',
        condition: 'success',
        description: `Sesi "${session.label}" berhasil disimpan.`,
      });
    } catch (err: unknown) {
      const msg =
        (
          err as {
            response?: { data?: { message?: string } };
          }
        )?.response?.data?.message ?? 'Gagal menyimpan sesi';
      patchSession(sessionId, { status: 'error', errorMsg: msg });
      toaster({ title: 'Error', condition: 'warning', description: msg });
    }
  }

  // ── Batch process all pending ────────────────────────────────────────────────
  async function runBatchProcess() {
    const pending = batchStates.filter(
      (s) => s.status === 'idle' || s.status === 'error',
    );
    if (pending.length === 0) {
      toaster({
        title: 'Info',
        condition: 'warning',
        description: 'Tidak ada sesi yang perlu diproses.',
      });
      return;
    }
    setIsBatchRunning(true);
    for (const session of pending) {
      await processSession(session.sessionId);
    }
    setIsBatchRunning(false);
    toaster({
      title: 'Selesai',
      condition: 'success',
      description: 'Semua sesi selesai diproses.',
    });
  }

  // ── Batch save all done ───────────────────────────────────────────────────────
  async function runBatchSave() {
    const done = batchStates.filter((s) => s.status === 'done' && s.result);
    if (done.length === 0) {
      toaster({
        title: 'Info',
        condition: 'warning',
        description: 'Tidak ada hasil yang perlu disimpan.',
      });
      return;
    }
    setIsBatchRunning(true);
    for (const session of done) {
      await saveSession(session.sessionId);
    }
    setIsBatchRunning(false);
    refetchTryout();
  }

  // ── Export to Markdown ──────────────────────────────────────────────────────
  function exportMarkdown() {
    const processedSessions = batchStates.filter(
      (s) => s.result && (s.status === 'done' || s.status === 'saved'),
    );
    if (processedSessions.length === 0) {
      toaster({
        title: 'Info',
        condition: 'warning',
        description: 'Belum ada sesi yang diproses.',
      });
      return;
    }

    const stdDev = (values: number[]) => {
      if (!values.length) return 0;
      const mean = values.reduce((s, v) => s + v, 0) / values.length;
      return Math.sqrt(
        values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length,
      );
    };
    const quantile = (sorted: number[], p: number) => {
      if (!sorted.length) return 0;
      const idx = p * (sorted.length - 1);
      const lo = Math.floor(idx);
      const hi = Math.ceil(idx);
      return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
    };
    const fmt = (v: number, d = 2) => v.toFixed(d);
    const bar = (count: number, max: number, width = 20) =>
      '█'
        .repeat(Math.round((count / Math.max(max, 1)) * width))
        .padEnd(width, '░');

    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const lines: string[] = [];

    lines.push(`# Laporan Analisis IRT — ${TryoutData?.title ?? tryoutId}`);
    lines.push(``);
    lines.push(`> **Digenerate pada:** ${dateStr}, pukul ${timeStr}  `);
    lines.push(
      `> **Model:** Item Response Theory 3PL (Three-Parameter Logistic)  `,
    );
    lines.push(
      `> **Metode estimasi θ:** Expected A Posteriori (EAP) · Prior N(0, σ²=25)  `,
    );
    lines.push(`> **Skala skor:** SNBT (Z-score → Mean=500, SD=100)`);
    lines.push(``);
    lines.push(`---`);
    lines.push(``);

    // Summary table across sessions
    lines.push(`## Ringkasan Semua Sesi`);
    lines.push(``);
    lines.push(`| Sesi | N | Mean | Median | SD | Min | Max | θ Mean | θ SD |`);
    lines.push(
      `|------|---|------|--------|-----|-----|-----|--------|------|`,
    );
    for (const s of processedSessions) {
      const r = s.result!;
      const scores = r.participants.map((p) => p.score);
      const thetas = r.participants.map((p) => p.theta);
      lines.push(
        `| ${s.label} | ${r.overallStats.totalParticipants} | ${fmt(r.overallStats.averageScores, 1)} | ${fmt(r.overallStats.medianScores, 1)} | ${fmt(stdDev(scores), 1)} | ${fmt(r.overallStats.minScores, 1)} | ${fmt(r.overallStats.maxScores, 1)} | ${fmt(r.overallStats.averageTheta, 3)} | ${fmt(stdDev(thetas), 3)} |`,
      );
    }
    lines.push(``);
    lines.push(`---`);
    lines.push(``);

    // Per-session detail
    for (const s of processedSessions) {
      const r = s.result!;
      const { overallStats, participants, question } = r;
      const scores = participants.map((p) => p.score);
      const thetas = participants.map((p) => p.theta);
      const sorted = [...scores].sort((a, b) => a - b);
      const sortedT = [...thetas].sort((a, b) => a - b);
      const n = sorted.length;
      const sd = stdDev(scores);
      const q1 = quantile(sorted, 0.25);
      const q3 = quantile(sorted, 0.75);
      const sdT = stdDev(thetas);

      lines.push(`## ${s.label}`);
      lines.push(``);

      // Score stats
      lines.push(`### Statistik Skor (Skala SNBT)`);
      lines.push(``);
      lines.push(`| Metrik | Nilai |`);
      lines.push(`|--------|-------|`);
      lines.push(`| Total Peserta | **${n}** |`);
      lines.push(
        `| Rata-rata (Mean) | **${fmt(overallStats.averageScores, 2)}** |`,
      );
      lines.push(`| Median | **${fmt(overallStats.medianScores, 2)}** |`);
      lines.push(`| Std. Deviasi | **${fmt(sd, 2)}** |`);
      lines.push(`| Nilai Tertinggi | **${fmt(overallStats.maxScores, 2)}** |`);
      lines.push(`| Nilai Terendah | **${fmt(overallStats.minScores, 2)}** |`);
      lines.push(`| Q1 (P25) | **${fmt(q1, 2)}** |`);
      lines.push(`| Q3 (P75) | **${fmt(q3, 2)}** |`);
      lines.push(`| IQR | **${fmt(q3 - q1, 2)}** |`);
      lines.push(``);

      // Theta stats
      lines.push(`### Statistik Theta (θ) — Estimasi Kemampuan`);
      lines.push(``);
      lines.push(`| Metrik | Nilai |`);
      lines.push(`|--------|-------|`);
      lines.push(`| θ Rata-rata | **${fmt(overallStats.averageTheta, 4)}** |`);
      lines.push(`| θ Tertinggi | **${fmt(overallStats.maxTheta, 4)}** |`);
      lines.push(`| θ Terendah | **${fmt(overallStats.minTheta, 4)}** |`);
      lines.push(`| θ Std. Deviasi | **${fmt(sdT, 4)}** |`);
      lines.push(`| θ Q1 (P25) | **${fmt(quantile(sortedT, 0.25), 4)}** |`);
      lines.push(`| θ Q3 (P75) | **${fmt(quantile(sortedT, 0.75), 4)}** |`);
      lines.push(``);

      // Score distribution brackets
      lines.push(`### Distribusi Skor (Kategori SNBT)`);
      lines.push(``);
      const cats = [
        { label: '< 400 (sangat rendah)', lo: -Infinity, hi: 400 },
        { label: '400–450 (rendah)', lo: 400, hi: 450 },
        { label: '450–500 (cukup)', lo: 450, hi: 500 },
        { label: '500–550 (baik)', lo: 500, hi: 550 },
        { label: '550–600 (sangat baik)', lo: 550, hi: 600 },
        { label: '≥ 600 (unggul)', lo: 600, hi: Infinity },
      ];
      const catCounts = cats.map((c) => ({
        ...c,
        count: scores.filter((s) => s >= c.lo && s < c.hi).length,
      }));
      const catMax = Math.max(...catCounts.map((c) => c.count), 1);
      lines.push(`| Rentang | Jumlah | Persentase | Distribusi |`);
      lines.push(`|---------|--------|------------|------------|`);
      for (const c of catCounts) {
        const pct = n > 0 ? ((c.count / n) * 100).toFixed(1) : '0.0';
        lines.push(
          `| ${c.label} | ${c.count} | ${pct}% | \`${bar(c.count, catMax)}\` |`,
        );
      }
      lines.push(``);

      // Item parameter analysis
      const validQ = question.filter(
        (q) => q.a !== null && q.b !== null && q.c !== null,
      );
      const aVals = validQ.map((q) => q.a as number);
      const bVals = validQ.map((q) => q.b as number);
      const cVals = validQ.map((q) => q.c as number);

      if (validQ.length > 0) {
        const avgA = aVals.reduce((s, v) => s + v, 0) / aVals.length;
        const avgB = bVals.reduce((s, v) => s + v, 0) / bVals.length;
        const avgC = cVals.reduce((s, v) => s + v, 0) / cVals.length;
        const easyN = bVals.filter((b) => b < -1).length;
        const medN = bVals.filter((b) => b >= -1 && b <= 1).length;
        const hardN = bVals.filter((b) => b > 1).length;
        const lowA = aVals.filter((a) => a < 0.5).length;
        const goodA = aVals.filter((a) => a >= 0.5 && a <= 2).length;
        const highA = aVals.filter((a) => a > 2).length;
        const maxDiff = Math.max(easyN, medN, hardN, 1);
        const maxDisc = Math.max(lowA, goodA, highA, 1);

        lines.push(`### Parameter Butir (Model 3PL)`);
        lines.push(``);
        lines.push(
          `> ${validQ.length} / ${question.length} soal berhasil diestimasi${question.length - validQ.length > 0 ? ` · ${question.length - validQ.length} soal tidak valid (tanpa variasi jawaban)` : ''}.`,
        );
        lines.push(``);
        lines.push(`| Parameter | Rata-rata | Min | Max | SD | Interpretasi |`);
        lines.push(`|-----------|-----------|-----|-----|----|--------------|`);
        lines.push(
          `| a (diskriminasi) | ${fmt(avgA, 3)} | ${fmt(Math.min(...aVals), 3)} | ${fmt(Math.max(...aVals), 3)} | ${fmt(stdDev(aVals), 3)} | ${avgA < 0.5 ? 'Rendah — soal kurang membedakan kemampuan' : avgA <= 2 ? 'Baik — soal cukup diskriminatif' : 'Sangat tinggi'} |`,
        );
        lines.push(
          `| b (kesulitan) | ${fmt(avgB, 3)} | ${fmt(Math.min(...bVals), 3)} | ${fmt(Math.max(...bVals), 3)} | ${fmt(stdDev(bVals), 3)} | ${avgB < -1 ? 'Mudah' : avgB <= 1 ? 'Sedang — tingkat kesulitan ideal' : 'Sulit'} |`,
        );
        lines.push(
          `| c (guessing) | ${fmt(avgC, 3)} | ${fmt(Math.min(...cVals), 3)} | ${fmt(Math.max(...cVals), 3)} | ${fmt(stdDev(cVals), 3)} | ${avgC < 0.1 ? 'Rendah — efek tebak minimal' : avgC <= 0.25 ? 'Wajar' : 'Tinggi — perlu perhatian'} |`,
        );
        lines.push(``);
        lines.push(`**Sebaran Tingkat Kesulitan (b):**`);
        lines.push(``);
        lines.push(`| Kategori | Jumlah | Distribusi |`);
        lines.push(`|----------|--------|------------|`);
        lines.push(
          `| Mudah (b < −1) | ${easyN} | \`${bar(easyN, maxDiff)}\` |`,
        );
        lines.push(
          `| Sedang (−1 ≤ b ≤ 1) | ${medN} | \`${bar(medN, maxDiff)}\` |`,
        );
        lines.push(`| Sulit (b > 1) | ${hardN} | \`${bar(hardN, maxDiff)}\` |`);
        lines.push(``);
        lines.push(`**Sebaran Daya Diskriminasi (a):**`);
        lines.push(``);
        lines.push(`| Kategori | Jumlah | Distribusi |`);
        lines.push(`|----------|--------|------------|`);
        lines.push(
          `| Rendah (a < 0.5) | ${lowA} | \`${bar(lowA, maxDisc)}\` |`,
        );
        lines.push(
          `| Baik (0.5 ≤ a ≤ 2) | ${goodA} | \`${bar(goodA, maxDisc)}\` |`,
        );
        lines.push(
          `| Sangat Tinggi (a > 2) | ${highA} | \`${bar(highA, maxDisc)}\` |`,
        );
        lines.push(``);

        // Item-level table
        lines.push(`### Tabel Parameter per Butir`);
        lines.push(``);
        lines.push(
          `| No. | a (diskriminasi) | b (kesulitan) | c (guessing) | Ket. Kesulitan | Ket. Diskriminasi |`,
        );
        lines.push(
          `|-----|-----------------|--------------|-------------|----------------|-------------------|`,
        );
        for (const q of question) {
          const diffLbl =
            q.b === null
              ? '—'
              : q.b < -1
                ? 'Mudah'
                : q.b <= 1
                  ? 'Sedang'
                  : 'Sulit';
          const discLbl =
            q.a === null
              ? '—'
              : q.a < 0.5
                ? 'Rendah'
                : q.a <= 2
                  ? 'Baik'
                  : 'Sangat Tinggi';
          lines.push(
            `| ${q.q} | ${q.a !== null ? fmt(q.a, 3) : '—'} | ${q.b !== null ? fmt(q.b, 3) : '—'} | ${q.c !== null ? fmt(q.c, 3) : '—'} | ${diffLbl} | ${discLbl} |`,
          );
        }
        lines.push(``);
      }

      // Interpretation / analysis narrative
      lines.push(`### Analisis & Interpretasi`);
      lines.push(``);
      const spreadRatio = sd / 100;
      lines.push(
        `- **Sebaran skor** ${spreadRatio < 0.7 ? 'sempit (homogen) — peserta memiliki kemampuan yang relatif merata.' : spreadRatio <= 1.3 ? 'normal — distribusi kemampuan peserta cukup bervariasi.' : 'lebar (heterogen) — terdapat perbedaan kemampuan yang signifikan antar peserta.'}`,
      );
      const aboveAvg = scores.filter((s) => s >= 500).length;
      lines.push(
        `- **${aboveAvg} peserta (${n > 0 ? ((aboveAvg / n) * 100).toFixed(1) : 0}%)** memperoleh skor ≥ 500 (di atas rata-rata nasional SNBT).`,
      );
      const below400 = scores.filter((s) => s < 400).length;
      if (below400 > 0)
        lines.push(
          `- **${below400} peserta (${((below400 / n) * 100).toFixed(1)}%)** memperoleh skor < 400 — perlu perhatian tambahan.`,
        );
      if (validQ.length > 0) {
        const avgA = aVals.reduce((s, v) => s + v, 0) / aVals.length;
        const avgB = bVals.reduce((s, v) => s + v, 0) / bVals.length;
        lines.push(
          `- **Rata-rata diskriminasi a=${fmt(avgA, 3)}**: ${avgA >= 0.5 ? 'soal secara keseluruhan memiliki daya beda yang baik.' : 'daya beda soal perlu ditingkatkan.'}`,
        );
        lines.push(
          `- **Rata-rata kesulitan b=${fmt(avgB, 3)}**: ${avgB < -0.5 ? 'paket soal cenderung mudah.' : avgB <= 0.5 ? 'tingkat kesulitan paket soal sudah ideal.' : 'paket soal cenderung sulit.'}`,
        );
      }
      lines.push(``);
      lines.push(`---`);
      lines.push(``);
    }

    lines.push(
      `*Laporan ini digenerate secara otomatis oleh sistem IRT Analyzer Bimbelio.*`,
    );

    const blob = new Blob([lines.join('\n')], {
      type: 'text/markdown;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IRT_${TryoutData?.title ?? tryoutId}_${now.toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toaster({
      title: 'Export Berhasil',
      condition: 'success',
      description: `Laporan IRT (${processedSessions.length} sesi) berhasil diunduh.`,
    });
  }

  // ── Derived stats ─────────────────────────────────────────────────────────────
  const savedCount = batchStates.filter((s) => s.status === 'saved').length;
  const doneCount = batchStates.filter(
    (s) => s.status === 'done' || s.status === 'saved',
  ).length;
  const totalSessions = batchStates.length;
  const pendingCount = batchStates.filter(
    (s) => s.status === 'idle' || s.status === 'error',
  ).length;
  const hasDoneResults = batchStates.some((s) => s.status === 'done');
  const batchProgressPct =
    totalSessions > 0 ? (doneCount / totalSessions) * 100 : 0;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-5 max-w-5xl">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-700 text-white border-0 shadow-lg overflow-hidden">
        <CardHeader className="pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-3xl">
              <Cpu className="h-7 w-7" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">
                IRT Analyzer
              </CardTitle>
              <CardDescription className="text-blue-100 text-sm mt-0.5">
                Item Response Theory — Model 3PL (Three-Parameter Logistic)
              </CardDescription>
            </div>
          </div>
          {TryoutData && (
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-white/20 text-sm text-blue-100">
              <span className="flex items-center gap-1.5 font-medium">
                <Users className="h-4 w-4" />
                {totalSessions} sesi
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-300" />
                {doneCount} diproses
              </span>
              <span className="flex items-center gap-1.5">
                <Save className="h-4 w-4 text-yellow-300" />
                {savedCount} tersimpan
              </span>
              {pendingCount > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-orange-300" />
                  {pendingCount} menunggu
                </span>
              )}
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Loading */}
      {isTryoutLoading && (
        <Card>
          <CardContent className="flex items-center justify-center gap-3 py-16 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="text-base">Mengambil data tryout…</span>
          </CardContent>
        </Card>
      )}

      {TryoutData && batchStates.length > 0 && (
        <>
          {/* Batch Controls */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Kontrol Batch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={runBatchProcess}
                  disabled={isBatchRunning || pendingCount === 0}
                  className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  {isBatchRunning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  Proses Semua Sesi
                  {pendingCount > 0 && (
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-xs font-bold">
                      {pendingCount}
                    </span>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={runBatchSave}
                  disabled={isBatchRunning || !hasDoneResults}
                  className="gap-2 border-green-200 text-green-700 hover:bg-green-50"
                >
                  {isBatchRunning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Simpan Semua Hasil
                </Button>

                <Button
                  variant="outline"
                  onClick={exportMarkdown}
                  disabled={
                    isBatchRunning ||
                    !batchStates.some(
                      (s) =>
                        s.result &&
                        (s.status === 'done' || s.status === 'saved'),
                    )
                  }
                  className="gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                  title="Export semua statistik ke file Markdown"
                >
                  <Download className="h-4 w-4" />
                  Export Laporan MD
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    refetchTryout();
                    setBatchStates(buildBatchStates(TryoutData));
                  }}
                  disabled={isBatchRunning}
                  title="Reset & Refresh"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              {/* Overall progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress keseluruhan</span>
                  <span className="font-medium">
                    {doneCount} / {totalSessions} sesi diproses
                  </span>
                </div>
                <Progress
                  value={batchProgressPct}
                  className="h-2 bg-muted"
                  classNameThumb="bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Session Cards */}
          <div className="space-y-3">
            {batchStates.map((session, idx) => {
              const isActive =
                session.status === 'processing' || session.status === 'saving';
              return (
                <Card
                  key={session.sessionId}
                  className={`transition-all duration-300 ${
                    isActive
                      ? 'ring-2 ring-blue-400/70 shadow-md shadow-blue-100'
                      : session.status === 'saved'
                        ? 'ring-1 ring-green-200'
                        : 'hover:shadow-sm'
                  }`}
                >
                  {/* Session header row */}
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3 flex-wrap min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-base leading-tight truncate">
                            {session.label}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Users className="h-3.5 w-3.5 shrink-0" />
                            {session.participantCount} peserta
                          </p>
                        </div>
                        <StatusBadge
                          status={session.status}
                          wasIrtDone={session.wasIrtDone}
                        />
                      </div>

                      {/* Per-session buttons */}
                      <div className="flex items-center gap-2 flex-wrap shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50 h-8"
                          disabled={
                            isBatchRunning || session.status === 'processing'
                          }
                          onClick={() => processSession(session.sessionId)}
                        >
                          {session.status === 'processing' ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Cpu className="h-3.5 w-3.5" />
                          )}
                          {session.wasIrtDone && session.status === 'idle'
                            ? 'Re-Proses'
                            : 'Proses'}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 text-green-700 border-green-200 hover:bg-green-50 h-8"
                          disabled={
                            isBatchRunning ||
                            session.status === 'saving' ||
                            !session.result ||
                            session.status === 'saved'
                          }
                          onClick={() => saveSession(session.sessionId)}
                        >
                          {session.status === 'saving' ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Save className="h-3.5 w-3.5" />
                          )}
                          Simpan
                        </Button>

                        {session.result && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="gap-1 text-muted-foreground h-8 px-2"
                            onClick={() =>
                              patchSession(session.sessionId, {
                                expanded: !session.expanded,
                              })
                            }
                          >
                            {session.expanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Processing indeterminate bar */}
                    {session.status === 'processing' && (
                      <div className="mt-3 space-y-1.5">
                        <p className="text-xs text-blue-600 animate-pulse font-medium">
                          Menjalankan model IRT 3PL via R… Ini mungkin memakan
                          beberapa menit.
                        </p>
                        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
                          <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-blue-500 animate-[shimmer_1.5s_ease-in-out_infinite]" />
                        </div>
                      </div>
                    )}

                    {/* Error */}
                    {session.status === 'error' && session.errorMsg && (
                      <p className="mt-2 text-sm text-red-600 flex items-start gap-1.5">
                        <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        {session.errorMsg}
                      </p>
                    )}
                  </CardHeader>

                  {/* Expandable result */}
                  {session.expanded && session.result && (
                    <>
                      <Separator />
                      <CardContent className="pt-5">
                        <ResultsOverview
                          result={session.result}
                          sessionLabel={session.label}
                        />
                      </CardContent>
                    </>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
