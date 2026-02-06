'use client';

import { DialogPayment } from '@/components/_shared/other/card-plan/_components/dialog-payment';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { formatDateRange } from '@/lib/utils/date';
import {
  ArrowRight,
  Calendar,
  Crown,
  MessageCircle,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { formatPrice, PlanDataType } from './_helper';

export default function Hero({
  plan,
  setIsConsultationDialogOpen,
}: {
  plan: PlanDataType;
  setIsConsultationDialogOpen: (open: boolean) => void;
}) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const discountPercentage = plan.originalPrice
    ? Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)
    : 0;

  // Get access duration text
  const getAccessDuration = () => {
    if (plan.PlanSubscription?.expireDays) {
      return `${plan.PlanSubscription.expireDays} hari akses`;
    }
    if (plan.PlanSubscription && plan.PlanSubscription.PlanFeature.length > 0) {
      return formatDateRange(
        plan.PlanSubscription.PlanFeature[0].validFrom,
        plan.PlanSubscription.PlanFeature[0].validUntil,
      );
    }
    return formatDateRange(
      plan.PlanLimitation.validFrom,
      plan.PlanLimitation.validUntil,
    );
  };

  // Handle consultation dialog open
  const handleConsultationClick = () => {
    try {
      trackUnifiedEvent({
        eventName: 'ViewContent',
        customData: {
          content_type: 'page',
          content_name: 'Contact Modal from Plan Detail',
          content_id: 'plan_detail_contact_modal',
          page_path: '/plan-detail-contact-modal',
        },
      });
    } catch (error) {
      console.warn('Pixel tracking error:', error);
    }
    setIsConsultationDialogOpen(true);
  };

  return (
    <div className="w-full">
      {/* Mobile-First Hero Container */}
      <div className="rounded-3xl overflow-hidden border-2 border-slate-200 bg-white shadow-sm">
        {/* Top Gradient Bar */}
        <div
          className="h-1.5 sm:h-2"
          style={{
            background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
          }}
        />

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Mobile: Image first, then content */}
          {/* Desktop: Content left, Image right */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-5 lg:gap-8">
            {/* Image - Mobile: Top, Desktop: Right */}
            <div className="w-full lg:w-2/5 lg:order-2">
              <div className="relative">
                <div className="rounded-3xl overflow-hidden border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white aspect-[4/5]">
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
                      <div className="text-center space-y-2">
                        <div
                          className="w-14 h-14 sm:w-20 sm:h-20 mx-auto rounded-3xl flex items-center justify-center"
                          style={{ backgroundColor: `${mainColor}20` }}
                        >
                          <Crown
                            className="w-7 h-7 sm:w-10 sm:h-10"
                            style={{ color: mainColor }}
                          />
                        </div>
                        <p
                          className="text-xs sm:text-sm font-bold"
                          style={{ color: mainColor }}
                        >
                          Premium Plan
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Floating Recommended Badge */}
                {plan.recommended && (
                  <div
                    className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-10 h-10 sm:w-12 sm:h-12 rounded-3xl flex items-center justify-center text-white shadow-lg border-2 sm:border-4 border-white"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                  </div>
                )}
              </div>
            </div>

            {/* Content - Mobile: Below image, Desktop: Left */}
            <div className="w-full lg:w-3/5 lg:order-1 space-y-4 sm:space-y-5">
              {/* Badges - Horizontal scroll on mobile */}
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                {plan.recommended && (
                  <Badge
                    className="px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-bold text-white border-none flex items-center gap-1 sm:gap-1.5 rounded-3xl shadow-md whitespace-nowrap flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                    RECOMMENDED
                  </Badge>
                )}
                <Badge className="px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-semibold bg-slate-100 text-slate-700 border-none rounded-3xl flex items-center gap-1 sm:gap-1.5 whitespace-nowrap flex-shrink-0">
                  <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Plan
                </Badge>
                {discountPercentage > 0 && (
                  <Badge className="px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white border-none rounded-3xl flex items-center gap-1 sm:gap-1.5 shadow-md whitespace-nowrap flex-shrink-0">
                    <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    HEMAT {discountPercentage}%
                  </Badge>
                )}
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight text-slate-900 tracking-tight">
                  {plan.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <span
                    className="font-bold"
                    style={{ color: mainColor }}
                  >
                    Goal kita jelas:
                  </span>{' '}
                  Nilai untuk naik{' '}
                  <span className="font-bold text-slate-900">200+ poin</span>{' '}
                  dalam waktu terukur.
                </p>
              </div>

              {/* Pricing - Compact on mobile */}
              <div className="rounded-3xl p-3 sm:p-4 bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span
                        className="text-xl sm:text-2xl font-bold"
                        style={{ color: mainColor }}
                      >
                        {formatPrice(plan.price)}
                      </span>
                      {plan.originalPrice && (
                        <span className="text-sm sm:text-base text-slate-400 line-through">
                          {formatPrice(plan.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Calendar
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                        style={{ color: mainColor }}
                      />
                      <span className="text-xs sm:text-sm text-slate-600 truncate">
                        {getAccessDuration()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kuota Terbatas - Simplified for mobile */}
              {plan.maxUsers && (
                <div className="rounded-3xl p-3 sm:p-4 bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-3xl bg-amber-100 flex items-center justify-center">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-amber-900">
                        Kuota Terbatas
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex-1 h-1.5 sm:h-2 bg-amber-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{
                              width: `${Math.min(((plan.totalUsers || 0) / plan.maxUsers) * 100, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold text-amber-700 whitespace-nowrap">
                          {plan.totalUsers || 0}/{plan.maxUsers}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Buttons - Stack on mobile */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1">
                {plan.maxUsers && plan.totalUsers >= plan.maxUsers ? (
                  <Button
                    disabled
                    className="w-full sm:w-auto h-11 sm:h-12 px-6 rounded-3xl font-bold text-white text-sm opacity-60"
                    style={{ backgroundColor: mainColor }}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Kuota Penuh
                  </Button>
                ) : (
                  <DialogPayment plan={plan}>
                    <Button
                      className="w-full sm:w-auto h-11 sm:h-12 px-6 rounded-3xl font-bold text-white text-sm shadow-md"
                      style={{
                        background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                      }}
                    >
                      Daftar Sekarang
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </DialogPayment>
                )}
                <Button
                  variant="outline"
                  onClick={handleConsultationClick}
                  className="w-full sm:w-auto h-11 sm:h-12 px-6 rounded-3xl font-semibold text-sm border-2 bg-white"
                  style={{
                    borderColor: mainColor,
                    color: mainColor,
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Konsultasi
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
