import { describe, expect, it } from 'vitest';
import { currentInstallment, isOverdue, remaining, tierLabel } from './model';

const inst = (installmentNumber: number, isPaid: boolean) => ({
  installmentNumber,
  isPaid,
  dueDate: '2026-01-01',
});

describe('currentInstallment', () => {
  it('memilih cicilan belum lunas dengan nomor terkecil', () => {
    expect(
      currentInstallment([inst(3, false), inst(1, true), inst(2, false)])
        ?.installmentNumber,
    ).toBe(2);
  });

  it('semua lunas → cicilan terakhir', () => {
    expect(
      currentInstallment([inst(2, true), inst(1, true)])?.installmentNumber,
    ).toBe(2);
  });

  it('kosong → null', () => {
    expect(currentInstallment([])).toBeNull();
  });
});

it('isOverdue', () => {
  const now = new Date('2026-05-10T00:00:00Z');
  expect(isOverdue('2026-05-09', now)).toBe(true);
  expect(isOverdue('2026-05-11', now)).toBe(false);
});

it('tierLabel', () => {
  expect(tierLabel(null)).toBe('Gratis');
  expect(tierLabel('SUPER_ADMIN')).toBe('Premium');
  expect(tierLabel('BASIC')).toBe('BASIC');
});

it('remaining tidak negatif', () => {
  expect(remaining(10, 3)).toBe(7);
  expect(remaining(5, 9)).toBe(0);
  expect(remaining(undefined, undefined)).toBe(0);
});
