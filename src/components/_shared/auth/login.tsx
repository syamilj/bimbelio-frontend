'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import LoadingPage from '@/components/ui/Loading-Page';
import Logo from '@/components/ui/logo';
import { env } from '@/env.mjs';
import { setAuthToken } from '@/lib/auth-helper';
import { responseError } from '@/lib/response';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { X } from 'lucide-react';
import { useState } from 'react';

export const Login = () => {
  const {
    useAuth: { setShowAuth, showAuth },
  } = useAppContext();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

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

      setAuthToken(res.data.data.token);

      console.log('Login Success: ', res);

      // ✅ Track login success dengan Advanced Matching
      try {
        const userData = res.data.data.user; // Ambil data user dari response

        const fullName = userData?.name || '';
        const [firstName, ...restNameParts] = fullName
          .split(' ')
          .filter(Boolean);
        const lastName = restNameParts.length
          ? restNameParts.join(' ')
          : undefined;

        trackUnifiedEvent({
          eventName: 'CompleteRegistration',
          customData: {
            currency: 'IDR',
            value: 0,
            content_name: 'User Login Success - Authentication',
            content_type: 'authentication',
            contents: [
              { id: userData?.id?.toString() || 'unknown_user', quantity: 1 },
            ],
            content_id: userData?.id?.toString() || 'unknown_user',
          },
          user: {
            userId: userData?.id?.toString() || undefined,
            email: userData?.email || undefined,
            phone: userData?.phone_number || undefined,
            firstName: firstName || undefined,
            lastName,
          },
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
        <div className="relative z-10 w-full max-w-sm mx-4 bg-white rounded-3xl overflow-hidden border border-slate-200">
          {/* Close button */}
          <button
            onClick={() => setShowAuth((prev) => ({ ...prev, open: false }))}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer z-[1] transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>

          {/* Header Section */}
          <div className="pt-8 pb-4 px-6 text-center">
            <Logo
              className="text-xl font-bold mx-auto mb-4 block"
              style={{ color: mainColor }}
            />
            <h1
              className="text-xl font-black mb-1.5"
              style={{ color: mainColor }}
            >
              Selamat Datang!
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Lanjutkan perjalanan belajar Kamu
            </p>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-5">
            <div className="flex justify-center">
              <GoogleButton handleSubmit={handleSubmit} />
            </div>

            <p className="text-[11px] text-center text-slate-400">
              Masuk aman dengan autentikasi Google
            </p>

            <div className="pt-3 border-t border-slate-100">
              <p className="text-[11px] text-center text-slate-400 leading-relaxed">
                Dengan melanjutkan, Kamu setuju dengan{' '}
                <span
                  className="font-bold cursor-pointer hover:underline"
                  style={{ color: mainColor }}
                >
                  Ketentuan Layanan
                </span>
                {' dan '}
                <span
                  className="font-bold cursor-pointer hover:underline"
                  style={{ color: mainColor }}
                >
                  Kebijakan Privasi
                </span>
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
