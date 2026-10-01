import Cookies from 'js-cookie';

// Cookie lintas subdomain. localStorage terpisah per origin, sehingga track
// terakhir & token disimpan di cookie ber-domain `NEXT_PUBLIC_COOKIE_DOMAIN`
// (mis. `.bimbelio.com`) agar terbaca di situs, app, dan admin sekaligus.

/** Track terakhir yang dibuka; dibaca proxy untuk `app.bimbelio.com/`. */
export const LAST_TRACK_COOKIE = 'bimbelio_track';

export const cookieDomain = () =>
  process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined;

export const sharedCookieOptions = (
  expires?: number,
): Cookies.CookieAttributes => ({
  domain: cookieDomain(),
  secure:
    typeof window !== 'undefined' && window.location.protocol === 'https:',
  sameSite: 'lax',
  expires,
});

/** Hapus cookie di domain bersama maupun host saat ini (sisa sebelum domain bersama aktif). */
export const removeSharedCookie = (name: string) => {
  Cookies.remove(name);
  const domain = cookieDomain();
  if (domain) Cookies.remove(name, { domain });
};

export const rememberTrackCookie = (trackId: string) => {
  try {
    Cookies.set(LAST_TRACK_COOKIE, trackId, sharedCookieOptions(365));
  } catch {}
};
