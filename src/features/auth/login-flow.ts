'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { api } from '@/lib/api/client';
import { setAuthToken } from '@/lib/auth-helper';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

type GoogleLoginResult = {
  token: string;
  user?: {
    id?: string | number;
    name?: string;
    email?: string;
    phone_number?: string;
  };
};

/**
 * Tujuan setelah masuk, sebagai path internal yang aman. Menolak URL luar
 * (mencegah open redirect) dan memperbaiki `//price` dari kode lama.
 */
export function resolveRedirect(
  redirect: string | null | undefined,
  origin: string,
) {
  if (!redirect) return null;
  try {
    const url = new URL(redirect.replace(/^\/+/, '/'), origin);
    if (url.origin !== origin) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

function trackLogin(user: GoogleLoginResult['user']) {
  try {
    const [firstName, ...rest] = (user?.name ?? '').split(' ').filter(Boolean);
    const id = user?.id?.toString() || 'unknown_user';
    trackUnifiedEvent({
      eventName: 'CompleteRegistration',
      customData: {
        currency: 'IDR',
        value: 0,
        content_name: 'User Login Success - Authentication',
        content_type: 'authentication',
        contents: [{ id, quantity: 1 }],
        content_id: id,
      },
      user: {
        userId: user?.id?.toString(),
        email: user?.email,
        phone: user?.phone_number,
        firstName: firstName || undefined,
        lastName: rest.length ? rest.join(' ') : undefined,
      },
    });
  } catch {
    // Pelacakan tidak boleh menggagalkan login.
  }
}

/** Tukar kredensial Google dengan sesi Bimbelio, lalu arahkan ke tujuan. */
export function useGoogleLogin() {
  const router = useRouter();
  const { refresh } = useSession();

  return useCallback(
    async (credential: string, redirect?: string | null) => {
      const res = await api.post<GoogleLoginResult>('/auth/google', {
        token: credential,
      });
      setAuthToken(res.data.token);
      trackLogin(res.data.user);
      await refresh();

      const target = resolveRedirect(redirect, window.location.origin);
      const current = `${window.location.pathname}${window.location.search}`;
      if (target && target !== current) router.push(target);
      else router.refresh();
    },
    [refresh, router],
  );
}
