import { NextRequest, NextResponse } from 'next/server';
import { env } from './env.mjs';
import { decideAccess } from './lib/auth/access';
import {
  domainConfig,
  routeByHost,
  surfaceForHost,
  type Surface,
} from './lib/surface';
import { LAST_TRACK_COOKIE } from './lib/track-cookie';

type DecodeData = {
  id: string;
  email: string;
  name: string;
  image: string;
  role: string;
  emailVerified: string;
  userTryOutId: string;
  createdAt: string;
  iat: number;
  exp: number;
};

// Hasil verifikasi sesi di-cache sebentar per token: satu halaman memicu
// puluhan request proxy (navigasi + prefetch link) yang dulu masing-masing
// memanggil /auth/verifyToken. Data tetap dijaga backend di setiap API.
const VERIFY_CACHE_MS = 30_000;
const verifyCache = new Map<string, { data: DecodeData; expiresAt: number }>();

const isPrefetch = (req: NextRequest) =>
  req.headers.get('next-router-prefetch') === '1' ||
  req.headers.get('purpose') === 'prefetch' ||
  req.headers.get('sec-purpose')?.includes('prefetch');

/** Baca payload JWT tanpa verifikasi, hanya untuk memilih redirect saat prefetch. */
const decodeTokenPayload = (token: string): DecodeData | null => {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as DecodeData;
  } catch {
    return null;
  }
};

const verifySession = async (token: string): Promise<DecodeData | null> => {
  const cached = verifyCache.get(token);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/verifyToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) return null;
  const resData: { status: number; data?: DecodeData } = await res.json();
  if (resData.status !== 200 || !resData.data) return null;

  if (verifyCache.size > 5000) verifyCache.clear();
  verifyCache.set(token, {
    data: resData.data,
    expiresAt: Date.now() + VERIFY_CACHE_MS,
  });
  return resData.data;
};

/** Rute yang butuh sesi (dicek terhadap path internal hasil routing host). */
const needsSession = (internalPath: string) => {
  const seg = internalPath.split('/').filter(Boolean);
  return seg[1] === 'user' || seg[1] === 'admin' || seg.includes('verify');
};

const authorize = async (
  req: NextRequest,
  internalPath: string,
  surface: Surface,
): Promise<NextResponse | null> => {
  // Tanpa sesi → beranda situs (dialog login ada di sana). Di subdomain, `/`
  // milik subdomain mengalihkan ke dashboard, jadi harus ke situs utama.
  const home =
    surface === 'site'
      ? new URL('/', req.url)
      : new URL('/', domainConfig.siteUrl);
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.redirect(home);

  try {
    const data = isPrefetch(req)
      ? decodeTokenPayload(token)
      : await verifySession(token);
    const decision = decideAccess(internalPath, data);
    if (decision.type === 'allow') return null;
    if (decision.to === '/') return NextResponse.redirect(home);
    // Halaman terlarang: satu domain → 404; subdomain → dashboard-nya sendiri.
    return NextResponse.redirect(
      new URL(surface === 'site' ? decision.to : '/', req.url),
    );
  } catch (error) {
    // Fail closed: if the session cannot be verified (network error, timeout,
    // invalid JSON), do not let the request through to protected pages.
    console.error('[proxy] verifyToken failed:', error);
    return NextResponse.redirect(home);
  }
};

/**
 * Sesi lama tersimpan sebagai cookie host-only di situs. Saat situs mengalihkan
 * ke subdomain, salin token ke domain bersama agar langsung terbaca di sana.
 * Hanya di respons redirect (tidak pernah di-cache CDN).
 */
const shareSessionCookie = (
  req: NextRequest,
  res: NextResponse,
  surface: Surface,
) => {
  const token = req.cookies.get('token')?.value;
  const domain = env.NEXT_PUBLIC_COOKIE_DOMAIN;
  if (surface !== 'site' || !token || !domain) return;
  res.cookies.set('token', token, {
    domain,
    path: '/',
    sameSite: 'lax',
    secure: req.nextUrl.protocol === 'https:',
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const proxy = async (req: NextRequest) => {
  const { pathname, search } = req.nextUrl;
  const host = req.headers.get('host');
  const surface = surfaceForHost(host);

  const route = routeByHost(host, pathname, search, {
    lastTrack: req.cookies.get(LAST_TRACK_COOKIE)?.value,
  });
  if (route.type === 'redirect') {
    const res = NextResponse.redirect(
      new URL(route.url, req.url),
      route.permanent ? 308 : 307,
    );
    shareSessionCookie(req, res, surface);
    return res;
  }

  const internalPath = route.type === 'rewrite' ? route.pathname : pathname;
  if (needsSession(internalPath)) {
    const denied = await authorize(req, internalPath, surface);
    if (denied) return denied;
  }

  const res =
    route.type === 'rewrite'
      ? NextResponse.rewrite(new URL(`${internalPath}${search}`, req.url))
      : NextResponse.next();
  // Subdomain aplikasi bukan untuk mesin pencari.
  if (surface !== 'site') res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
};

export const config = {
  // Semua halaman kecuali aset Next dan file statis (path berekstensi).
  matcher: ['/((?!_next/static|_next/image|.*\\.[\\w]+$).*)'],
};
