'use client';

import { BookOpen, Calendar, Clock, Crown, Eye, Lock } from 'lucide-react';
import type * as React from 'react';

import ButtonPayment from '@/app/(main)/[web_sub_category]/(user)/user/_components/button-payment';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NotificationBadgeProps {
  count: number;
  variant?: 'default' | 'red' | 'green' | 'yellow' | 'gray';
  pulse?: boolean;
}

export function NotificationBadge({
  count,
  variant = 'default',
  pulse = false,
}: NotificationBadgeProps) {
  // if (count === 0) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'red':
        return 'bg-red-500 text-white border-red-600';
      case 'green':
        return 'bg-green-500 text-white border-green-600';
      case 'yellow':
        return 'bg-yellow-500 text-white border-yellow-600';
      case 'gray':
        return 'bg-gray-500 text-white border-gray-600';
      default:
        return 'bg-blue-500 text-white border-blue-600';
    }
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-black rounded-full border-2 ${getVariantStyles()} ${pulse ? 'animate-pulse' : ''}`}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}

interface CountdownTimerProps {
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  };
}

export function CountdownTimer({ timeLeft }: CountdownTimerProps) {
  if (timeLeft.isExpired) {
    return (
      <div className="text-xs text-slate-400 font-semibold">
        Waktu telah berakhir
      </div>
    );
  }

  const units = [
    ...(timeLeft.days > 0 ? [{ value: timeLeft.days, label: 'hari' }] : []),
    { value: timeLeft.hours, label: 'jam' },
    { value: timeLeft.minutes, label: 'mnt' },
    ...(timeLeft.days === 0 ? [{ value: timeLeft.seconds, label: 'dtk' }] : []),
  ];

  return (
    <div className="flex gap-1.5 items-center">
      {units.map(({ value, label }) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center min-w-[36px] px-2 py-1.5 rounded-3xl bg-white border border-slate-200 shadow-sm"
        >
          <span className="text-sm font-black leading-none text-slate-800">
            {String(value).padStart(2, '0')}
          </span>
          <span className="text-[9px] font-bold text-slate-400 mt-0.5 leading-none">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  gradient,
  bgColor,
  borderColor,
  textColor,
}: StatsCardProps) {
  return (
    <Card
      className={`stats-card border-2 transition-all duration-300 hover:shadow-md rounded-3xl overflow-hidden ${bgColor} ${borderColor}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
        <CardTitle className={`text-xs md:text-sm font-black ${textColor}`}>
          {title}
        </CardTitle>
        <div
          className={`w-8 h-8 md:w-10 md:h-10 rounded-3xl flex items-center justify-center bg-gradient-to-br ${gradient} text-white shadow-sm border-2 border-white`}
        >
          <Icon className="w-4 h-4 md:w-5 md:h-5" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xl md:text-2xl lg:text-3xl font-black text-gray-900 mb-1 md:mb-2">
          {value}
        </div>
        <p className={`text-xs md:text-sm font-bold opacity-80 ${textColor}`}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

interface MarketingCTAProps {
  liveClass: any;
  compact?: boolean;
}

