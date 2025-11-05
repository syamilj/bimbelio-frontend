'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { env } from '@/env.mjs';
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
    } catch (error) {
      responseError(error, true);
      console.log({ error });
      return;
    }
  };

  useGoogleOneTapLogin({
    disabled: !!session,
    onSuccess(credentialResponse) {
      console.log('One Tap Success:', credentialResponse);
      handleSubmit(credentialResponse);
    },
    onError() {
      console.error('One Tap Failed:');
    },
    promptMomentNotification: (notification) => {
      console.log('One Tap notification:', notification);
      if (notification.isNotDisplayed()) {
        console.log('One Tap not displayed');
      }
      if (notification.isSkippedMoment()) {
        console.log('One Tap skipped');
      }
    },
  });

  return <div className="hidden"></div>;
};
