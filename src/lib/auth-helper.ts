import { env } from '@/env.mjs';
import Cookies from 'js-cookie';
import {
  LEGACY_TOKEN_COOKIE,
  SESSION_FLAG_COOKIE,
} from './auth/session-cookie';
import { siteHref } from './surface';
import {
  cookieDomain,
  removeSharedCookie,
  sharedCookieOptions,
} from './track-cookie';

/**
 * Sesi disimpan backend sebagai cookie httpOnly (tidak bisa dicuri lewat XSS).
 * Butuh frontend dan API satu situs (*.bimbelio.com atau localhost), jadi
 * hanya diaktifkan di Production; preview *.vercel.app tetap memakai token JS.
 */
export const httpOnlySession = () =>
  process.env.NEXT_PUBLIC_SESSION_COOKIE === 'httponly';

const logout = async () => {
  try {
    await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: authHeaders(),
      signal: AbortSignal.timeout(3000),
    });
  } catch {}
};

export const signOut = async (data?: { callbackUrl?: string }) => {
  const callbackUrl = data?.callbackUrl;
  // Cabut sesi di backend (dan hapus cookie httpOnly) sebelum pindah halaman.
  await logout();
  removeSharedCookie(LEGACY_TOKEN_COOKIE);
  removeSharedCookie(SESSION_FLAG_COOKIE);
  Cookies.remove('g_state');
  const pathname = window.location.pathname;
  if (pathname === callbackUrl) {
    window.location.reload();
  } else if (callbackUrl) {
    window.location.pathname = callbackUrl;
  } else {
    // Dari subdomain app/admin kembali ke beranda situs utama.
    window.location.assign(siteHref('/'));
  }
};

export const signIn = () => {};

// Matches the backend JWT lifetime (`expiresIn: '7d'`).
const AUTH_TOKEN_EXPIRES_DAYS = 7;

/** Simpan token hasil login. Mode httpOnly: backend sudah memasang cookie. */
export const setAuthToken = (token: string) => {
  // Cookie host-only lama dihapus dulu agar tidak terbaca dobel.
  removeSharedCookie(LEGACY_TOKEN_COOKIE);
  if (httpOnlySession()) return;
  // Berlaku di semua subdomain bila NEXT_PUBLIC_COOKIE_DOMAIN diisi.
  Cookies.set(
    LEGACY_TOKEN_COOKIE,
    token,
    sharedCookieOptions(AUTH_TOKEN_EXPIRES_DAYS),
  );
};

/** Token yang bisa dibaca JS; kosong di mode httpOnly setelah migrasi. */
export const getAuthToken = () => Cookies.get(LEGACY_TOKEN_COOKIE);

/** Ada sesi yang perlu diverifikasi (token JS atau cookie httpOnly). */
export const hasSession = () =>
  !!getAuthToken() || Cookies.get(SESSION_FLAG_COOKIE) === '1';

const SHARED_COOKIE_FLAG = 'bimbelio:token-shared';

/**
 * Pindahkan sesi lama ke penyimpanan saat ini, sekali per browser:
 * - mode httpOnly: token JS ditukar ke cookie httpOnly lewat backend lalu dihapus;
 * - mode lama: token host-only `www` disalin ke `.bimbelio.com` agar terbaca di
 *   app/admin (tanpa ini pengguna terpental bolak-balik situs ↔ app).
 */
export const migrateSession = async () => {
  const token = getAuthToken();
  if (!token) return;

  if (httpOnlySession()) {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/sessionCookie`, {
      method: 'POST',
      credentials: 'include',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => null);
    // Gagal jaringan: coba lagi di kunjungan berikutnya. 401: token sudah mati.
    if (res && (res.ok || res.status === 401)) {
      removeSharedCookie(LEGACY_TOKEN_COOKIE);
      try {
        localStorage.removeItem(SHARED_COOKIE_FLAG);
      } catch {}
    }
    return;
  }

  if (!cookieDomain()) return;
  try {
    if (localStorage.getItem(SHARED_COOKIE_FLAG) === token) return;
    Cookies.remove(LEGACY_TOKEN_COOKIE); // host-only lama
    Cookies.set(
      LEGACY_TOKEN_COOKIE,
      token,
      sharedCookieOptions(AUTH_TOKEN_EXPIRES_DAYS),
    );
    localStorage.setItem(SHARED_COOKIE_FLAG, token);
  } catch {}
};

/**
 * Header Authorization untuk request langsung (axios/fetch tanpa instance utama).
 * Pasangkan dengan `credentials: 'include'` / `withCredentials: true` agar
 * cookie httpOnly ikut terkirim.
 */
export const authHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
