'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 px-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center space-y-8">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              {/* Outer circle with animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-full animate-pulse" />

              {/* Main icon container */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-12 h-12 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Error Code */}
          <div className="space-y-2">
            <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              404
            </h1>
            <p className="text-sm font-semibold text-slate-500 tracking-widest uppercase">
              Page Not Found
            </p>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Oops! Halaman Tidak Ditemukan
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Maaf, halaman yang Anda cari tidak tersedia atau mungkin telah
              dipindahkan. Silakan periksa URL atau kembali ke halaman utama.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="rounded-xl border-2 border-red-300 hover:border-red-400 h-12 px-8 font-semibold text-base transition-all duration-300 hover:shadow-md text-red-600 hover:text-red-700"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Kembali
            </Button>
          </div>

          {/* Additional help text */}
          <div className="pt-6 border-t border-red-200">
            <p className="text-sm text-red-600 mb-3">
              Butuh bantuan? Hubungi kami di:
            </p>
            <div className="flex items-center justify-center gap-3">
              <a
                href="mailto:support@bimbelio.com"
                className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
              >
                support@bimbelio.com
              </a>
              <span className="text-red-300">•</span>
              <a
                href="/contact"
                className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
              >
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
