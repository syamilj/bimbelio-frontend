'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { env } from '@/env.mjs';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { pixel } from '@/lib/pixel/_core';
import { responseError } from '@/lib/response';
import { GoogleOAuthProvider, useGoogleOneTapLogin } from '@react-oauth/google';
import axios from 'axios';
import Cookies from 'js-cookie';

export const OneTapLogin = () => {
  return (
    <GoogleOAuthProvider clientId={env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <HandleLogin />
    </GoogleOAuthProvider>
  );
};
const HandleLogin = () => {
  const { data: session } = useSession();

  const handleSubmit = async (googleToken: any) => {
    try {
      // Get Google token
      const { credential } = googleToken as { credential: string };
      console.log({ credential });
      const res = await axios.post(`${env.NEXT_PUBLIC_API_URL}/auth/google`, {
        token: credential,
      });
      console.log({ res });

      Cookies.set('token', res.data.data.token);

      console.log('Login Success: ', res);

      // ✅ Track login success dengan Advanced Matching
      try {
        const userData = res.data.data.user; // Ambil data user dari response

        // Track CompleteRegistration dengan Meta Pixel + Advanced Matching
        pixel.meta.track(
          'CompleteRegistration',
          {
            currency: 'IDR',
            value: 0, // Login success tidak ada nilai monetary
            content_name: 'User Login Success - Authentication',
            content_type: 'authentication',
            contents: [
              { id: userData?.id?.toString() || 'unknown_user', quantity: 1 },
            ],
          },
          {
            // Advanced Matching data
            em: userData?.email, // Email akan di-hash otomatis
            ph: userData?.phone_number, // Phone akan di-hash otomatis
            fn: userData?.name?.split(' ')[0], // First name akan di-hash otomatis
            ln: userData?.name?.split(' ').slice(1).join(' '), // Last name akan di-hash otomatis
          },
        );

        // Track dengan TikTok Pixel
        pixel.tiktok.track('CompleteRegistration', {
          currency: 'IDR',
          value: 0,
          content_name: 'User Login Success - Authentication',
          content_type: 'authentication',
          content_id: userData?.id?.toString() || 'unknown_user', // ✅ content_id untuk TikTok
        });
      } catch (pixelError) {
        console.warn('Pixel tracking error on login:', pixelError);
      }

      window.location.reload();

      const redirect = `${website_sub_category_id}/user/dashboard`;
      const pathname = window.location.pathname;
      const origin = window.location.origin;
      if (pathname === redirect || !redirect) {
        window.location.reload();
      } else {
        window.location.href = redirect ? `${origin}/${redirect}` : origin;
      }
    } catch (error) {
      responseError(error, true);
      console.log({ error });
      return;
    }
  };

  useGoogleOneTapLogin({
    disabled: !!session,
    use_fedcm_for_prompt: true, // Enable FedCM for Google One Tap (required after Jan 2025)
    onSuccess(credentialResponse) {
      console.log('One Tap Success:', credentialResponse);
      handleSubmit(credentialResponse);
    },
    onError() {
      // FedCM errors are expected in some cases:
      // - User cancels the prompt
      // - Browser doesn't fully support FedCM
      // - Network issues
      // These are not critical errors, so we just log them silently
      console.log('One Tap: User cancelled or FedCM unavailable');
    },
    // NOTE: promptMomentNotification removed for FedCM migration
    // Methods like isDisplayMoment(), isNotDisplayed(), getSkippedReason()
    // are deprecated and will stop working when FedCM becomes mandatory.
    // See: https://developers.google.com/identity/gsi/web/guides/fedcm-migration
  });

  return <div className="hidden"></div>;
};
