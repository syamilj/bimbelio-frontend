import { describe, expect, it } from 'vitest';
import { buildSession } from './provider-session-auth';

const raw = {
  id: 'u1',
  email: 'siswa@contoh.id',
  name: 'Siswa',
  role: 'USER',
  subsList: {
    utbk: {
      tier: 'PREMIUM',
      feature: {
        document: true,
        course: 'ALLOW',
        quiz: 'ALLOW',
        liveClass: true,
      },
    },
  },
  subsData: { utbk: [{ id: 's1' }] },
  subsPendingData: { utbk: [{ id: 'p1' }], all: [{ id: 'p-all' }] },
};

describe('buildSession', () => {
  it('memakai langganan milik track yang sedang dibuka', () => {
    const session = buildSession(raw, 'tok', 'utbk');
    expect(session.user.tier).toBe('PREMIUM');
    expect(session.user.feature.document).toBe(true);
    expect(session.user.subsList).toEqual([{ id: 's1' }]);
    expect(session.user.subsPendingList).toEqual([
      { id: 'p1' },
      { id: 'p-all' },
    ]);
  });

  it('track lain tidak mewarisi langganan', () => {
    const session = buildSession(raw, 'tok', 'stan');
    expect(session.user.tier).toBeNull();
    expect(session.user.feature.document).toBe(false);
    expect(session.user.subsList).toEqual([]);
    expect(session.user.subsPendingList).toEqual([{ id: 'p-all' }]);
  });

  it('peran khusus staf menimpa tier', () => {
    const session = buildSession(
      {
        ...raw,
        role: 'ADMIN',
        specialRole: { tier: 'STAFF', feature: { document: true } },
      },
      'tok',
      'stan',
    );
    expect(session.user.tier).toBe('STAFF');
  });
});
