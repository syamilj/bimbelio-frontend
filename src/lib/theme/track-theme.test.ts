import { describe, expect, it } from 'vitest';
import {
  BRAND,
  contrast,
  hexToRgba,
  luminance,
  programColor,
  safeHex,
  trackProgram,
  trackThemeCss,
} from './track-theme';

describe('safeHex', () => {
  it('menerima hex 3 dan 6 digit', () => {
    expect(safeHex('#0066FF', '#000')).toBe('#0066ff');
    expect(safeHex(' #abc ', '#000')).toBe('#abc');
  });

  it('menolak nilai yang bisa menyuntikkan CSS', () => {
    expect(safeHex('red;}body{display:none', '#000')).toBe('#000');
    expect(safeHex('#12345', '#000')).toBe('#000');
    expect(safeHex(null, '#000')).toBe('#000');
  });
});

describe('kontras', () => {
  it('luminans putih = 1, hitam = 0', () => {
    expect(luminance('#fff')).toBeCloseTo(1);
    expect(luminance('#000000')).toBe(0);
  });

  it('putih di Biru Bimbelio lolos AA', () => {
    expect(contrast(BRAND, '#ffffff')).toBeGreaterThanOrEqual(4.5);
  });

  it('Tinta di lime & pink lolos AA (aksen di balik teks Tinta)', () => {
    expect(contrast('#0b1736', '#c6f432')).toBeGreaterThan(13);
    expect(contrast('#0b1736', '#ff5fa2')).toBeGreaterThan(6);
  });
});

describe('program track', () => {
  it('memetakan track ke program merek', () => {
    expect(trackProgram('snbt')).toBe('utbk');
    expect(trackProgram('core')).toBe('utbk');
    expect(trackProgram('tka')).toBe('utbk');
    expect(trackProgram('kedinasan')).toBe('kedinasan');
    expect(trackProgram('simak-ui')).toBe('campus');
    expect(trackProgram('um-ugm')).toBe('campus');
    expect(trackProgram(undefined)).toBe('utbk');
  });

  it('warna DB tidak dipakai: Kedinasan selalu merah merek', () => {
    expect(programColor('kedinasan')).toBe('#e0263b');
  });

  it('hanya menulis --program; --brand tetap Biru', () => {
    expect(trackThemeCss('kedinasan')).toBe(':root{--program:#e0263b;}');
    expect(trackThemeCss(null)).toBe(':root{--program:#0066ff;}');
  });
});

it('hexToRgba (kompatibilitas)', () => {
  expect(hexToRgba('#0066ff', 0.1)).toBe('rgba(0, 102, 255, 0.1)');
  expect(hexToRgba(undefined)).toBeUndefined();
});
