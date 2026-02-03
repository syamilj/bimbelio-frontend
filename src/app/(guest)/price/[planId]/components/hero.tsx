'use client';

import { DialogPayment } from '@/components/_shared/other/card-plan/_components/dialog-payment';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { formatDateRange } from '@/lib/utils/date';
import { motion } from 'framer-motion';
import {
  Crown,
  MessageCircle,
  Play,
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
    <div className="relative">
      {/* Clean Hero Card - BimArena Style */}
      <Card className="border border-slate-200 shadow-sm bg-white rounded-3xl overflow-hidden">
        <CardContent className="p-4 lg:p-6">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Content - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Clean badges - BimArena Style */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  className="px-3 py-1 text-xs font-bold text-white border-none flex items-center gap-1 rounded-3xl"
                  style={{ backgroundColor: mainColor }}
                >
                  <Crown className="w-3 h-3" />
                  Blueprint Plan
                </Badge>
                {discountPercentage > 0 && (
                  <Badge className="bg-red-500 text-white px-2 py-1 text-xs rounded-3xl">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {discountPercentage}% OFF
                  </Badge>
                )}
              </div>

              {/* Clean title - BimArena Style */}
              <div className="space-y-2">
                <h1 className="text-2xl lg:text-3xl font-black leading-tight text-slate-800">
                  <SparklesText sparklesCount={4}>
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {plan.name}
                    </span>
                  </SparklesText>
                </h1>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                  <span
                    className="font-bold"
                    style={{ color: mainColor }}
                  >
                    Goal kita jelas:
                  </span>{' '}
                  Blueprint personal untuk naik 200+ poin dalam waktu terukur.
                </p>
              </div>

              {/* Clean pricing */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl lg:text-3xl font-black text-slate-900">
                    {formatPrice(plan.price)}
                  </span>
                  {plan.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(plan.originalPrice)}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500">
                  {plan.PlanSubscription?.expireDays
                    ? `${plan.PlanSubscription?.expireDays} hari akses`
                    : plan.PlanSubscription &&
                        plan.PlanSubscription.PlanFeature.length > 0
                      ? formatDateRange(
                          plan.PlanSubscription.PlanFeature[0].validFrom,
                          plan.PlanSubscription.PlanFeature[0].validUntil,
                        )
                      : formatDateRange(
                          plan.PlanLimitation.validFrom,
                          plan.PlanLimitation.validUntil,
                        )}
                </div>
              </div>

              {plan.maxUsers && (
                <div className="w-fit mb-4 p-3 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-3xl">
                      <Users className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-amber-800">
                        Kuota Terbatas
                      </p>
                      <p className="text-xs text-amber-700">
                        {plan.totalUsers || 0} / {plan.maxUsers} pengguna aktif
                      </p>
                    </div>
                    <Badge className="bg-amber-500 text-white text-xs font-bold px-2 py-1 ml-8 rounded-3xl">
                      LIMITED
                    </Badge>
                  </div>
                </div>
              )}

              {/* Clean CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {plan.maxUsers && plan.totalUsers >= plan.maxUsers ? (
                  <Button
                    className="px-6 py-2 rounded-3xl font-bold text-white text-sm cursor-not-allowed shadow-sm"
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
                      className="px-6 py-2 rounded-3xl font-bold text-white text-sm shadow-sm hover:shadow-md transition-shadow"
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
                  variant="outline"
                  onClick={handleConsultationClick}
                  className="px-6 py-2 rounded-3xl font-semibold text-sm border-slate-300"
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

            {/* Clean image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-sm bg-white/20 backdrop-blur-sm">
                {plan.image && (
                  <Image
                    src={plan.image || '/placeholder.svg'}
                    alt={plan.name}
                    width={300}
                    height={200}
                    className="w-full h-auto rounded-3xl"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-3xl" />
              </div>

              {/* Small floating badge */}
              <div
                className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: mainColor }}
              >
                <Star className="w-5 h-5" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
