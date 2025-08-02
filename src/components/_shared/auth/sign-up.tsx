'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import LoadingPage from '@/components/ui/Loading-Page';
import { Eye, EyeOff, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const SignUp = ({ showAuth, setShowAuth }: any) => {
  const router = useRouter();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const [loading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // try {
    //   if (name.length < 1) {
    //     toaster({
    //       title: "Gagal",
    //       description: "Masukan Nama",
    //       duration: 5000,
    //       condition: "warning",
    //     });
    //     setLoading(false);
    //     return;
    //   }
    //   if (password.length < 6) {
    //     toaster({
    //       title: "Gagal",
    //       description: "Password minimal 6 karakter",
    //       duration: 5000,
    //       condition: "warning",
    //     });
    //     setLoading(false);
    //     return;
    //   }
    //   const data = await createUsers.mutateAsync({
    //     name: name,
    //     password: password,
    //     email: email,
    //   });
    //   if (data && data.data.id) {
    //     router.push(`/send-verify?id=${data.data.id}`);
    //   }
    //   setLoading(false);
    // } catch (error: any) {
    //   setLoading(false);
    //   return;
    // }
  };

  return (
    <div className="fixed inset-0 z-3000 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {loading && <LoadingPage />}

      {/* Backdrop */}
      {showAuth && (
        <div
          className="fixed inset-0 bg-transparent"
          onClick={() =>
            setShowAuth((prev: any) => ({ ...prev, signUp: false }))
          }
        />
      )}

      {/* Main Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div
          className="p-6 pb-4 text-center relative"
          style={{ backgroundColor: `${mainColor}05` }}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setShowAuth((prev: any) => ({ ...prev, signUp: false }))
            }
            className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </Button>

          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: mainColor }}
          >
            Mulai <span className="text-gray-700">sekarang</span>
          </h1>
          <p className="text-gray-600">Daftarkan akunmu</p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Name Field */}
            <div>
              <input
                type="text"
                placeholder="Nama Lengkap..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-2 transition-all"
                style={
                  {
                    borderColor: name ? `${mainColor}80` : undefined,
                    '--focus-border-color': mainColor,
                  } as React.CSSProperties
                }
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <input
                type="email"
                placeholder="Email..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-2 transition-all"
                style={
                  {
                    borderColor: email ? `${mainColor}80` : undefined,
                    '--focus-border-color': mainColor,
                  } as React.CSSProperties
                }
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Kata sandi..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-sm outline-none focus:border-2 transition-all"
                style={
                  {
                    borderColor: password ? `${mainColor}80` : undefined,
                    '--focus-border-color': mainColor,
                  } as React.CSSProperties
                }
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 rounded"
                style={{ accentColor: mainColor }}
                required
              />
              <p className="text-sm text-gray-700">
                Saya telah membaca dan setuju dengan{' '}
                <button
                  type="button"
                  className="font-semibold underline hover:no-underline"
                  style={{ color: mainColor }}
                  onClick={() => router.push('/terms-of-service')}
                >
                  Ketentuan Layanan
                </button>{' '}
                dan{' '}
                <button
                  type="button"
                  className="font-semibold underline hover:no-underline"
                  style={{ color: mainColor }}
                  onClick={() => router.push('/privacy-policy')}
                >
                  Kebijakan Privasi
                </button>{' '}
                bimbelio.com
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-white font-semibold bg-linear-to-r hover:opacity-90 transition-opacity"
              style={{
                background: `linear-gradient(to right, ${mainColor}, ${mainColor}dd)`,
              }}
            >
              Daftar Akun
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <button
                type="button"
                className="font-semibold underline hover:no-underline"
                style={{ color: mainColor }}
                onClick={() =>
                  setShowAuth(() => ({ signUp: false, login: true }))
                }
              >
                masuk sekarang
              </button>
            </p>
            <p className="text-xs text-gray-500">
              Dengan melanjutkan, kamu setuju dengan ketentuan Layanan dan
              Kebijakan Privasi kami.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
