import { describe, expect, it } from 'vitest';
import {
  brandInk,
  hexToRgba,
  luminance,
  safeHex,
  trackThemeCss,
} from './track-theme';

describe('safeHex', () => {
  it('menerima hex 3 dan 6 digit', () => {
    expect(safeHex('#0091FF', '#000')).toBe('#0091ff');
    expect(safeHex(' #abc ', '#000')).toBe('#abc');
  });

  it('menolak nilai yang bisa menyuntikkan CSS', () => {
    expect(safeHex('red;}body{display:none', '#000')).toBe('#000');
    expect(safeHex('#12345', '#000')).toBe('#000');
    expect(safeHex(null, '#000')).toBe('#000');
  });
});

describe('brandInk', () => {
  it('teks putih di atas biru brand', () => {
    expect(brandInk('#0091ff')).toBe('#ffffff');
  });

  it('teks gelap di atas warna track yang sangat terang', () => {
    expect(brandInk('#fde047')).toBe('#1b2230');
  });

  it('luminans putih = 1, hitam = 0', () => {
    expect(luminance('#fff')).toBeCloseTo(1);
    expect(luminance('#000000')).toBe(0);
  });
});

describe('trackThemeCss', () => {
  it('menulis variabel brand dari warna track', () => {
    expect(trackThemeCss('#7C3AED', '#A78BFA')).toBe(
      ':root{--brand:#7c3aed;--brand-2:#a78bfa;--brand-ink:#ffffff;}',
    );
  });

  it('jatuh ke warna bawaan bila data kosong', () => {
    expect(trackThemeCss(undefined, null)).toContain('--brand:#0091ff');
  });
});

it('hexToRgba (kompatibilitas)', () => {
  expect(hexToRgba('#0091ff', 0.1)).toBe('rgba(0, 145, 255, 0.1)');
  expect(hexToRgba(undefined)).toBeUndefined();
});
