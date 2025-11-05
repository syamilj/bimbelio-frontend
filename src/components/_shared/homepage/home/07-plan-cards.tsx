'use client';

import ConsultationDialog from '@/components/_shared/contact/consultation-dialog';
import { CardPlan } from '@/components/_shared/other/card-plan';
import { PlanDataType } from '@/components/_shared/other/card-plan/_provider/types';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGet } from '@/lib/fetch-helper/useGet';
// import { motion } from 'framer-motion';
import { CheckCircle2, CreditCard, Crown, MessageCircle } from 'lucide-react';
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

  const isMainLandingPage = window.location.pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');
  const secondaryColor = isMainLandingPage
    ? '#5aa4dd'
    : (websiteSubCategory?.secondary_color ?? '#7C3AED');

  // Selalu cari dan gunakan kategori dengan webSubCategoryId "all"
  const getAllCategory = PricingData?.webSubCategory?.find(
    (cat) => cat.webSubCategoryId.toLowerCase() === 'all',
  );

  // Selalu gunakan kategori "all" untuk menampilkan semua plan
  const getAllPlans = (): PlanDataType[] => {
    // Strategy 1: Cari kategori dengan webSubCategoryId "all"
    let categoryToUse = PricingData?.webSubCategory?.find(
      (cat) => cat.webSubCategoryId.toLowerCase() === 'all',
    );

    // Strategy 2: Fallback ke kategori dengan nama "Semua" jika "all" tidak ada
    if (!categoryToUse) {
      categoryToUse = PricingData?.webSubCategory?.find(
        (cat) => cat.webSubCategoryName.toLowerCase() === 'semua',
      );
    }

    // Strategy 3: Fallback ke gabungan semua kategori jika tidak ada kategori khusus
    if (!categoryToUse && PricingData?.webSubCategory?.length) {
      const allPlans: PlanDataType[] = [];

      PricingData.webSubCategory.forEach((category) => {
        if (category.subscriptions) {
          allPlans.push(...category.subscriptions);
        }
        if (category.bundles) {
          allPlans.push(...category.bundles);
        }
      });

      // Tambahkan topping plans jika ada
      if (PricingData.topping) {
        allPlans.push(...PricingData.topping);
      }

      return allPlans;
    }

    if (!categoryToUse) return [];

    const allPlans: PlanDataType[] = [];

    // Tambahkan subscription plans dari kategori yang dipilih
    if (categoryToUse.subscriptions) {
      allPlans.push(...categoryToUse.subscriptions);
    }

    // Tambahkan bundle plans dari kategori yang dipilih
    if (categoryToUse.bundles) {
      allPlans.push(...categoryToUse.bundles);
    }

    // Tambahkan topping plans jika ada
    if (PricingData?.topping) {
      allPlans.push(...PricingData.topping);
    }

    return allPlans;
  };

  const allPlans = getAllPlans();

  // Ambil 3 plan teratas (bisa berdasarkan urutan dari API atau kriteria lain)
  const topPlans = allPlans.slice(0, 3);

  // Loading state
  if (!PricingData) {
    return (
      <section
        id="programs"
        className="py-24 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge
              className="mb-6 px-6 py-2 text-sm font-bold text-white border-none"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <Crown className="w-4 h-4 mr-2 inline" />
              Pilih Blueprint Kamu
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
                <div className="h-1.5 bg-gray-200 rounded mb-6"></div>
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-6"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Empty state - hanya tampilkan jika benar-benar tidak ada data
  if (topPlans.length === 0) {
    return (
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge
              className="mb-6 px-6 py-2 text-sm font-bold text-white border-none"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <Crown className="w-4 h-4 mr-2 inline" />
              Pilih Blueprint Kamu
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

  // Handle consultation dialog open
  const handleConsultationClick = () => {
    setIsConsultationDialogOpen(true);
  };

  const handleContactSelect = (contactType: string) => {
    // Contact selection handler
  };

  return (
    <>
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge
              className="mb-6 px-6 py-2 text-sm font-bold text-white border-none"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <Crown className="w-4 h-4 mr-2 inline" />
              Pilih Blueprint Kamu
            </Badge>

            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Udah Kebayang Sistemnya Kan —
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Sekarang Pilih Paket Mana?
              </span>
            </h2>

            <p className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              <span className="font-semibold">Mulai dari Rp799 ribu</span>{' '}
              dengan cicilan 3x tanpa bunga.
              <span className="font-semibold block mt-2">
                Semua paket udah include PRINTS System, 3-Layer Support (Tutor +
                Mentor + AI), dan akses ke semua platform.
              </span>
            </p>

            {/* Info Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-md"
                style={{
                  backgroundColor: mainColor + '15',
                  border: `1.5px solid ${mainColor}30`,
                  color: mainColor,
                }}
              >
                <CreditCard className="w-4 h-4" />
                <span>Cicilan 3x</span>
              </div>
              <div
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-md"
                style={{
                  backgroundColor: '#9C27B015',
                  border: '1.5px solid #9C27B030',
                  color: '#9C27B0',
                }}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>3-Layer Support</span>
              </div>
            </div>
          </div>

          {/* Plans Grid - Using CardPlan component */}
          <div
            className={`
              grid gap-8 items-start justify-items-stretch
              ${
                topPlans.length === 1
                  ? 'grid-cols-1 max-w-md mx-auto'
                  : topPlans.length === 2
                    ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                    : 'grid-cols-1 md:grid-cols-3'
              }
            `}
            style={{ alignItems: 'flex-start' }}
          >
            {topPlans.map((plan, index) => (
              <div
                key={plan.id}
                className={`
                  flex flex-col
                  ${topPlans.length === 3 && index === 1 ? 'md:scale-105' : ''}
                `}
                style={{ alignSelf: 'flex-start' }}
              >
                <CardPlan
                  plan={plan}
                  hideFeatures={['comparison']}
                  viewOnly={false}
                />
              </div>
            ))}
          </div>

          {/* Bottom Info */}
          <div className="text-center mt-16">
            <div
              className="rounded-3xl p-8 max-w-4xl mx-auto border-2 shadow-md"
              style={{
                backgroundColor: `${mainColor}08`,
                borderColor: `${mainColor}30`,
              }}
            >
              <div className="mb-4 flex items-center justify-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900">
                  Masih ragu? Konsultasi gratis!
                </h3>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6 max-w-3xl mx-auto">
                Nggak yakin paket mana yang cocok? Tim kami siap bantu kamu via
                chat, WhatsApp, atau telepon. Kami juga bisa jelasin cicilan 3x
                dan benefit setiap paket sesuai goals & schedule kamu.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={handleConsultationClick}
                  className="px-8 py-6 rounded-2xl font-bold text-white hover:shadow-md transition-all duration-300 text-base"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Konsultasi Gratis (via Chat)
                </Button>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2
                    className="w-4 h-4"
                    style={{ color: '#00C853' }}
                  />
                  <span className="font-semibold">Response dalam 5 menit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Dialog */}
      <ConsultationDialog
        isOpen={isConsultationDialogOpen}
        onOpenChange={setIsConsultationDialogOpen}
        onContactSelect={handleContactSelect}
        showStats={true}
        showDiscordOption={false}
      />
    </>
  );
};

export default PlanCards;
export { PlanCards };
