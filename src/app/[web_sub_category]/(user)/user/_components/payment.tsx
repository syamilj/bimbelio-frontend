'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { EmptyPlan } from '@/components/_shared/empty/empty-plan';
import { CardPlan } from '@/components/_shared/other/card-plan';
import { CardPlanTopping } from '@/components/_shared/other/card-plan-coin';
import { PlanDataType } from '@/components/_shared/other/card-plan/_provider/types';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import { pixel } from '@/lib/pixel/_core';
import { AlertCircle, Loader2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';

type PaymentPremium =
  | '1-month'
  | '3-month'
  | 'limitasi_chat'
  | 'limitasi_notes'
  | 'limitasi_vision'
  | 'limitasi_quiz'
  | 'limitasi_all'
  | 'tryout_unlock'
  | 'plan';

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
  productCompare: {
    subscription: PlanType[];
    bundles: PlanType[];
    listCompare: string[];
  };
};

export function Payment() {
  const { transactionPopUp, setTransactionPopUp } = useAppContext();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // State management for payment flow
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [paymentType, setPaymentType] = useState<PaymentPremium>('plan');

  // Tab state management with configurable defaults
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPlanType, setSelectedPlanType] = useState<string>('bundle');

  // Default configurations - bisa disesuaikan
  const DEFAULT_PLAN_TYPE = 'bundle'; // Options: 'bundle', 'subscription', 'coin'
  const PREFERRED_CATEGORY_ORDER = ['snbt', 'cpns', 'toefl', 'tkp', 'tiu']; // Urutan prioritas kategori

  const {
    data: PricingData,
    isLoading,
    error,
  } = useGet<PricingDataType>('/plan/getAllPlanByWebCategory');

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  // Smart default category selection
  const getDefaultCategory = () => {
    if (!PricingData?.webSubCategory.length) return 'snbt';

    // Cari kategori berdasarkan urutan prioritas
    for (const preferredCategory of PREFERRED_CATEGORY_ORDER) {
      const found = PricingData.webSubCategory.find(
        (ws) => ws.webSubCategoryId === preferredCategory,
      );
      if (found) return found.webSubCategoryId;
    }

    // Fallback ke kategori pertama yang tersedia
    return PricingData.webSubCategory[0]?.webSubCategoryId || 'snbt';
  };

  const firstCategory = getDefaultCategory();
  const categoryCount = PricingData?.webSubCategory.length || 1;

  // Set default category when data loads
  useEffect(() => {
    if (PricingData && !selectedCategory) {
      setSelectedCategory(firstCategory);
    }
  }, [PricingData, firstCategory, selectedCategory]);

  // Reset plan type to default when category changes
  useEffect(() => {
    if (selectedCategory) {
      setSelectedPlanType(DEFAULT_PLAN_TYPE);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (website_sub_category_id_params) {
      setSelectedCategory(website_sub_category_id_params);
    }
  }, [website_sub_category_id_params]);

  const topping = PricingData?.topping || [];

  // Analytics tracking
  useEffect(() => {
    if (transactionPopUp && PricingData) {
      pixel.meta.track('ViewContent', {
        content_name: 'Payment Dialog',
        content_type: 'pricing',
      });

      pixel.tiktok.track('ViewContent', {
        content_name: 'Payment Dialog',
        content_id: 'payment_modal',
      });
    }
  }, [transactionPopUp, PricingData]);

  // Payment handlers
  const handlePackageSelect = (planId: string) => {
    // Analytics for plan selection
    pixel.meta.track('InitiateCheckout', {
      content_name: 'Plan Selection',
      contents: [{ id: planId, quantity: 1 }],
      value: selectedPlan?.price || 0,
      currency: 'IDR',
    });

    // TODO: Implement payment logic
    console.log('Selected plan ID:', planId);
    // This would typically:
    // 1. Navigate to payment page
    // 2. Open payment modal
    // 3. Trigger payment flow
  };

  const handlePlanSelect = (plan: PlanType, type: PaymentPremium = 'plan') => {
    setSelectedPlan(plan);
    setPaymentType(type);
    handlePackageSelect(plan.id);
  };

  // Error state
  if (error) {
    return (
      <Dialog
        open={transactionPopUp}
        onOpenChange={setTransactionPopUp}
      >
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center gap-4 py-8">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Terjadi Kesalahan
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Gagal memuat data paket. Silakan coba lagi.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog
        open={transactionPopUp}
        onOpenChange={setTransactionPopUp}
      >
        <DialogContent
          className="max-w-[95vw] h-[95vh] p-0"
          classOverlay="z-10000"
        >
          {isLoading && (
            <div className="absolute inset-0 z-50 grid place-items-center bg-white/80 backdrop-blur-sm">
              <Loader2Icon className="h-8 w-8 animate-spin text-main" />
            </div>
          )}
          <ScrollArea className="max-h-[85vh]">
            <div className="space-y-8 p-6 sm:p-8">
              <DialogHeader>
                <DialogTitle className="text-center text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                  Tingkatkan Persiapan{' '}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    kamu
                  </span>
                </DialogTitle>
                <DialogDescription className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
                  Akses fitur premium untuk memaksimalkan potensi kelulusanmu
                </DialogDescription>
              </DialogHeader>

              <Tabs
                className="w-full"
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <TabsList
                  className={`grid w-full max-w-md mx-auto mb-8 p-1 rounded-full`}
                  style={{
                    backgroundColor: `${mainColor}10`,
                    gridTemplateColumns: `repeat(${Math.min(categoryCount, 6)}, 1fr)`,
                  }}
                >
                  {PricingData?.webSubCategory.map((ws) => (
                    <TabsTrigger
                      key={ws.webSubCategoryId}
                      value={ws.webSubCategoryId}
                      className="rounded-full font-medium data-[state=active]:text-white transition-all"
                      style={
                        {
                          '--tw-data-state-active-bg': mainColor,
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
                    <Tabs
                      value={selectedPlanType}
                      onValueChange={setSelectedPlanType}
                      className="w-full"
                    >
                      <TabsList
                        className="mx-auto mb-8 grid w-full max-w-md grid-cols-3"
                        style={{ backgroundColor: `${mainColor}08` }}
                      >
                        <TabsTrigger
                          value="bundle"
                          className="text-sm font-medium sm:text-base transition-all"
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
                          className="text-sm font-medium sm:text-base transition-all"
                          style={
                            {
                              '--tw-data-state-active-bg': mainColor,
                              '--tw-data-state-active-color': 'white',
                            } as React.CSSProperties
                          }
                        >
                          Berlangganan
                        </TabsTrigger>
                        <TabsTrigger
                          value="coin"
                          className="text-sm font-medium sm:text-base transition-all"
                          style={
                            {
                              '--tw-data-state-active-bg': mainColor,
                              '--tw-data-state-active-color': 'white',
                            } as React.CSSProperties
                          }
                        >
                          Coin
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="bundle">
                        {ws.bundles.length === 0 ? (
                          <EmptyPlan
                            type="bundle"
                            categoryName={ws.webSubCategoryName}
                          />
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {ws.bundles.map((bundle, i) => (
                              <CardPlan
                                key={i}
                                plan={bundle}
                                classOverlay="z-[10001]"
                              />
                            ))}
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="subscription">
                        {ws.subscriptions.length === 0 ? (
                          <EmptyPlan
                            type="subscription"
                            categoryName={ws.webSubCategoryName}
                          />
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {ws.subscriptions.map((plan, i) => (
                              <CardPlan
                                key={i}
                                plan={plan}
                                classOverlay="z-[10001]"
                              />
                            ))}
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="coin">
                        {topping.length === 0 ? (
                          <EmptyPlan
                            type="coin"
                            categoryName={ws.webSubCategoryName}
                          />
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                            {topping.map((pack) => (
                              <CardPlanTopping
                                plan={pack}
                                key={pack.name}
                                classOverlay="z-[10001]"
                              />
                            ))}
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
