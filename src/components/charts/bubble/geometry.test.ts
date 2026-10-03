import { describe, expect, it } from 'vitest';
import {
  fillLevels,
  heatLevels,
  ladderSteps,
  normalBins,
  percentileBelow,
  spreadColumns,
} from './geometry';

describe('fillLevels', () => {
  it('8 bubble = 0–800, bubble terakhir terisi sebagian', () => {
    expect(fillLevels(655, 100, 8)).toEqual([1, 1, 1, 1, 1, 1, 0.55, 0]);
  });
  it('dibatasi 0..1', () => {
    expect(fillLevels(-20, 100, 2)).toEqual([0, 0]);
    expect(fillLevels(900, 100, 8).every((v) => v === 1)).toBe(true);
  });
});

describe('ladderSteps', () => {
  it('kenaikan dari TO pertama (baseline nol)', () => {
    const steps = ladderSteps([548, 560, 600], 20);
    expect(steps.map((s) => s.rise)).toEqual([0, 12, 52]);
    expect(steps[0].bubbles).toEqual([0]);
    expect(steps[1].bubbles).toEqual([0.6]);
    expect(steps[2].bubbles).toEqual([1, 1, 0.6]);
  });
  it('skor di bawah TO pertama tidak membuat bubble negatif', () => {
    const [, down] = ladderSteps([600, 580], 10);
    expect(down.rise).toBe(-20);
    expect(down.bubbles).toEqual([0]);
  });
});

describe('sebaran', () => {
  const bins = [
    { from: 400, to: 500, count: 20 },
    { from: 500, to: 600, count: 60 },
    { from: 600, to: 700, count: 20 },
  ];
  it('1 bubble = 2% peserta', () => {
    expect(spreadColumns(bins, 612).map((c) => c.bubbles)).toEqual([
      10, 30, 10,
    ]);
  });
  it('menandai kelas "kamu" dan kelas yang sudah dilewati', () => {
    const cols = spreadColumns(bins, 612);
    expect(cols.map((c) => c.isYou)).toEqual([false, false, true]);
    expect(cols.map((c) => c.passed)).toEqual([true, true, false]);
  });
  it('persentil dengan interpolasi di dalam kelas', () => {
    expect(percentileBelow(bins, 600)).toBe(80);
    expect(percentileBelow(bins, 650)).toBe(90);
    expect(percentileBelow([], 650)).toBe(0);
  });
  it('kelas normal simetris di sekitar rata-rata', () => {
    const n = normalBins(400, 800, 50, 600, 80);
    expect(n).toHaveLength(8);
    expect(n[3].count).toBe(n[4].count);
  });
});

describe('heatLevels', () => {
  it('tingkat 0..4 relatif terhadap maksimum + puncak', () => {
    const { levels, peak } = heatLevels([
      [0, 1, 2],
      [4, 3, 0],
    ]);
    expect(levels).toEqual([
      [0, 1, 2],
      [4, 3, 0],
    ]);
    expect(peak).toEqual([1, 0]);
  });
  it('grid kosong aman', () => {
    expect(heatLevels([[0, 0]]).peak).toBeNull();
  });
});
