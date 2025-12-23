'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import {
  Bell,
  BookOpen,
  Construction,
  Lightbulb,
  Rocket,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';

interface CourseUpcomingProps {
  courseTitle?: string;
  courseDescription?: string;
}

export default function CourseUpcoming({
  courseTitle = 'Materi Baru',
  courseDescription,
}: CourseUpcomingProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const [notifyMe, setNotifyMe] = useState(false);

  const handleNotify = () => {
    setNotifyMe(true);
    // TODO: Implement notification logic
    setTimeout(() => {
      setNotifyMe(false);
    }, 3000);
  };

  return (
    <div className="relative min-h-[calc(100vh-120px)] flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Subtle Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: mainColor }}
        />
        <div
          className="absolute bottom-20 left-20 w-64 h-64 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: mainColor }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        {/* Animated Icon */}
        <div className="relative inline-block">
          <div
            className="absolute inset-0 rounded-3xl blur-2xl opacity-20 animate-pulse"
            style={{ backgroundColor: mainColor }}
          />
          <div
            className="relative bg-white rounded-3xl p-8 shadow-lg"
            style={{ boxShadow: `0 10px 40px ${mainColor}20` }}
          >
            <div className="relative">
              <Construction
                className="w-16 h-16 mx-auto mb-2"
                style={{ color: mainColor }}
                strokeWidth={1.5}
              />
              <Sparkles
                className="w-8 h-8 mx-auto animate-pulse absolute -top-2 -right-2"
                style={{ color: mainColor }}
              />
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
            <Rocket
              className="w-4 h-4"
              style={{ color: mainColor }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: mainColor }}
            >
              Segera Hadir
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Kami Sedang Menyiapkan <br />
            Sesuatu yang Luar Biasa!
          </h1>

          {courseTitle && (
            <div className="space-y-2">
              <p className="text-xl font-semibold text-gray-700">
                {courseTitle}
              </p>
              {courseDescription && (
                <p className="text-gray-600 max-w-xl mx-auto">
                  {courseDescription}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {[
            {
              icon: BookOpen,
              title: 'Materi Lengkap',
              desc: 'Konten berkualitas tinggi',
            },
            {
              icon: Lightbulb,
              title: 'Mudah Dipahami',
              desc: 'Penjelasan yang jelas',
            },
            {
              icon: Sparkles,
              title: 'Interaktif',
              desc: 'Pengalaman belajar seru',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <feature.icon
                className="w-6 h-6 mx-auto mb-2"
                style={{ color: mainColor }}
              />
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="space-y-4 pt-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-left flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Ingin Mendapatkan Notifikasi?
                </h3>
                <p className="text-sm text-gray-600">
                  Kami akan memberi tahu kamu saat materi ini sudah siap!
                </p>
              </div>
              <Button
                onClick={handleNotify}
                disabled={notifyMe}
                className="whitespace-nowrap"
                style={{
                  backgroundColor: notifyMe ? '#10B981' : mainColor,
                }}
              >
                {notifyMe ? (
                  <>
                    <span className="mr-2">✓</span>
                    Berhasil!
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 mr-2" />
                    Beritahu Aku
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress Info */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: mainColor }}
              />
              <span>
                Tim kami sedang bekerja keras untuk menghadirkan pengalaman
                belajar terbaik untukmu
              </span>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="pt-4">
          <p className="text-sm text-gray-500 mb-3">
            💡 <span className="font-medium">Sementara menunggu:</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              'Jelajahi materi lain',
              'Selesaikan quiz',
              'Catat progress belajarmu',
            ].map((tip, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors cursor-default"
              >
                {tip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