export function MarketingCTA({ compact = false }: MarketingCTAProps) {
  if (compact) {
    return (
      <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-3 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-bold text-orange-800">
            Premium Required
          </span>
        </div>
        <ButtonPayment
          type="modal"
          className="w-full h-8 text-xs bg-orange-600 hover:bg-orange-700 text-white rounded-3xl font-bold border-2"
        >
          Upgrade Sekarang
        </ButtonPayment>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-3xl p-4 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shrink-0 border-2 border-orange-600 shadow-sm">
          <Crown className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-black text-gray-900 text-base">
            Upgrade ke Premium
          </h4>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Dapatkan akses penuh ke semua fitur kelas
          </p>
        </div>
      </div>

      <ButtonPayment
        type="modal"
        className="w-full h-10 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-3xl font-black shadow-sm transition-all duration-200 border-2"
      >
        Upgrade Sekarang
      </ButtonPayment>
    </div>
  );
}

interface PreviewContentProps {
  liveClass: any;
}

export function PreviewContent({ liveClass }: PreviewContentProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl p-3 sm:p-5 space-y-3 sm:space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-3xl bg-blue-500 flex items-center justify-center shrink-0 border-2 border-blue-600 shadow-sm">
            <Eye className="w-3 h-3 text-white" />
          </div>
          <span className="font-black text-blue-900 text-sm sm:text-base">
            Preview Kelas
          </span>
        </div>
        <Badge className="bg-blue-100 text-blue-700 border-2 border-blue-300 text-xs w-fit font-bold rounded-3xl">
          Terbatas
        </Badge>
      </div>

      {/* Agenda Preview - Responsive Design */}
      {liveClass.LiveClassAgenda && liveClass.LiveClassAgenda.length > 0 && (
        <div className="bg-white rounded-3xl p-3 sm:p-4 border-2 border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-bold text-gray-900 text-sm">
              Agenda Pembelajaran
            </span>
          </div>
          <div className="space-y-2">
            {liveClass.LiveClassAgenda.slice(0, 2).map(
              (agenda: any, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-50 rounded-3xl border-2 border-blue-100"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-500 text-white text-xs font-black flex items-center justify-center mt-0.5 shrink-0 border-2 border-blue-600">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">
                      {agenda.title}
                    </p>
                    {agenda.duration && (
                      <p className="text-xs text-gray-500 mt-1 font-medium">
                        {agenda.duration} menit
                      </p>
                    )}
                  </div>
                </div>
              ),
            )}
            {liveClass.LiveClassAgenda.length > 2 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-500 font-bold">
                    +{liveClass.LiveClassAgenda.length - 2} agenda lainnya
                  </span>
                </div>
                <Badge className="bg-orange-100 text-orange-700 border-orange-300 text-xs w-fit mx-auto sm:mx-0">
                  Premium
                </Badge>
              </div>
            )}
          </div>
        </div>
      )}

      {/* References Preview - Responsive Design */}
      {liveClass.LiveClassReference &&
        liveClass.LiveClassReference.length > 0 && (
          <div className="bg-white rounded-3xl p-3 sm:p-4 border border-blue-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-green-600 shrink-0" />
              <span className="font-medium text-gray-800 text-sm">
                Materi & Referensi
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-3 p-3 sm:p-4 bg-linear-to-r from-gray-50 to-gray-100 rounded-3xl border-2 border-dashed border-gray-200">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mx-auto sm:mx-0 shrink-0" />
              <div className="text-center sm:text-left">
                <p className="font-medium text-gray-700 text-xs sm:text-sm">
                  {liveClass.LiveClassReference.length} referensi pembelajaran
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Dokumen, video, dan materi eksklusif untuk member premium
                </p>
              </div>
            </div>
          </div>
        )}

      {/* Call to Action - Responsive */}
      <div className="bg-linear-to-r from-orange-100 to-red-100 rounded-3xl p-3 sm:p-4 border border-orange-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-orange-400 to-red-500 flex items-center justify-center mx-auto sm:mx-0 shrink-0">
            <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-semibold text-gray-800 text-xs sm:text-sm">
              Ingin melihat lebih lengkap?
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              Upgrade ke premium untuk akses penuh semua materi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="mb-6">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      </div>
      <div className="flex justify-center">
        <Button
          variant="outline"
          className="gap-2 bg-transparent"
        >
          <Calendar className="h-4 w-4" />
          Lihat Semua Kelas
        </Button>
      </div>
    </div>
  );
}

export function LoadingSkeleton({
  mainColor,
  secondaryColor,
}: {
  mainColor: string;
  secondaryColor: string;
}) {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
        <CardHeader
          className="pb-6 border-b border-gray-100 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
          }}
        >
          <div className="relative z-10">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-96"></div>
          </div>
        </CardHeader>
      </Card>
      {/* Tabs Skeleton */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <div className="flex space-x-1 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 bg-gray-200 rounded animate-pulse w-32"
            ></div>
          ))}
        </div>
        {/* Cards Skeleton */}
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border rounded-3xl p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ErrorState() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-12 text-center">
      <div className="text-red-500 mb-4">
        <svg
          className="h-16 w-16 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13 12"
          />
        </svg>
      </div>
      <p className="text-gray-600 text-sm mb-4">
        Terjadi kesalahan saat memuat data.
      </p>
      <Button
        variant="outline"
        className="gap-2 bg-transparent"
      >
        <Clock className="h-4 w-4" />
        Coba Lagi
      </Button>
    </div>
  );
}
