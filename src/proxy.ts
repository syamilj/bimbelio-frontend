import { NextRequest, NextResponse } from 'next/server';
import { env } from './env.mjs';
import { decideAccess } from './lib/auth/access';

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

export const proxy = async (req: NextRequest) => {
  const token = req.cookies.get('token')?.value;
  const pathname = req.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    const data = isPrefetch(req)
      ? decodeTokenPayload(token)
      : await verifySession(token);
    const decision = decideAccess(pathname, data);
    if (decision.type === 'redirect') {
      return NextResponse.redirect(new URL(decision.to, req.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Fail closed: if the session cannot be verified (network error, timeout,
    // invalid JSON), do not let the request through to protected pages.
    console.error('[proxy] verifyToken failed:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
};

export const config = {
  matcher: [
    '/:path*/auth/login',
    '/:path*/auth/signup',
    '/:path*/admin/:path*',
    '/:path*/user/:path*',
    '/:path*/verify/:path*',
  ],
};
