'use server';

import { env } from '@/env.mjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { passwordCookieName } from './_components/password-cookie';

/**
 * Buka halaman link yang dikunci. Password dikirim lewat POST dan disimpan di
 * cookie httpOnly khusus halaman ini — tidak lagi muncul di URL/riwayat/log.
 */
export async function unlockLinkPage(slug: string, formData: FormData) {
  const password = String(formData.get('password') ?? '');
  const url = new URL(
    `/link/${encodeURIComponent(slug)}`,
    env.NEXT_PUBLIC_API_URL,
  );
  url.searchParams.set('password', password);
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) redirect(`/link/${slug}?error=password`);

  (await cookies()).set(passwordCookieName(slug), password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: `/link/${slug}`,
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect(`/link/${slug}`);
}
