'use client';

import { DialogPayment } from '@/components/_shared/other/card-plan/_components/dialog-payment';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { pixel } from '@/lib/pixel/_core';
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
      pixel.meta.track('ViewContent', {
        content_type: 'page',
        content_name: 'Contact Modal from Plan Detail',
      });

      pixel.tiktok.track('ViewContent', {
        content_name: 'Contact Modal from Plan Detail',
        content_id: 'plan_detail_contact_modal',
        page_path: '/plan-detail-contact-modal',
      });

      console.log('📊 Pixel tracked: Contact dialog opened from plan detail');
    } catch (error) {
      console.warn('Pixel tracking error:', error);
    }

    setIsConsultationDialogOpen(true);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Compact Hero Card */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-6 lg:p-8">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Content - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Compact badges */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-2 flex-wrap"
              >
                <Badge
                  className="px-3 py-1 text-xs font-bold text-white border-none flex items-center gap-1"
                  style={{ backgroundColor: mainColor }}
                >
                  <Crown className="w-3 h-3" />
                  Blueprint Plan
                </Badge>
                {discountPercentage > 0 && (
                  <Badge className="bg-red-500 text-white px-2 py-1 text-xs animate-pulse">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {discountPercentage}% OFF
                  </Badge>
                )}
              </motion.div>

              {/* Compact title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-3"
              >
                <h1 className="text-2xl lg:text-3xl font-black leading-tight text-gray-900">
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
              </motion.div>

              {/* Compact pricing and CTA */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-4 flex-wrap"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl lg:text-3xl font-black text-gray-900">
                    {formatPrice(plan.price)}
                  </span>
                  {plan.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(plan.originalPrice)}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
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
              </motion.div>

              {plan.maxUsers && (
                <div className="w-fit mb-4 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
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
                    <Badge className="bg-amber-500 text-white text-xs font-bold px-2 py-1 ml-8">
                      LIMITED
                    </Badge>
                  </div>
                </div>
              )}

              {/* Compact CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                {plan.maxUsers && plan.totalUsers >= plan.maxUsers ? (
                  <Button
                    className="px-6 py-2 rounded-xl font-bold text-white hover:scale-105 transition-all duration-300 text-sm cursor-not-allowed"
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
                      className="px-6 py-2 rounded-xl font-bold text-white hover:scale-105 transition-all duration-300 text-sm"
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
                  className="px-6 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition-all duration-300"
                  style={{
                    borderColor: mainColor,
                    color: mainColor,
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Konsultasi
                </Button>
              </motion.div>
            </div>

            {/* Compact image - 1/3 width */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg bg-white/20 backdrop-blur-sm">
                {plan.image && (
                  <Image
                    src={plan.image || '/placeholder.svg'}
                    alt={plan.name}
                    width={300}
                    height={200}
                    className="w-full h-auto rounded-2xl"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl" />
              </div>

              {/* Small floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: mainColor }}
              >
                <Star className="w-5 h-5" />
              </motion.div>
            </motion.div>
          </div>

          {/* Compact stats row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200/50"
          >
            <div className="text-center">
              <div
                className="text-lg font-bold"
                style={{ color: mainColor }}
              >
                15K+
              </div>
              <div className="text-xs text-gray-600">Users</div>
            </div>
            <div className="text-center">
              <div
                className="text-lg font-bold"
                style={{ color: mainColor }}
              >
                +200
              </div>
              <div className="text-xs text-gray-600">Score</div>
            </div>
            <div className="text-center">
              <div
                className="text-lg font-bold"
                style={{ color: mainColor }}
              >
                97%
              </div>
              <div className="text-xs text-gray-600">Success</div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
