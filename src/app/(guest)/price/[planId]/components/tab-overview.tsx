'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Infinity,
  LockOpen,
  Play,
  Star,
  Users,
  Video,
} from 'lucide-react';
import { getFeatureIcon, getLimitationIcon, PlanDataType } from './_helper';

export default function TabOverview({
  plan,
  setActiveTab,
}: {
  plan: PlanDataType;
  setActiveTab: (
    tab: 'overview' | 'course' | 'features' | 'classes' | 'limits',
  ) => void;
}) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';
  return (
    <div className="space-y-8">
      {/* Benefits Grid - BimArena Style */}
      {plan.PlanBenefit && plan.PlanBenefit.length > 0 && (
        <Card className="border-2 border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden">
          <CardHeader className="pb-6">
            <Badge
              className="mb-4 px-4 py-2 text-sm font-semibold text-white border-none flex items-center gap-2 w-fit rounded-full shadow-sm"
              style={{ backgroundColor: mainColor }}
            >
              <Star className="w-4 h-4" />
              Keunggulan
            </Badge>
            <CardTitle className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Sistem yang <span style={{ color: mainColor }}>terukur</span>{' '}
              untuk hasil maksimal
            </CardTitle>
            <CardDescription className="text-lg text-slate-600 leading-relaxed">
              <span
                className="font-semibold"
                style={{ color: mainColor }}
              >
                Goal kita jelas:
              </span>{' '}
              setiap fitur dirancang khusus untuk bantu kamu naik minimal 200+
              poin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {plan.PlanBenefit.sort((a, b) => a.order - b.order).map(
                (benefit, index) => (
                  <div
                    key={benefit.id}
                    className="group relative p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="shrink-0 w-11 h-11 rounded-3xl flex items-center justify-center"
                        style={{ backgroundColor: `${mainColor}15` }}
                      >
                        <Check
                          className="w-5 h-5"
                          style={{ color: mainColor }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 text-base mb-1">
                          {benefit.title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                    <div
                      className="absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: secondaryColor }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Overview - BimArena Style */}
      {plan.PlanSubscription?.PlanFeature &&
        plan.PlanSubscription?.PlanFeature.length > 0 && (
          <Card className="border-2 border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden">
            <CardHeader className="pb-6">
              <Badge
                className="mb-4 px-4 py-2 text-sm font-semibold text-white border-none flex items-center gap-2 w-fit rounded-full shadow-sm"
                style={{ backgroundColor: mainColor }}
              >
                <BookOpen className="w-4 h-4" />
                Fitur
              </Badge>
              <CardTitle className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                Akses <span style={{ color: mainColor }}>unlimited</span> ke
                semua kategori
              </CardTitle>
              <CardDescription className="text-lg text-slate-600 leading-relaxed">
                <span
                  className="font-semibold"
                  style={{ color: mainColor }}
                >
                  Semua fitur premium
                </span>{' '}
                yang kamu butuhkan untuk persiapan UTBK maksimal. Bukan sekadar
                akses biasa, tapi{' '}
                <span
                  className="font-semibold"
                  style={{ color: secondaryColor }}
                >
                  sistem pembelajaran terintegrasi
                </span>
                !
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  'grid md:grid-cols-3 gap-4',
                  plan.PlanSubscription.PlanFeature.length === 1 &&
                    'md:grid-cols-1',
                  plan.PlanSubscription.PlanFeature.length === 2 &&
                    'md:grid-cols-2',
                )}
              >
                {plan.PlanSubscription.PlanFeature.map((feature, index) => (
                  <div
                    key={feature.id}
                    className="group p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-11 h-11 rounded-3xl flex items-center justify-center"
                        style={{ backgroundColor: `${mainColor}15` }}
                      >
                        <div style={{ color: mainColor }}>
                          {getFeatureIcon(feature.type)}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-base capitalize">
                          {feature.type.toLowerCase().replace('_', ' ')}
                        </h3>
                        {feature.liveClassesPerWeek && (
                          <p
                            className="text-sm font-medium"
                            style={{ color: mainColor }}
                          >
                            {feature.liveClassesPerWeek} kelas/minggu
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {feature.type === 'COURSE' &&
                        feature.Pivot_Plan_Category.slice(0, 3).map((pivot) => (
                          <div
                            key={pivot.id}
                            className="flex items-center gap-3 p-2 rounded-3xl bg-white border border-slate-100"
                          >
                            <div
                              className="w-6 h-6 rounded-3xl text-white text-xs flex items-center justify-center font-bold"
                              style={{ backgroundColor: mainColor }}
                            >
                              {pivot.Category.nomor}
                            </div>
                            <span className="text-slate-700 font-medium text-sm">
                              {pivot.Category.name}
                            </span>
                            <ArrowRight className="w-4 h-4 text-slate-400 ml-auto" />
                          </div>
                        ))}
                      {feature.type === 'DOCUMENT' && (
                        <div className="flex gap-3 p-2 rounded-3xl bg-white border border-slate-100">
                          <div
                            className="w-6 h-6 rounded-3xl text-white text-xs flex items-center justify-center font-bold shrink-0"
                            style={{ backgroundColor: mainColor }}
                          >
                            <LockOpen className="w-3 h-3" />
                          </div>
                          <span className="text-slate-700 font-medium text-sm">
                            Akses ke Semua Document Premium
                          </span>
                        </div>
                      )}
                      {feature.type === 'LIVECLASS' &&
                        feature.liveClassesPerWeek && (
                          <div className="flex gap-3 p-2 rounded-3xl bg-white border border-slate-100">
                            <div
                              className="w-6 h-6 rounded-3xl text-white text-xs flex items-center justify-center font-bold shrink-0"
                              style={{ backgroundColor: mainColor }}
                            >
                              <Play className="w-3 h-3" />
                            </div>
                            <span className="text-slate-700 font-medium text-sm">
                              {feature.liveClassesPerWeek} BimLive per Minggu
                            </span>
                          </div>
                        )}
                    </div>

                    {/* Feature highlight badge */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div
                        className="text-xs font-semibold px-3 py-1 rounded-full text-white w-fit"
                        style={{ backgroundColor: secondaryColor }}
                      >
                        Premium Access
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* BimLivees Overview - BimArena Style */}
      {plan.Pivot_LiveClass_Plan && plan.Pivot_LiveClass_Plan.length > 0 && (
        <Card className="border-2 border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden">
          <CardHeader className="pb-6">
            <Badge
              className="mb-4 px-4 py-2 text-sm font-semibold text-white border-none flex items-center gap-2 w-fit rounded-full shadow-sm"
              style={{ backgroundColor: mainColor }}
            >
              <Video className="w-4 h-4" />
              BimLive Premium
            </Badge>
            <CardTitle className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Belajar langsung dengan{' '}
              <span style={{ color: mainColor }}>mentor terbaik</span>
            </CardTitle>
            <CardDescription className="text-lg text-slate-600 leading-relaxed">
              <span
                className="font-semibold"
                style={{ color: mainColor }}
              >
                {plan.Pivot_LiveClass_Plan.length} BimLive terjadwal
              </span>{' '}
              dengan instruktur berpengalaman. Interaksi langsung,{' '}
              <span
                className="font-semibold"
                style={{ color: secondaryColor }}
              >
                hasil maksimal
              </span>
              !
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {plan.Pivot_LiveClass_Plan.slice(0, 4).map((pivot, index) => (
                <div
                  key={pivot.id}
                  className="group p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all duration-300 relative"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-11 h-11 rounded-3xl flex items-center justify-center text-white font-bold text-base shrink-0"
                      style={{ backgroundColor: mainColor }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 text-base mb-2 leading-tight">
                        {pivot.LiveClass.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-3xl border border-slate-100">
                          <Clock
                            className="w-4 h-4"
                            style={{ color: mainColor }}
                          />
                          <span className="font-medium text-slate-700">
                            {pivot.LiveClass.duration}m
                          </span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-3xl border border-slate-100">
                          <Users
                            className="w-4 h-4"
                            style={{ color: mainColor }}
                          />
                          <span className="font-medium text-slate-700">
                            {pivot.LiveClass.maxParticipant || 'Unlimited'}
                          </span>
                        </div>
                        {pivot.LiveClass.isRecord && (
                          <Badge className="bg-emerald-500 text-white text-xs font-medium border-0 rounded-full">
                            <Play className="w-3 h-3 mr-1" />
                            Direkam
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Instructor info */}
                  {pivot.LiveClass.Instructor && (
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      <div
                        className="w-6 h-6 rounded-3xl flex items-center justify-center"
                        style={{ backgroundColor: `${mainColor}15` }}
                      >
                        <Users
                          className="w-3 h-3"
                          style={{ color: mainColor }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        Instructor Premium
                      </span>
                    </div>
                  )}

                  {/* Class number badge */}
                  <div
                    className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full text-white"
                    style={{ backgroundColor: secondaryColor }}
                  >
                    Class {index + 1}
                  </div>
                </div>
              ))}
            </div>

            {plan.Pivot_LiveClass_Plan.length > 4 && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('classes')}
                  className="px-6 py-3 rounded-full border-2 font-semibold hover:shadow-md transition-all duration-300"
                  style={{
                    borderColor: mainColor,
                    color: mainColor,
                  }}
                >
                  Lihat Semua {plan.Pivot_LiveClass_Plan.length} BimLive
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Usage Limits Overview - BimArena Style */}
      {plan.PlanLimitation && (
        <Card className="border-2 border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden">
          <CardHeader className="pb-6">
            <Badge
              className="mb-4 px-4 py-2 text-sm font-semibold text-white border-none flex items-center gap-2 w-fit rounded-full shadow-sm"
              style={{ backgroundColor: mainColor }}
            >
              <Infinity className="w-4 h-4" />
              Koin BimBot
            </Badge>
            <CardTitle className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Sistem koin yang{' '}
              <span style={{ color: mainColor }}>unlimited</span> untuk belajar
            </CardTitle>
            <CardDescription className="text-lg text-slate-600 leading-relaxed">
              <span
                className="font-semibold"
                style={{ color: mainColor }}
              >
                Gak perlu khawatir
              </span>{' '}
              soal limit! Paket ini dirancang untuk pembelajaran maksimal dengan{' '}
              <span
                className="font-semibold"
                style={{ color: secondaryColor }}
              >
                koin yang berlimpah
              </span>
              .
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(plan.PlanLimitation)
                .filter(([key, value]) => {
                  if (
                    key !== 'id' &&
                    key !== 'planId' &&
                    key !== 'expireDays' &&
                    key !== 'validFrom' &&
                    key !== 'validUntil' &&
                    key !== 'isTimebound'
                  ) {
                    if (typeof value === 'number' && value > 0) {
                      return true;
                    }
                    if (typeof value === 'string' && parseInt(value) > 0) {
                      return true;
                    }
                    return false;
                  }
                  return false;
                })
                .map(([key, value], index) => (
                  <div
                    key={key}
                    className="group p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center hover:shadow-md transition-all duration-300 relative"
                  >
                    <div
                      className="w-14 h-14 rounded-3xl flex items-center justify-center mx-auto mb-3"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <div style={{ color: mainColor }}>
                        {getLimitationIcon(key)}
                      </div>
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2 text-base">
                      {key === 'chat'
                        ? 'Chat AI'
                        : key === 'notes'
                          ? 'Catatan'
                          : key === 'vision'
                            ? 'Vision AI'
                            : key === 'quiz'
                              ? 'Kuis'
                              : key === 'tryout'
                                ? 'Tryout'
                                : key}
                    </h4>
                    <div
                      className="text-3xl font-bold mb-1"
                      style={{ color: mainColor }}
                    >
                      {typeof value === 'number'
                        ? value.toLocaleString()
                        : value}
                    </div>
                    <div className="text-sm text-slate-600 font-medium">
                      koin tersedia
                    </div>

                    {/* Progress bar indicator */}
                    <div className="mt-4">
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            backgroundColor: mainColor,
                            width:
                              typeof value === 'number' && value > 100
                                ? '100%'
                                : '85%',
                          }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Lebih dari cukup!
                      </p>
                    </div>

                    {/* Feature badge */}
                    <div
                      className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: secondaryColor }}
                    >
                      Premium
                    </div>
                  </div>
                ))}
            </div>

            {/* Info banner */}
            <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-3xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  <Infinity
                    className="w-5 h-5"
                    style={{ color: mainColor }}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    Sistem Koin BimBot yang Berbeda
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    <span
                      className="font-semibold"
                      style={{ color: mainColor }}
                    >
                      Gak kayak platform lain
                    </span>{' '}
                    yang perhitungan koinnya pelit. Di sini kamu bisa belajar
                    sepuasnya tanpa khawatir koin habis!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
