// Model paket belajar (plan) & aturan harga. Murni — dipakai server dan klien.
import type {
  Category,
  Instructor,
  LiveClass,
  Pivot_LiveClass_Plan,
  Pivot_Plan_Category,
  Plan,
  PlanBenefit,
  PlanFeature,
  PlanInstallmentConfig,
  PlanInstallmentSchedule,
  PlanInstallmentScheduleLimitation,
  PlanLimitation,
  PlanSubscription,
  PlanSubscriptionBundle,
  WebsiteSubCategory,
} from '@/types/database';

export type PlanFeatureWithCategory = PlanFeature & {
  Pivot_Plan_Category: (Pivot_Plan_Category & { Category: Category })[];
};

export type PlanInstallmentWithSchedule = PlanInstallmentConfig & {
  PlanInstallmentSchedule: (PlanInstallmentSchedule & {
    PlanInstallmentScheduleLimitation: PlanInstallmentScheduleLimitation | null;
  })[];
};

export type PlanDataType = Plan & {
  totalUsers: number;
  PlanBenefit: PlanBenefit[];
  PlanLimitation: PlanLimitation | null;
  /** Dari endpoint daftar saat `?voucherCode=`: HARGA SETELAH diskon (bukan nominal diskon). */
  discount: number | undefined;
  PlanSubscription:
    | (PlanSubscription & {
        PlanSubscriptionBundle: PlanSubscriptionBundle[];
        PlanFeature: PlanFeatureWithCategory[];
        WebsiteSubCategory: WebsiteSubCategory;
      })
    | null;
  Pivot_LiveClass_Plan: (Pivot_LiveClass_Plan & {
    LiveClass: LiveClass & { Instructor: Instructor };
  })[];
  PlanInstallmentConfig: PlanInstallmentWithSchedule | null;
  timeline: string;
};

export type PaymentMethod = 'FULL_PAYMENT' | 'INSTALLMENT';

export type Voucher = { type: 'Fixed_Amount' | 'Percentage'; discount: number };

/** Jenis paket: langganan, bundel (langganan + koin), atau koin saja. */
export function planKind(
  plan: Pick<PlanDataType, 'PlanSubscription' | 'PlanLimitation'>,
) {
  if (plan.PlanSubscription && plan.PlanLimitation) return 'bundle' as const;
  if (plan.PlanSubscription) return 'subscription' as const;
  if (plan.PlanLimitation) return 'coin' as const;
  return 'other' as const;
}

/** Harga penuh yang dibayar: harga voucher URL bila ada, selain itu harga paket. */
export const listPrice = (plan: Pick<PlanDataType, 'price' | 'discount'>) =>
  plan.discount != null && plan.discount >= 0 ? plan.discount : plan.price;

/** Persen potongan dari harga coret (0 bila tidak ada harga coret yang lebih tinggi). */
export function strikePercent(
  plan: Pick<PlanDataType, 'originalPrice' | 'price'>,
) {
  const original = plan.originalPrice ?? 0;
  if (!original || original <= plan.price) return 0;
  return Math.round(((original - plan.price) / original) * 100);
}

export const isSoldOut = (
  plan: Pick<PlanDataType, 'maxUsers' | 'totalUsers'>,
) => !!plan.maxUsers && plan.totalUsers >= plan.maxUsers;

export const isAlmostFull = (
  plan: Pick<PlanDataType, 'maxUsers' | 'totalUsers'>,
) =>
  !!plan.maxUsers && !isSoldOut(plan) && plan.totalUsers >= plan.maxUsers * 0.8;

/** Jadwal cicilan terurut (tidak memutasi data asli). */
export const installmentSchedule = (
  plan: Pick<PlanDataType, 'PlanInstallmentConfig'>,
) =>
  [...(plan.PlanInstallmentConfig?.PlanInstallmentSchedule ?? [])].sort(
    (a, b) => a.installmentNumber - b.installmentNumber,
  );

