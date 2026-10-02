import { describe, expect, it } from 'vitest';
import { resolveRedirect } from './login-flow';

const ORIGIN = 'https://www.bimbelio.com';

describe('resolveRedirect', () => {
  it('menjaga path, query, dan hash internal', () => {
    expect(resolveRedirect('/price?planId=p1&voucherCode=HEMAT', ORIGIN)).toBe(
      '/price?planId=p1&voucherCode=HEMAT',
    );
    expect(resolveRedirect('/utbk/user/bimboard#x', ORIGIN)).toBe(
      '/utbk/user/bimboard#x',
    );
  });

  it('memperbaiki garis miring ganda dari kode lama', () => {
    expect(resolveRedirect('//price?planId=p1', ORIGIN)).toBe(
      '/price?planId=p1',
    );
  });

  it('menolak tujuan di luar situs', () => {
    expect(resolveRedirect('https://evil.example/phish', ORIGIN)).toBeNull();
  });

  it('kosong → null', () => {
    expect(resolveRedirect(null, ORIGIN)).toBeNull();
    expect(resolveRedirect('', ORIGIN)).toBeNull();
  });
});
