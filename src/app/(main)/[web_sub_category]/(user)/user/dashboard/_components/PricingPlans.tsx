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
          <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">
            <Sparkles className="w-3 h-3 mr-0.5" />
            Promo
          </Badge>
        </div>
        <Link href={`/${webSubCategory}/user/pricing`}>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-6 px-2"
            style={{ color: mainColor }}
          >
            Semua <ChevronRight className="w-3 h-3 ml-0.5" />
          </Button>
        </Link>
      </div>

      {/* Plans Cards - Horizontal Scroll */}
      {!loading && plans.length > 0 ? (
        <div className="w-full overflow-x-auto scrollbar-hidden -mx-1 px-1">
          <div className="flex gap-2 md:gap-3 pb-2">
            {plans.map((plan, idx) => (
              <Link
                key={plan.id}
                href={`/${webSubCategory}/user/pricing`}
                className="flex-shrink-0 group"
              >
                <div
                  className={`w-52 md:w-60 bg-white rounded-2xl overflow-hidden border-2 hover:shadow-lg transition-all cursor-pointer ${
                    plan.isPopular ? 'shadow-md' : 'border-gray-100'
                  }`}
                  style={{
                    borderColor: plan.isPopular ? mainColor : undefined,
                  }}
                >
                  {/* Plan Header */}
                  <div
                    className="relative px-4 py-4"
                    style={{
                      background: plan.isPopular
                        ? `linear-gradient(135deg, ${mainColor}, ${mainColor}cc)`
                        : `linear-gradient(135deg, ${mainColor}15, ${mainColor}05)`,
                    }}
                  >
                    {plan.isPopular && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-white/20 text-white text-[10px] font-bold border-0">
                          <Star className="w-3 h-3 mr-0.5 fill-yellow-300 text-yellow-300" />
                          Populer
                        </Badge>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      <Crown
                        className={`w-5 h-5 ${plan.isPopular ? 'text-white' : ''}`}
                        style={{
                          color: plan.isPopular ? undefined : mainColor,
                        }}
                      />
                      <span
                        className={`text-xs font-medium ${
                          plan.isPopular ? 'text-white/80' : 'text-gray-500'
                        }`}
                      >
                        {plan.tier || `Paket ${idx + 1}`}
                      </span>
                    </div>

                    <h3
                      className={`font-bold text-sm leading-tight line-clamp-2 ${
                        plan.isPopular ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {plan.name}
                    </h3>

                    <div className="flex items-baseline gap-1 mt-2">
                      <span
                        className={`text-xl font-black ${plan.isPopular ? 'text-white' : ''}`}
                        style={{
                          color: plan.isPopular ? undefined : mainColor,
                        }}
                      >
                        {formatPrice(plan.price)}
                      </span>
                    </div>
                  </div>

                  {/* Plan Body */}
                  <div className="p-4">
                    <div className="space-y-2 mb-4">
                      {plan.features.slice(0, 4).map((f) => (
                        <div
                          key={f}
                          className="flex items-center gap-2 text-xs text-gray-600"
                        >
                          <Check
                            className="w-3.5 h-3.5 flex-shrink-0"
                            style={{ color: mainColor }}
                          />
                          <span className="line-clamp-1">{f}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      size="sm"
                      className={`w-full text-xs h-9 font-semibold ${
                        plan.isPopular ? 'text-white' : ''
                      }`}
                      style={{
                        backgroundColor: plan.isPopular
                          ? mainColor
                          : `${mainColor}15`,
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
        <div className="flex justify-center py-8">
          <div
            className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200"
            style={{ borderTopColor: mainColor }}
          />
        </div>
      ) : null}

      {/* Social Proof */}
      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>5,000+ siswa</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span>4.9 rating</span>
        </div>
      </div>
    </section>
  );
}
