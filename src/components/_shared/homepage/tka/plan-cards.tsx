'use client';

import ConsultationDialog from '@/components/_shared/contact/consultation-dialog';
import { CardPlan } from '@/components/_shared/other/card-plan';
import { PlanDataType } from '@/components/_shared/other/card-plan/_provider/types';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGet } from '@/lib/fetch-helper/useGet';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
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
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-6 px-6 py-2 text-sm font-semibold text-white border-none flex items-center gap-2 w-fit mx-auto"
              style={{ backgroundColor: mainColor }}
            >
              <Crown className="w-4 h-4" />
              Whiteprint Plans
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

  // Empty state - hanya tampilkan jika benar-benar tidak ada data
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
              Whiteprint Plans
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
              Whiteprint Plans
            </Badge>

            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Pilih Whiteprint yang{' '}
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
              Sistem yang terukur untuk bantu ribuan siswa nilai 90+ poin.{' '}
              <span className="font-semibold">
                Pilih sesuai kebutuhan & budget!
              </span>
            </p>
          </motion.div>

          {/* Plans Grid - Using CardPlan component */}
          <div
            className={`
              grid gap-8 items-start
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
                  ${topPlans.length === 3 && index === 1 ? 'md:scale-105' : ''}
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
                Kalau masih ada pertanyaan atau mau konsultasi Whiteprint yang
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
      <ConsultationDialog
        isOpen={isConsultationDialogOpen}
        onOpenChange={setIsConsultationDialogOpen}
        onContactSelect={handleContactSelect}
        showStats={true}
        showTelegramOption={false}
      />
    </>
  );
};

export default PlanCards;
