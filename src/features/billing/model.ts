// Aturan langganan yang dipakai beberapa layar (menu langganan, pengaturan akun).

type InstallmentLike = {
  installmentNumber: number;
  isPaid: boolean;
  dueDate: string | Date;
};

/** Cicilan yang sedang berjalan: nomor terkecil yang belum lunas; bila semua lunas, cicilan terakhir. */
export function currentInstallment<T extends InstallmentLike>(
  installments: T[],
): T | null {
  if (installments.length === 0) return null;
  const sorted = [...installments].sort(
    (a, b) => a.installmentNumber - b.installmentNumber,
  );
  return sorted.find((i) => !i.isPaid) ?? sorted[sorted.length - 1];
}

export const isOverdue = (dueDate: string | Date, now = new Date()) =>
  new Date(dueDate).getTime() < now.getTime();

const PREMIUM_TIERS = new Set(['ADMIN', 'SUPER_ADMIN', 'PREMIUM']);

/** Label tier untuk ditampilkan ke siswa. */
export const tierLabel = (tier: string | null | undefined) =>
  !tier ? 'Gratis' : PREMIUM_TIERS.has(tier) ? 'Premium' : tier;

export const FEATURE_LABELS: Record<string, string> = {
  DOCUMENT: 'Dokumen & AI',
  COURSE: 'Course',
  LIVECLASS: 'Live class',
  QUIZ: 'Quiz',
};

export const COIN_LABELS = {
  chat: 'Chat AI',
  vision: 'Vision',
  notes: 'Catatan AI',
  quiz: 'Quiz AI',
  tryout: 'Try out',
} as const;

export type CoinKey = keyof typeof COIN_LABELS;
export const COIN_KEYS = Object.keys(COIN_LABELS) as CoinKey[];

/** Sisa koin (tidak pernah negatif). */
export const remaining = (
  limit: number | undefined,
  used: number | undefined,
) => Math.max(0, (limit ?? 0) - (used ?? 0));
