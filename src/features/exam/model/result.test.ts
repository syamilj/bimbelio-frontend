import { describe, expect, it } from 'vitest';
import type { ReviewAnswer, TryoutAnalysis } from '../types';
import {
  aboveShare,
  barsMax,
  focusSubtests,
  reviewStats,
  reviewStatus,
  scoreLio,
  scoreTrend,
  subtestCode,
  subtestCodes,
  subtestRows,
  topShare,
} from './result';

const analysis = (scores: [string, number, number, number][]): TryoutAnalysis =>
  ({
    userScore: 600,
    totalParticipants: 200,
    summaryTryout: {
      userScore: 600,
      Result: [],
      sessionResult: scores.map(([name, score, correct, total], i) => ({
        id: `r${i}`,
        category: 'TPS',
        subCategory: name,
        correctAnswers: correct,
        wrongAnswers: total - correct,
        totalQuestions: total,
        score,
        totalParticipants: 200,
        ranking: 10 + i,
      })),
    },
    choiceAnalisis: {
      userScore: 600,
      rankingTryout: 44,
      tryoutPersentage: 78,
      rankingUniv: 0,
      rankingMajor: 0,
      university: [],
    },
  }) as TryoutAnalysis;

describe('kode subtes', () => {
  it('memakai singkatan resmi UTBK dan inisial untuk lainnya', () => {
    expect(subtestCode('Penalaran Umum')).toBe('PU');
    expect(subtestCode('Pengetahuan dan Pemahaman Umum')).toBe('PPU');
    expect(subtestCode('Literasi dalam Bahasa Inggris')).toBe('LBE');
    expect(subtestCode('Tes Wawasan Kebangsaan')).toBe('TWK');
    expect(subtestCode('Matematika')).toBe('MAT');
  });
  it('kode kembar diberi nomor', () => {
    expect(subtestCodes(['Tes A', 'Tes Aman'])).toEqual(['TA', 'TA2']);
  });
});

describe('pemetaan rapor', () => {
  const a = analysis([
    ['Penalaran Umum', 640, 15, 20],
    ['Pengetahuan Kuantitatif', 480, 8, 20],
    ['Penalaran Matematika', 520, 10, 20],
    ['Literasi dalam Bahasa Indonesia', 700, 18, 20],
  ]);
  const rows = subtestRows(a);

  it('baris subtes dengan kode & akurasi', () => {
    expect(rows[1]).toMatchObject({ code: 'PK', score: 480, accuracy: 0.4 });
  });

  it('fokus = 3 subtes skor terendah', () => {
    expect(focusSubtests(rows).map((r) => r.code)).toEqual(['PK', 'PM', 'PU']);
  });

  it('skala batang naik ke 1000 bila ada skor > 800', () => {
    expect(barsMax(rows)).toBe(800);
    expect(barsMax([{ score: 912 }])).toBe(1000);
  });

  it('posisi: "di atas X%" dan "top X%" dihitung benar', () => {
    expect(aboveShare(44, 200)).toBe(78);
    expect(aboveShare(1, 200)).toBe(99);
    expect(topShare(1, 200)).toBe(1);
    expect(topShare(44, 200)).toBe(22);
    expect(aboveShare(0, 0)).toBeNull();
  });
});

describe('riwayat skor', () => {
  const history = [
    { name: 'TO #06', score: 560 },
    { name: 'TO #07', score: 587 },
    { name: 'TO #08', score: 600 },
    { name: 'TO #09', score: 610 },
  ];
  it('selisih dengan TO sebelum TO ini', () => {
    const t = scoreTrend(history, 'TO #08', 600);
    expect(t.delta).toBe(13);
    expect(t.previousName).toBe('TO #07');
    expect(t.scores).toEqual([560, 587, 600]);
  });
  it('TO pertama → tanpa selisih; tidak ketemu → dibanding TO terakhir', () => {
    expect(scoreTrend(history, 'TO #06', 560).delta).toBeNull();
    expect(scoreTrend(history, 'TO baru', 598).delta).toBe(-12);
    expect(scoreTrend(undefined, 'x', 500).scores).toEqual([500]);
  });
  it('Lio: naik bintang, turun netral (tidak pernah sedih)', () => {
    expect(scoreLio(13)).toBe('bintang');
    expect(scoreLio(-16)).toBe('netral');
    expect(scoreLio(null)).toBe('senang');
  });
});

describe('status pembahasan', () => {
  const item = (picked: string | null): ReviewAnswer =>
    ({
      id: 'ua',
      questionId: 'q',
      answerId: picked,
      TryoutAnswers: picked ? { id: picked, questionId: 'q', answer: '' } : null,
      TryoutQuestion: {
        id: 'q',
        number: 1,
        sessionId: 's',
        question: '',
        type: 'OBJECTIVE_5',
        TryoutAnswers: [
          { id: 'a', questionId: 'q', answer: '', value: 0 },
          { id: 'b', questionId: 'q', answer: '', value: 5 },
        ],
      },
      difficultyQuestion: null,
    }) as ReviewAnswer;

  it('benar/salah/kosong dari opsi berbobot tertinggi', () => {
    expect(reviewStatus(item('b'))).toBe('benar');
    expect(reviewStatus(item('a'))).toBe('salah');
    expect(reviewStatus(item(null))).toBe('kosong');
    expect(reviewStats([item('b'), item('a'), item(null)])).toMatchObject({
      benar: 1,
      salah: 1,
      kosong: 1,
    });
  });
});
