'use client';
import { CardPlan } from '@/components/_shared/other/card-plan';
import { CardPlanTopping } from '@/components/_shared/other/card-plan-coin';
import { PlanDataType } from '@/components/_shared/other/card-plan/_provider/types';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { Sparkles, Zap } from 'lucide-react';

type PlanType = PlanDataType;

type PricingDataType = {
  webSubCategory: {
    webSubCategoryId: string;
    webSubCategoryName: string;
    main_color: string;
    secondary_color: string;
    bundles: PlanType[];
    subscriptions: PlanType[];
  }[];
  topping: PlanType[];
  productCompare?: {
    subscription: PlanType[];
    bundles: PlanType[];
    listCompare: string[];
  };
};

export default function PricingPlans() {
  const { data: PricingData } = useGet<PricingDataType>(
    '/plan/getAllPlanByWebCategory',
  );
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const topping = PricingData?.topping || [];

  return (
    <div className="space-y-20">
      {/* Modern Header Section */}
      <div className="text-center mb-16">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-6"
          style={{
            backgroundColor: `${mainColor}10`,
            color: mainColor,
          }}
        >
          <Sparkles size={16} />
          Pilih Paket Terbaik
        </div>

        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          style={{ color: mainColor }}
        >
          Sudah Siap Mulai Belajar?
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Pilih paket yang sesuai dengan kebutuhanmu dan mulai perjalanan
          belajar bersama{' '}
          <span
            style={{ color: mainColor }}
            className="font-semibold"
          >
            Bimbelio
          </span>
        </p>
      </div>
      {/* Modern Category Tabs */}
      <Tabs
        className="w-full"
        defaultValue="snbt"
      >
        <TabsList
          className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8 h-12 p-1 rounded-xl"
          style={{
            backgroundColor: `${mainColor}08`,
          }}
        >
          {PricingData?.webSubCategory.map((ws) => (
            <TabsTrigger
              key={ws.webSubCategoryId}
              value={ws.webSubCategoryId}
              className="rounded-lg font-medium data-[state=active]:shadow-sm transition-all"
              style={
                {
                  '--tw-data-state-active-bg': mainColor,
                  '--tw-data-state-active-color': 'white',
                } as React.CSSProperties
              }
            >
              {ws.webSubCategoryName}
            </TabsTrigger>
          ))}
        </TabsList>

        {PricingData?.webSubCategory.map((ws) => (
          <TabsContent
            key={ws.webSubCategoryId}
            value={ws.webSubCategoryId}
            className="w-full"
          >
            {/* Sub-category tabs for Bundle/Subscription */}
            <Tabs
              defaultValue="bundle"
              className="w-full"
            >
              <TabsList
                className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 h-10 p-1 rounded-lg"
                style={{
                  backgroundColor: `${mainColor}08`,
                }}
              >
                <TabsTrigger
                  value="bundle"
                  className="rounded-md font-medium data-[state=active]:shadow-sm transition-all"
                  style={
                    {
                      '--tw-data-state-active-bg': mainColor,
                      '--tw-data-state-active-color': 'white',
                    } as React.CSSProperties
                  }
                >
                  Paket Bundle
                </TabsTrigger>
                <TabsTrigger
                  value="subscription"
                  className="rounded-md font-medium data-[state=active]:shadow-sm transition-all"
                  style={
                    {
                      '--tw-data-state-active-bg': mainColor,
                      '--tw-data-state-active-color': 'white',
                    } as React.CSSProperties
                  }
                >
                  Paket Berlangganan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="subscription">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {ws.subscriptions.map((plan, i) => (
                    <CardPlan
                      key={i}
                      plan={plan}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="bundle">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {ws.bundles.map((bundle, i) => (
                    <CardPlan
                      key={i}
                      plan={bundle}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        ))}
      </Tabs>
      {/* Modern Coin Topping Section */}
      <div className="relative">
        {/* Background decoration */}
        <div
          className="absolute inset-0 opacity-5 rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
        />

        <div className="relative z-10 text-center mb-12">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-6"
            style={{
              backgroundColor: `${secondaryColor}15`,
              color: secondaryColor,
            }}
          >
            <Zap size={16} />
            Tambah Coin
          </div>

          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: mainColor }}
          >
            Paket Coin Tambahan
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Tambah coin untuk mengakses lebih banyak fitur seperti notes, chat,
            tryout, quiz, dan vision dengan mudah dan fleksibel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {topping.map((pack) => (
            <CardPlanTopping
              plan={pack}
              key={pack.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
