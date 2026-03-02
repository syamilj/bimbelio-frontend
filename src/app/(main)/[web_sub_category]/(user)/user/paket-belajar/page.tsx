'use client';

import { CardPlan } from '@/components/_shared/other/card-plan';
import { PlanDataType } from '@/components/_shared/other/card-plan/_provider/types';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGet } from '@/lib/fetch-helper/useGet';
import { Crown, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

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

export default function PaketBelajarPage() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const params = useParams();
  const webSub = (params?.web_sub_category as string) || '';

  const { data: pricingData, isLoading } = useGet<PricingDataType>(
    '/plan/getAllPlanByWebCategory',
  );

  const categoryPlans = useMemo(() => {
    if (!pricingData?.webSubCategory?.length) {
      return {
        subscriptions: [] as PlanDataType[],
        bundles: [] as PlanDataType[],
      };
    }

    const selectedCategory =
      pricingData.webSubCategory.find(
        (item) => item.webSubCategoryId.toLowerCase() === webSub.toLowerCase(),
      ) ||
      pricingData.webSubCategory.find(
        (item) => item.webSubCategoryId.toLowerCase() === 'all',
      );

    return {
      subscriptions: selectedCategory?.subscriptions || [],
      bundles: selectedCategory?.bundles || [],
    };
  }, [pricingData, webSub]);

  const visiblePlans = useMemo(() => {
    const mergedPlans = [
      ...categoryPlans.subscriptions,
      ...categoryPlans.bundles,
      ...(pricingData?.topping || []),
    ];

    return mergedPlans.sort((a, b) => {
      const aRecommended = a.recommended ? 1 : 0;
      const bRecommended = b.recommended ? 1 : 0;
      if (aRecommended !== bRecommended) {
        return bRecommended - aRecommended;
      }
      return (a.price || 0) - (b.price || 0);
    });
  }, [categoryPlans, pricingData]);

  const recommendedPlans = useMemo(
    () => visiblePlans.filter((plan) => plan.recommended),
    [visiblePlans],
  );

  const topUpPlans = useMemo(() => pricingData?.topping || [], [pricingData]);

  const regularPlans = useMemo(
    () =>
      visiblePlans.filter(
        (plan) => !plan.recommended && !topUpPlans.some((top) => top.id === plan.id),
      ),
    [visiblePlans, topUpPlans],
  );

  const sectionList: { title: string; plans: PlanDataType[] }[] = [
    { title: 'Rekomendasi', plans: recommendedPlans },
    { title: 'Paket Belajar', plans: regularPlans },
    { title: 'Top Up', plans: topUpPlans },
  ].filter((section) => section.plans.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 pb-12">
      <Card className="rounded-3xl border-2 border-slate-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <Badge className="mb-3 bg-blue-50 text-blue-700 border-blue-200">
              Paket Belajar Bimbelio
            </Badge>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">
              Pilih Paket Belajar Sesuai Target Kamu
            </h1>
            <p className="text-sm md:text-base text-slate-500 mt-2 max-w-2xl">
              Semua paket ditarik langsung dari konfigurasi plan aktif, jadi
              selalu up-to-date untuk kebutuhan belajar user.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="rounded-3xl text-white font-bold"
            style={{ backgroundColor: mainColor }}
          >
            <Link href={`/${webSub}/user/subscription`}>
              <Crown className="w-4 h-4" />
              Kelola Langganan
            </Link>
          </Button>
        </div>
      </Card>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-4 md:p-6">
        {isLoading ? (
          <div className="flex gap-5 overflow-x-auto pb-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-slate-100 p-4 animate-pulse min-w-[85%] sm:min-w-[360px]"
              >
                <div className="aspect-[4/5] rounded-3xl bg-slate-100 mb-4" />
                <div className="h-4 bg-slate-100 rounded w-2/3 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : visiblePlans.length === 0 ? (
          <Card className="rounded-3xl border border-slate-200 p-6 bg-slate-50/70">
            <div className="flex items-center gap-2 text-slate-700 font-bold">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Belum ada paket tersedia
            </div>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Paket untuk kategori ini belum tersedia saat ini. Coba cek tab
              lain atau kembali lagi nanti.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {sectionList.map((section) => (
              <div key={section.title}>
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-sm md:text-base font-black text-slate-800">
                    {section.title}
                  </h3>
                  <span className="text-[11px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                    {section.plans.length} paket
                  </span>
                </div>

                <div className="flex overflow-x-auto touch-auto gap-5 px-2 -mx-2 snap-x snap-mandatory scrollbar-hide pb-3 [-webkit-overflow-scrolling:touch]">
                  {section.plans.map((plan) => (
                    <div
                      key={plan.id}
                      className="min-w-[85%] sm:min-w-[360px] lg:min-w-[390px] snap-center"
                    >
                      <CardPlan plan={plan} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Card className="rounded-3xl border border-slate-200 p-5 md:p-6 bg-slate-50/70">
        <div className="flex items-center gap-2 text-slate-700 font-bold">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Kenapa pilih paket belajar?
        </div>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Dengan paket belajar, user dapat akses materi lebih luas, evaluasi
          performa lebih detail, dan jalur belajar lebih terstruktur untuk
          meningkatkan hasil secara konsisten.
        </p>
      </Card>
    </div>
  );
}
