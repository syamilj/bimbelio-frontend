'use client';

import { CardPlan } from '@/components/_shared/other/card-plan';
import { PlanDataType } from '@/components/_shared/other/card-plan/_provider/types';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CONTACT_CONFIG } from '@/config/contact';
import { useGet } from '@/lib/fetch-helper/useGet';
import { pixel } from '@/lib/pixel/_core';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Crown, MessageCircle, Phone } from 'lucide-react';
import React, { useState } from 'react';

type PricingDataType = {
  webSubCategory: {
    webSubCategoryId: string;
    webSubCategoryName: string;
    main_color: string;
    secondary_color: string;
    bundles: PlanDataType[];
    subscriptions: PlanDataType[];
  }[];
  topping: PlanDataType[];
  productCompare?: {
    subscription: PlanDataType[];
    bundles: PlanDataType[];
    listCompare: string[];
  };
};

const PlanCards: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [isConsultationDialogOpen, setIsConsultationDialogOpen] =
    useState(false);
  const { data: PricingData } = useGet<PricingDataType>(
    '/plan/getAllPlanByWebCategory',
  );

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#7C3AED';

  // Ambil data plan dari API
  const currentCategory = PricingData?.webSubCategory?.find(
    (cat) => cat.webSubCategoryId === websiteSubCategory?.id,
  );

  // Gabungkan subscription dan bundle, ambil 3 teratas
  const allPlans = [
    ...(currentCategory?.subscriptions || []),
    ...(currentCategory?.bundles || []),
  ];

  const topPlans = allPlans.slice(0, 3);

  // Loading state
  if (!PricingData || !websiteSubCategory) {
    return (
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-6 px-6 py-2 text-sm font-semibold text-white border-none flex items-center gap-2 w-fit mx-auto"
              style={{ backgroundColor: mainColor }}
            >
              <Crown className="w-4 h-4" />
              Blueprint Plans
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Loading plans...
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 border-2 border-gray-200 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (topPlans.length === 0) {
    return (
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge
              variant="outline"
              className="mb-6 px-6 py-2 text-sm font-semibold text-white border-none flex items-center gap-2 w-fit mx-auto"
              style={{ backgroundColor: mainColor }}
            >
              <Crown className="w-4 h-4" />
              Blueprint Plans
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Paket akan segera hadir
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Paket pembelajaran terbaik sedang disiapkan untuk kamu.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Pixel tracking function untuk konsultasi
  const trackContactEvent = (contactType: string) => {
    try {
      pixel.meta.track('Contact', {
        content_type: 'contact',
        content_name: contactType,
      });

      pixel.tiktok.track('Contact', {
        content_name: contactType,
        content_id: `contact_${contactType.toLowerCase()}`,
      });

      console.log(`📊 Pixel tracked: ${contactType} contact initiated`);
    } catch (error) {
      console.warn('Pixel tracking error:', error);
    }
  };

  // Handle consultation dialog open
  const handleConsultationClick = () => {
    try {
      pixel.meta.track('ViewContent', {
        content_type: 'page',
        content_name: 'Contact Modal from Plan Cards',
      });

      pixel.tiktok.track('ViewContent', {
        content_name: 'Contact Modal from Plan Cards',
        content_id: 'plan_cards_contact_modal',
        page_path: '/plan-cards-contact-modal',
      });

      console.log('📊 Pixel tracked: Contact dialog opened from plan cards');
    } catch (error) {
      console.warn('Pixel tracking error:', error);
    }

    setIsConsultationDialogOpen(true);
  };

  const consultationOptions = [
    {
      id: 'whatsapp',
      title: 'Chat WhatsApp',
      description: 'Respons cepat dalam 5 menit',
      icon: <MessageCircle className="w-5 h-5" />,
      action: () => {
        trackContactEvent('WhatsApp');
        const message = encodeURIComponent(CONTACT_CONFIG.whatsapp.message);
        window.open(
          `https://wa.me/${CONTACT_CONFIG.whatsapp.number}?text=${message}`,
          '_blank',
        );
        setIsConsultationDialogOpen(false);
      },
      color: '#25D366',
    },
    {
      id: 'phone',
      title: 'Telepon Langsung',
      description: 'Bicara dengan ahli sekarang',
      icon: <Phone className="w-5 h-5" />,
      action: () => {
        trackContactEvent('Phone');
        window.open(`tel:${CONTACT_CONFIG.phone.number}`, '_self');
        setIsConsultationDialogOpen(false);
      },
      color: mainColor,
    },
  ];

  return (
    <>
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge
              variant="outline"
              className="mb-6 px-6 py-2 text-sm font-semibold text-white border-none flex items-center gap-2 w-fit mx-auto"
              style={{ backgroundColor: mainColor }}
            >
              <Crown className="w-4 h-4" />
              Blueprint Plans
            </Badge>

            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Pilih Blueprint yang{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                pas buat lo!
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Sistem yang terukur untuk bantu ribuan siswa naik 200+ poin.{' '}
              <span className="font-semibold">
                Pilih sesuai kebutuhan & budget!
              </span>
            </p>
          </motion.div>

          {/* Plans Grid - Using CardPlan component */}
          <div
            className={`
          grid gap-8
          ${
            topPlans.length === 1
              ? 'grid-cols-1 max-w-md mx-auto'
              : topPlans.length === 2
                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                : 'grid-cols-1 md:grid-cols-3'
          }
        `}
          >
            {topPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`
                ${index === 1 ? 'md:scale-105' : ''}
              `}
              >
                <CardPlan
                  plan={plan}
                  hideFeatures={['comparison']}
                  viewOnly={false}
                />
              </motion.div>
            ))}
          </div>

          {/* Bottom Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div
              className="rounded-3xl p-8 max-w-2xl mx-auto"
              style={{
                background: `linear-gradient(to right, ${mainColor}08, ${secondaryColor}08)`,
              }}
            >
              <h3 className="text-2xl font-black text-gray-900 mb-4">
                Masih bingung? Konsultasi langsung aja!
              </h3>

              <p className="text-gray-700 leading-relaxed mb-6">
                Kalau masih ada pertanyaan atau mau konsultasi Blueprint yang
                paling cocok, tim kami siap bantu lewat WhatsApp atau telepon.
              </p>

              <Button
                onClick={handleConsultationClick}
                className="px-8 py-3 rounded-full font-semibold text-white hover:scale-105 transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                Konsultasi Sekarang
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Consultation Dialog */}
      <Dialog
        open={isConsultationDialogOpen}
        onOpenChange={setIsConsultationDialogOpen}
      >
        <DialogContent className="sm:max-w-lg mx-4 max-h-[90vh] overflow-hidden flex flex-col items-center justify-center">
          <DialogHeader className="pb-4 w-full">
            <DialogTitle className="text-center text-xl font-bold text-gray-900">
              Wujudkan Impian PTN-mu!
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 text-sm mt-2">
              Pilih langkah pertama untuk memulai journey menuju PTN idaman
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 w-full">
            {/* Konsultasi Langsung - 2 Columns Grid */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 text-center">
                💬 Konsultasi Langsung
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {consultationOptions.map((option) => (
                  <div
                    key={`consultation-${option.id}`}
                    className="w-full"
                  >
                    <Button
                      onClick={option.action}
                      className={cn(
                        'w-full h-auto p-3 rounded-xl text-center',
                        'flex flex-col items-center gap-2 bg-white border-2',
                        'hover:shadow-lg transition-all duration-300',
                        'hover:border-opacity-60 hover:bg-opacity-5 hover:scale-105',
                      )}
                      style={{
                        borderColor: `${option.color}30`,
                      }}
                      variant="outline"
                    >
                      {/* Icon */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md"
                        style={{ backgroundColor: option.color }}
                      >
                        {option.icon}
                      </div>

                      {/* Content */}
                      <div className="text-center">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">
                          {option.title}
                        </h3>
                        <p className="text-xs text-gray-600 leading-tight px-1">
                          {option.description}
                        </p>
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats - Compact Layout */}
            <div className="flex justify-center gap-4 text-center py-2">
              <div>
                <div
                  className="font-bold text-base leading-tight"
                  style={{ color: mainColor }}
                >
                  {CONTACT_CONFIG.stats.responseTime}
                </div>
                <div className="text-xs text-gray-600">Response</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <div
                  className="font-bold text-base leading-tight"
                  style={{ color: mainColor }}
                >
                  {CONTACT_CONFIG.stats.studentsServed}
                </div>
                <div className="text-xs text-gray-600">Siswa</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <div
                  className="font-bold text-base leading-tight"
                  style={{ color: mainColor }}
                >
                  {CONTACT_CONFIG.stats.satisfactionRate}
                </div>
                <div className="text-xs text-gray-600">Rating</div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5"
                  style={{ backgroundColor: mainColor }}
                >
                  💡
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 text-sm">
                    Blueprint Personal 100% Gratis
                  </span>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Tim kami akan membantu kamu bikin strategi belajar yang
                    tepat untuk mencapai target PTN idamanmu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlanCards;
