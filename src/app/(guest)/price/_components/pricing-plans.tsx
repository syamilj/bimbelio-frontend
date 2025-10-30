'use client';
import { EmptyPlan } from '@/components/_shared/empty/empty-plan';
import { CardPlan } from '@/components/_shared/other/card-plan';
import { CardPlanTopping } from '@/components/_shared/other/card-plan-coin';
import { PlanDataType } from '@/components/_shared/other/card-plan/_provider/types';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { pixel } from '@/lib/pixel/_core';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  FileText,
  Filter,
  Package,
  Sparkles,
  Star,
  TrendingUp,
  Video,
  Wallet,
  Zap,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

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
  productCompare?: {
    subscription: PlanType[];
    bundles: PlanType[];
    listCompare: string[];
  };
};

export default function PricingPlans() {
  const { data: session } = useSession();

  const { websiteSubCategory, webCategoryData } = useWebsiteSubCategory();

  // Ref for click outside
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  // Get list of WebsiteSubCategory from first WebsiteCategory
  const categoryOptions =
    webCategoryData.length > 0 ? webCategoryData[0].WebsiteSubCategory : [];

  console.log({ webCategoryData });

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

  const topping = PricingData?.topping || [];

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<
    'name' | 'price' | 'price-desc' | 'popularity'
  >('name');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Advanced Filter States
  const [selectedPlanTypes, setSelectedPlanTypes] = useState<string[]>([]); // 'subscription', 'bundle', 'topping'
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]); // '30', '90', '180', 'unlimited'
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]); // 'video', 'document', 'tryout', 'live_class'
  const [filterTabActive, setFilterTabActive] = useState('type');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get min/max price from data
  const priceMinMax = useMemo(() => {
    if (!PricingData?.plans) return { min: 0, max: 5000000 };
    const prices = PricingData.plans.map((p) => p.price || 0);
    return {
      min: Math.min(...prices, 0),
      max: Math.max(...prices, 5000000),
    };
  }, [PricingData?.plans]);

  // Filter dan Search Logic
  const filteredAndSortedPlans = useMemo(() => {
    if (!PricingData?.plans) return [];

    let filtered = PricingData.plans.filter((plan) => {
      const searchLower = searchQuery.toLowerCase();
      const planName = plan.name?.toLowerCase() || '';
      const planDescription = plan.description?.toLowerCase() || '';

      // 1. Search filter
      const matchesSearch =
        planName.includes(searchLower) || planDescription.includes(searchLower);

      // 2. Category filter
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(
          plan.PlanSubscription?.WebsiteSubCategory?.id || '',
        );

      // 3. Plan Type filter (subscription vs bundle vs topping)
      let matchesPlanType = true;
      if (selectedPlanTypes.length > 0) {
        if (
          selectedPlanTypes.includes('subscription') &&
          plan.PlanSubscription
        ) {
          matchesPlanType = true;
        } else if (
          selectedPlanTypes.includes('bundle') &&
          !plan.PlanSubscription
        ) {
          matchesPlanType = true;
        } else if (
          selectedPlanTypes.includes('topping') &&
          plan.name?.toLowerCase().includes('coin')
        ) {
          // Check if it's a coin/topping plan by name
          matchesPlanType = true;
        } else {
          matchesPlanType = false;
        }
      }

      // 4. Price Range filter
      const planPrice = plan.price || 0;
      const matchesPriceRange =
        planPrice >= priceRange[0] && planPrice <= priceRange[1];

      // 5. Duration filter
      let matchesDuration = true;
      if (selectedDurations.length > 0) {
        const expireDays = plan.PlanSubscription?.expireDays || 0;
        matchesDuration = selectedDurations.some((duration) => {
          if (duration === 'unlimited')
            return expireDays === 0 || !plan.PlanSubscription;
          if (duration === '30') return expireDays >= 1 && expireDays <= 30;
          if (duration === '90') return expireDays >= 31 && expireDays <= 90;
          if (duration === '180') return expireDays >= 91 && expireDays <= 180;
          if (duration === '365') return expireDays >= 181 && expireDays <= 365;
          if (duration === '365+') return expireDays > 365;
          return false;
        });
      }

      // 6. Features filter
      let matchesFeatures = true;
      if (selectedFeatures.length > 0) {
        const planFeatures = plan.PlanSubscription?.PlanFeature || [];
        matchesFeatures = selectedFeatures.every((feature) => {
          if (feature === 'video')
            return planFeatures.some((f) => f.type === 'COURSE');
          if (feature === 'document')
            return planFeatures.some((f) => f.type === 'DOCUMENT');
          if (feature === 'tryout')
            // Check if tryout is available (non-zero limit or unlimited)
            return plan.PlanLimitation?.tryout !== 0;
          if (feature === 'live_class')
            return (
              planFeatures.some((f) => f.type === 'LIVECLASS') ||
              (plan.Pivot_LiveClass_Plan &&
                plan.Pivot_LiveClass_Plan.length > 0)
            );
          return false;
        });
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPlanType &&
        matchesPriceRange &&
        matchesDuration &&
        matchesFeatures
      );
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
  }, [
    PricingData?.plans,
    searchQuery,
    sortBy,
    selectedCategories,
    selectedPlanTypes,
    priceRange,
    selectedDurations,
    selectedFeatures,
  ]);

  // Handle category toggle
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  // Handle plan type toggle
  const togglePlanType = (type: string) => {
    setSelectedPlanTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  // Handle duration toggle
  const toggleDuration = (duration: string) => {
    setSelectedDurations((prev) =>
      prev.includes(duration)
        ? prev.filter((d) => d !== duration)
        : [...prev, duration],
    );
  };

  // Handle feature toggle
  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature],
    );
  };

  // Reset all filters
  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedPlanTypes([]);
    setPriceRange([priceMinMax.min, priceMinMax.max]);
    setSelectedDurations([]);
    setSelectedFeatures([]);
    setSortBy('name');
  };

  // Count active filters
  const activeFiltersCount =
    selectedCategories.length +
    selectedPlanTypes.length +
    selectedDurations.length +
    selectedFeatures.length +
    (priceRange[0] !== priceMinMax.min || priceRange[1] !== priceMinMax.max
      ? 1
      : 0);

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

  // Click outside to close filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  return (
    <div className="space-y-20">
      {/* Enhanced Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Badge
            className="px-6 py-2 text-sm font-bold text-white border-none mb-6"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <Sparkles className="w-4 h-4 mr-2 inline" />
            Pilih Paket Terbaik
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2"
        >
          Sudah Siap Mulai Belajar?
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-5xl font-black mb-6 bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Wujudkan Impian PTN-mu
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
        >
          Pilih paket yang sesuai dengan kebutuhanmu dan mulai perjalanan
          belajar bersama{' '}
          <span className="font-bold text-gray-900">Bimbelio</span>
        </motion.p>
      </motion.div>
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Search dan Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative z-20"
        >
          <Card
            className="mb-8 border-2 shadow-lg bg-white rounded-2xl overflow-visible"
            style={{ borderColor: `${mainColor}20` }}
          >
            {/* Top Accent Bar */}
            <div
              className="h-2 w-full"
              style={{
                background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
              }}
            />

            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-3 rounded-2xl"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  <TrendingUp
                    className="w-6 h-6"
                    style={{ color: mainColor }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-gray-900">
                    Cari & Filter Paket
                  </h3>
                  <p className="text-sm text-gray-600">
                    Hasil:{' '}
                    <span
                      className="font-bold"
                      style={{ color: mainColor }}
                    >
                      {filteredAndSortedPlans.length} paket
                    </span>{' '}
                    ditemukan
                  </p>
                </div>
              </div>

              {/* Search Input dan Filter Button */}
              <div className="flex gap-3 items-end flex-wrap sm:flex-nowrap">
                <div className="flex-1 w-full sm:w-auto min-w-0">
                  <Label
                    htmlFor="search-paket"
                    className="mb-2 block font-bold text-gray-900"
                  >
                    Cari Paket
                  </Label>
                  <Input
                    id="search-paket"
                    type="text"
                    placeholder="Cari berdasarkan nama atau deskripsi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border-2"
                    style={{ borderColor: `${mainColor}20` }}
                  />
                </div>

                {/* Filter Button - Click to Toggle */}
                <div
                  className="relative z-30 w-full sm:w-auto"
                  ref={filterDropdownRef}
                >
                  <Button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 text-white whitespace-nowrap rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    <Filter size={18} />
                    Filter Lanjutan
                    {activeFiltersCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-white text-gray-900 font-black"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>

                  {/* Dropdown Content with Tabs */}
                  {isFilterOpen && (
                    <div
                      className="absolute left-0 right-0 sm:left-auto sm:right-0 top-full mt-2 w-auto sm:w-[420px] bg-white rounded-2xl shadow-2xl border-2 overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-10rem)] overflow-y-auto"
                      style={{ borderColor: `${mainColor}20` }}
                    >
                      {/* Top Accent Bar */}
                      <div
                        className="h-2 w-full"
                        style={{
                          background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
                        }}
                      />

                      {/* Close Button */}
                      <div className="absolute top-3 right-3 z-10">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsFilterOpen(false)}
                          className="h-7 w-7 p-0 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                        >
                          ✕
                        </Button>
                      </div>

                      <Tabs
                        value={filterTabActive}
                        onValueChange={setFilterTabActive}
                        className="w-full"
                      >
                        <div className="overflow-x-auto">
                          <TabsList className="w-full sm:grid sm:grid-cols-5 flex p-2 bg-gray-50 rounded-none min-w-max sm:min-w-0">
                            <TabsTrigger
                              value="type"
                              className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-white data-[state=inactive]:text-gray-600 whitespace-nowrap"
                            >
                              <Package className="w-3 h-3 mr-1" />
                              Tipe
                            </TabsTrigger>
                            <TabsTrigger
                              value="category"
                              className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-white data-[state=inactive]:text-gray-600 whitespace-nowrap"
                            >
                              <Star className="w-3 h-3 mr-1" />
                              Kategori
                            </TabsTrigger>
                            <TabsTrigger
                              value="price"
                              className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-white data-[state=inactive]:text-gray-600 whitespace-nowrap"
                            >
                              <Wallet className="w-3 h-3 mr-1" />
                              Harga
                            </TabsTrigger>
                            <TabsTrigger
                              value="duration"
                              className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-white data-[state=inactive]:text-gray-600 whitespace-nowrap"
                            >
                              <Calendar className="w-3 h-3 mr-1" />
                              Durasi
                            </TabsTrigger>
                            <TabsTrigger
                              value="features"
                              className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-white data-[state=inactive]:text-gray-600 whitespace-nowrap"
                            >
                              <Sparkles className="w-3 h-3 mr-1" />
                              Fitur
                            </TabsTrigger>
                          </TabsList>
                        </div>

                        {/* Tab 1: Plan Type */}
                        <TabsContent
                          value="type"
                          className="p-4 space-y-3"
                        >
                          <div className="space-y-2">
                            <Label className="text-sm font-black text-gray-900 flex items-center gap-2">
                              <Package
                                className="w-4 h-4"
                                style={{ color: mainColor }}
                              />
                              Pilih Tipe Paket
                            </Label>
                            <div className="space-y-2">
                              {[
                                {
                                  id: 'subscription',
                                  label: 'Subscription',
                                  desc: 'Akses berlangganan',
                                },
                                {
                                  id: 'bundle',
                                  label: 'Bundle',
                                  desc: 'Paket bundel',
                                },
                                {
                                  id: 'topping',
                                  label: 'Topping',
                                  desc: 'Tambahan coin',
                                },
                              ].map((type) => (
                                <Button
                                  key={type.id}
                                  variant={
                                    selectedPlanTypes.includes(type.id)
                                      ? 'default'
                                      : 'outline'
                                  }
                                  onClick={() => togglePlanType(type.id)}
                                  className="w-full justify-start font-bold rounded-xl h-auto py-2.5"
                                  style={
                                    selectedPlanTypes.includes(type.id)
                                      ? {
                                          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                          color: 'white',
                                        }
                                      : { borderColor: `${mainColor}20` }
                                  }
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <div className="text-left">
                                      <div className="font-black text-sm">
                                        {selectedPlanTypes.includes(
                                          type.id,
                                        ) && <span className="mr-2">✓</span>}
                                        {type.label}
                                      </div>
                                      <div className="text-xs opacity-80 font-normal">
                                        {type.desc}
                                      </div>
                                    </div>
                                  </div>
                                </Button>
                              ))}
                            </div>
                            {selectedPlanTypes.length > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedPlanTypes([])}
                                className="text-xs font-bold w-full"
                                style={{ color: mainColor }}
                              >
                                Bersihkan Tipe Paket
                              </Button>
                            )}
                          </div>
                        </TabsContent>

                        {/* Tab 2: Category */}
                        <TabsContent
                          value="category"
                          className="p-4 space-y-3"
                        >
                          {categoryOptions.length > 0 ? (
                            <div className="space-y-2">
                              <Label className="text-sm font-black text-gray-900 flex items-center gap-2">
                                <Star
                                  className="w-4 h-4"
                                  style={{ color: mainColor }}
                                />
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
                                    className="justify-start font-bold rounded-xl"
                                    style={
                                      selectedCategories.includes(category.id)
                                        ? {
                                            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                            color: 'white',
                                          }
                                        : { borderColor: `${mainColor}20` }
                                    }
                                  >
                                    {selectedCategories.includes(
                                      category.id,
                                    ) && <span className="mr-1">✓</span>}
                                    {category.name}
                                  </Button>
                                ))}
                              </div>
                              {selectedCategories.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedCategories([])}
                                  className="text-xs font-bold w-full"
                                  style={{ color: mainColor }}
                                >
                                  Bersihkan Kategori
                                </Button>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 text-center py-8">
                              Tidak ada kategori tersedia
                            </p>
                          )}
                        </TabsContent>

                        {/* Tab 3: Price Range */}
                        <TabsContent
                          value="price"
                          className="p-4 space-y-3"
                        >
                          <div className="space-y-3">
                            <Label className="text-sm font-black text-gray-900 flex items-center gap-2">
                              <Wallet
                                className="w-4 h-4"
                                style={{ color: mainColor }}
                              />
                              Range Harga
                            </Label>

                            {/* Price Display */}
                            <div
                              className="flex items-center justify-between p-3 rounded-xl border-2"
                              style={{
                                backgroundColor: `${mainColor}08`,
                                borderColor: `${mainColor}20`,
                              }}
                            >
                              <div>
                                <div className="text-xs text-gray-600 font-bold">
                                  Minimum
                                </div>
                                <div
                                  className="text-base font-black"
                                  style={{ color: mainColor }}
                                >
                                  Rp {priceRange[0].toLocaleString('id-ID')}
                                </div>
                              </div>
                              <div className="text-gray-400">—</div>
                              <div className="text-right">
                                <div className="text-xs text-gray-600 font-bold">
                                  Maximum
                                </div>
                                <div
                                  className="text-base font-black"
                                  style={{ color: secondaryColor }}
                                >
                                  Rp {priceRange[1].toLocaleString('id-ID')}
                                </div>
                              </div>
                            </div>

                            {/* Slider */}
                            <div className="px-2 py-3">
                              <Slider
                                min={priceMinMax.min}
                                max={priceMinMax.max}
                                step={10000}
                                value={priceRange}
                                onValueChange={(value) =>
                                  setPriceRange(value as [number, number])
                                }
                                className="w-full"
                              />
                            </div>

                            {/* Preset Price Ranges */}
                            <div className="space-y-2">
                              <Label className="text-sm font-bold text-gray-700">
                                Preset Harga
                              </Label>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { label: '< 100K', range: [0, 100000] },
                                  {
                                    label: '100K - 500K',
                                    range: [100000, 500000],
                                  },
                                  {
                                    label: '500K - 1JT',
                                    range: [500000, 1000000],
                                  },
                                  {
                                    label: '1JT - 2JT',
                                    range: [1000000, 2000000],
                                  },
                                  {
                                    label: '> 2JT',
                                    range: [2000000, priceMinMax.max],
                                  },
                                  {
                                    label: 'Semua',
                                    range: [priceMinMax.min, priceMinMax.max],
                                  },
                                ].map((preset) => (
                                  <Button
                                    key={preset.label}
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setPriceRange(
                                        preset.range as [number, number],
                                      )
                                    }
                                    className="text-xs font-bold rounded-xl"
                                    style={{ borderColor: `${mainColor}20` }}
                                  >
                                    {preset.label}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        {/* Tab 4: Duration */}
                        <TabsContent
                          value="duration"
                          className="p-4 space-y-3"
                        >
                          <div className="space-y-2">
                            <Label className="text-sm font-black text-gray-900 flex items-center gap-2">
                              <Calendar
                                className="w-4 h-4"
                                style={{ color: mainColor }}
                              />
                              Durasi Akses
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                {
                                  id: '30',
                                  label: '1 Bulan',
                                  desc: '1-30 hari',
                                },
                                {
                                  id: '90',
                                  label: '3 Bulan',
                                  desc: '31-90 hari',
                                },
                                {
                                  id: '180',
                                  label: '6 Bulan',
                                  desc: '91-180 hari',
                                },
                                {
                                  id: '365',
                                  label: '1 Tahun',
                                  desc: '181-365 hari',
                                },
                                {
                                  id: '365+',
                                  label: '> 1 Tahun',
                                  desc: '365+ hari',
                                },
                                {
                                  id: 'unlimited',
                                  label: 'Unlimited',
                                  desc: 'Tanpa batas',
                                },
                              ].map((duration) => (
                                <Button
                                  key={duration.id}
                                  variant={
                                    selectedDurations.includes(duration.id)
                                      ? 'default'
                                      : 'outline'
                                  }
                                  onClick={() => toggleDuration(duration.id)}
                                  className="justify-start font-bold rounded-xl h-auto py-2.5"
                                  style={
                                    selectedDurations.includes(duration.id)
                                      ? {
                                          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                          color: 'white',
                                        }
                                      : { borderColor: `${mainColor}20` }
                                  }
                                >
                                  <div className="text-left w-full">
                                    <div className="font-black text-sm">
                                      {selectedDurations.includes(
                                        duration.id,
                                      ) && <span className="mr-2">✓</span>}
                                      {duration.label}
                                    </div>
                                    <div className="text-xs opacity-80 font-normal">
                                      {duration.desc}
                                    </div>
                                  </div>
                                </Button>
                              ))}
                            </div>
                            {selectedDurations.length > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedDurations([])}
                                className="text-xs font-bold w-full"
                                style={{ color: mainColor }}
                              >
                                Bersihkan Durasi
                              </Button>
                            )}
                          </div>
                        </TabsContent>

                        {/* Tab 5: Features */}
                        <TabsContent
                          value="features"
                          className="p-4 space-y-3"
                        >
                          <div className="space-y-2">
                            <Label className="text-sm font-black text-gray-900 flex items-center gap-2">
                              <Sparkles
                                className="w-4 h-4"
                                style={{ color: mainColor }}
                              />
                              Fitur yang Tersedia
                            </Label>
                            <div className="space-y-2">
                              {[
                                {
                                  id: 'video',
                                  label: 'Video Course',
                                  desc: 'Akses video pembelajaran',
                                  icon: Video,
                                },
                                {
                                  id: 'document',
                                  label: 'Dokumen & Materi',
                                  desc: 'E-book dan modul',
                                  icon: FileText,
                                },
                                {
                                  id: 'tryout',
                                  label: 'Tryout',
                                  desc: 'Latihan soal tryout',
                                  icon: BookOpen,
                                },
                                {
                                  id: 'live_class',
                                  label: 'Live Class',
                                  desc: 'Kelas langsung dengan tutor',
                                  icon: Star,
                                },
                              ].map((feature) => {
                                const IconComponent = feature.icon;
                                return (
                                  <Button
                                    key={feature.id}
                                    variant={
                                      selectedFeatures.includes(feature.id)
                                        ? 'default'
                                        : 'outline'
                                    }
                                    onClick={() => toggleFeature(feature.id)}
                                    className="w-full justify-start font-bold rounded-xl h-auto py-2.5"
                                    style={
                                      selectedFeatures.includes(feature.id)
                                        ? {
                                            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                            color: 'white',
                                          }
                                        : { borderColor: `${mainColor}20` }
                                    }
                                  >
                                    <div className="flex items-center gap-3 w-full">
                                      <IconComponent className="w-4 h-4" />
                                      <div className="text-left flex-1">
                                        <div className="font-black text-sm">
                                          {selectedFeatures.includes(
                                            feature.id,
                                          ) && <span className="mr-2">✓</span>}
                                          {feature.label}
                                        </div>
                                        <div className="text-xs opacity-80 font-normal">
                                          {feature.desc}
                                        </div>
                                      </div>
                                    </div>
                                  </Button>
                                );
                              })}
                            </div>
                            {selectedFeatures.length > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedFeatures([])}
                                className="text-xs font-bold w-full"
                                style={{ color: mainColor }}
                              >
                                Bersihkan Fitur
                              </Button>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>

                      {/* Bottom Actions */}
                      <div className="border-t p-4 space-y-2 bg-gray-50">
                        {/* Sort Options - Compact */}
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-gray-700">
                            Urutkan
                          </Label>
                          <div className="grid grid-cols-2 gap-2">
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
                                className="text-xs font-bold rounded-xl"
                                style={
                                  sortBy === option
                                    ? {
                                        background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                        color: 'white',
                                      }
                                    : { borderColor: `${mainColor}20` }
                                }
                              >
                                {option === 'name' && 'A-Z'}
                                {option === 'price' && 'Termurah'}
                                {option === 'price-desc' && 'Termahal'}
                                {option === 'popularity' && 'Populer'}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Reset Button */}
                        {activeFiltersCount > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={resetAllFilters}
                            className="w-full rounded-xl font-bold"
                            style={{
                              borderColor: `${mainColor}20`,
                              color: mainColor,
                            }}
                          >
                            Reset Semua ({activeFiltersCount} filter aktif)
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

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
      {/* Enhanced Coin Topping Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="relative max-w-7xl mx-auto"
      >
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute top-1/4 left-0 w-72 h-72 rounded-full blur-3xl opacity-10"
            style={{
              background: `radial-gradient(circle, ${mainColor}, transparent)`,
            }}
          />
          <div
            className="absolute bottom-1/4 right-0 w-72 h-72 rounded-full blur-3xl opacity-10"
            style={{
              background: `radial-gradient(circle, ${secondaryColor}, transparent)`,
            }}
          />
        </div>

        <div className="relative z-10 text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Badge
              className="px-6 py-2 text-sm font-bold text-white border-none mb-6 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${secondaryColor}, ${mainColor})`,
              }}
            >
              <Zap className="w-4 h-4 mr-2 inline" />
              Tambah Coin
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-3xl md:text-4xl font-black text-gray-900 mb-2"
          >
            Paket Coin Tambahan
          </motion.h2>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="text-3xl md:text-4xl font-black mb-6 bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${secondaryColor}, ${mainColor})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Fleksibel & Hemat
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Tambah coin untuk mengakses lebih banyak fitur seperti{' '}
            <span className="font-bold text-gray-900">notes</span>,{' '}
            <span className="font-bold text-gray-900">chat</span>,
            <span className="font-bold text-gray-900"> tryout</span>,{' '}
            <span className="font-bold text-gray-900">quiz</span>, dan{' '}
            <span className="font-bold text-gray-900">vision</span> dengan mudah
            dan fleksibel
          </motion.p>
        </div>

        {topping.length === 0 ? (
          <EmptyPlan type="coin" />
        ) : (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl">
              {topping.map((pack) => (
                <CardPlanTopping
                  plan={pack}
                  key={pack.name}
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
