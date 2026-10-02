import Cookies from 'js-cookie';
import { siteHref } from './surface';
import {
  cookieDomain,
  removeSharedCookie,
  sharedCookieOptions,
} from './track-cookie';

export const signOut = (data?: { callbackUrl?: string }) => {
  const callbackUrl = data?.callbackUrl;
  removeSharedCookie('token');
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

export const setAuthToken = (token: string) => {
  // Berlaku di semua subdomain bila NEXT_PUBLIC_COOKIE_DOMAIN diisi; cookie
  // host-only lama dihapus dulu agar tidak terbaca dobel.
  removeSharedCookie('token');
  Cookies.set('token', token, sharedCookieOptions(AUTH_TOKEN_EXPIRES_DAYS));
};

export const getAuthToken = () => Cookies.get('token');

const SHARED_COOKIE_FLAG = 'bimbelio:token-shared';

/**
 * Sekali per browser: token lama (host-only `www.bimbelio.com`) disalin ke
 * cookie ber-domain `.bimbelio.com` agar sesi juga terbaca di app/admin.
 * Tanpa ini pengguna yang sudah login terpental bolak-balik situs ↔ app.
 */
export const shareAuthCookie = () => {
  const token = getAuthToken();
  if (!token || !cookieDomain()) return;
  try {
    if (localStorage.getItem(SHARED_COOKIE_FLAG) === token) return;
    Cookies.remove('token'); // host-only lama
    Cookies.set('token', token, sharedCookieOptions(AUTH_TOKEN_EXPIRES_DAYS));
    localStorage.setItem(SHARED_COOKIE_FLAG, token);
  } catch {}
};

/** Header Authorization untuk request langsung (axios/fetch tanpa instance utama). */
export const authHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
