'use client';
import { CardPlan } from '@/components/_shared/other/card-plan';
import { CardPlanTopping } from '@/components/_shared/other/card-plan-coin';
import { PlanDataType } from '@/components/_shared/other/card-plan/_provider/types';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { pixel } from '@/lib/pixel/_core';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

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
  const { data: session } = useSession();

  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const searchParams = useSearchParams();
  const voucherCodeQuery = searchParams.get('voucherCode');

  const { data: PricingData } = useGet<PricingDataType>(
    '/plan/getAllPlanByWebCategory',
    {
      params: {
        voucherCode: voucherCodeQuery,
      },
      useEffectDependencies: [voucherCodeQuery],
    },
  );

  console.log({ PricingData });

  const topping = PricingData?.topping || [];

  useEffect(() => {
    // ✅ ENRICHED VIEWCONTENT EVENT DATA
    pixel.meta.track(
      'ViewContent',
      {
        content_name: 'Pricing Page',
        content_type: 'page',
      },
      // ✅ Advanced Matching untuk Meta Pixel
      session?.user
        ? {
            em: session.user.email,
            ph: session.user.phone || undefined,
            fn: session.user.name?.split(' ')[0],
            ln: session.user.name?.split(' ').slice(1).join(' '),
          }
        : undefined,
    );
    pixel.tiktok.track('ViewContent', {
      content_name: 'Pricing Page',
      page_path: '/price',
      content_id: 'pricing_page_main', // ✅ Required untuk TikTok VSA
    });
  }, [session]);

  return (
    <div className="space-y-20">
      {/* Header Section - Matching Homepage Style */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        {/* Badge - Match homepage style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold text-white border-none mb-6"
          style={{ backgroundColor: mainColor }}
        >
          <Sparkles size={16} />
          Blueprint Plans
        </motion.div>

        {/* Main headline - Match homepage typography */}
        <h1 className="text-4xl md:text-5xl font-black leading-tight text-gray-900 mb-6">
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
        </h1>

        {/* Subheadline - Match homepage style */}
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Sistem yang terukur untuk bantu ribuan siswa naik 200+ poin.{' '}
          <span
            className="font-semibold"
            style={{ color: mainColor }}
          >
            Pilih sesuai kebutuhan & budget!
          </span>
        </p>
      </motion.div>
      {/* Enhanced Filter Tabs System */}
      <Tabs
        className="w-full"
        defaultValue="all"
      >
        <TabsList
          className="grid w-full max-w-2xl mx-auto grid-cols-5 mb-8 h-12 p-1 rounded-xl"
          style={{
            backgroundColor: `${mainColor}08`,
            gridTemplateColumns: `repeat(${(PricingData?.webSubCategory.length || 0) + 1}, 1fr)`,
          }}
        >
          {/* All Tab */}
          <TabsTrigger
            value="all"
            className="rounded-lg font-semibold data-[state=active]:shadow-sm transition-all text-sm"
            style={
              {
                '--tw-data-state-active-bg': mainColor,
                '--tw-data-state-active-color': 'white',
              } as React.CSSProperties
            }
          >
            <Sparkles
              size={16}
              className="mr-2"
            />
            Semua Paket
          </TabsTrigger>

          {/* Category Tabs */}
          {PricingData?.webSubCategory.map((ws) => (
            <TabsTrigger
              key={ws.webSubCategoryId}
              value={ws.webSubCategoryId}
              className="rounded-lg font-semibold data-[state=active]:shadow-sm transition-all text-sm"
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

        {/* Individual Category Tabs - Enhanced */}
        {PricingData?.webSubCategory.map((ws) => (
          <TabsContent
            key={ws.webSubCategoryId}
            value={ws.webSubCategoryId}
            className="w-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Enhanced Sub-category tabs */}
              <Tabs
                defaultValue="all-category"
                className="w-full"
              >
                <TabsList
                  className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8 h-10 p-1 rounded-lg"
                  style={{
                    backgroundColor: `${mainColor}08`,
                  }}
                >
                  <TabsTrigger
                    value="all-category"
                    className="rounded-md font-medium data-[state=active]:shadow-sm transition-all text-xs"
                    style={
                      {
                        '--tw-data-state-active-bg': mainColor,
                        '--tw-data-state-active-color': 'white',
                      } as React.CSSProperties
                    }
                  >
                    Semua {ws.webSubCategoryName}
                  </TabsTrigger>
                  <TabsTrigger
                    value="bundle"
                    className="rounded-md font-medium data-[state=active]:shadow-sm transition-all text-xs"
                    style={
                      {
                        '--tw-data-state-active-bg': mainColor,
                        '--tw-data-state-active-color': 'white',
                      } as React.CSSProperties
                    }
                  >
                    Bundle
                  </TabsTrigger>
                  <TabsTrigger
                    value="subscription"
                    className="rounded-md font-medium data-[state=active]:shadow-sm transition-all text-xs"
                    style={
                      {
                        '--tw-data-state-active-bg': mainColor,
                        '--tw-data-state-active-color': 'white',
                      } as React.CSSProperties
                    }
                  >
                    Berlangganan
                  </TabsTrigger>
                </TabsList>

                {/* All category plans */}
                <TabsContent value="all-category">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {[...(ws.subscriptions || []), ...(ws.bundles || [])].map(
                      (plan, i) => (
                        <CardPlan
                          key={`all-${ws.webSubCategoryId}-${i}`}
                          plan={plan}
                        />
                      ),
                    )}
                  </div>
                </TabsContent>

                {/* Bundle only */}
                <TabsContent value="bundle">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {ws.bundles?.map((bundle, i) => (
                      <CardPlan
                        key={`bundle-${ws.webSubCategoryId}-${i}`}
                        plan={bundle}
                      />
                    ))}
                  </div>
                </TabsContent>

                {/* Subscription only */}
                <TabsContent value="subscription">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {ws.subscriptions?.map((plan, i) => (
                      <CardPlan
                        key={`subscription-${ws.webSubCategoryId}-${i}`}
                        plan={plan}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
      {/* Modern Coin Topping Section */}
      <div className="relative">
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
