'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronRight, Crown, Layers, Play } from 'lucide-react';
import { PlanDataType } from './_helper';

export default function TabCourse({ plan }: { plan: PlanDataType }) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const courseFeature = plan.PlanSubscription?.PlanFeature.find(
    (feature) => feature.type === 'COURSE',
  );

  if (!courseFeature) {
    return (
      <div className="text-center py-12">
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: `${mainColor}15` }}
        >
          <BookOpen
            className="w-7 h-7 sm:w-8 sm:h-8"
            style={{ color: mainColor }}
          />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
          Course Belum Tersedia
        </h3>
        <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto">
          Paket ini belum memiliki course. Hubungi kami untuk informasi lebih
          lanjut.
        </p>
      </div>
    );
  }

  const categories = courseFeature.Pivot_Plan_Category;

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="space-y-2">
        <Badge
          className="px-3 py-1 sm:px-4 sm:py-1.5 text-xs font-semibold text-white border-none flex items-center gap-1.5 w-fit rounded-3xl"
          style={{ backgroundColor: mainColor }}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Struktur Pembelajaran
        </Badge>
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">
          Materi <span style={{ color: mainColor }}>terstruktur</span> untuk
          hasil optimal
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Setiap kategori dirancang khusus dengan chapter yang mendalam
        </p>
      </div>

      {/* Horizontal Scroll Categories */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 scrollbar-hide">
        <div className="flex gap-4 lg:grid lg:grid-cols-3">
          {categories.map((pivot) => (
            <div
              key={pivot.id}
              className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-auto rounded-3xl border-2 border-slate-200 bg-white overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              {/* Card Header with Gradient */}
              <div
                className="p-4 text-white relative"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-lg">
                      {pivot.Category.nomor}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base leading-tight line-clamp-1">
                        {pivot.Category.name}
                      </h3>
                      <p className="text-white/80 text-[10px] sm:text-xs mt-0.5">
                        Kategori #{pivot.Category.nomor}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-white/20 text-white border-none text-[10px] px-2 py-0.5 rounded-full">
                    <Crown className="w-2.5 h-2.5 mr-0.5" />
                    Premium
                  </Badge>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 space-y-3">
                {/* Sample Chapters */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <Play
                        className="w-2.5 h-2.5"
                        style={{ color: mainColor }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">
                      Chapters
                    </span>
                  </div>

                  {/* Chapter Items */}
                  <div className="space-y-1.5">
                    {[1, 2, 3].map((num) => (
                      <div
                        key={num}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 group-hover:bg-slate-100 transition-colors"
                      >
                        <div
                          className="w-6 h-6 rounded-lg text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0"
                          style={{ backgroundColor: mainColor }}
                        >
                          {num}
                        </div>
                        <span className="text-xs text-slate-700 line-clamp-1 flex-1">
                          {num === 1 && `Pengenalan ${pivot.Category.name}`}
                          {num === 2 && `Konsep Dasar`}
                          {num === 3 && `Latihan & Penerapan`}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      </div>
                    ))}
                  </div>

                  {/* More indicator */}
                  <p className="text-[10px] text-slate-500 text-center pt-1">
                    + Banyak chapter lainnya
                  </p>
                </div>

                {/* Features */}
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <div className="flex-1 flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[10px] font-medium text-emerald-700">
                      Video
                    </span>
                  </div>
                  <div className="flex-1 flex items-center gap-1.5 p-2 rounded-xl bg-purple-50">
                    <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                    <span className="text-[10px] font-medium text-purple-700">
                      Materi
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator for Mobile */}
      {categories.length > 1 && (
        <div className="flex justify-center gap-1.5 lg:hidden">
          {categories.map((_, idx) => (
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
            <BookOpen
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: mainColor }}
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900">
              Pembelajaran Sistematis
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Setiap kategori memiliki chapter bertahap dengan progress tracking
              otomatis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
