'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Lock, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CourseScheduledProps {
  publishedAt: Date;
  courseTitle?: string;
  courseDescription?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export default function CourseScheduled({
  publishedAt,
  courseTitle = 'Materi Premium',
  courseDescription,
}: CourseScheduledProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const calculateTimeLeft = () => {
      const difference = new Date(publishedAt).getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          total: difference,
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0,
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [publishedAt]);

  // If time is up, reload page
  useEffect(() => {
    if (mounted && timeLeft.total === 0 && timeLeft.total !== undefined) {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [timeLeft.total, mounted]);

  const publishDate = new Date(publishedAt);
  const formattedDate = publishDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = publishDate.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (!mounted) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: mainColor }}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-120px)] flex items-center justify-center p-6 bg-gray-50/50">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-white" />

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl w-full space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4"
            style={{ backgroundColor: `${mainColor}10` }}
          >
            <Lock
              className="w-10 h-10"
              style={{ color: mainColor }}
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Materi Segera Tersedia
          </h1>

          {courseTitle && (
            <p className="text-xl font-medium text-gray-700">{courseTitle}</p>
          )}

          {courseDescription && (
            <p className="text-gray-600 max-w-xl mx-auto">
              {courseDescription}
            </p>
          )}
        </div>

        {/* Countdown Cards */}
        <div className="grid grid-cols-4 gap-3 md:gap-4">
          {[
            { label: 'Hari', value: timeLeft.days, icon: Calendar },
            { label: 'Jam', value: timeLeft.hours, icon: Clock },
            { label: 'Menit', value: timeLeft.minutes, icon: Timer },
            { label: 'Detik', value: timeLeft.seconds, icon: Clock },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <item.icon
                className="w-5 h-5 mx-auto mb-2 opacity-50"
                style={{ color: mainColor }}
              />
              <div
                className="text-3xl md:text-4xl font-bold mb-1 tabular-nums"
                style={{ color: mainColor }}
              >
                {String(item.value).padStart(2, '0')}
              </div>
              <div className="text-xs md:text-sm text-gray-500 font-medium uppercase">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Schedule Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div
              className="flex-shrink-0 p-3 rounded-3xl"
              style={{ backgroundColor: `${mainColor}10` }}
            >
              <Calendar
                className="w-6 h-6"
                style={{ color: mainColor }}
              />
            </div>
            <div className="flex-1 text-center md:text-left space-y-1">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Jadwal Pembukaan
              </h3>
              <p className="text-lg font-semibold text-gray-900">
                {formattedDate}
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: mainColor }}
              >
                {formattedTime} WIB
              </p>
            </div>
            <Button
              disabled
              variant="outline"
              className="flex-shrink-0"
              style={{
                borderColor: `${mainColor}30`,
                color: mainColor,
              }}
            >
              <Lock className="w-4 h-4 mr-2" />
              Terkunci
            </Button>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-4 text-center">
          <p className="text-sm text-gray-600">
            💡 Materi akan otomatis terbuka saat waktu yang dijadwalkan tiba.
            Halaman akan ter-refresh secara otomatis.
          </p>
        </div>
      </div>
    </div>
  );
}
