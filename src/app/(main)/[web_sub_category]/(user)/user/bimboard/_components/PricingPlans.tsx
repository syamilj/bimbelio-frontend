'use client';

import { PlanDataType } from '@/components/_shared/other/card-plan/_provider/types';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import {
  ArrowRight,
  Check,
  ChevronRight,
  Crown,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  isPopular?: boolean;
  tier?: string;
}

interface PricingPlansProps {
  webSubCategory: string;
  isPremium?: boolean;
}

type PricingDataType = {
  plans: PlanDataType[];
  topping: PlanDataType[];
  productCompare?: {
    subscription: PlanDataType[];
    bundles: PlanDataType[];
    listCompare: string[];
  };
};

export default function PricingPlans({
  webSubCategory,
  isPremium = false,
}: PricingPlansProps) {
  const { websiteSubCategory, id: webSubCategoryId } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!webSubCategoryId) return;

      try {
        const res = await getGeneral(`/plan/getAllPlanByWebCategory`, {
          params: { website_sub_category_id: webSubCategoryId },
        });
        console.log('Fetched plans:', res);

        const bundles =
          res?.data?.webSubCategory?.find(
            (web: any) => web.webSubCategoryId === webSubCategoryId,
          )?.bundles || [];

        if (bundles.length > 0) {
          const transformedPlans = bundles
            .slice(0, 3)
            .map((plan: any, index: number) => {
              const tryoutCoin =
                plan.coins?.find((c: any) => c.name === 'tryout')?.total || 0;
              const chatCoin =
                plan.coins?.find((c: any) => c.name === 'chat')?.total || 0;

              const featureList: string[] = [];
              plan.features?.forEach((f: any) => {
                if (f.features && Array.isArray(f.features)) {
                  featureList.push(...f.features.slice(0, 2));
                }
              });

              return {
                id: plan.id,
                name: plan.name,
                price: plan.price,
                duration: 30,
                tier: plan.tier,
                features:
                  featureList.length > 0
                    ? featureList.slice(0, 4)
                    : [
                        `${tryoutCoin} Try Out`,
                        `${chatCoin} AI Chat`,
                        'Akses Course',
                        'Akses Materi',
                      ],
                isPopular: index === 0,
              };
            });
          setPlans(transformedPlans);
        }
      } catch (error) {
        console.error('Failed to fetch plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [webSubCategoryId]);

  if (isPremium) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Crown
            className="w-4 h-4"
            style={{ color: mainColor }}
          />
          <h2 className="font-bold text-sm text-gray-900">Upgrade Premium</h2>
          <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px] px-2 py-0.5 rounded-full shadow-sm">
            <Sparkles className="w-3 h-3 mr-0.5 fill-amber-500 text-amber-500" />
            Promo
          </Badge>
        </div>
        <Link href={`/${webSubCategory}/user/pricing`}>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-6 px-2 hover:bg-slate-50 transition-colors rounded-full"
            style={{ color: mainColor }}
          >
            Semua <ChevronRight className="w-3 h-3 ml-0.5" />
          </Button>
        </Link>
      </div>

      {/* Plans Cards - Horizontal Scroll */}
      {!loading && plans.length > 0 ? (
        <div className="w-full overflow-x-auto scrollbar-hidden -mx-4 px-4 md:-mx-1 md:px-1">
          <div className="flex gap-4 md:gap-3 pb-4">
            {plans.map((plan, idx) => (
              <Link
                key={plan.id}
                href={`/${webSubCategory}/user/pricing`}
                className="flex-shrink-0 group"
              >
                <div
                  className={`w-64 md:w-60 bg-white rounded-3xl overflow-hidden border-2 transition-all cursor-pointer hover:-translate-y-1 ${
                    plan.isPopular
                      ? 'shadow-lg ring-4 ring-offset-0'
                      : 'border-gray-50 hover:border-gray-100 shadow-sm hover:shadow-md'
                  }`}
                  style={{
                    borderColor: plan.isPopular ? mainColor : undefined,
                    boxShadow: plan.isPopular
                      ? `0 10px 30px -10px ${mainColor}50`
                      : undefined,
                    // ringColor: plan.isPopular ? `${mainColor}20` : undefined, // Tailwind ring util handles opacity well, can hardcode class if needed
                  }}
                >
                  {/* Plan Header */}
                  <div
                    className="relative px-5 py-5"
                    style={{
                      background: plan.isPopular
                        ? `linear-gradient(135deg, ${mainColor}, ${mainColor}dd)`
                        : `linear-gradient(135deg, ${mainColor}08, ${mainColor}02)`,
                    }}
                  >
                    {/* Decorative Blobs for Popular */}
                    {plan.isPopular && (
                      <>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-black opacity-5 rounded-full -ml-10 -mb-10 blur-xl"></div>
                      </>
                    )}

                    {plan.isPopular && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold border-0 px-2 py-0.5 shadow-sm">
                          <Star className="w-3 h-3 mr-0.5 fill-yellow-300 text-yellow-300" />
                          Populer
                        </Badge>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-3 relative z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${plan.isPopular ? 'bg-white/20' : 'bg-white shadow-sm'}`}
                      >
                        <Crown
                          className={`w-4 h-4 ${plan.isPopular ? 'text-white' : ''}`}
                          style={{
                            color: plan.isPopular ? undefined : mainColor,
                          }}
                        />
                      </div>
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${
                          plan.isPopular ? 'text-white/90' : 'text-gray-500'
                        }`}
                      >
                        {plan.tier || `Paket ${idx + 1}`}
                      </span>
                    </div>

                    <h3
                      className={`font-black text-lg leading-tight line-clamp-2 relative z-10 mb-2 ${
                        plan.isPopular ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {plan.name}
                    </h3>

                    <div className="flex items-baseline gap-1 relative z-10">
                      <span
                        className={`text-2xl font-black ${plan.isPopular ? 'text-white' : ''}`}
                        style={{
                          color: plan.isPopular ? undefined : mainColor,
                        }}
                      >
                        {formatPrice(plan.price)}
                      </span>
                    </div>
                  </div>

                  {/* Plan Body */}
                  <div className="p-5">
                    <div className="space-y-3 mb-5">
                      {plan.features.slice(0, 4).map((f) => (
                        <div
                          key={f}
                          className="flex items-start gap-2 text-xs text-gray-600"
                        >
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.isPopular ? 'bg-white shadow-sm border border-gray-100' : 'bg-slate-50'}`}
                          >
                            <Check
                              className="w-2.5 h-2.5"
                              style={{ color: mainColor }}
                            />
                          </div>
                          <span className="line-clamp-2 font-medium leading-relaxed">
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      size="sm"
                      className={`w-full rounded-3xl text-xs h-10 font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 ${
                        plan.isPopular ? 'text-white' : ''
                      }`}
                      style={{
                        backgroundColor: plan.isPopular
                          ? mainColor
                          : `${mainColor}10`,
                        color: plan.isPopular ? 'white' : mainColor,
                      }}
                    >
                      Pilih Paket
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-12">
          <div
            className="animate-spin rounded-full h-10 w-10 border-2 border-gray-100"
            style={{ borderTopColor: mainColor }}
          />
        </div>
      ) : null}

      {/* Social Proof */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-2 text-xs text-gray-400 font-medium">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full">
          <Users className="w-3.5 h-3.5" />
          <span>5,000+ siswa</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span>4.9 rating</span>
        </div>
      </div>
    </section>
  );
}
