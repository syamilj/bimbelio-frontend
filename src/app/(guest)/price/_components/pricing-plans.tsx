'use client';
import { EmptyPlan } from '@/components/_shared/empty/empty-plan';
import { CardPlan } from '@/components/_shared/other/card-plan';
import { CardPlanTopping } from '@/components/_shared/other/card-plan-coin';
import { PlanDataType } from '@/components/_shared/other/card-plan/_provider/types';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGet } from '@/lib/fetch-helper/useGet';
import { pixel } from '@/lib/pixel/_core';
import { Filter, Sparkles, Zap } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

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

  // Filter dan Search Logic
  const filteredAndSortedPlans = useMemo(() => {
    if (!PricingData?.plans) return [];

    let filtered = PricingData.plans.filter((plan) => {
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
      <div className="max-w-7xl mx-auto">
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
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-6 space-y-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
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
                      ['name', 'price', 'price-desc', 'popularity'] as const
                    ).map((option) => (
                      <Button
                        key={option}
                        variant={sortBy === option ? 'default' : 'outline'}
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

        {topping.length === 0 ? (
          <EmptyPlan type="coin" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {topping.map((pack) => (
              <CardPlanTopping
                plan={pack}
                key={pack.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
