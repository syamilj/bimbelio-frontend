// Data contoh untuk tes unit/komponen mesin ujian. Bukan data produksi.
import type { ExamQuestion, ExamSession, ExamTryout } from './types';

export const question = (
  id: string,
  number: number,
  opts: Partial<ExamQuestion> = {},
): ExamQuestion => ({
  id,
  number,
  sessionId: 's1',
  question: `<p>Soal ${number}: berapakah $1+${number}$?</p>`,
  type: 'OBJECTIVE_5',
  TryoutAnswers: ['A', 'B', 'C', 'D', 'E'].map((l, i) => ({
    id: `${id}-${l.toLowerCase()}`,
    questionId: id,
    answer: `<p>Pilihan ${l}</p>`,
    value: i === 0 ? 5 : 0,
  })),
  ...opts,
});

export const session = (
  id: string,
  number: number,
  opts: Partial<ExamSession> = {},
): ExamSession => ({
  id,
  number,
  name: `Sesi ${number}`,
  duration: 30,
  assessmentType: 'IRT',
  TryoutCategory: { id: 'cat', name: 'TPS' },
  TryoutSubCategory: { id: `sub-${id}`, name: `Subtes ${number}` },
  TryoutQuestion: [question(`${id}-q1`, 1), question(`${id}-q2`, 2)],
  TryoutSessionParticipant: null,
  ...opts,
});

export const participant = (
  sessionId: string,
  opts: { done?: boolean; start?: string; end?: string | null } = {},
) => ({
  id: `p-${sessionId}`,
  userId: 'u1',
  sessionId,
  startSession: opts.start ?? '2026-10-03T08:00:00.000Z',
  endSession: opts.end ?? (opts.done ? '2026-10-03T08:20:00.000Z' : null),
  isDone: !!opts.done,
});

export const tryout = (opts: Partial<ExamTryout> = {}): ExamTryout => ({
  id: 'to1',
  title: 'TO UTBK #08',
  restTime: 5,
  startDate: '2026-10-01T00:00:00.000Z',
  endDate: '2026-10-10T00:00:00.000Z',
  resultDate: '2026-10-02T00:00:00.000Z',
  TryoutSession: [session('s1', 1), session('s2', 2)],
  TryoutRegistration: [{ id: 'r1' }],
  ...opts,
});

export const NOW = new Date('2026-10-03T08:10:00.000Z').getTime();