export function installmentTotal(
  plan: Pick<PlanDataType, 'PlanInstallmentConfig'>,
) {
  const schedule = installmentSchedule(plan);
  const sum = schedule.reduce((acc, item) => acc + item.amount, 0);
  return sum || plan.PlanInstallmentConfig?.totalAmount || 0;
}

/**
 * Nominal yang dibayar sekarang SEBELUM voucher. Sengaja memakai `plan.price`
 * (bukan `listPrice`): voucher dari URL sudah tercermin di `plan.discount` dan
 * akan dicek ulang di checkout — memakai harga terdiskon akan memotong dua kali.
 */
export function baseAmount(plan: PlanDataType, method: PaymentMethod) {
  if (method === 'INSTALLMENT')
    return installmentSchedule(plan)[0]?.amount ?? 0;
  return plan.price;
}

/**
 * Nominal setelah voucher, dibulatkan dan tidak pernah negatif.
 * - Persen: dipotong dari nominal yang dibayar sekarang (cicilan pertama bila mencicil).
 * - Nominal tetap: bayar penuh → dipotong langsung; cicilan → dibagi rata ke
 *   seluruh cicilan, sehingga cicilan pertama dipotong porsinya.
 */
export function amountAfterVoucher(
  plan: PlanDataType,
  method: PaymentMethod,
  voucher: Voucher,
) {
  const base = baseAmount(plan, method);
  let next: number;
  if (voucher.type === 'Percentage') {
    next = base * (1 - Math.min(Math.max(voucher.discount, 0), 100) / 100);
  } else if (method === 'INSTALLMENT') {
    const count = Math.max(installmentSchedule(plan).length, 1);
    next = base - voucher.discount / count;
  } else {
    next = base - voucher.discount;
  }
  return Math.max(0, Math.round(next));
}

/** Biaya rata-rata per hari untuk langganan berdurasi. */
export function pricePerDay(plan: PlanDataType) {
  const days = plan.PlanSubscription?.expireDays;
  if (!days || days <= 0) return null;
  return Math.floor(listPrice(plan) / days);
}

export const FEATURE_TYPE_LABEL: Record<string, string> = {
  COURSE: 'Video course',
  DOCUMENT: 'Dokumen & materi',
  LIVECLASS: 'Live class',
  PRIVATE: 'Kelas privat',
};

export const COIN_FIELDS = [
  'chat',
  'notes',
  'vision',
  'quiz',
  'tryout',
] as const;
export const COIN_FIELD_LABEL: Record<(typeof COIN_FIELDS)[number], string> = {
  chat: 'Chat AI',
  notes: 'Catatan AI',
  vision: 'Vision AI',
  quiz: 'Quiz',
  tryout: 'Try out',
};

/** Kuota koin yang diberikan paket (hanya yang > 0). */
export function planCoins(plan: Pick<PlanDataType, 'PlanLimitation'>) {
  const limit = plan.PlanLimitation;
  if (!limit) return [];
  return COIN_FIELDS.map((key) => ({
    key,
    label: COIN_FIELD_LABEL[key],
    value: limit[key] ?? 0,
  })).filter((c) => c.value > 0);
}

/** Track (jalur ujian) yang dicakup paket. */
export function planTracks(plan: PlanDataType): string[] {
  const bundle = plan.PlanSubscription?.PlanSubscriptionBundle ?? [];
  if (bundle.length > 0)
    return bundle.map((b) => b.websiteSubCategoryId.toUpperCase());
  const single = plan.PlanSubscription?.WebsiteSubCategory?.name;
  return single ? [single] : [];
}

/** Normalisasi nomor WhatsApp ke +62… dan validasi panjang minimal. */
export function normalizeWhatsapp(value: string) {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('62')) return `+${digits}`;
  if (digits.startsWith('0')) return `+62${digits.slice(1)}`;
  if (digits.startsWith('8')) return `+62${digits}`;
  return `+${digits}`;
}

export const isValidWhatsapp = (value: string) => /^\+628\d{7,12}$/.test(value);
