import type {
  ExamOption,
  ReviewAnswer,
  ScoreHistoryItem,
  SessionReview,
  SubtestResult,
  TryoutAnalysis,
} from '../types';

// ---------------------------------------------------------------- subtes

/** Singkatan resmi subtes UTBK; selain itu inisial kata (tanpa kata sambung). */
const KNOWN_CODES: Record<string, string> = {
  'penalaran umum': 'PU',
  'pengetahuan dan pemahaman umum': 'PPU',
  'kemampuan memahami bacaan dan menulis': 'PBM',
  'pemahaman bacaan dan menulis': 'PBM',
  'pengetahuan kuantitatif': 'PK',
  'literasi dalam bahasa indonesia': 'LBI',
  'literasi bahasa indonesia': 'LBI',
  'literasi dalam bahasa inggris': 'LBE',
  'literasi bahasa inggris': 'LBE',
  'penalaran matematika': 'PM',
};

const STOPWORDS = new Set(['dan', 'dalam', 'di', 'ke', 'dari', 'the', 'of', 'and']);

export function subtestCode(name: string) {
  const key = name.trim().toLowerCase().replace(/\s+/g, ' ');
  if (KNOWN_CODES[key]) return KNOWN_CODES[key];
  const words = key.split(/[\s/&-]+/).filter((w) => w && !STOPWORDS.has(w));
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words
    .map((w) => w[0])
    .join('')
    .slice(0, 4)
    .toUpperCase();
}

/** Kode unik untuk daftar subtes (kode kembar diberi nomor). */
export function subtestCodes(names: string[]) {
  const seen = new Map<string, number>();
  return names.map((n) => {
    const code = subtestCode(n);
    const count = (seen.get(code) ?? 0) + 1;
    seen.set(code, count);
    return count === 1 ? code : `${code}${count}`;
  });
}

export type SubtestRow = {
  id: string;
  name: string;
  code: string;
  category: string;
  score: number;
  correct: number;
  total: number;
  accuracy: number;
  ranking: number;
  participants: number;
};

export function subtestRows(analysis: TryoutAnalysis): SubtestRow[] {
  const list: SubtestResult[] = analysis.summaryTryout?.sessionResult ?? [];
  const codes = subtestCodes(list.map((s) => s.subCategory));
  return list.map((s, i) => ({
    id: s.id,
    name: s.subCategory,
    code: codes[i],
    category: s.category,
    score: s.score ?? 0,
    correct: s.correctAnswers ?? 0,
    total: s.totalQuestions ?? 0,
    accuracy: s.totalQuestions ? s.correctAnswers / s.totalQuestions : 0,
    ranking: s.ranking,
    participants: s.totalParticipants,
  }));
}

/**
 * Fokus = subtes yang paling perlu dikejar (skor terendah, lalu akurasi
 * terendah), maks. 3 — "terarah, bukan asal banyak".
 */
export function focusSubtests(rows: SubtestRow[], limit = 3) {
  return rows
    .filter((r) => r.total > 0)
    .slice()
    .sort((a, b) => a.score - b.score || a.accuracy - b.accuracy)
    .slice(0, limit);
}

/** Skala BubbleBars: 0–800 (UTBK), naik ke 1000 bila ada skor di atas 800. */
export const barsMax = (rows: { score: number }[]) =>
  rows.some((r) => r.score > 800) ? 1000 : 800;

// ---------------------------------------------------------------- posisi

/**
 * Persentase peserta yang skornya DI BAWAH kamu: (N − peringkat) / N.
 * Catatan: field `tryoutPersentage` backend = (N − peringkat + 1) / N, yang
 * dulu ditampilkan sebagai "Top X%" (peringkat 1 → "Top 100%", keliru).
 */
export function aboveShare(ranking: number, participants: number) {
  if (!participants || !ranking || ranking > participants) return null;
  return Math.floor(((participants - ranking) / participants) * 100);
}

/** "Top X%" yang benar: peringkat 1 dari 200 → 1%. */
export function topShare(ranking: number, participants: number) {
  if (!participants || !ranking || ranking > participants) return null;
  return Math.max(1, Math.ceil((ranking / participants) * 100));
}

// ---------------------------------------------------------------- riwayat

export type ScoreTrend = {
  scores: number[];
  labels: string[];
  /** Selisih dengan TO sebelumnya; null bila tidak ada pembanding. */
  delta: number | null;
  previousName: string | null;
};

/**
 * Riwayat skor TO (`getTryoutUserProgress`, urut waktu). TO ini dicari lewat
 * judul; bila tidak ketemu, riwayat dianggap sampai TO terakhir.
 */
export function scoreTrend(
  history: ScoreHistoryItem[] | undefined,
  title: string,
  currentScore: number,
): ScoreTrend {
  const list = (history ?? []).filter((h) => Number.isFinite(h.score));
  const idx = list.findIndex((h) => h.name === title);
  const past = idx >= 0 ? list.slice(0, idx) : list;
  const scores = [...past.map((h) => h.score), currentScore];
  const labels = scores.map((_, i) => `#${i + 1}`);
  const prev = past.at(-1);
  return {
    scores,
    labels,
    delta: prev ? Math.round(currentScore - prev.score) : null,
    previousName: prev?.name ?? null,
  };
}

// ---------------------------------------------------------------- review

/** Opsi benar = bobot tertinggi (perilaku lama). */
export function correctOption(options: ExamOption[] | undefined) {
  if (!options?.length) return null;
  return options.reduce((best, o) =>
    (o.value ?? -Infinity) > (best.value ?? -Infinity) ? o : best,
  );
}

export type ReviewStatus = 'benar' | 'salah' | 'kosong';

export function reviewStatus(item: ReviewAnswer): ReviewStatus {
  if (!item.TryoutAnswers) return 'kosong';
  const correct = correctOption(item.TryoutQuestion.TryoutAnswers);
  if (!correct) return 'kosong';
  return item.TryoutAnswers.id === correct.id ? 'benar' : 'salah';
}

/** Jawaban sesi urut nomor soal (backend tidak menjamin urutan). */
export const sortedReview = (review: SessionReview | undefined) =>
  (review?.TryoutUserAnswer ?? [])
    .slice()
    .sort(
      (a, b) => (a.TryoutQuestion?.number ?? 0) - (b.TryoutQuestion?.number ?? 0),
    );

export function reviewStats(items: ReviewAnswer[]) {
  let benar = 0;
  let salah = 0;
  let kosong = 0;
  for (const item of items) {
    const s = reviewStatus(item);
    if (s === 'benar') benar++;
    else if (s === 'salah') salah++;
    else kosong++;
  }
  const total = items.length;
  return { benar, salah, kosong, total, accuracy: total ? benar / total : 0 };
}

/** Bulatkan skor untuk tampilan: 612,4 → "612". */
export const formatScore = (n: number | null | undefined, digits = 0) =>
  (n ?? 0).toLocaleString('id-ID', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });

/** Poin per bubble di tangga skor: kelipatan 10, tangga maks. ±8 bubble. */
export function ladderPer(scores: number[]) {
  const base = scores[0] ?? 0;
  const rise = Math.max(0, ...scores.map((s) => s - base));
  return Math.max(10, Math.ceil(rise / 8 / 10) * 10);
}

/** Ekspresi Lio di rapor: naik → bintang, pertama kali → senang, turun/tetap → netral. */
export function scoreLio(delta: number | null) {
  if (delta === null) return 'senang' as const;
  if (delta > 0) return 'bintang' as const;
  // Lio tidak pernah sedih soal skor siswa (BRAND-2.1 §4).
  return 'netral' as const;
}
