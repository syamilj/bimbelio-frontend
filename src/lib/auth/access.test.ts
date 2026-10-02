import { describe, expect, it } from 'vitest';
import { decideAccess } from './access';

describe('decideAccess', () => {
  it('tanpa sesi → beranda', () => {
    expect(decideAccess('/utbk/user/bimboard', null)).toEqual({
      type: 'redirect',
      to: '/',
    });
  });

  it('siswa boleh masuk area user', () => {
    expect(decideAccess('/utbk/user/bimboard', { role: 'USER' })).toEqual({
      type: 'allow',
    });
  });

  it.each(['USER', 'PREMIUM'])('%s tidak boleh masuk admin', (role) => {
    expect(decideAccess('/utbk/admin/voucher', { role })).toEqual({
      type: 'redirect',
      to: '/',
    });
  });

  it.each(['ADMIN', 'SUPER_ADMIN', 'FINANCE'])(
    '%s boleh masuk admin',
    (role) => {
      expect(decideAccess('/utbk/admin/voucher', { role })).toEqual({
        type: 'allow',
      });
    },
  );

  it('kategori hanya untuk SUPER_ADMIN', () => {
    expect(decideAccess('/utbk/admin/category', { role: 'ADMIN' })).toEqual({
      type: 'redirect',
      to: '/404',
    });
    expect(
      decideAccess('/utbk/admin/category', { role: 'SUPER_ADMIN' }),
    ).toEqual({
      type: 'allow',
    });
  });
});
