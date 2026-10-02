import { describe, expect, it } from 'vitest';
import {
  amountAfterVoucher,
  baseAmount,
  installmentSchedule,
  installmentTotal,
  isAlmostFull,
  isSoldOut,
  isValidWhatsapp,
  listPrice,
  normalizeWhatsapp,
  planCoins,
  planKind,
  pricePerDay,
  strikePercent,
  type PlanDataType,
} from './plan';

const makePlan = (overrides: Partial<PlanDataType> = {}) =>
  ({
    id: 'p1',
    slug: 'paket-intensif',
    name: 'Paket Intensif',
    price: 1_500_000,
    originalPrice: 2_000_000,
    discount: undefined,
    maxUsers: null,
    totalUsers: 0,
    PlanSubscription: {
      expireDays: 150,
      PlanSubscriptionBundle: [],
      PlanFeature: [],
    },
    PlanLimitation: null,
    PlanInstallmentConfig: null,
    PlanBenefit: [],
    Pivot_LiveClass_Plan: [],
    ...overrides,
  }) as unknown as PlanDataType;

const withInstallments = (amounts: number[]) =>
  makePlan({
    PlanInstallmentConfig: {
      totalInstallments: amounts.length,
      totalAmount: 0,
      gracePeriodDays: 3,
      // urutan sengaja diacak: fungsi harus mengurutkan sendiri
      PlanInstallmentSchedule: amounts
        .map((amount, i) => ({ installmentNumber: i + 1, amount }))
        .reverse(),
    },
  } as unknown as Partial<PlanDataType>);

describe('harga paket', () => {
  it('listPrice memakai harga voucher dari URL bila ada', () => {
    expect(listPrice(makePlan())).toBe(1_500_000);
    expect(listPrice(makePlan({ discount: 1_200_000 }))).toBe(1_200_000);
    expect(listPrice(makePlan({ discount: 0 }))).toBe(0);
  });

  it('strikePercent hanya bila harga coret lebih tinggi', () => {
    expect(strikePercent(makePlan())).toBe(25);
    expect(strikePercent(makePlan({ originalPrice: 1_000_000 }))).toBe(0);
    expect(strikePercent(makePlan({ originalPrice: null }))).toBe(0);
  });

  it('pricePerDay untuk langganan berdurasi', () => {
    expect(pricePerDay(makePlan())).toBe(10_000);
    expect(pricePerDay(makePlan({ PlanSubscription: null }))).toBeNull();
  });

  it('kuota: hampir penuh & habis', () => {
    expect(isAlmostFull(makePlan({ maxUsers: 10, totalUsers: 8 }))).toBe(true);
    expect(isSoldOut(makePlan({ maxUsers: 10, totalUsers: 10 }))).toBe(true);
    expect(isAlmostFull(makePlan({ maxUsers: 10, totalUsers: 10 }))).toBe(
      false,
    );
    expect(isSoldOut(makePlan())).toBe(false);
  });

  it('jenis paket', () => {
    expect(planKind(makePlan())).toBe('subscription');
    expect(planKind(makePlan({ PlanLimitation: { chat: 5 } as never }))).toBe(
      'bundle',
    );
    expect(
      planKind(
        makePlan({
          PlanSubscription: null,
          PlanLimitation: { chat: 5 } as never,
        }),
      ),
    ).toBe('coin');
  });

  it('koin hanya yang bernilai > 0', () => {
    const plan = makePlan({
      PlanLimitation: {
        chat: 50,
        notes: 0,
        vision: 10,
        quiz: 0,
        tryout: 3,
      } as never,
    });
    expect(planCoins(plan).map((c) => c.key)).toEqual([
      'chat',
      'vision',
      'tryout',
    ]);
  });
});

describe('cicilan', () => {
  it('jadwal diurutkan tanpa memutasi data asli', () => {
    const plan = withInstallments([500_000, 500_000, 600_000]);
    const original = plan.PlanInstallmentConfig!.PlanInstallmentSchedule.map(
      (s) => s.installmentNumber,
    );
    expect(installmentSchedule(plan).map((s) => s.installmentNumber)).toEqual([
      1, 2, 3,
    ]);
    expect(
      plan.PlanInstallmentConfig!.PlanInstallmentSchedule.map(
        (s) => s.installmentNumber,
      ),
    ).toEqual(original);
    expect(installmentTotal(plan)).toBe(1_600_000);
  });
});

describe('amountAfterVoucher', () => {
  it('voucher dihitung dari harga paket, bukan harga yang sudah terpotong voucher URL', () => {
    const plan = makePlan({ discount: 1_200_000 });
    expect(baseAmount(plan, 'FULL_PAYMENT')).toBe(1_500_000);
    expect(
      amountAfterVoucher(plan, 'FULL_PAYMENT', {
        type: 'Fixed_Amount',
        discount: 300_000,
      }),
    ).toBe(1_200_000);
  });

  it('persen untuk bayar penuh', () => {
    expect(
      amountAfterVoucher(makePlan(), 'FULL_PAYMENT', {
        type: 'Percentage',
        discount: 20,
      }),
    ).toBe(1_200_000);
  });

  it('persen untuk cicilan memotong cicilan pertama', () => {
    const plan = withInstallments([500_000, 500_000, 500_000]);
    expect(
      amountAfterVoucher(plan, 'INSTALLMENT', {
        type: 'Percentage',
        discount: 10,
      }),
    ).toBe(450_000);
  });

  it('nominal tetap untuk cicilan dibagi rata ke semua cicilan', () => {
    const plan = withInstallments([500_000, 500_000, 500_000]);
    expect(
      amountAfterVoucher(plan, 'INSTALLMENT', {
        type: 'Fixed_Amount',
        discount: 300_000,
      }),
    ).toBe(400_000);
  });

  it('voucher 100% dan nominal melebihi harga menghasilkan 0, tidak negatif', () => {
    expect(
      amountAfterVoucher(makePlan(), 'FULL_PAYMENT', {
        type: 'Percentage',
        discount: 100,
      }),
    ).toBe(0);
    expect(
      amountAfterVoucher(makePlan(), 'FULL_PAYMENT', {
        type: 'Fixed_Amount',
        discount: 9_999_999,
      }),
    ).toBe(0);
    expect(
      amountAfterVoucher(makePlan(), 'FULL_PAYMENT', {
        type: 'Percentage',
        discount: 150,
      }),
    ).toBe(0);
  });

  it('dibulatkan ke rupiah', () => {
    const plan = makePlan({ price: 99_999 });
    expect(
      amountAfterVoucher(plan, 'FULL_PAYMENT', {
        type: 'Percentage',
        discount: 33,
      }),
    ).toBe(66_999);
  });
});

describe('nomor WhatsApp', () => {
  it.each([
    ['0812 3456 7890', '+6281234567890'],
    ['81234567890', '+6281234567890'],
    ['+62 812-3456-7890', '+6281234567890'],
    ['6281234567890', '+6281234567890'],
  ])('%s → %s', (input, out) => {
    expect(normalizeWhatsapp(input)).toBe(out);
    expect(isValidWhatsapp(out)).toBe(true);
  });

  it('menolak nomor terlalu pendek atau bukan seluler', () => {
    expect(isValidWhatsapp(normalizeWhatsapp('0812'))).toBe(false);
    expect(isValidWhatsapp(normalizeWhatsapp('021 555 1234'))).toBe(false);
    expect(normalizeWhatsapp('')).toBe('');
  });
});
