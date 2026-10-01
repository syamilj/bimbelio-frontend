'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { env } from '@/env.mjs';
import { GoogleOAuthProvider, useGoogleOneTapLogin } from '@react-oauth/google';
import { useGoogleLogin } from './login-flow';

function OneTapPrompt() {
  const { status } = useSession();
  const login = useGoogleLogin();
  useGoogleOneTapLogin({
    disabled: status !== 'unauthenticated',
    use_fedcm_for_prompt: true,
    onSuccess: ({ credential }) => {
      if (credential) login(credential).catch(() => {});
    },
  });
  return null;
}

/** Saran masuk Google One Tap untuk pengunjung yang belum masuk. */
export function OneTapLogin() {
  return (
    <GoogleOAuthProvider clientId={env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <OneTapPrompt />
    </GoogleOAuthProvider>
  );
}
