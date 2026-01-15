'use client';

import { DialogPayment } from '@/components/_shared/other/card-plan/_components/dialog-payment';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { formatDateDifference } from '@/lib/utils/date';
import { motion } from 'framer-motion';
import {
  Clock,
  Crown,
  MessageCircle,
  Play,
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

      console.log('📊 Pixel tracked: Contact dialog opened from plan detail');
    } catch (error) {
      console.warn('Pixel tracking error:', error);
    }

    setIsConsultationDialogOpen(true);
  };
  return (
    <div className="space-y-4">
      {/* Compact Purchase Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
          <div
            className="p-4 text-white relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <div className="relative">
              <Badge className="px-3 py-1 bg-white/20 text-white border-none text-xs font-bold mb-3 flex items-center gap-1 w-fit">
                <Crown className="w-3 h-3" />
                Blueprint Plan
              </Badge>

              <h3 className="text-lg font-bold mb-3 leading-tight">
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
                  <Badge className="bg-red-500 text-white border-0 animate-pulse text-xs">
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
                <div className="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
                  <span className="text-gray-700 flex items-center gap-2 text-sm font-medium">
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center"
                      style={{ backgroundColor: mainColor }}
                    >
                      <Clock className="w-3 h-3 text-white" />
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

              <div className="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
                <span className="text-gray-700 flex items-center gap-2 text-sm font-medium">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center"
                    style={{ backgroundColor: mainColor }}
                  >
                    <Video className="w-3 h-3 text-white" />
                  </div>
                  Live Classes
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
            <div className="space-y-2">
              {plan.maxUsers && plan.totalUsers >= plan.maxUsers ? (
                <Button
                  className="w-full py-3 text-sm font-bold rounded-3xl text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-not-allowed"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Kuota Penuh
                </Button>
              ) : (
                <DialogPayment plan={plan}>
                  <Button
                    className="w-full py-3 text-sm font-bold rounded-3xl text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Mulai Sekarang
                  </Button>
                </DialogPayment>
              )}

              <Button
                onClick={handleConsultationClick}
                variant="outline"
                className="w-full py-3 text-sm font-semibold rounded-3xl border hover:scale-[1.02] transition-all duration-300"
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
            <div className="pt-3 border-t border-gray-100">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: mainColor }}
                  >
                    97%
                  </div>
                  <div className="text-xs text-gray-600">Success</div>
                </div>
                <div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: mainColor }}
                  >
                    +200
                  </div>
                  <div className="text-xs text-gray-600">Score</div>
                </div>
                <div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: mainColor }}
                  >
                    24/7
                  </div>
                  <div className="text-xs text-gray-600">Support</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
