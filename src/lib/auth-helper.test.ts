import Cookies from 'js-cookie';
import { HttpResponse, http as mswHttp } from 'msw';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { API, server } from '../../test/msw/server';
import {
  getAuthToken,
  hasSession,
  migrateSession,
  setAuthToken,
} from './auth-helper';

const clearCookies = () => {
  for (const name of Object.keys(Cookies.get())) Cookies.remove(name);
};

afterEach(() => {
  vi.unstubAllEnvs();
  clearCookies();
});

describe('mode token JS (bawaan, preview)', () => {
  it('menyimpan token hasil login di cookie', () => {
    setAuthToken('abc');
    expect(getAuthToken()).toBe('abc');
    expect(hasSession()).toBe(true);
  });
});

describe('mode cookie httpOnly', () => {
  it('tidak menyimpan token di cookie yang bisa dibaca JS', () => {
    vi.stubEnv('NEXT_PUBLIC_SESSION_COOKIE', 'httponly');
    document.cookie = 'bimbelio_auth=1; path=/';
    setAuthToken('abc');
    expect(getAuthToken()).toBeUndefined();
  });

  it('tetap menyimpan token bila backend belum memasang cookie sesi', () => {
    vi.stubEnv('NEXT_PUBLIC_SESSION_COOKIE', 'httponly');
    setAuthToken('abc');
    expect(getAuthToken()).toBe('abc');
  });

  it('mengenali sesi dari cookie penanda backend', () => {
    vi.stubEnv('NEXT_PUBLIC_SESSION_COOKIE', 'httponly');
    expect(hasSession()).toBe(false);
    document.cookie = 'bimbelio_auth=1; path=/';
    expect(hasSession()).toBe(true);
  });

  it('memindahkan token lama ke cookie httpOnly lalu menghapusnya', async () => {
    vi.stubEnv('NEXT_PUBLIC_SESSION_COOKIE', 'httponly');
    document.cookie = 'token=lama; path=/';
    let auth: string | null = null;
    server.use(
      mswHttp.post(`${API}/auth/sessionCookie`, ({ request }) => {
        auth = request.headers.get('authorization');
        return HttpResponse.json({ status: 200, message: 'OK', data: null });
      }),
    );
    await migrateSession();
    expect(auth).toBe('Bearer lama');
    expect(getAuthToken()).toBeUndefined();
  });

  it('token tetap disimpan bila migrasi gagal karena server', async () => {
    vi.stubEnv('NEXT_PUBLIC_SESSION_COOKIE', 'httponly');
    document.cookie = 'token=lama; path=/';
    server.use(
      mswHttp.post(`${API}/auth/sessionCookie`, () =>
        HttpResponse.json({ status: 500, message: 'x' }, { status: 500 }),
      ),
    );
    await migrateSession();
    expect(getAuthToken()).toBe('lama');
  });
});
