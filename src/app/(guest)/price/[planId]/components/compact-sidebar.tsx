'use client';

import { DialogPayment } from '@/components/_shared/other/card-plan/_components/dialog-payment';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { formatDateDifference } from '@/lib/utils/date';
import {
  Clock,
  Crown,
  MessageCircle,
  Play,
  Star,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react';
import { formatPrice, PlanDataType } from './_helper';

export default function CompactSidebar({
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
    <div className="space-y-4">
      {/* Clean Purchase Card - BimArena Style */}
      <Card className="border-2 border-slate-200 shadow-sm bg-white rounded-3xl overflow-hidden hover:shadow-lg transition-shadow duration-200">
        {/* Header with gradient */}
        <div
          className="p-4 text-white relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
        >
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="px-3 py-1 bg-white/20 text-white border-none text-xs font-bold flex items-center gap-1 w-fit rounded-full">
                <Crown className="w-3 h-3" />
                Plan
              </Badge>
              {plan.recommended && (
                <Badge className="px-2 py-1 bg-amber-400 text-amber-900 border-none text-xs font-bold flex items-center gap-1 w-fit rounded-full">
                  <Star className="w-3 h-3" />
                  Top Pick
                </Badge>
              )}
            </div>

            <h3 className="text-lg font-black mb-3 leading-tight">
              {plan.name}
            </h3>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black">
                  {formatPrice(plan.price)}
                </span>
                {plan.originalPrice && (
                  <span className="text-sm text-white/70 line-through">
                    {formatPrice(plan.originalPrice)}
                  </span>
                )}
              </div>
              {discountPercentage > 0 && (
                <Badge className="bg-red-500 text-white border-0 text-xs rounded-full">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Hemat {discountPercentage}%
                </Badge>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          {/* Compact Plan Details */}
          <div className="space-y-3">
            {plan.PlanSubscription && (
              <div className="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-700 flex items-center gap-2 text-sm font-medium">
                  <div
                    className="w-7 h-7 rounded-3xl flex items-center justify-center"
                    style={{ backgroundColor: `${mainColor}15` }}
                  >
                    <Clock className="w-3.5 h-3.5" style={{ color: mainColor }} />
                  </div>
                  Durasi
                </span>
                <span
                  className="font-bold text-sm"
                  style={{ color: mainColor }}
                >
                  {plan.PlanSubscription.expireDays &&
                    `${plan.PlanSubscription.expireDays} hari`}
                  {plan.PlanSubscription.PlanFeature.length > 0 &&
                    `${formatDateDifference(plan.PlanSubscription.PlanFeature[0].validFrom, plan.PlanSubscription.PlanFeature[0].validUntil)}`}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-700 flex items-center gap-2 text-sm font-medium">
                <div
                  className="w-7 h-7 rounded-3xl flex items-center justify-center"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  <Video className="w-3.5 h-3.5" style={{ color: mainColor }} />
                </div>
                BimLivees
              </span>
              <span
                className="font-bold text-sm"
                style={{ color: mainColor }}
              >
                {plan.Pivot_LiveClass_Plan.length} kelas
              </span>
            </div>
          </div>

          {/* Compact Action Buttons */}
          <div className="space-y-2.5">
            {plan.maxUsers && plan.totalUsers >= plan.maxUsers ? (
              <Button
                className="w-full py-3 text-sm font-bold rounded-full text-white shadow-sm cursor-not-allowed"
                style={{ backgroundColor: mainColor }}
              >
                <Users className="w-4 h-4 mr-2" />
                Kuota Penuh
              </Button>
            ) : (
              <DialogPayment plan={plan}>
                <Button
                  className="w-full py-3 text-sm font-bold rounded-full text-white shadow-sm hover:shadow-md transition-shadow"
                  style={{ backgroundColor: mainColor }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Mulai Sekarang
                </Button>
              </DialogPayment>
            )}

            <Button
              onClick={handleConsultationClick}
              variant="outline"
              className="w-full py-3 text-sm font-semibold rounded-full border-2 hover:shadow-md transition-shadow"
              style={{
                borderColor: mainColor,
                color: mainColor,
              }}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Konsultasi
            </Button>
          </div>

          {/* Compact Trust Indicators */}
          <div className="pt-3 border-t border-slate-100">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-3xl bg-slate-50">
                <div
                  className="text-lg font-black"
                  style={{ color: mainColor }}
                >
                  97%
                </div>
                <div className="text-xs text-slate-600 font-medium">Success</div>
              </div>
              <div className="p-2 rounded-3xl bg-slate-50">
                <div
                  className="text-lg font-black"
                  style={{ color: mainColor }}
                >
                  +200
                </div>
                <div className="text-xs text-slate-600 font-medium">Score</div>
              </div>
              <div className="p-2 rounded-3xl bg-slate-50">
                <div
                  className="text-lg font-black"
                  style={{ color: mainColor }}
                >
                  24/7
                </div>
                <div className="text-xs text-slate-600 font-medium">Support</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
