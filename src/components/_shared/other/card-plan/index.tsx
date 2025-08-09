'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { pixel } from '@/lib/pixel/_core'; // ✅ Import pixel untuk tracking
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Clock,
  Crown,
  Eye,
  Gift,
  Heart,
  ImageIcon,
  Shield,
  ShoppingCart,
  SparkleIcon,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { DialogPayment } from './_components/dialog-payment';
import { RenderBenefitTab } from './_components/render-benefit';
import { RenderFeatureTab } from './_components/render-feature';
import { RenderLimitationTab } from './_components/render-limitation';
import { RenderOverviewTab } from './_components/render-overview';
import { ProviderContext } from './_provider/provider';
import { PlanDataType } from './_provider/types';

export function CardPlan({
  plan,
  hideFeatures = [],
  viewOnly,
  discount,
  onClose,
  classOverlay,
}: {
  plan: PlanDataType;
  hideFeatures?: string[];
  viewOnly?: boolean;
  discount?: number;
  onClose?: () => void;
  classOverlay?: string;
}) {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const {
    useAuth: { setShowAuth },
    setTransactionPopUp,
  } = useAppContext();

  const router = useRouter();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const searchParams = useSearchParams();
  const planIdQuery = searchParams.get('planId');
  const voucherCodeQuery = searchParams.get('voucherCode');

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAllBenefits, setShowAllBenefits] = useState(false);
  const [liveClassDetails, setLiveClassDetails] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const isCourse = plan.PlanSubscription.PlanFeature.some(
    (item) => item.type === 'COURSE',
  );
  const isDocument = plan.PlanSubscription.PlanFeature.some(
    (item) => item.type === 'DOCUMENT',
  );

  // Enhanced marketplace indicators
  const isPopular =
    plan.name.toLowerCase().includes('popular') ||
    plan.name.toLowerCase().includes('terpopuler');
  const isRecommended =
    plan.name.toLowerCase().includes('recommended') ||
    plan.name.toLowerCase().includes('direkomendasikan');
  const isBestSeller = plan.name.toLowerCase().includes('bestseller');
  const isLimitedTime = plan.originalPrice && plan.originalPrice > plan.price;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getDiscountPercentage = () => {
    if (!plan.originalPrice || plan.originalPrice <= plan.price) return 0;
    return Math.round(
      ((plan.originalPrice - plan.price) / plan.originalPrice) * 100,
    );
  };

  // Mock marketplace data (in real app, this would come from API)
  // const marketplaceData = {
  //   rating: 4.8,
  //   reviewCount: 2847,
  //   studentCount: 15420,
  //   completionRate: 94,
  //   lastUpdated: '2 minggu lalu',
  //   instructor: 'Expert Team',
  //   difficulty: 'Pemula - Mahir',
  // };

  useEffect(() => {
    if (!session && planIdQuery) {
      setShowAuth({
        redirect: `/price?planId=${planIdQuery}${voucherCodeQuery ? `&voucherCode=${voucherCodeQuery}` : ''}`,
        open: true,
      });
    }
    if (planIdQuery === plan.id && session) {
      buttonRef.current?.click();
      router.replace(window.location.pathname);
    }
  }, [planIdQuery, session, voucherCodeQuery]);

  const Context = {
    useState: {
      activeTab,
      setActiveTab,
      showAllBenefits,
      setShowAllBenefits,
      liveClassDetails,
      setLiveClassDetails,
    },
    useData: {
      plan,
      isCourse,
      isDocument,
      hideFeatures,
    },
  };

  return (
    <ProviderContext.Provider value={Context}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className={cn(
          'w-full max-w-md group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl border-0 transition-all duration-500',
          isRecommended && 'ring-2 ring-offset-4',
        )}
        style={{
          borderColor: isRecommended ? mainColor : undefined,
          boxShadow: isPopular
            ? `0 8px 32px ${mainColor}30`
            : `0 4px 24px ${mainColor}15`,
        }}
      >
        {/* Marketplace Status Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/50 to-transparent">
          {isLimitedTime && (
            <div
              className="h-full bg-gradient-to-r from-red-500 to-orange-500 animate-pulse"
              style={{ width: '60%' }}
            />
          )}
        </div>

        {/* Header Section - Homepage Style */}
        <div className="relative p-6 bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-sm">
          {/* Top Badges Row */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20">
            {/* Left badges */}
            <div className="flex flex-col gap-1">
              {isBestSeller && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg border-0 font-bold text-xs">
                  <SparkleIcon
                    size={10}
                    className="mr-1"
                  />
                  BESTSELLER
                </Badge>
              )}
              {isPopular && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg border-0">
                  <TrendingUp
                    size={10}
                    className="mr-1"
                  />
                  TRENDING
                </Badge>
              )}
            </div>

            {/* Right badges */}
            <div className="flex flex-col gap-1 items-end">
              {isRecommended && (
                <Badge
                  className="text-white shadow-lg border-0 font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  <Crown
                    size={10}
                    className="mr-1"
                  />
                  PILIHAN EDITOR
                </Badge>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-all duration-200"
              >
                <Heart
                  size={14}
                  className={cn(
                    'transition-colors duration-200',
                    isWishlisted
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-400',
                  )}
                />
              </button>
            </div>
          </div>

          {/* Discount Flash Badge */}
          {isLimitedTime && getDiscountPercentage() > 0 && (
            <div className="absolute top-16 left-3 z-20">
              <div className="relative">
                <Badge className="bg-red-500 text-white shadow-xl border-0 font-bold text-sm px-3 py-1 animate-pulse">
                  <Zap
                    size={12}
                    className="mr-1"
                  />
                  HEMAT {getDiscountPercentage()}%
                </Badge>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping" />
              </div>
            </div>
          )}

          {/* Enhanced Hero Image Section */}
          <div className="relative mt-12 mb-4">
            <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:shadow-xl transition-all duration-500">
              {plan.image ? (
                <Image
                  src={plan.image}
                  alt={plan.name}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback =
                      e.currentTarget.parentElement?.querySelector(
                        '.fallback-icon',
                      );
                    if (fallback) {
                      (fallback as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
              ) : null}

              {/* Enhanced Fallback */}
              <div
                className={`fallback-icon absolute inset-0 flex flex-col items-center justify-center ${plan.image ? 'hidden' : 'flex'}`}
                style={{
                  background: `linear-gradient(135deg, ${mainColor}20, ${secondaryColor}15)`,
                }}
              >
                <ImageIcon
                  size={40}
                  style={{ color: `${mainColor}80` }}
                  className="mb-2"
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: `${mainColor}70` }}
                >
                  Product Preview
                </span>
              </div>

              {/* Marketplace Overlay Effects */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

              {/* Quick Stats Overlay */}
              {/* <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="flex gap-2">
                  <div className="px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm bg-white/90 text-gray-800">
                    ⭐ {marketplaceData.rating}
                  </div>
                  <div className="px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm bg-white/90 text-gray-800">
                    👥 {marketplaceData.studentCount.toLocaleString()}
                  </div>
                </div>
              </div> */}

              {/* Live indicator for time-sensitive offers */}
              {isLimitedTime && (
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/90 backdrop-blur-sm text-white text-xs font-medium">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    LIMITED
                  </div>
                </div>
              )}
            </div>

            {/* Category & Platform Tags */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                {plan.PlanSubscription?.WebsiteSubCategory && (
                  <Badge
                    variant="outline"
                    className="text-xs font-medium border-2"
                    style={{
                      borderColor: `${mainColor}30`,
                      color: mainColor,
                      backgroundColor: `${mainColor}05`,
                    }}
                  >
                    {plan.PlanSubscription.WebsiteSubCategory.name}
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="text-xs text-gray-600 border-gray-300"
                >
                  {plan.PlanSubscription.tier}
                </Badge>
              </div>

              {/* <div className="text-xs text-gray-500 flex items-center gap-1">
                <Clock size={10} />
                {marketplaceData.lastUpdated}
              </div> */}
            </div>
          </div>

          {/* Product Title & Rating */}
          <div className="space-y-3">
            <h3 className="text-xl font-black leading-tight text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors">
              {plan.name}
            </h3>

            {/* Marketplace Rating & Social Proof */}
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={cn(
                        'transition-colors',
                        i < Math.floor(marketplaceData.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300',
                      )}
                    />
                  ))}
                  <span className="text-sm font-semibold text-gray-800">
                    {marketplaceData.rating}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  ({marketplaceData.reviewCount.toLocaleString()} ulasan)
                </span>
              </div>

              <div className="text-xs text-gray-600 flex items-center gap-1">
                <Users size={10} />
                {marketplaceData.studentCount.toLocaleString()} siswa
              </div>
            </div> */}

            {/* Enhanced Description */}
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              {plan.description}
            </p>

            {/* Key Features Preview - Marketplace Style */}
            <div className="flex flex-wrap gap-1.5">
              {plan.PlanSubscription?.PlanFeature?.slice(0, 3).map(
                (feature, index) => (
                  <Badge
                    key={feature.id}
                    variant="secondary"
                    className="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    {feature.type === 'COURSE'
                      ? '📚'
                      : feature.type === 'DOCUMENT'
                        ? '📄'
                        : '🎥'}{' '}
                    {feature.type === 'COURSE'
                      ? 'Video Course'
                      : feature.type === 'DOCUMENT'
                        ? 'Materials'
                        : 'Live Class'}
                  </Badge>
                ),
              )}
              {(plan.PlanSubscription?.PlanFeature?.length || 0) > 3 && (
                <Badge
                  variant="secondary"
                  className="text-xs font-medium bg-gray-100 text-gray-600"
                >
                  +{(plan.PlanSubscription?.PlanFeature?.length || 0) - 3}{' '}
                  lainnya
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          {/* Marketplace-Style Pricing Section */}
          <div className="mb-6 p-4 rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Harga Terbaik
                </span>
                {isLimitedTime && (
                  <div className="flex items-center gap-1 text-red-600">
                    <Zap size={12} />
                    <span className="text-xs font-bold">PROMO TERBATAS</span>
                  </div>
                )}
              </div>

              {/* Price Display - Enhanced */}
              <div className="flex items-end justify-between">
                <div className="flex items-baseline gap-3">
                  {/* Current/Discounted Price */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      {discount && (
                        <div
                          className="text-3xl font-black"
                          style={{ color: mainColor }}
                        >
                          {formatPrice(discount)}
                        </div>
                      )}
                      <div
                        className={cn(
                          'text-3xl font-black',
                          discount &&
                            'text-lg text-gray-500 line-through font-semibold',
                        )}
                        style={{ color: mainColor }}
                      >
                        {formatPrice(plan.price)}
                      </div>
                    </div>
                    {plan.PlanBenefit.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        ~
                        {formatPrice(
                          Math.floor(
                            (discount || plan.price) /
                              plan.PlanSubscription.expireDays,
                          ),
                        )}{' '}
                        per hari
                      </div>
                    )}
                  </div>

                  {/* Original Price */}
                  {((plan.originalPrice && plan.originalPrice > plan.price) ||
                    discount) && (
                    <div className="flex flex-col items-end">
                      <span className="text-lg text-gray-500 line-through font-semibold">
                        {formatPrice(plan.originalPrice || plan.price)}
                      </span>
                      <div className="flex items-center gap-1 text-green-600">
                        <span className="text-xs font-bold">
                          Hemat{' '}
                          {formatPrice(
                            (plan.originalPrice || plan.price) -
                              (discount || plan.price),
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Savings Badge */}
                {getDiscountPercentage() > 0 && (
                  <div className="text-right">
                    <Badge className="bg-red-500 text-white font-bold text-sm">
                      -{getDiscountPercentage()}%
                    </Badge>
                  </div>
                )}
              </div>

              {/* Value Props */}
              {/* <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Shield
                    size={12}
                    className="text-green-500"
                  />
                  <span>Garansi 30 hari</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle2
                    size={12}
                    className="text-blue-500"
                  />
                  <span>Akses selamanya</span>
                </div>
              </div> */}
            </div>
          </div>

          {/* Enhanced Tabs - Marketplace Style */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-4 h-8 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger
                value="overview"
                className="text-xs font-medium rounded-lg data-[state=active]:shadow-md transition-all data-[state=active]:bg-white"
                style={
                  {
                    '--tw-ring-color': `${mainColor}20`,
                  } as React.CSSProperties
                }
              >
                <Eye
                  size={14}
                  className="mr-1"
                />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="text-xs font-medium rounded-lg data-[state=active]:shadow-md transition-all data-[state=active]:bg-white"
              >
                <Sparkles
                  size={14}
                  className="mr-1"
                />
                <span className="hidden sm:inline">Fitur</span>
              </TabsTrigger>
              <TabsTrigger
                value="benefits"
                className="text-xs font-medium rounded-lg data-[state=active]:shadow-md transition-all data-[state=active]:bg-white"
              >
                <Gift
                  size={14}
                  className="mr-1"
                />
                <span className="hidden sm:inline">Benefit</span>
              </TabsTrigger>
              <TabsTrigger
                value="limitations"
                className="text-xs font-medium rounded-lg data-[state=active]:shadow-md transition-all data-[state=active]:bg-white"
              >
                <Clock
                  size={14}
                  className="mr-1"
                />
                <span className="hidden sm:inline">Limits</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <div className="min-h-[200px] rounded-xl border border-gray-100 p-4 bg-white shadow-sm">
              <TabsContent
                value="overview"
                className="mt-0"
              >
                <RenderOverviewTab />
              </TabsContent>
              <TabsContent
                value="limitations"
                className="mt-0"
              >
                <RenderLimitationTab />
              </TabsContent>
              <TabsContent
                value="features"
                className="mt-0"
              >
                <RenderFeatureTab />
              </TabsContent>
              <TabsContent
                value="benefits"
                className="mt-0"
              >
                <RenderBenefitTab />
              </TabsContent>
            </div>
          </Tabs>

          {/* Marketplace-Style CTA Section */}
          <div className="mt-6 space-y-3">
            {/* Primary CTA */}
            {!viewOnly && (
              <DialogPayment
                plan={plan}
                classOverlay={classOverlay}
              >
                <Button
                  ref={buttonRef}
                  className="w-full h-14 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 text-white border-0 relative overflow-hidden group"
                  size="lg"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 20px 40px ${mainColor}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 10px 30px ${mainColor}30`;
                  }}
                  onClick={() => {
                    // ✅ ADDTOCART TRACKING - Track saat user klik "Beli Sekarang"
                    try {
                      pixel.meta.track(
                        'AddToCart',
                        {
                          content_name: plan.name,
                          content_type: 'product',
                          value: plan.price,
                          currency: 'IDR',
                          contents: [{ id: plan.id, quantity: 1 }],
                        },
                        {
                          // Advanced Matching jika user sudah login
                          em: session?.user?.email,
                          ph: session?.user?.phone || undefined,
                          fn: session?.user?.name?.split(' ')[0],
                          ln: session?.user?.name
                            ?.split(' ')
                            .slice(1)
                            .join(' '),
                        },
                      );

                      pixel.tiktok.track('AddToCart', {
                        content_name: plan.name,
                        content_type: 'product',
                        value: plan.price,
                        currency: 'IDR',
                        content_id: `plan_addtocart_${plan.id}`, // ✅ Required untuk TikTok VSA
                      });

                      pixel.meta.track(
                        'AddPaymentInfo',
                        {
                          content_name: plan.name,
                          content_type: 'product',
                          value: plan.price,
                          currency: 'IDR',
                          contents: [{ id: plan.id, quantity: 1 }],
                        },
                        {
                          // Advanced Matching jika user sudah login
                          em: session?.user?.email,
                          ph: session?.user?.phone || undefined,
                          fn: session?.user?.name?.split(' ')[0],
                          ln: session?.user?.name
                            ?.split(' ')
                            .slice(1)
                            .join(' '),
                        },
                      );

                      pixel.tiktok.track('AddPaymentInfo', {
                        content_name: plan.name,
                        content_type: 'product',
                        value: plan.price,
                        currency: 'IDR',
                        content_id: `plan_addpaymentinfo_${plan.id}`, // ✅ Required untuk TikTok VSA
                      });
                    } catch (pixelError) {
                      console.warn(
                        'Pixel tracking error on add to cart:',
                        pixelError,
                      );
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <ShoppingCart
                    size={20}
                    className="mr-3"
                  />
                  <span>Beli Sekarang</span>
                </Button>
              </DialogPayment>
            )}

            {/* Secondary CTA */}
            {!viewOnly && (
              <Link href={`/price/${plan.id}`}>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-2 hover:shadow-lg font-semibold transition-all duration-300 group bg-white h-12"
                  style={{
                    borderColor: `${mainColor}40`,
                    color: mainColor,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${mainColor}05`;
                    e.currentTarget.style.borderColor = mainColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = `${mainColor}40`;
                  }}
                  onClick={() => {
                    // ✅ VIEWCONTENT TRACKING - Track saat user melihat detail produk
                    pixel.meta.track('ViewContent', {
                      contents: [{ id: plan.id, quantity: 1 }],
                      content_name: plan.name,
                      content_type: 'product',
                      value: plan.price,
                      currency: 'IDR',
                    });

                    pixel.tiktok.track('ViewContent', {
                      content_id: plan.id,
                      content_name: plan.name,
                      content_type: 'product',
                      value: plan.price,
                      currency: 'IDR',
                    });

                    setTransactionPopUp(false);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Lihat Detail Lengkap</span>
                </Button>
              </Link>
            )}

            {/* Trust Indicators - Marketplace Style */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mb-1">
                    <Shield
                      size={14}
                      className="text-green-600"
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Aman
                  </span>
                  <span className="text-xs text-gray-500">SSL Secure</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                    <Users
                      size={14}
                      className="text-blue-600"
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Support
                  </span>
                  <span className="text-xs text-gray-500">24/7 Help</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mb-1">
                    <Star
                      size={14}
                      className="text-purple-600"
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Kualitas
                  </span>
                  <span className="text-xs text-gray-500">Premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </ProviderContext.Provider>
  );
}
