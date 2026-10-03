// Statistik & laporan IRT (3PL) — murni, dipakai halaman IRT dan ekspor .md.

import type { IrtResult, TryoutForIrt } from './types';

export function stdDev(values: number[]) {
  if (values.length === 0) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  return Math.sqrt(
    values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length,
  );
}

export function quantile(sorted: number[], p: number) {
  if (sorted.length === 0) return 0;
  const idx = p * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

const mean = (values: number[]) =>
  values.length ? values.reduce((s, v) => s + v, 0) / values.length : null;

export function buildDistribution(values: number[], buckets = 10) {
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = range / buckets;
  const counts = Array.from({ length: buckets }, (_, i) => ({
    label: `${(min + i * step).toFixed(0)}–${(min + (i + 1) * step).toFixed(0)}`,
    count: 0,
  }));
  for (const v of values) {
    const i = Math.min(Math.floor(((v - min) / range) * buckets), buckets - 1);
    counts[i].count++;
  }
  return counts;
}

export const SCORE_BRACKETS = [
  { label: '< 400', long: '< 400 (sangat rendah)', lo: -Infinity, hi: 400 },
  { label: '400–450', long: '400–450 (rendah)', lo: 400, hi: 450 },
  { label: '450–500', long: '450–500 (cukup)', lo: 450, hi: 500 },
  { label: '500–550', long: '500–550 (baik)', lo: 500, hi: 550 },
  { label: '550–600', long: '550–600 (sangat baik)', lo: 550, hi: 600 },
  { label: '≥ 600', long: '≥ 600 (unggul)', lo: 600, hi: Infinity },
];

export const difficultyLabel = (b: number | null) =>
  b === null ? '—' : b < -1 ? 'Mudah' : b <= 1 ? 'Sedang' : 'Sulit';
export const discriminationLabel = (a: number | null) =>
  a === null ? '—' : a < 0.5 ? 'Rendah' : a <= 2 ? 'Baik' : 'Sangat tinggi';

/** Ringkasan turunan dari hasil proses satu sesi. */
export function analyzeIrt(result: IrtResult) {
  const { participants, question, overallStats } = result;
  const scores = participants.map((p) => p.score);
  const thetas = participants.map((p) => p.theta);
  const sorted = [...scores].sort((a, b) => a - b);
  const sortedTheta = [...thetas].sort((a, b) => a - b);
  const sd = stdDev(scores);
  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);
  const synthetic =
    overallStats.transformMode === 'synthetic' ||
    overallStats.transformMode === 'pooled';
  const valid = question.filter(
    (q) => q.a !== null && q.b !== null && q.c !== null,
  );
  const a = valid.map((q) => q.a as number);
  const b = valid.map((q) => q.b as number);
  const c = valid.map((q) => q.c as number);
  return {
    n: sorted.length,
    sd,
    q1,
    q3,
    iqr: q3 - q1,
    thetaSd: stdDev(thetas),
    thetaQ1: quantile(sortedTheta, 0.25),
    thetaQ3: quantile(sortedTheta, 0.75),
    synthetic,
    displayMean:
      synthetic && overallStats.populationMean != null
        ? overallStats.populationMean
        : overallStats.averageScores,
    displaySd:
      synthetic && overallStats.populationSd != null
        ? overallStats.populationSd
        : sd,
    brackets: SCORE_BRACKETS.map((br) => ({
      ...br,
      count: scores.filter((s) => s >= br.lo && s < br.hi).length,
    })),
    scoreBuckets: buildDistribution(scores, 10),
    thetaBuckets: buildDistribution(thetas, 8),
    validCount: valid.length,
    totalItems: question.length,
    avgA: mean(a),
    avgB: mean(b),
    avgC: mean(c),
    a,
    b,
    c,
    difficulty: {
      easy: b.filter((x) => x < -1).length,
      medium: b.filter((x) => x >= -1 && x <= 1).length,
      hard: b.filter((x) => x > 1).length,
    },
    discrimination: {
      low: a.filter((x) => x < 0.5).length,
      good: a.filter((x) => x >= 0.5 && x <= 2).length,
      high: a.filter((x) => x > 2).length,
    },
  };
}

/** Sesi sudah pernah di-IRT bila ada soal yang punya parameter a, b, c. */
export function sessionIrtDone(session: TryoutForIrt['TryoutSession'][number]) {
  return session.TryoutSessionParticipant.some((p) =>
    p.TryoutUserAnswer.some(
      (u) =>
        u.TryoutQuestion.a_discrimination &&
        u.TryoutQuestion.b_difficulty &&
        u.TryoutQuestion.c_guessing,
    ),
  );
}

const fmt = (v: number, d = 2) => v.toFixed(d);
const bar = (count: number, max: number, width = 20) =>
  '█'.repeat(Math.round((count / Math.max(max, 1)) * width)).padEnd(width, '░');

