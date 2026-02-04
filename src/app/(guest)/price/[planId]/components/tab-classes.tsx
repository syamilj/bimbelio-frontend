'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import {
  ArrowRight,
  Calendar,
  Clock,
  Play,
  Users,
  Video,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlanDataType } from './_helper';

export default function TabClasses({ plan }: { plan: PlanDataType }) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const liveClasses = plan.Pivot_LiveClass_Plan;

  if (liveClasses.length === 0) {
    return (
      <div className="text-center py-12">
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: `${mainColor}15` }}
        >
          <Video
            className="w-7 h-7 sm:w-8 sm:h-8"
            style={{ color: mainColor }}
          />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
          BimLive Segera Hadir
        </h3>
        <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto">
          Kelas live eksklusif akan segera tersedia untuk membermu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="space-y-2">
        <Badge
          className="px-3 py-1 sm:px-4 sm:py-1.5 text-xs font-semibold text-white border-none flex items-center gap-1.5 w-fit rounded-3xl"
          style={{ backgroundColor: mainColor }}
        >
          <Video className="w-3.5 h-3.5" />
          BimLive
        </Badge>
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">
          Kelas <span style={{ color: mainColor }}>Live</span> Eksklusif
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Belajar langsung dengan tutor profesional secara interaktif
        </p>
      </div>

      {/* Horizontal Scroll BimLivees */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 scrollbar-hide">
        <div className="flex gap-4 lg:grid lg:grid-cols-2">
          {liveClasses.map((pivot, index) => (
            <div
              key={pivot.id}
              className="flex-shrink-0 w-[300px] sm:w-[340px] lg:w-auto rounded-3xl border-2 border-slate-200 bg-white overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              {/* Image Section */}
              <div className="relative h-40 sm:h-44 overflow-hidden">
                {pivot.LiveClass.image ? (
                  <Image
                    src={pivot.LiveClass.image}
                    alt={pivot.LiveClass.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: `${mainColor}15` }}
                  >
                    <Video
                      className="w-12 h-12"
                      style={{ color: mainColor }}
                    />
                  </div>
                )}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `linear-gradient(to top, ${mainColor}, transparent)`,
                  }}
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge
                    className="text-white border-none text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ backgroundColor: mainColor }}
                  >
                    <Play className="w-2.5 h-2.5 mr-0.5" />
                    Kelas #{index + 1}
                  </Badge>
                </div>
                {pivot.LiveClass.isRecord && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-red-500 text-white border-none text-[10px] px-2 py-0.5 rounded-full font-semibold animate-pulse">
                      <Video className="w-2.5 h-2.5 mr-0.5" />
                      LIVE
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-4 space-y-3">
                {/* Title */}
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-slate-900 line-clamp-2 leading-tight">
                    {pivot.LiveClass.title}
                  </h3>
                  {pivot.LiveClass.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {pivot.LiveClass.description}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-3xl bg-slate-50">
                    <Calendar
                      className="w-3.5 h-3.5"
                      style={{ color: mainColor }}
                    />
                    <span className="text-[10px] sm:text-xs text-slate-600 font-medium">
                      {formatDate(pivot.LiveClass.startDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-3xl bg-slate-50">
                    <Clock
                      className="w-3.5 h-3.5"
                      style={{ color: secondaryColor }}
                    />
                    <span className="text-[10px] sm:text-xs text-slate-600 font-medium">
                      {pivot.LiveClass.duration} menit
                    </span>
                  </div>
                  {pivot.LiveClass.maxParticipant && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-3xl bg-slate-50">
                      <Users
                        className="w-3.5 h-3.5"
                        style={{ color: mainColor }}
                      />
                      <span className="text-[10px] sm:text-xs text-slate-600 font-medium">
                        Max {pivot.LiveClass.maxParticipant}
                      </span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href={`/${pivot.LiveClass.websiteSubCategoryId}/user/live-class/${pivot.liveClassId}`}
                  onClick={() => window.scrollTo(0, 0)}
                  className="block"
                >
                  <Button
                    className="w-full h-10 text-xs sm:text-sm font-semibold rounded-3xl text-white"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    <Play className="w-3.5 h-3.5 mr-1.5" />
                    Ikuti Kelas
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator for Mobile */}
      {liveClasses.length > 1 && (
        <div className="flex justify-center gap-1.5 lg:hidden">
          {liveClasses.map((_, idx) => (
            <div
              key={idx}
              className="w-1.5 h-1.5 rounded-full bg-slate-300"
              style={idx === 0 ? { backgroundColor: mainColor } : {}}
            />
          ))}
        </div>
      )}

      {/* Info Banner */}
      <div className="rounded-3xl p-4 bg-slate-50 border border-slate-200">
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${mainColor}15` }}
          >
            <Video
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: mainColor }}
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900">
              Pembelajaran Interaktif
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Tanya jawab langsung dengan tutor dan diskusi dengan peserta
              lainnya.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
