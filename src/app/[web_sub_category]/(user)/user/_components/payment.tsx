'use client';

import { useAppContext } from '@/components/provider/provider-app';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

import { EmptyPlan } from '@/components/_shared/empty/empty-plan';
import { CardPlan } from '@/components/_shared/other/card-plan';
import { PlanDataType } from '@/components/_shared/other/card-plan/_provider/types';
import { useGet } from '@/lib/fetch-helper/useGet';
import { pixel } from '@/lib/pixel/_core';
import { AlertCircle, Filter, Loader2Icon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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
  // webSubCategory: {
  //   webSubCategoryId: string;
  //   webSubCategoryName: string;
  //   main_color: string;
  //   secondary_color: string;
  //   bundles: PlanType[];
  //   subscriptions: PlanType[];
  // }[];

  plans: PlanType[];
  topping: PlanType[];
  productCompare: {
    subscription: PlanType[];
    bundles: PlanType[];
    listCompare: string[];
  };
};

export function Payment() {
  const { transactionPopUp, setTransactionPopUp } = useAppContext();
  const { websiteSubCategory, webCategoryData } = useWebsiteSubCategory();

  // State management for payment flow
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);

  const categoryOptions =
    webCategoryData.length > 0 ? webCategoryData[0].WebsiteSubCategory : [];

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<
    'name' | 'price' | 'price-desc' | 'popularity'
  >('name');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPlanType, setSelectedPlanType] = useState<string>('bundle');

  const {
    data: PricingData,
    isLoading,
    error,
  } = useGet<PricingDataType>('/plan/getAllPlanByWebCategory');

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const topping = PricingData?.topping || [];

  // Filter dan Search Logic
  const filteredAndSortedPlans = useMemo(() => {
    if (!PricingData?.plans) return [];

    const plans = PricingData.plans;

    let filtered = plans.filter((plan) => {
      const searchLower = searchQuery.toLowerCase();
      const planName = plan.name?.toLowerCase() || '';
      const planDescription = plan.description?.toLowerCase() || '';

      // Search filter
      const matchesSearch =
        planName.includes(searchLower) || planDescription.includes(searchLower);

      // Category filter - multiple choice berdasarkan PlanSubscription.WebsiteSubCategory.id
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(
          plan.PlanSubscription?.WebsiteSubCategory?.id || '',
        );

      return matchesSearch && matchesCategory;
    });

    // Sort berdasarkan pilihan
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'popularity':
          return (b.totalUsers || 0) - (a.totalUsers || 0);
        case 'name':
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });

    return sorted;
  }, [PricingData?.plans, searchQuery, sortBy, selectedCategories]);

  // Handle category toggle
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

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

  // // Payment handlers
  // const handlePackageSelect = (planId: string) => {
  //   // Analytics for plan selection
  //   pixel.meta.track('InitiateCheckout', {
  //     content_name: 'Plan Selection',
  //     contents: [{ id: planId, quantity: 1 }],
  //     value: selectedPlan?.price || 0,
  //     currency: 'IDR',
  //   });

  //   // TODO: Implement payment logic
  //   console.log('Selected plan ID:', planId);
  //   // This would typically:
  //   // 1. Navigate to payment page
  //   // 2. Open payment modal
  //   // 3. Trigger payment flow
  // };

  // const handlePlanSelect = (plan: PlanType, type: PaymentPremium = 'plan') => {
  //   setSelectedPlan(plan);
  //   setPaymentType(type);
  //   handlePackageSelect(plan.id);
  // };

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

              <div className="w-full max-w-7xl mx-auto">
                {/* Search dan Filter Section */}
                <div className="mb-8 space-y-4">
                  {/* Search Input dan Filter Button */}
                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Label
                        htmlFor="search-paket"
                        className="mb-2 block"
                      >
                        Cari Paket
                      </Label>
                      <Input
                        id="search-paket"
                        type="text"
                        placeholder="Cari berdasarkan nama atau deskripsi..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    {/* Filter Hover Popover */}
                    <div className="relative group">
                      <Button
                        className="flex items-center gap-2 text-white whitespace-nowrap"
                        style={{
                          backgroundColor: mainColor,
                        }}
                      >
                        <Filter size={18} />
                        Filter
                        {selectedCategories.length > 0 && (
                          <Badge
                            variant="secondary"
                            className="ml-2"
                          >
                            {selectedCategories.length}
                          </Badge>
                        )}
                      </Button>

                      {/* Hover Dropdown Content */}
                      <div className="absolute right-0 top-full w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-6 space-y-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
                        {/* Category Filter */}
                        {categoryOptions.length > 0 && (
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">
                              Filter Kategori
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                              {categoryOptions.map((category) => (
                                <Button
                                  key={category.id}
                                  variant={
                                    selectedCategories.includes(category.id)
                                      ? 'default'
                                      : 'outline'
                                  }
                                  size="sm"
                                  onClick={() => toggleCategory(category.id)}
                                  className="justify-start"
                                  style={
                                    selectedCategories.includes(category.id)
                                      ? { backgroundColor: mainColor }
                                      : undefined
                                  }
                                >
                                  {selectedCategories.includes(category.id) && (
                                    <span className="mr-1">✓</span>
                                  )}
                                  {category.name}
                                </Button>
                              ))}
                            </div>
                            {selectedCategories.length > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedCategories([])}
                                className="text-xs"
                              >
                                Bersihkan Kategori
                              </Button>
                            )}
                          </div>
                        )}

                        {/* Sort Options */}
                        <div className="space-y-3 border-t pt-4">
                          <Label className="text-base font-semibold">
                            Urutkan Berdasarkan
                          </Label>
                          <div className="space-y-2">
                            {(
                              [
                                'name',
                                'price',
                                'price-desc',
                                'popularity',
                              ] as const
                            ).map((option) => (
                              <Button
                                key={option}
                                variant={
                                  sortBy === option ? 'default' : 'outline'
                                }
                                size="sm"
                                onClick={() => setSortBy(option)}
                                className="w-full justify-start"
                                style={
                                  sortBy === option
                                    ? { backgroundColor: mainColor }
                                    : undefined
                                }
                              >
                                {option === 'name' && 'Nama A-Z'}
                                {option === 'price' && 'Harga Terendah'}
                                {option === 'price-desc' && 'Harga Tertinggi'}
                                {option === 'popularity' && 'Paling Populer'}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Reset Button */}
                        {(searchQuery || selectedCategories.length > 0) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSearchQuery('');
                              setSelectedCategories([]);
                              setSortBy('name');
                            }}
                            className="w-full border-t pt-4 mt-2"
                          >
                            Reset Semua Filter
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Results Summary */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium text-gray-700">
                      Hasil Pencarian:{' '}
                      <span
                        style={{ color: mainColor }}
                        className="font-bold"
                      >
                        {filteredAndSortedPlans.length} paket
                      </span>
                    </div>
                    {selectedCategories.length > 0 && (
                      <p className="text-xs text-gray-500">
                        Filter Kategori Aktif: {selectedCategories.length}
                      </p>
                    )}
                  </div>
                </div>

                {filteredAndSortedPlans.length === 0 ? (
                  <EmptyPlan
                    type="bundle"
                    categoryName={'awda'}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {filteredAndSortedPlans.map((bundle, i) => (
                      <CardPlan
                        key={i}
                        plan={bundle}
                        discount={bundle.discount}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
