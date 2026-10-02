import { describe, expect, it } from 'vitest';
import { adminRolesFor, decideAccess } from './access';

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

  it.each(['ADMIN', 'SUPER_ADMIN'])('%s boleh masuk admin', (role) => {
    expect(decideAccess('/utbk/admin/voucher', { role })).toEqual({
      type: 'allow',
    });
    expect(decideAccess('/utbk/admin', { role })).toEqual({ type: 'allow' });
  });

  it('FINANCE hanya boleh membuka transaksi', () => {
    const finance = { role: 'FINANCE' };
    expect(decideAccess('/utbk/admin/transaction', finance)).toEqual({
      type: 'allow',
    });
    for (const path of [
      '/utbk/admin',
      '/utbk/admin/voucher',
      '/utbk/admin/login',
      '/utbk/admin/users/online',
    ]) {
      expect(decideAccess(path, finance)).toEqual({
        type: 'redirect',
        to: '/utbk/admin/transaction',
      });
    }
  });

  it('kategori hanya untuk SUPER_ADMIN, per segmen', () => {
    expect(decideAccess('/utbk/admin/category', { role: 'ADMIN' })).toEqual({
      type: 'redirect',
      to: '/404',
    });
    expect(
      decideAccess('/utbk/admin/website-category', { role: 'ADMIN' }),
    ).toEqual({ type: 'redirect', to: '/404' });
    expect(
      decideAccess('/utbk/admin/category', { role: 'SUPER_ADMIN' }),
    ).toEqual({ type: 'allow' });
    expect(adminRolesFor('category-tryout/abc')).toEqual(['SUPER_ADMIN']);
  });

  it('kata "admin" di luar area admin tidak dianggap halaman admin', () => {
    expect(
      decideAccess('/utbk/user/bimcourse/admin-guide', { role: 'USER' }),
    ).toEqual({ type: 'allow' });
  });
});
