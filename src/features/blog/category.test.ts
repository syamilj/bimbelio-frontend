import { GraduationCap, Landmark, Lightbulb, Newspaper } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { categoryIcon, categoryLabel } from './category';

describe('kategori blog', () => {
  it('label huruf kalimat, singkatan ujian tetap kapital', () => {
    expect(categoryLabel('snbt')).toBe('SNBT');
    expect(categoryLabel('tips')).toBe('Tips');
    expect(categoryLabel('mandiri')).toBe('Mandiri');
  });

  it('ikon mengikuti jenis kategori', () => {
    expect(categoryIcon('snbt')).toBe(GraduationCap);
    expect(categoryIcon('tips belajar')).toBe(Lightbulb);
    expect(categoryIcon('kedinasan')).toBe(Landmark);
    expect(categoryIcon('pengumuman')).toBe(Newspaper);
  });
});
