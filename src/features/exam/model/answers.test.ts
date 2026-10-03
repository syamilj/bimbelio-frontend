import { describe, expect, it } from 'vitest';
import { question } from '../fixtures.test-utils';
import {
  applySaved,
  emptySheet,
  mergeSaved,
  sheetReducer,
  sheetStats,
  toDraftAnswers,
  toSubmitAnswers,
  MAX_DRAFT_ANSWERS,
} from './answers';

const qs = [
  question('q1', 1),
  question('q2', 2),
  question('q3', 3, {
    type: 'SHORT_ANSWER',
    TryoutAnswers: [{ id: 'q3-k', questionId: 'q3', answer: '<p>42</p>' }],
  }),
];

describe('lembar jawaban', () => {
  it('pilih, pilih ulang = batal, ragu, isian', () => {
    let s = emptySheet(qs);
    s = sheetReducer(s, { type: 'pilih', index: 0, answerId: 'q1-b' });
    expect(s[0].answerId).toBe('q1-b');
    s = sheetReducer(s, { type: 'pilih', index: 0, answerId: 'q1-b' });
    expect(s[0].answerId).toBe('');
    s = sheetReducer(s, { type: 'ragu', index: 1 });
    expect(s[1].notSure).toBe(true);
    s = sheetReducer(s, { type: 'isian', index: 2, text: '42', answerId: 'q3-k' });
    expect(s[2]).toMatchObject({ answer: '42', answerId: 'q3-k' });
    // Teks dikosongkan → kembali belum dijawab (bug lama: tetap terhitung).
    s = sheetReducer(s, { type: 'isian', index: 2, text: '  ', answerId: 'q3-k' });
    expect(s[2].answerId).toBe('');
    expect(sheetStats(s)).toMatchObject({
      answered: 0,
      flagged: 1,
      empty: 3,
      flaggedNumbers: [2],
    });
  });

  it('payload kumpulkan berisi semua field yang diwajibkan backend', () => {
    let s = emptySheet(qs);
    s = sheetReducer(s, { type: 'pilih', index: 1, answerId: 'q2-c' });
    s = sheetReducer(s, { type: 'isian', index: 2, text: '42', answerId: 'q3-k' });
    expect(toSubmitAnswers(s)).toEqual([
      { number: 1, questionId: 'q1', answerId: '', answer: '', type: 'OBJECTIVE_5', notSure: false },
      { number: 2, questionId: 'q2', answerId: 'q2-c', answer: '', type: 'OBJECTIVE_5', notSure: false },
      { number: 3, questionId: 'q3', answerId: 'q3-k', answer: '42', type: 'SHORT_ANSWER', notSure: false },
    ]);
  });

  it('draft dibatasi 500 jawaban', () => {
    const many = Array.from({ length: 520 }, (_, i) => question(`x${i}`, i + 1));
    expect(toDraftAnswers(emptySheet(many))).toHaveLength(MAX_DRAFT_ANSWERS);
  });

  it('applySaved membuang opsi yang tidak lagi ada', () => {
    const s = applySaved(qs, [
      { questionId: 'q1', answerId: 'q1-z', notSure: true },
      { questionId: 'q2', answerId: 'q2-a', notSure: false },
    ]);
    expect(s[0]).toMatchObject({ answerId: '', notSure: true });
    expect(s[1].answerId).toBe('q2-a');
  });

  it('mergeSaved: yang lebih baru menang; teks isian diambil dari lokal', () => {
    const local = {
      updatedAt: 1000,
      answers: [{ questionId: 'q3', answerId: 'q3-k', answer: '42', notSure: false }],
    };
    const server = {
      updatedAt: new Date(2000).toISOString(),
      answers: [
        { questionId: 'q1', answerId: 'q1-a', notSure: false },
        { questionId: 'q3', answerId: 'q3-k', notSure: true },
      ],
    };
    const merged = mergeSaved(local, server)!;
    expect(merged.find((a) => a.questionId === 'q1')?.answerId).toBe('q1-a');
    expect(merged.find((a) => a.questionId === 'q3')).toMatchObject({
      answer: '42',
      notSure: true,
    });
    expect(mergeSaved({ ...local, updatedAt: 3000 }, server)).toBe(local.answers);
    expect(mergeSaved(null, null)).toBeNull();
  });
});
