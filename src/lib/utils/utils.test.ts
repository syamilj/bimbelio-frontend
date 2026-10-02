import { describe, expect, it } from 'vitest';
import {
  formatIDR,
  getPriceByDiscountFixedAmount,
  getPriceByDiscountPercentage,
} from './currency';
import { calculateDateDifference } from './date';
import { formatPhoneNumber } from './phone';
import { getSlug } from './slug';
import { sanitizeFileName } from './storage';

describe('currency', () => {
  it('format rupiah tanpa desimal', () => {
    expect(formatIDR(150000).replace(/\s/g, ' ')).toBe('Rp 150.000');
  });

  it('diskon persen dan nominal', () => {
    expect(getPriceByDiscountPercentage(200000, 25)).toBe(150000);
    expect(getPriceByDiscountFixedAmount(200000, 50000)).toBe(150000);
  });
});

describe('formatPhoneNumber', () => {
  it.each([
    ['0812-3456-789', '+628123456789'],
    ['8123456789', '+628123456789'],
    ['628123456789', '+628123456789'],
    ['+62 812 3456 789', '+628123456789'],
  ])('%s → %s', (input, expected) => {
    expect(formatPhoneNumber(input)).toBe(expected);
  });

  it('kosong → null', () => {
    expect(formatPhoneNumber('')).toBeNull();
    expect(formatPhoneNumber(undefined)).toBeNull();
  });
});

it('getSlug', () => {
  expect(getSlug('Tips Lolos UTBK 2027!')).toBe('tips-lolos-utbk-2027');
});

it('sanitizeFileName membuang karakter berbahaya', () => {
  const result = sanitizeFileName('../soal ujian (1).pdf');
  expect(result).not.toContain('/');
  expect(result).not.toContain(' ');
});

it('calculateDateDifference', () => {
  const diff = calculateDateDifference(
    '2026-01-01T00:00:00Z',
    '2026-01-02T01:30:00Z',
  );
  expect(diff).toMatchObject({
    totalHours: 25,
    hours: 1,
    minutes: 30,
    days: 1,
  });
  expect(calculateDateDifference(undefined, new Date())).toBeNull();
});
