import { describe, expect, it } from 'vitest';
import { isAdminItemActive, visibleAdminNav } from './admin-nav';

const labels = (role: string | undefined, core = false) =>
  visibleAdminNav(role, core).flatMap((s) => s.items.map((i) => i.label));

describe('visibleAdminNav', () => {
  it('SUPER_ADMIN melihat semua menu termasuk kategori', () => {
    expect(labels('SUPER_ADMIN')).toEqual(
      expect.arrayContaining([
        'Kategori dokumen',
        'Kategori try out',
        'Kategori website',
        'Transaksi',
      ]),
    );
  });

  it('ADMIN tidak melihat menu kategori khusus super admin', () => {
    const list = labels('ADMIN');
    expect(list).not.toContain('Kategori dokumen');
    expect(list).not.toContain('Kategori try out');
    expect(list).not.toContain('Kategori website');
    expect(list).toContain('Try out');
  });

  it('FINANCE hanya melihat transaksi', () => {
    expect(labels('FINANCE')).toEqual(['Transaksi']);
  });

  it('track CORE hanya menampilkan menu materi', () => {
    expect(labels('SUPER_ADMIN', true)).toEqual([
      'Dashboard',
      'Kategori dokumen',
      'Dokumen',
      'Course',
      'Kategori website',
    ]);
  });

  it('role tak dikenal tidak melihat apa pun', () => {
    expect(labels('USER')).toEqual([]);
    expect(labels(undefined)).toEqual([]);
  });
});

describe('isAdminItemActive', () => {
  const base = '/utbk/admin';
  it('dashboard hanya aktif di halaman dashboard', () => {
    expect(isAdminItemActive(base, base, true)).toBe(true);
    expect(isAdminItemActive(`${base}/voucher`, base, true)).toBe(false);
  });

  it('tryout tidak aktif di tryout-coupon', () => {
    expect(
      isAdminItemActive(`${base}/tryout-coupon`, `${base}/tryout`, false),
    ).toBe(false);
    expect(
      isAdminItemActive(`${base}/tryout/edit/1`, `${base}/tryout`, false),
    ).toBe(true);
  });

  it('quiz tidak aktif di quiz-volume, category tidak aktif di category-tryout', () => {
    expect(
      isAdminItemActive(`${base}/quiz-volume`, `${base}/quiz`, false),
    ).toBe(false);
    expect(
      isAdminItemActive(`${base}/category-tryout`, `${base}/category`, false),
    ).toBe(false);
  });
});
