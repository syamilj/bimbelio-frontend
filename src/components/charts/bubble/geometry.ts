// Tata letak chart bubble LJK (brand book Bimbelio 2.1, bab 08). Murni & diuji.
// Prinsip: satu seri satu warna, hanya SATU data disorot, baseline nol, skala
// selalu tertulis.

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/**
 * Isi tiap bubble untuk sebuah nilai: `count` bubble masing-masing bernilai
 * `per`. Bubble terakhir boleh terisi sebagian (0..1).
 * fillLevels(655, 100, 8) → [1,1,1,1,1,1,0.55,0]
 */
export const fillLevels = (value: number, per: number, count: number) =>
  Array.from({ length: count }, (_, i) => clamp01((value - i * per) / per));

/**
 * Tangga: kenaikan tiap TO dibanding TO pertama. Turun dibanding TO pertama
 * ditampilkan 0 (tangga tidak punya bubble negatif; angkanya tetap tertulis).
 */
export const ladderSteps = (scores: number[], per: number) => {
  const base = scores[0] ?? 0;
  return scores.map((s) => {
    const rise = Math.round(s - base);
    const n = rise > 0 ? Math.ceil(rise / per) : 1;
    return {
      score: s,
      rise,
      bubbles: rise > 0 ? fillLevels(rise, per, n) : [0],
    };
  });
};

export type SpreadBin = { from: number; to: number; count: number };

/**
 * Sebaran: 1 bubble = `pct`% peserta (default 2%). Mengembalikan jumlah
 * bubble per kelas dan kelas tempat skor `you` berada.
 */
export const spreadColumns = (bins: SpreadBin[], you: number, pct = 2) => {
  const total = bins.reduce((a, b) => a + b.count, 0) || 1;
  return bins.map((b) => ({
    ...b,
    bubbles: Math.round(((b.count / total) * 100) / pct),
    isYou: you >= b.from && you < b.to,
    passed: b.to <= you,
  }));
};

/** Persentase peserta yang skornya di bawah `you` (untuk "di atas 78% peserta"). */
export const percentileBelow = (bins: SpreadBin[], you: number) => {
  const total = bins.reduce((a, b) => a + b.count, 0);
  if (!total) return 0;
  let below = 0;
  for (const b of bins) {
    if (b.to <= you) below += b.count;
    else if (b.from < you)
      below += (b.count * (you - b.from)) / (b.to - b.from);
  }
  return Math.round((below / total) * 100);
};

/** Kelas sebaran normal — HANYA untuk data contoh / pratinjau berlabel. */
export const normalBins = (
  from: number,
  to: number,
  width: number,
  mean: number,
  sd: number,
  total = 1000,
): SpreadBin[] => {
  const out: SpreadBin[] = [];
  for (let x = from; x < to; x += width) {
    const z = (x + width / 2 - mean) / sd;
    const density = Math.exp((-z * z) / 2) / (sd * Math.sqrt(2 * Math.PI));
    out.push({
      from: x,
      to: x + width,
      count: Math.round(total * width * density),
    });
  }
  return out;
};

/**
 * Peta jam: nilai → tingkat 0..4 (0 = kosong). Tingkat dihitung relatif
 * terhadap nilai terbesar sehingga satu warna sekuensial cukup.
 */
export const heatLevels = (grid: number[][]) => {
  const max = Math.max(0, ...grid.flat());
  let peak: [number, number] | null = null;
  const levels = grid.map((row, r) =>
    row.map((v, c) => {
      if (max > 0 && v === max && !peak) peak = [r, c];
      return v <= 0 || max === 0 ? 0 : Math.max(1, Math.ceil((v / max) * 4));
    }),
  );
  return { levels, peak: peak as [number, number] | null, max };
};
