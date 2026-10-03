import { describe, expect, it } from 'vitest';
import { participant, session, tryout } from '../fixtures.test-utils';
import {
  CLAMP_TO_TRYOUT_END,
  clockOffset,
  formatClock,
  restDeadline,
  sessionDeadline,
  timerLevel,
} from './timer';

describe('timer', () => {
  it('selisih jam server', () => {
    expect(clockOffset('2026-10-03T08:00:10.000Z', Date.parse('2026-10-03T08:00:00.000Z'))).toBe(10_000);
    expect(clockOffset(undefined, 123)).toBe(0);
    expect(clockOffset('bukan tanggal', 123)).toBe(0);
  });

  it('batas sesi = mulai + durasi; dipotong endDate untuk tryout tertentu', () => {
    const s = session('s1', 1, {
      duration: 30,
      TryoutSessionParticipant: participant('s1', { start: '2026-10-03T08:00:00.000Z' }),
    });
    expect(sessionDeadline(s, tryout())).toBe(Date.parse('2026-10-03T08:30:00.000Z'));
    expect(sessionDeadline(session('s2', 2), tryout())).toBeNull();
    const id = [...CLAMP_TO_TRYOUT_END][0];
    expect(
      sessionDeadline(s, tryout({ id, endDate: '2026-10-03T08:10:00.000Z' })),
    ).toBe(Date.parse('2026-10-03T08:10:00.000Z'));
  });

  it('istirahat = endSession sebelumnya + restTime; tanpa endSession dihitung dari sekarang', () => {
    const t = tryout({
      restTime: 5,
      TryoutSession: [
        session('s1', 1, {
          TryoutSessionParticipant: participant('s1', {
            done: true,
            end: '2026-10-03T08:20:00.000Z',
          }),
        }),
        session('s2', 2),
      ],
    });
    expect(restDeadline(t, 1, 0)).toBe(Date.parse('2026-10-03T08:25:00.000Z'));
    const noEnd = tryout({
      restTime: 5,
      TryoutSession: [
        session('s1', 1, {
          TryoutSessionParticipant: { ...participant('s1', { done: true }), endSession: null },
        }),
        session('s2', 2),
      ],
    });
    expect(restDeadline(noEnd, 1, 1000)).toBe(1000 + 5 * 60_000);
  });

  it('level peringatan & format', () => {
    expect(timerLevel(20 * 60_000, 30 * 60_000)).toBe('normal');
    expect(timerLevel(9 * 60_000, 30 * 60_000)).toBe('peringatan');
    expect(timerLevel(4 * 60_000, 30 * 60_000)).toBe('kritis');
    expect(formatClock(3_725_000)).toBe('1:02:05');
    expect(formatClock(125_000)).toBe('02:05');
    expect(formatClock(-5)).toBe('00:00');
  });
});