/** Laporan Markdown semua sesi yang sudah diproses (sama dengan versi lama). */
export function buildIrtMarkdown(
  title: string,
  sessions: { label: string; result: IrtResult }[],
  now = new Date(),
) {
  const dateStr = now.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const L: string[] = [];
  L.push(`# Laporan Analisis IRT — ${title}`, '');
  L.push(`> **Digenerate pada:** ${dateStr}, pukul ${timeStr}  `);
  L.push('> **Model:** Item Response Theory 3PL (Three-Parameter Logistic)  ');
  L.push(
    '> **Metode estimasi θ:** Expected A Posteriori (EAP) · Prior N(0, σ²=25)  ',
  );
  L.push('> **Skala skor:** SNBT (Z-score → Mean=500, SD=100)', '', '---', '');
  L.push('## Ringkasan Semua Sesi', '');
  L.push('| Sesi | N | Mean | Median | SD | Min | Max | θ Mean | θ SD |');
  L.push('|------|---|------|--------|-----|-----|-----|--------|------|');
  for (const { label, result: r } of sessions) {
    const x = analyzeIrt(r);
    const o = r.overallStats;
    L.push(
      `| ${label} | ${o.totalParticipants} | ${fmt(o.averageScores, 1)} | ${fmt(o.medianScores, 1)} | ${fmt(x.sd, 1)} | ${fmt(o.minScores, 1)} | ${fmt(o.maxScores, 1)} | ${fmt(o.averageTheta, 3)} | ${fmt(x.thetaSd, 3)} |`,
    );
  }
  L.push('', '---', '');

  for (const { label, result: r } of sessions) {
    const x = analyzeIrt(r);
    const o = r.overallStats;
    const scores = r.participants.map((p) => p.score);
    L.push(`## ${label}`, '', '### Statistik Skor (Skala SNBT)', '');
    L.push('| Metrik | Nilai |', '|--------|-------|');
    L.push(`| Total Peserta | **${x.n}** |`);
    L.push(`| Rata-rata (Mean) | **${fmt(o.averageScores)}** |`);
    L.push(`| Median | **${fmt(o.medianScores)}** |`);
    L.push(`| Std. Deviasi | **${fmt(x.sd)}** |`);
    L.push(`| Nilai Tertinggi | **${fmt(o.maxScores)}** |`);
    L.push(`| Nilai Terendah | **${fmt(o.minScores)}** |`);
    L.push(`| Q1 (P25) | **${fmt(x.q1)}** |`);
    L.push(`| Q3 (P75) | **${fmt(x.q3)}** |`);
    L.push(`| IQR | **${fmt(x.iqr)}** |`, '');
    L.push('### Statistik Theta (θ) — Estimasi Kemampuan', '');
    L.push('| Metrik | Nilai |', '|--------|-------|');
    L.push(`| θ Rata-rata | **${fmt(o.averageTheta, 4)}** |`);
    L.push(`| θ Tertinggi | **${fmt(o.maxTheta, 4)}** |`);
    L.push(`| θ Terendah | **${fmt(o.minTheta, 4)}** |`);
    L.push(`| θ Std. Deviasi | **${fmt(x.thetaSd, 4)}** |`);
    L.push(`| θ Q1 (P25) | **${fmt(x.thetaQ1, 4)}** |`);
    L.push(`| θ Q3 (P75) | **${fmt(x.thetaQ3, 4)}** |`, '');
    L.push('### Distribusi Skor (Kategori SNBT)', '');
    const catMax = Math.max(...x.brackets.map((c) => c.count), 1);
    L.push('| Rentang | Jumlah | Persentase | Distribusi |');
    L.push('|---------|--------|------------|------------|');
    for (const c of x.brackets) {
      const pct = x.n > 0 ? ((c.count / x.n) * 100).toFixed(1) : '0.0';
      L.push(
        `| ${c.long} | ${c.count} | ${pct}% | \`${bar(c.count, catMax)}\` |`,
      );
    }
    L.push('');
    if (x.validCount > 0) {
      const { easy, medium, hard } = x.difficulty;
      const { low, good, high } = x.discrimination;
      const maxDiff = Math.max(easy, medium, hard, 1);
      const maxDisc = Math.max(low, good, high, 1);
      const invalid = x.totalItems - x.validCount;
      L.push('### Parameter Butir (Model 3PL)', '');
      L.push(
        `> ${x.validCount} / ${x.totalItems} soal berhasil diestimasi${invalid > 0 ? ` · ${invalid} soal tidak valid (tanpa variasi jawaban)` : ''}.`,
        '',
      );
      L.push('| Parameter | Rata-rata | Min | Max | SD | Interpretasi |');
      L.push('|-----------|-----------|-----|-----|----|--------------|');
      const avgA = x.avgA!;
      const avgB = x.avgB!;
      const avgC = x.avgC!;
      L.push(
        `| a (diskriminasi) | ${fmt(avgA, 3)} | ${fmt(Math.min(...x.a), 3)} | ${fmt(Math.max(...x.a), 3)} | ${fmt(stdDev(x.a), 3)} | ${avgA < 0.5 ? 'Rendah — soal kurang membedakan kemampuan' : avgA <= 2 ? 'Baik — soal cukup diskriminatif' : 'Sangat tinggi'} |`,
      );
      L.push(
        `| b (kesulitan) | ${fmt(avgB, 3)} | ${fmt(Math.min(...x.b), 3)} | ${fmt(Math.max(...x.b), 3)} | ${fmt(stdDev(x.b), 3)} | ${avgB < -1 ? 'Mudah' : avgB <= 1 ? 'Sedang — tingkat kesulitan ideal' : 'Sulit'} |`,
      );
      L.push(
        `| c (guessing) | ${fmt(avgC, 3)} | ${fmt(Math.min(...x.c), 3)} | ${fmt(Math.max(...x.c), 3)} | ${fmt(stdDev(x.c), 3)} | ${avgC < 0.1 ? 'Rendah — efek tebak minimal' : avgC <= 0.25 ? 'Wajar' : 'Tinggi — perlu perhatian'} |`,
        '',
      );
      L.push('**Sebaran Tingkat Kesulitan (b):**', '');
      L.push(
        '| Kategori | Jumlah | Distribusi |',
        '|----------|--------|------------|',
      );
      L.push(`| Mudah (b < −1) | ${easy} | \`${bar(easy, maxDiff)}\` |`);
      L.push(
        `| Sedang (−1 ≤ b ≤ 1) | ${medium} | \`${bar(medium, maxDiff)}\` |`,
      );
      L.push(`| Sulit (b > 1) | ${hard} | \`${bar(hard, maxDiff)}\` |`, '');
      L.push('**Sebaran Daya Diskriminasi (a):**', '');
      L.push(
        '| Kategori | Jumlah | Distribusi |',
        '|----------|--------|------------|',
      );
      L.push(`| Rendah (a < 0.5) | ${low} | \`${bar(low, maxDisc)}\` |`);
      L.push(`| Baik (0.5 ≤ a ≤ 2) | ${good} | \`${bar(good, maxDisc)}\` |`);
      L.push(
        `| Sangat Tinggi (a > 2) | ${high} | \`${bar(high, maxDisc)}\` |`,
        '',
      );
      L.push('### Tabel Parameter per Butir', '');
      L.push(
        '| No. | a (diskriminasi) | b (kesulitan) | c (guessing) | Ket. Kesulitan | Ket. Diskriminasi |',
      );
      L.push(
        '|-----|-----------------|--------------|-------------|----------------|-------------------|',
      );
      for (const q of r.question) {
        L.push(
          `| ${q.q} | ${q.a !== null ? fmt(q.a, 3) : '—'} | ${q.b !== null ? fmt(q.b, 3) : '—'} | ${q.c !== null ? fmt(q.c, 3) : '—'} | ${difficultyLabel(q.b)} | ${q.a === null ? '—' : q.a < 0.5 ? 'Rendah' : q.a <= 2 ? 'Baik' : 'Sangat Tinggi'} |`,
        );
      }
      L.push('');
    }
    L.push('### Analisis & Interpretasi', '');
    const spread = x.sd / 100;
    L.push(
      `- **Sebaran skor** ${spread < 0.7 ? 'sempit (homogen) — peserta memiliki kemampuan yang relatif merata.' : spread <= 1.3 ? 'normal — distribusi kemampuan peserta cukup bervariasi.' : 'lebar (heterogen) — terdapat perbedaan kemampuan yang signifikan antar peserta.'}`,
    );
    const above = scores.filter((s) => s >= 500).length;
    L.push(
      `- **${above} peserta (${x.n > 0 ? ((above / x.n) * 100).toFixed(1) : 0}%)** memperoleh skor ≥ 500 (di atas rata-rata nasional SNBT).`,
    );
    const below = scores.filter((s) => s < 400).length;
    if (below > 0)
      L.push(
        `- **${below} peserta (${((below / x.n) * 100).toFixed(1)}%)** memperoleh skor < 400 — perlu perhatian tambahan.`,
      );
    if (x.validCount > 0) {
      L.push(
        `- **Rata-rata diskriminasi a=${fmt(x.avgA!, 3)}**: ${x.avgA! >= 0.5 ? 'soal secara keseluruhan memiliki daya beda yang baik.' : 'daya beda soal perlu ditingkatkan.'}`,
      );
      L.push(
        `- **Rata-rata kesulitan b=${fmt(x.avgB!, 3)}**: ${x.avgB! < -0.5 ? 'paket soal cenderung mudah.' : x.avgB! <= 0.5 ? 'tingkat kesulitan paket soal sudah ideal.' : 'paket soal cenderung sulit.'}`,
      );
    }
    L.push('', '---', '');
  }
  L.push(
    '*Laporan ini digenerate secara otomatis oleh sistem IRT Analyzer Bimbelio.*',
  );
  return L.join('\n');
}
