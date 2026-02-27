'use client';

import ConsultationDialog from '@/components/_shared/contact/consultation-dialog';
import { DialogPayment } from '@/components/_shared/other/card-plan/_components/dialog-payment';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGet } from '@/lib/fetch-helper/useGet';
import { formatDate } from '@/lib/utils';
import { formatDateRange } from '@/lib/utils/date';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Coins,
  Crown,
  Layers,
  MessageCircle,
  Play,
  Star,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  formatPrice,
  getFeatureIcon,
  getLimitationIcon,
  PlanDataType,
} from './components/_helper';
import { LoadingSkeleton } from './components/loading-skeleton';

export default function PlanDetailPage() {
  const { planId } = useParams();
  const [isConsultationDialogOpen, setIsConsultationDialogOpen] =
    useState(false);
  const { websiteSubCategory } = useWebsiteSubCategory();

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const { data: plan, isLoading: planIsLoading } = useGet<PlanDataType>(
    `/plan/getSinglePlan?slug=${planId}`,
    {
      useEffectDependencies: [planId],
    },
  );

  if (planIsLoading) {
    return <LoadingSkeleton />;
  }

  if (!plan) {
    return <div className="">Not Found</div>;
  }

  const discountPercentage = plan.originalPrice
    ? Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)
    : 0;

  const getAccessDuration = () => {
    if (plan.PlanSubscription?.expireDays) {
      return `${plan.PlanSubscription.expireDays} hari akses`;
    }

    const firstFeature = plan.PlanSubscription?.PlanFeature?.[0];
    if (firstFeature?.validFrom && firstFeature?.validUntil) {
      return formatDateRange(
        firstFeature.validFrom,
        firstFeature.validUntil,
      );
    }

    if (plan.PlanLimitation?.validFrom && plan.PlanLimitation?.validUntil) {
      return formatDateRange(
        plan.PlanLimitation.validFrom,
        plan.PlanLimitation.validUntil,
      );
    }

    if (plan.PlanLimitation?.expireDays) {
      return `${plan.PlanLimitation.expireDays} hari akses`;
    }

    return 'Akses sesuai ketentuan plan';
  };

  const courseFeature = plan.PlanSubscription?.PlanFeature.find(
    (f) => f.type === 'COURSE',
  );
  const liveClasses = plan.Pivot_LiveClass_Plan || [];
  const limitations = plan.PlanLimitation
    ? Object.entries(plan.PlanLimitation).filter(([key, value]) => {
        if (
          key !== 'id' &&
          key !== 'planId' &&
          key !== 'expireDays' &&
          key !== 'validFrom' &&
          key !== 'validUntil' &&
          key !== 'isTimebound'
        ) {
          return typeof value === 'number' && value > 0;
        }
        return false;
      })
    : [];

  return (
    <>
      <div className="min-h-screen pt-[50px] bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
          {/* ========== HERO SECTION ========== */}
          <section className="rounded-3xl overflow-hidden border-2 border-slate-200 bg-white">
            <div
              className="h-1.5"
              style={{
                background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
              }}
            />
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-5">
                {/* Image */}
                <div className="w-full sm:w-1/3">
                  <div className="relative rounded-3xl overflow-hidden border border-slate-200 aspect-[4/5]">
                    {plan.image ? (
                      <Image
                        src={plan.image}
                        alt={plan.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: `${mainColor}10` }}
                      >
                        <Crown
                          className="w-12 h-12"
                          style={{ color: mainColor }}
                        />
                      </div>
                    )}
                    {plan.recommended && (
                      <div
                        className="absolute top-2 right-2 w-8 h-8 rounded-3xl flex items-center justify-center text-white"
                        style={{
                          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                        }}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  {/* Badges */}
                  <div className="flex gap-2 flex-wrap">
                    {plan.recommended && (
                      <Badge
                        className="px-2.5 py-1 text-[10px] font-bold text-white border-none rounded-full"
                        style={{
                          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                        }}
                      >
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        RECOMMENDED
                      </Badge>
                    )}
                    <Badge className="px-2.5 py-1 text-[10px] font-semibold bg-slate-100 text-slate-700 border-none rounded-full">
                      <Crown className="w-3 h-3 mr-1" />
                      Plan
                    </Badge>
                    {discountPercentage > 0 && (
                      <Badge className="px-2.5 py-1 text-[10px] font-bold bg-red-500 text-white border-none rounded-full">
                        <TrendingUp className="w-3 h-3 mr-1" />-
                        {discountPercentage}%
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                    {plan.name}
                  </h1>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span
                      className="text-xl sm:text-2xl font-bold"
                      style={{ color: mainColor }}
                    >
                      {formatPrice(plan.price)}
                    </span>
                    {plan.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        {formatPrice(plan.originalPrice)}
                      </span>
                    )}
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {getAccessDuration()}
                    </span>
                  </div>

                  {/* Installment/Cicilan */}
                  {plan.PlanInstallmentConfig &&
                    plan.PlanInstallmentConfig.PlanInstallmentSchedule.length >
                      0 && (
                      <div
                        className="p-3 rounded-3xl border"
                        style={{
                          backgroundColor: `${mainColor}08`,
                          borderColor: `${mainColor}30`,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-6 h-6 rounded-3xl flex items-center justify-center text-white text-[10px] font-bold"
                            style={{ backgroundColor: mainColor }}
                          >
                            {
                              plan.PlanInstallmentConfig.PlanInstallmentSchedule
                                .length
                            }
                            x
                          </div>
                          <span className="text-xs font-semibold text-slate-700">
                            Bisa Cicilan{' '}
                            {
                              plan.PlanInstallmentConfig.PlanInstallmentSchedule
                                .length
                            }
                            x
                          </span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                          {plan.PlanInstallmentConfig.PlanInstallmentSchedule.sort(
                            (a, b) => a.installmentNumber - b.installmentNumber,
                          ).map((schedule) => (
                            <div
                              key={schedule.id}
                              className="flex-shrink-0 px-2.5 py-1.5 rounded-3xl bg-white border border-slate-200"
                            >
                              <p className="text-[10px] text-slate-500">
                                Cicilan ke-{schedule.installmentNumber}
                              </p>
                              <p
                                className="text-xs font-bold"
                                style={{ color: mainColor }}
                              >
                                {formatPrice(schedule.amount)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Kuota */}
                  {plan.maxUsers && (
                    <div className="flex items-center gap-2 p-2 rounded-3xl bg-amber-50 border border-amber-200">
                      <Users className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-medium text-amber-800">
                        {plan.totalUsers || 0}/{plan.maxUsers} kuota terisi
                      </span>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="flex gap-2 pt-1">
                    {plan.maxUsers && plan.totalUsers >= plan.maxUsers ? (
                      <Button
                        disabled
                        className="h-9 px-4 rounded-full text-xs font-semibold"
                      >
                        Kuota Penuh
                      </Button>
                    ) : (
                      <DialogPayment plan={plan}>
                        <Button
                          className="h-9 px-4 rounded-full text-xs font-semibold text-white"
                          style={{
                            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                          }}
                        >
                          Daftar Sekarang
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      </DialogPayment>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => setIsConsultationDialogOpen(true)}
                      className="h-9 px-4 rounded-full text-xs font-semibold border-2"
                      style={{ borderColor: mainColor, color: mainColor }}
                    >
                      <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                      Konsultasi
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== BENEFITS SECTION ========== */}
          {plan.PlanBenefit && plan.PlanBenefit.length > 0 && (
            <section className="rounded-3xl border-2 border-slate-200 bg-white p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-3xl flex items-center justify-center"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  <Star
                    className="w-4 h-4"
                    style={{ color: mainColor }}
                  />
                </div>
                <h2 className="text-base font-semibold text-slate-900">
                  Keunggulan
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {plan.PlanBenefit.sort((a, b) => a.order - b.order).map(
                  (benefit, index) => (
                    <div
                      key={benefit.id}
                      className="flex items-start gap-3 p-3 rounded-3xl bg-slate-50 border border-slate-100"
                    >
                      <div
                        className="w-7 h-7 rounded-3xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${mainColor}15` }}
                      >
                        <Check
                          className="w-3.5 h-3.5"
                          style={{ color: mainColor }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900">
                          {benefit.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {benefit.description}
                        </p>
                      </div>
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white flex-shrink-0"
                        style={{ backgroundColor: secondaryColor }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </section>
          )}

          {/* ========== FEATURES SECTION ========== */}
          {plan.PlanSubscription?.PlanFeature &&
            plan.PlanSubscription.PlanFeature.length > 0 && (
              <section className="rounded-3xl border-2 border-slate-200 bg-white p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-8 h-8 rounded-3xl flex items-center justify-center"
                    style={{ backgroundColor: `${mainColor}15` }}
                  >
                    <BookOpen
                      className="w-4 h-4"
                      style={{ color: mainColor }}
                    />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Fitur Premium
                  </h2>
                </div>

                <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                  <div className="flex gap-3 sm:grid sm:grid-cols-3">
                    {plan.PlanSubscription.PlanFeature.map((feature) => (
                      <div
                        key={feature.id}
                        className="flex-shrink-0 w-[200px] sm:w-auto p-3 rounded-3xl bg-slate-50 border border-slate-100"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-7 h-7 rounded-3xl flex items-center justify-center"
                            style={{ backgroundColor: `${mainColor}15` }}
                          >
                            <div style={{ color: mainColor }}>
                              {getFeatureIcon(feature.type)}
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-slate-900 capitalize">
                            {feature.type.toLowerCase().replace('_', ' ')}
                          </span>
                        </div>
                        {feature.type === 'COURSE' && (
                          <p className="text-[10px] text-slate-500">
                            {feature.Pivot_Plan_Category.length} kategori materi
                          </p>
                        )}
                        {feature.type === 'LIVECLASS' &&
                          feature.liveClassesPerWeek && (
                            <p className="text-[10px] text-slate-500">
                              {feature.liveClassesPerWeek} kelas/minggu
                            </p>
                          )}
                        {feature.type === 'DOCUMENT' && (
                          <p className="text-[10px] text-slate-500">
                            Akses semua dokumen
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

          {/* ========== COURSE SECTION ========== */}
          {courseFeature && courseFeature.Pivot_Plan_Category.length > 0 && (
            <section className="rounded-3xl border-2 border-slate-200 bg-white p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-3xl flex items-center justify-center"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  <Layers
                    className="w-4 h-4"
                    style={{ color: mainColor }}
                  />
                </div>
                <h2 className="text-base font-semibold text-slate-900">
                  BimCourse
                </h2>
                <span className="text-xs text-slate-500 ml-auto">
                  {courseFeature.Pivot_Plan_Category.length} kategori
                </span>
              </div>

              <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                <div className="flex gap-3 sm:grid sm:grid-cols-3">
                  {courseFeature.Pivot_Plan_Category.map((pivot) => (
                    <div
                      key={pivot.id}
                      className="flex-shrink-0 w-[220px] sm:w-auto rounded-3xl border border-slate-200 overflow-hidden"
                    >
                      <div
                        className="p-3 text-white"
                        style={{
                          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-3xl bg-white/20 flex items-center justify-center font-bold text-sm">
                            {pivot.Category.nomor}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold truncate">
                              {pivot.Category.name}
                            </h3>
                            <p className="text-[10px] text-white/70">
                              Kategori #{pivot.Category.nomor}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 space-y-1.5">
                        {[1, 2, 3].map((num) => (
                          <div
                            key={num}
                            className="flex items-center gap-2 p-1.5 rounded-3xl bg-slate-50"
                          >
                            <div
                              className="w-5 h-5 rounded text-white text-[10px] flex items-center justify-center font-bold"
                              style={{ backgroundColor: mainColor }}
                            >
                              {num}
                            </div>
                            <span className="text-[10px] text-slate-600 truncate">
                              Chapter {num}
                            </span>
                            <ChevronRight className="w-3 h-3 text-slate-400 ml-auto" />
                          </div>
                        ))}
                        <p className="text-[10px] text-slate-400 text-center pt-1">
                          + lebih banyak
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ========== BimLive SECTION ========== */}
          {liveClasses.length > 0 && (
            <section className="rounded-3xl border-2 border-slate-200 bg-white p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-3xl flex items-center justify-center"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  <Video
                    className="w-4 h-4"
                    style={{ color: mainColor }}
                  />
                </div>
                <h2 className="text-base font-semibold text-slate-900">
                  BimLive
                </h2>
                <span className="text-xs text-slate-500 ml-auto">
                  {liveClasses.length} kelas
                </span>
              </div>

              <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                <div className="flex gap-3 sm:grid sm:grid-cols-2">
                  {liveClasses.map((pivot, index) => (
                    <div
                      key={pivot.id}
                      className="flex-shrink-0 w-[200px] sm:w-auto rounded-3xl border border-slate-200 overflow-hidden"
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/5] bg-slate-100">
                        {pivot.LiveClass.image ? (
                          <Image
                            src={pivot.LiveClass.image}
                            alt={pivot.LiveClass.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: `${mainColor}10` }}
                          >
                            <Video
                              className="w-10 h-10"
                              style={{ color: mainColor }}
                            />
                          </div>
                        )}
                        <Badge
                          className="absolute top-2 left-2 text-[10px] px-2 py-0.5 text-white border-none rounded-full"
                          style={{ backgroundColor: mainColor }}
                        >
                          #{index + 1}
                        </Badge>
                        {pivot.LiveClass.isRecord && (
                          <Badge className="absolute top-2 right-2 text-[10px] px-2 py-0.5 bg-red-500 text-white border-none rounded-full animate-pulse">
                            LIVE
                          </Badge>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3 space-y-2">
                        <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">
                          {pivot.LiveClass.title}
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="flex items-center gap-1 text-[10px] text-slate-500 px-2 py-1 bg-slate-50 rounded-3xl">
                            <Calendar className="w-3 h-3" />
                            {formatDate(pivot.LiveClass.startDate)}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-slate-500 px-2 py-1 bg-slate-50 rounded-3xl">
                            <Clock className="w-3 h-3" />
                            {pivot.LiveClass.duration}m
                          </span>
                        </div>
                        <Link
                          href={`/${pivot.LiveClass.websiteSubCategoryId}/user/live-class/${pivot.liveClassId}`}
                          className="block"
                        >
                          <Button
                            size="sm"
                            className="w-full h-8 text-[10px] rounded-full text-white"
                            style={{ backgroundColor: mainColor }}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Lihat Detail
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ========== KOIN/LIMITS SECTION ========== */}
          {limitations.length > 0 && (
            <section className="rounded-3xl border-2 border-slate-200 bg-white p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-3xl flex items-center justify-center"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  <Coins
                    className="w-4 h-4"
                    style={{ color: mainColor }}
                  />
                </div>
                <h2 className="text-base font-semibold text-slate-900">
                  Koin BimBot
                </h2>
              </div>

              <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                <div className="flex gap-3 sm:grid sm:grid-cols-4">
                  {limitations.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex-shrink-0 w-[140px] sm:w-auto p-3 rounded-3xl bg-slate-50 border border-slate-100 text-center"
                    >
                      <div
                        className="w-10 h-10 rounded-3xl flex items-center justify-center mx-auto mb-2"
                        style={{ backgroundColor: `${mainColor}15` }}
                      >
                        <div style={{ color: mainColor }}>
                          {getLimitationIcon(key)}
                        </div>
                      </div>
                      <p
                        className="text-lg font-bold"
                        style={{ color: mainColor }}
                      >
                        {typeof value === 'number'
                          ? value.toLocaleString()
                          : value}
                      </p>
                      <p className="text-[10px] text-slate-500 capitalize">
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
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ========== BOTTOM CTA ========== */}
          <section
            className="rounded-3xl p-4 sm:p-6 text-white"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-base sm:text-lg font-bold">
                  Siap mulai perjalananmu?
                </h2>
                <p className="text-xs text-white/80 mt-1">
                  Daftar sekarang dan raih impian PTN-mu bersama Bimbelio
                </p>
              </div>
              <div className="flex gap-2">
                {plan.maxUsers && plan.totalUsers >= plan.maxUsers ? (
                  <Button
                    disabled
                    className="h-9 px-4 rounded-full text-xs font-semibold bg-white/20 text-white"
                  >
                    Kuota Penuh
                  </Button>
                ) : (
                  <DialogPayment plan={plan}>
                    <Button className="h-9 px-4 rounded-full text-xs font-semibold bg-white text-slate-900 hover:bg-white/90">
                      Daftar Sekarang
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </DialogPayment>
                )}
                <Button
                  variant="outline"
                  onClick={() => setIsConsultationDialogOpen(true)}
                  className="h-9 px-4 rounded-full text-xs font-semibold border-2 border-white/50 text-white bg-transparent hover:bg-white/10"
                >
                  <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                  Konsultasi
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ConsultationDialog
        isOpen={isConsultationDialogOpen}
        onOpenChange={setIsConsultationDialogOpen}
        title="Wujudkan Impian PTN-mu!"
        description="Pilih langkah pertama untuk memulai journey menuju PTN idaman"
        showStats={true}
      />
    </>
  );
}
