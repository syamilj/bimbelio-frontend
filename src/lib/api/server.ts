import { env } from '@/env.mjs';
import 'server-only';
import type { ApiEnvelope } from './client';

type ServerGetOptions = {
  params?: Record<string, string | number | undefined | null>;
  /** Detik sebelum data di-cache ulang (ISR). Default 5 menit. */
  revalidate?: number | false;
  tags?: string[];
};

/**
 * GET dari server component (halaman publik). Mengembalikan `null` untuk 404
 * agar halaman bisa memanggil `notFound()`; error lain dilempar ke error boundary.
 */
export async function serverGet<T>(
  path: string,
  options: ServerGetOptions = {},
): Promise<T | null> {
  const url = new URL(path, env.NEXT_PUBLIC_API_URL);
  for (const [key, value] of Object.entries(options.params ?? {})) {
    if (value !== undefined && value !== null)
      url.searchParams.set(key, String(value));
  }

  const res = await fetch(url, {
    next: { revalidate: options.revalidate ?? 300, tags: options.tags },
    headers: { Accept: 'application/json' },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET ${url.pathname} gagal (${res.status})`);
  const body = (await res.json()) as ApiEnvelope<T>;
  return body.data ?? null;
}

/** Seperti serverGet, tetapi tidak pernah melempar: kegagalan menjadi `fallback`. */
export async function serverGetSafe<T>(
  path: string,
  fallback: T,
  options?: ServerGetOptions,
): Promise<T> {
  try {
    return (await serverGet<T>(path, options)) ?? fallback;
  } catch (error) {
    console.error(error);
    return fallback;
  }
}
