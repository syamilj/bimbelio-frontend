'use client';

import { CardPlan } from '@/components/_shared/other/card-plan';
import { PlanDataType } from '@/components/_shared/other/card-plan/_provider/types';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { useGet } from '@/lib/fetch-helper/useGet';
import { cn } from '@/lib/utils';
import { Crown, MessageCircle, Star } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';

const ConsultationDialog = dynamic(
  () => import('@/components/_shared/contact/consultation-dialog'),
  { ssr: false },
);

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
};

const PricingSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [isConsultationDialogOpen, setIsConsultationDialogOpen] =
    useState(false);

  const { data: PricingData } = useGet<PricingDataType>(
    '/plan/getAllPlanByWebCategory',
  );

  const mainColor = websiteSubCategory?.main_color ?? '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color ?? '#5aa4dd';

  const getAllPlans = (): PlanDataType[] => {
    let categoryToUse = PricingData?.webSubCategory?.find(
      (cat) => cat.webSubCategoryId.toLowerCase() === 'all',
    );

    if (!categoryToUse) {
      categoryToUse = PricingData?.webSubCategory?.find(
        (cat) => cat.webSubCategoryName.toLowerCase() === 'semua',
      );
    }

    if (!categoryToUse && PricingData?.webSubCategory?.length) {
      const allPlans: PlanDataType[] = [];
      PricingData.webSubCategory.forEach((category) => {
        if (category.subscriptions) allPlans.push(...category.subscriptions);
        if (category.bundles) allPlans.push(...category.bundles);
      });
      if (PricingData.topping) allPlans.push(...PricingData.topping);
      return allPlans;
    }

    if (!categoryToUse) return [];

    const allPlans: PlanDataType[] = [];
    if (categoryToUse.subscriptions)
      allPlans.push(...categoryToUse.subscriptions);
    if (categoryToUse.bundles) allPlans.push(...categoryToUse.bundles);
    if (PricingData?.topping) allPlans.push(...PricingData.topping);

    return allPlans;
  };

  const allPlans = getAllPlans();
  const recommendedPlans = allPlans.filter((plan) => plan.recommended);
  const topPlans = allPlans.filter((plan) => !plan.recommended).slice(0, 3);

  if (!PricingData) {
    return (
      <section
        id="pricing"
        className="py-16 md:py-20 px-4 bg-white"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <p className="text-sm text-gray-500">Loading plans...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="pricing"
      className="py-16 md:py-20 px-4 bg-white"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white mb-4"
            style={{ backgroundColor: mainColor }}
          >
            <Crown className="w-4 h-4" />
            Oke, Berapa?
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pilih yang <span style={{ color: mainColor }}>Cocok Buat Kamu</span>
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            SNBT doang? Atau sekalian Mandiri UI/UGM/ITB + Kedinasan STAN/STIS?
            Semua ada paketnya. Bisa cicil juga.
          </p>
        </div>

        {/* Recommended Plans Section */}
        {recommendedPlans.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-6">
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold text-white border-none mb-3 shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <Star className="w-3.5 h-3.5" />
                Rekomendasi Terbaik
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-800">
                Paket <span style={{ color: mainColor }}>Pilihan Kami</span>
              </h3>
              <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
                Paket yang paling populer dan direkomendasikan untuk
                memaksimalkan persiapanmu
              </p>
            </div>
            <div className="flex overflow-x-auto touch-pan-y md:flex md:flex-wrap md:justify-center gap-5 px-4 -mx-4 md:px-0 md:mx-0 snap-x snap-mandatory scrollbar-hide pb-4 md:pb-0">
              {recommendedPlans.map((plan) => (
                <div
                  key={`recommended-${plan.id}`}
                  className={cn(
                    'min-w-[85%] sm:min-w-[350px] md:min-w-0 md:w-full md:max-w-md snap-center',
                  )}
                >
                  <CardPlan plan={plan} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Plans */}
        {topPlans.length > 0 && (
          <div>
            {recommendedPlans.length > 0 && (
              <div className="text-center mb-6">
                <h3 className="text-2xl md:text-3xl font-black text-slate-800">
                  Paket <span style={{ color: mainColor }}>Lainnya</span>
                </h3>
                <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
                  Pilihan paket lainnya yang bisa kamu sesuaikan dengan
                  kebutuhanmu
                </p>
              </div>
            )}
            <div className="flex overflow-x-auto touch-pan-y md:grid md:grid-cols-3 gap-5 mb-8 px-4 -mx-4 md:px-0 md:mx-0 snap-x snap-mandatory scrollbar-hide pb-4 md:pb-0">
              {topPlans.map((plan, index) => (
                <div
                  key={plan.id}
                  className={cn(
                    'min-w-[85%] sm:min-w-[350px] md:min-w-0 snap-center',
                    !recommendedPlans.length && index === 1
                      ? 'md:scale-105 md:z-10 relative'
                      : '',
                  )}
                >
                  <CardPlan plan={plan} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-20">
          <Link
            href="/price"
            className="px-8 py-3 rounded-3xl font-semibold text-white"
            style={{ backgroundColor: mainColor }}
          >
            Lihat Semua Paket →
          </Link>

          <button
            onClick={() => setIsConsultationDialogOpen(true)}
            className="px-8 py-3 rounded-3xl font-semibold bg-white border-2"
            style={{ borderColor: mainColor, color: mainColor }}
          >
            <MessageCircle className="w-4 h-4 inline mr-2" />
            Konsultasi Dulu
          </button>
        </div>

        {isConsultationDialogOpen && (
          <ConsultationDialog
            isOpen={isConsultationDialogOpen}
            onOpenChange={setIsConsultationDialogOpen}
          />
        )}
      </div>
    </section>
  );
};

export default PricingSection;
