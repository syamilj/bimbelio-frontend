'use client';
import {
  ArrowRight,
  CheckCircle,
  MessageCircle,
  Settings,
  Wrench,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

const isMaintenance = false;

export default function ProviderMaintenance({
  children,
}: {
  children: ReactNode;
}) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isMaintenance) return <>{children}</>;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute -bottom-32 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-bounce"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
          style={{ animationDelay: '3s' }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">B</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Bimbelio
              </h1>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Hero Section */}
            <div className="relative bg-linear-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 md:p-12 text-white text-center">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                  <Settings
                    className="w-12 h-12 text-white animate-spin"
                    style={{ animationDuration: '4s' }}
                  />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Sedang Dalam Perbaikan
                </h2>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                  Kami sedang meningkatkan sistem untuk memberikan pengalaman
                  belajar yang lebih revolusioner dengan teknologi AI terdepan
                </p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 left-4 w-20 h-20 border border-white/20 rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 border border-white/20 rounded-full"></div>
              <div className="absolute top-1/2 right-8 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>

            <div className="p-8 md:p-12">
              {/* Countdown Timer */}
              {/* <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 text-blue-600 mb-4">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">Estimasi Waktu Kembali</span>
                </div>

                <div className="flex justify-center gap-4 mb-6">
                  {[
                    { label: 'Jam', value: timeLeft.hours },
                    { label: 'Menit', value: timeLeft.minutes },
                    { label: 'Detik', value: timeLeft.seconds },
                  ].map((item, index) => (
                    <div
                      key={item.label}
                      className="text-center"
                    >
                      <div className="bg-linear-to-br from-blue-600 to-indigo-600 text-white rounded-2xl p-4 min-w-[80px] shadow-lg">
                        <div className="text-3xl font-bold">
                          {item.value.toString().padStart(2, '0')}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-2 font-medium">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-linear-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">
                      Pembaruan Sistem
                    </span>
                  </div>
                  <p className="text-yellow-700">
                    Peningkatan performa AI dan fitur pembelajaran adaptif
                  </p>
                </div>
              </div> */}
              {/* Progress Steps */}
              <div className="mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  Progress Pemeliharaan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: CheckCircle,
                      title: 'Database Backup',
                      status: 'completed',
                      description: 'Data pembelajaran aman tersimpan',
                    },
                    {
                      icon: Wrench,
                      title: 'System Upgrade',
                      status: 'in-progress',
                      description: 'Peningkatan AI dan performa',
                    },
                    {
                      icon: Settings,
                      title: 'Final Testing',
                      status: 'pending',
                      description: 'Pengujian kualitas sistem',
                    },
                  ].map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = step.status === 'completed';
                    const isInProgress = step.status === 'in-progress';

                    return (
                      <div
                        key={index}
                        className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                          isCompleted
                            ? 'bg-green-50 border-green-200 shadow-green-100 shadow-lg'
                            : isInProgress
                              ? 'bg-yellow-50 border-yellow-200 shadow-yellow-100 shadow-lg'
                              : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="text-center">
                          <div
                            className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                              isCompleted
                                ? 'bg-green-100 text-green-600'
                                : isInProgress
                                  ? 'bg-yellow-100 text-yellow-600'
                                  : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            <Icon
                              className={`w-6 h-6 ${isInProgress ? 'animate-spin' : ''}`}
                            />
                          </div>
                          <h4 className="font-bold text-gray-900 mb-2">
                            {step.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {step.description}
                          </p>
                        </div>

                        {isCompleted && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Contact Section */}
              <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Butuh Bantuan?
                  </h3>
                  <p className="text-gray-600">
                    Tim support kami siap membantu Kamu 24/7
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href="https://www.bimbelio.com/l/wa-grup"
                    target="_blank"
                    className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <MessageCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Discord</div>
                      <div className="text-sm text-gray-600">Bimbelio</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </a>

                  <a
                    href="https://www.instagram.com/bimbelio.official?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                    target="_blank"
                    className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-pink-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-linear-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:from-pink-200 group-hover:to-purple-200 transition-all">
                      <div className="w-6 h-6 bg-linear-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">IG</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        Instagram
                      </div>
                      <div className="text-sm text-gray-600">
                        Follow untuk update terbaru
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pink-600 transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-500">
            <p className="mb-2">
              © 2024 Bimbelio - Revolusi Persiapan Belajar dengan AI
            </p>
            <p className="text-sm">
              Terima kasih atas kesabaran Kamu. Kami akan segera kembali dengan
              fitur yang lebih canggih! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
