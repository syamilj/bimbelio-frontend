// Satu codebase, tiga "permukaan" (surface) dengan domain sendiri:
//   site  → bimbelio.com          (marketing, SEO)
//   app   → app.bimbelio.com      (ruang belajar siswa)
//   admin → admin.bimbelio.com    (panel admin)
// Rute di filesystem tetap `/[track]/user/...` dan `/[track]/admin/...`;
// proxy.ts menerjemahkan URL publik ke rute internal per host.
// Bila NEXT_PUBLIC_APP_URL / NEXT_PUBLIC_ADMIN_URL kosong (lokal, preview),
// semuanya berjalan di satu domain dengan URL lama.

import { siteConfig } from '@/config/site';

export type Surface = 'site' | 'app' | 'admin';

export type DomainConfig = {
  siteUrl: string;
  appUrl?: string;
  adminUrl?: string;
};

const clean = (url?: string | null) =>
  url ? url.replace(/\/+$/, '') : undefined;

export const domainConfig: DomainConfig = {
  siteUrl: clean(process.env.NEXT_PUBLIC_SITE_URL) ?? siteConfig.url,
  appUrl: clean(process.env.NEXT_PUBLIC_APP_URL),
  adminUrl: clean(process.env.NEXT_PUBLIC_ADMIN_URL),
};

const hostOf = (url?: string) => {
  if (!url) return undefined;
  try {
    return new URL(url).host.toLowerCase();
  } catch {
    return undefined;
  }
};

/** Surface untuk sebuah host (`app.bimbelio.com` → 'app'). */
export function surfaceForHost(
  host: string | null | undefined,
  cfg: DomainConfig = domainConfig,
): Surface {
  const h = host?.toLowerCase();
  if (h && h === hostOf(cfg.appUrl)) return 'app';
  if (h && h === hostOf(cfg.adminUrl)) return 'admin';
  return 'site';
}

/** Segmen pertama yang milik situs marketing — tidak pernah dianggap track. */
export const SITE_SEGMENTS = new Set([
  'price',
  'blog',
  'about',
  'scholarship',
  'calendar',
  'tryout',
  'link',
  'l',
  'api',
  'beasiswa',
  'tutor',
  'privacy',
  'terms',
]);

const segmentsOf = (pathname: string) => pathname.split('/').filter(Boolean);

/**
 * Path rute internal dari path yang terlihat di browser.
 * Di host app `/utbk/bimboard` → `/utbk/user/bimboard`; di host admin
 * `/utbk/voucher` → `/utbk/admin/voucher`. Path yang sudah internal dibiarkan.
 */
export function toInternalPath(pathname: string, surface: Surface) {
  if (surface === 'site') return pathname;
  const seg = segmentsOf(pathname);
  const area = surface === 'app' ? 'user' : 'admin';
  if (seg.length === 0) return pathname;
  if (seg[1] === 'user' || seg[1] === 'admin') return pathname;
  return `/${[seg[0], area, ...seg.slice(1)].join('/')}`;
}

/** Path yang ditampilkan untuk rute internal pada surface tertentu (kebalikan toInternalPath). */
export function toPublicPath(internalPath: string, surface: Surface) {
  if (surface === 'site') return internalPath;
  const seg = segmentsOf(internalPath);
  const area = surface === 'app' ? 'user' : 'admin';
  if (seg[1] !== area) return internalPath;
  return `/${[seg[0], ...seg.slice(2)].join('/')}`;
}

export const isSplitDomains = (cfg: DomainConfig = domainConfig) =>
  !!(cfg.appUrl || cfg.adminUrl);

/**
 * Href ke area siswa/admin. Satu domain → path lama (`/utbk/user/bimboard`);
 * domain terpisah → URL absolut (`https://app.bimbelio.com/utbk/bimboard`).
 * URL absolut ke origin yang sama tetap dinavigasi client-side oleh Next,
 * sehingga href yang sama benar dari surface mana pun (tanpa context).
 */
export function areaHref(
  area: 'app' | 'admin',
  trackId: string,
  path: string,
  cfg: DomainConfig = domainConfig,
) {
  const rest = path.replace(/^\/+/, '');
  const internal = `/${trackId}/${area === 'app' ? 'user' : 'admin'}${rest ? `/${rest}` : ''}`;
  const base = area === 'app' ? cfg.appUrl : cfg.adminUrl;
  return base ? `${base}${toPublicPath(internal, area)}` : internal;
}

/**
 * Path rute internal dari href/pathname apa pun: membuang origin milik kita
 * dan mengubah bentuk publik subdomain ke rute internal. `area` dipakai untuk
 * path tanpa origin (mis. hasil usePathname di host app).
 */
