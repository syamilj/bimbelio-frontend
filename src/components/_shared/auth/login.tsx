'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { Button } from '@/components/ui/button';
import LoadingPage from '@/components/ui/Loading-Page';
import Logo from '@/components/ui/logo';
import { env } from '@/env.mjs';
import { pixel } from '@/lib/pixel/_core'; // ✅ Import pixel untuk tracking login success
import { responseError } from '@/lib/response';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import Cookies from 'js-cookie';
import { X } from 'lucide-react';
import { useState } from 'react';

export const Login = () => {
  const {
    useAuth: { setShowAuth, showAuth },
  } = useAppContext();

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (googleToken: any) => {
    setLoading(true);
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

      const pathname = window.location.pathname;
      const origin = window.location.origin;
      if (pathname === showAuth.redirect || !showAuth.redirect) {
        window.location.reload();
      } else {
        window.location.href = showAuth.redirect
          ? `${origin}/${showAuth.redirect}`
          : origin;
      }
    } catch (error) {
      responseError(error, true);
      console.log({ error });
      setLoading(false);
      return;
    }
  };

  return (
    <GoogleOAuthProvider clientId={env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <div className="fixed inset-0 z-3000 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        {loading && <LoadingPage />}

        {/* Backdrop */}
        {showAuth && (
          <div
            className="fixed inset-0 bg-transparent"
            onClick={() => setShowAuth((prev) => ({ ...prev, open: false }))}
          />
        )}

        {/* Main Modal */}
        <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Gradient Header Background */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-main-default to-blue-600" />
          {/* Close button - Floating */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAuth((prev) => ({ ...prev, open: false }))}
            className="absolute top-6 right-4 w-9 h-9 rounded-full hover:bg-main-default/10 cursor-pointer z-[1] transition-all duration-200 hover:scale-110"
          >
            <X className="w-5 h-5 text-main-default" />
          </Button>{' '}
          <div className="space-y-4 mt-8 ml-4">
            <Logo
              className="text-2xl font-bold text-main-default"
              // style={{ color: mainColor }}
            />
          </div>
          {/* Header Section */}
          <div className="pt-4 pb-4 px-6 text-center relative bg-gradient-to-b from-main-default/5 to-white">
            <div className="space-y-3 mb-2">
              <div>
                <h1 className="text-2xl font-bold text-main-default mb-2">
                  Selamat Datang Kembali!
                </h1>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Lanjutkan perjalanan belajar Kamu dengan akses ke ribuan
                  materi berkualitas
                </p>
              </div>
            </div>
          </div>
          {/* Content */}
          <div className="px-6 pb-8 space-y-6">
            {/* Main Login Section */}
            <div className="space-y-4">
              {/* Google Login Button Container */}
              <div className="flex justify-center">
                <GoogleButton handleSubmit={handleSubmit} />
              </div>

              <p className="text-xs text-center text-gray-500 px-2">
                Masuk aman dengan autentikasi Google
              </p>
            </div>

            {/* Footer */}
            <div className="space-y-4 pt-4 border-t border-main-default/10">
              <p className="text-xs text-center text-gray-500 leading-relaxed px-2">
                Dengan melanjutkan, Kamu setuju dengan{' '}
                <span className="text-main-default font-medium">
                  Ketentuan Layanan
                </span>
                {' dan '}
                <span className="text-main-default font-medium">
                  Kebijakan Privasi
                </span>{' '}
                Bimbelio
              </p>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;

// Enhanced Google Button Component
const GoogleButton = ({
  handleSubmit,
}: {
  handleSubmit: (googleToken: any) => void;
}) => {
  return (
    <div
      className="w-full flex justify-center"
      id="google-button"
    >
      <GoogleLogin
        onSuccess={handleSubmit}
        onError={() => console.log('Login Failed')}
        text="signin_with"
        shape="circle"
        size="large"
        width="280"
        theme="outline"
      />
    </div>
  );
};
