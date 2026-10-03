import { describe, expect, it } from 'vitest';
import { NOW, participant, session, tryout } from '../fixtures.test-utils';
import { currentSessionIndex, deriveExamPhase, isQuizUnlocked } from './machine';

const ctx = { mode: 'try-out' as const, now: NOW };

describe('deriveExamPhase — alur utama', () => {
  it('belum-mulai: belum ada sesi yang dimulai', () => {
    expect(deriveExamPhase(tryout(), ctx)).toEqual({
      kind: 'belum-mulai',
      index: 0,
    });
  });

  it('sesi: sesi pertama sudah dimulai, belum selesai', () => {
    const t = tryout({
      TryoutSession: [
        session('s1', 1, { TryoutSessionParticipant: participant('s1') }),
        session('s2', 2),
      ],
    });
    expect(deriveExamPhase(t, ctx)).toEqual({ kind: 'sesi', index: 0 });
  });

  it('istirahat: sesi 1 selesai, sesi 2 belum dimulai', () => {
    const t = tryout({
      TryoutSession: [
        session('s1', 1, {
          TryoutSessionParticipant: participant('s1', { done: true }),
        }),
        session('s2', 2),
      ],
    });
    expect(deriveExamPhase(t, ctx)).toEqual({ kind: 'istirahat', index: 1 });
  });

  it('sesi lagi: sesi 2 dimulai setelah istirahat', () => {
    const t = tryout({
      TryoutSession: [
        session('s1', 1, {
          TryoutSessionParticipant: participant('s1', { done: true }),
        }),
        session('s2', 2, { TryoutSessionParticipant: participant('s2') }),
      ],
    });
    expect(deriveExamPhase(t, ctx)).toEqual({ kind: 'sesi', index: 1 });
  });

  it('hasil: semua sesi selesai', () => {
    const t = tryout({
      TryoutSession: [
        session('s1', 1, {
          TryoutSessionParticipant: participant('s1', { done: true }),
        }),
        session('s2', 2, {
          TryoutSessionParticipant: participant('s2', { done: true }),
        }),
      ],
    });
    expect(deriveExamPhase(t, ctx)).toEqual({ kind: 'hasil' });
  });

  it('indeks = sesudah sesi terakhir yang selesai (perilaku lama)', () => {
    expect(
      currentSessionIndex([
        session('s1', 1),
        session('s2', 2, {
          TryoutSessionParticipant: participant('s2', { done: true }),
        }),
        session('s3', 3),
      ]),
    ).toBe(2);
  });
});

describe('deriveExamPhase — gerbang', () => {
  it('belum-dibuka sebelum startDate, kecuali mode uji admin', () => {
    const t = tryout({ startDate: '2026-10-05T00:00:00.000Z' });
    expect(deriveExamPhase(t, ctx).kind).toBe('belum-dibuka');
    expect(deriveExamPhase(t, { ...ctx, testing: true }).kind).toBe(
      'belum-mulai',
    );
  });

  it('try out tanpa registrasi → tidak-terdaftar; quiz tidak butuh registrasi', () => {
    const t = tryout({ TryoutRegistration: [] });
    expect(deriveExamPhase(t, ctx).kind).toBe('tidak-terdaftar');
    expect(
      deriveExamPhase(t, {
        mode: 'quiz',
        now: NOW,
        quizFeature: 'ALLOW',
      }).kind,
    ).toBe('belum-mulai');
  });

  it('quiz terkunci tanpa fitur, kecuali quiz pertama di volume', () => {
    const q = { mode: 'quiz' as const, now: NOW, volumeId: 'v1' };
    expect(deriveExamPhase(tryout(), { ...q, quizFeature: [] }).kind).toBe(
      'terkunci',
    );
    expect(
      deriveExamPhase(tryout({ isFirstQuizInVolume: true }), {
        ...q,
        quizFeature: [],
      }).kind,
    ).toBe('belum-mulai');
    expect(deriveExamPhase(tryout(), { ...q, quizFeature: ['v1'] }).kind).toBe(
      'belum-mulai',
    );
  });

  it('quiz yang sudah lewat endDate → berakhir, tapi hasil tetap bisa dibuka', () => {
    const q = { mode: 'quiz' as const, now: NOW, quizFeature: 'ALLOW' as const };
    const ended = tryout({ endDate: '2026-10-02T00:00:00.000Z' });
    expect(deriveExamPhase(ended, q).kind).toBe('berakhir');
    const done = tryout({
      endDate: '2026-10-02T00:00:00.000Z',
      TryoutSession: [
        session('s1', 1, {
          TryoutSessionParticipant: participant('s1', { done: true }),
        }),
      ],
    });
    expect(deriveExamPhase(done, q).kind).toBe('hasil');
  });

  it('tanpa sesi → kosong', () => {
    expect(deriveExamPhase(tryout({ TryoutSession: [] }), ctx).kind).toBe(
      'kosong',
    );
  });

  it('isQuizUnlocked', () => {
    expect(isQuizUnlocked('ALLOW')).toBe(true);
    expect(isQuizUnlocked(['v1'], 'v1')).toBe(true);
    expect(isQuizUnlocked(['v1'], 'v2')).toBe(false);
    expect(isQuizUnlocked(null, 'v1')).toBe(false);
  });
});