export function toRoutePath(
  hrefOrPath: string,
  area: Surface,
  cfg: DomainConfig = domainConfig,
) {
  if (!/^https?:\/\//.test(hrefOrPath))
    return isSplitDomains(cfg) ? toInternalPath(hrefOrPath, area) : hrefOrPath;
  const url = new URL(hrefOrPath);
  return toInternalPath(url.pathname, surfaceForHost(url.host, cfg));
}

/**
 * Id track dari pathname. Rute internal `/utbk/user/...` selalu dikenali; bila
 * domain terpisah aktif, bentuk publik `/utbk/bimboard` (host app/admin) juga.
 */
export function trackIdFromPath(
  pathname: string,
  cfg: DomainConfig = domainConfig,
): string | undefined {
  const seg = segmentsOf(pathname);
  if (!seg[0]) return undefined;
  if (seg[1] === 'user' || seg[1] === 'admin') return seg[0];
  if (isSplitDomains(cfg) && !SITE_SEGMENTS.has(seg[0])) return seg[0];
  return undefined;
}

/**
 * Href ke halaman marketing (mis. `/price`) dari komponen yang juga tampil di
 * app/admin. Domain terpisah → URL absolut situs (tetap navigasi client-side
 * bila sudah di situs).
 */
export function siteHref(path: string, cfg: DomainConfig = domainConfig) {
  return isSplitDomains(cfg) ? `${cfg.siteUrl}${path}` : path;
}

export type ProxyRoute =
  | { type: 'next' }
  | { type: 'rewrite'; pathname: string }
  | { type: 'redirect'; url: string; permanent: boolean };

/**
 * Keputusan routing proxy berdasarkan host & path (murni, diuji terpisah).
 * Autentikasi diputuskan terpisah terhadap path internal hasil fungsi ini.
 */
export function routeByHost(
  host: string | null,
  pathname: string,
  search: string,
  options: { lastTrack?: string | null } = {},
  cfg: DomainConfig = domainConfig,
): ProxyRoute {
  if (!isSplitDomains(cfg)) return { type: 'next' };

  const surface = surfaceForHost(host, cfg);
  const seg = segmentsOf(pathname);
  const isSitePath = seg.length === 0 || SITE_SEGMENTS.has(seg[0]);

  if (surface === 'site') {
    // URL lama area aplikasi → domain barunya.
    if (seg[1] === 'user' && cfg.appUrl) {
      return {
        type: 'redirect',
        url: `${cfg.appUrl}${toPublicPath(pathname, 'app')}${search}`,
        permanent: true,
      };
    }
    if (seg[1] === 'admin' && cfg.adminUrl) {
      return {
        type: 'redirect',
        url: `${cfg.adminUrl}${toPublicPath(pathname, 'admin')}${search}`,
        permanent: true,
      };
    }
    return { type: 'next' };
  }

  const area = surface === 'app' ? 'user' : 'admin';
  const otherArea = area === 'user' ? 'admin' : 'user';
  const otherUrl = area === 'user' ? cfg.adminUrl : cfg.appUrl;

  // Beranda subdomain → dashboard track terakhir.
  if (seg.length === 0) {
    const track = options.lastTrack || 'choice';
    return {
      type: 'redirect',
      url: `/${track}/${surface === 'app' ? 'bimboard' : ''}`.replace(
        /\/$/,
        '',
      ),
      permanent: false,
    };
  }
  // Halaman marketing tidak dilayani di subdomain.
  if (isSitePath)
    return {
      type: 'redirect',
      url: `${cfg.siteUrl}${pathname}${search}`,
      permanent: true,
    };
  // Bentuk lama `/track/user/...` di host app → bentuk baru (link lama di kode/notifikasi).
  if (seg[1] === area)
    return {
      type: 'redirect',
      url: `${toPublicPath(pathname, surface)}${search}`,
      permanent: true,
    };
  // Area lain → domainnya sendiri.
  if (seg[1] === otherArea) {
    if (!otherUrl) return { type: 'next' };
    return {
      type: 'redirect',
      url: `${otherUrl}${toPublicPath(pathname, otherArea === 'user' ? 'app' : 'admin')}${search}`,
      permanent: true,
    };
  }
  // `/utbk` saja di host app → dashboard.
  if (seg.length === 1 && surface === 'app')
    return { type: 'redirect', url: `/${seg[0]}/bimboard`, permanent: false };
  return { type: 'rewrite', pathname: toInternalPath(pathname, surface) };
}
