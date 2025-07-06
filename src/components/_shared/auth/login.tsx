'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import LoadingPage from '@/components/ui/Loading-Page';
import Logo from '@/components/ui/logo';
import { env } from '@/env.mjs';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import Cookies from 'js-cookie';
import { X } from 'lucide-react';
import { useState } from 'react';

export const Login = () => {
  const {
    useAuth: { setShowAuth, showAuth },
  } = useAppContext();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (googleToken: any) => {
    setLoading(true);
    try {
      const { credential } = googleToken as { credential: string };
      const res = await axios.post(`${env.NEXT_PUBLIC_API_URL}/auth/google`, {
        token: credential,
      });

      Cookies.set('token', res.data.data.token);
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
      setLoading(false);
      return;
    }
  };

  return (
    <GoogleOAuthProvider clientId={env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        {loading && <LoadingPage />}

        {/* Backdrop */}
        {showAuth && (
          <div
            className="fixed inset-0 bg-transparent"
            onClick={() => setShowAuth((prev) => ({ ...prev, open: false }))}
          />
        )}

        {/* Main Modal */}
        <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div
            className="p-6 pb-8 text-center relative"
            style={{ backgroundColor: `${mainColor}05` }}
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAuth((prev) => ({ ...prev, open: false }))}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="space-y-4">
              <Logo
                className="text-2xl font-bold"
                style={{ color: mainColor }}
              />
              <div>
                <h1
                  className="text-xl font-bold"
                  style={{ color: mainColor }}
                >
                  Selamat Datang Kembali!
                </h1>
                <p className="text-gray-600 mt-1">
                  Masuk untuk melanjutkan perjalanan belajar Anda
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Google Login */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Masuk dengan Akun Anda
                </h3>
              </div>

              <div className="flex justify-center">
                <div
                  className="p-4 rounded-xl border-2 hover:shadow-md transition-all"
                  style={{
                    borderColor: `${mainColor}20`,
                    backgroundColor: `${mainColor}02`,
                  }}
                >
                  <GoogleButton handleSubmit={handleSubmit} />
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Gunakan akun Google untuk masuk dengan mudah dan aman
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-blue-50 text-center">
                <div className="font-medium text-blue-700 text-sm">Try Out</div>
                <div className="text-xs text-blue-600">Gratis!</div>
              </div>
              <div className="p-3 rounded-lg bg-green-50 text-center">
                <div className="font-medium text-green-700 text-sm">
                  AI Learning
                </div>
                <div className="text-xs text-green-600">Terdepan</div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center space-y-3">
              {/* <p className="text-sm text-gray-600">
                Belum punya akun?{' '}
                <button
                  type="button"
                  className="font-semibold underline hover:no-underline"
                  style={{ color: mainColor }}
                  onClick={() =>
                    setShowAuth((prev) => ({
                      ...prev,
                      signUp: true,
                      open: false,
                    }))
                  }
                >
                  Daftar sekarang
                </button>
              </p> */}

              <p className="text-xs text-gray-500">
                Dengan melanjutkan, Anda setuju dengan Ketentuan Layanan dan
                Kebijakan Privasi Bimbelio
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
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleSubmit}
        onError={() => console.log('Login Failed')}
        text="signin_with"
        shape="rectangular"
        size="large"
        width="280"
        theme="outline"
      />
    </div>
  );
};
