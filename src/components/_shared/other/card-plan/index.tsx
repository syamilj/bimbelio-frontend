'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { cn } from '@/lib/utils';
import {
  Coins,
  Eye,
  Gift,
  Heart,
  ImageIcon,
  Info,
  Shield,
  ShoppingCart,
  Sparkles,
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
import { ProviderContext, useProvider } from './_provider/provider';
import { PlanDataType } from './_provider/types';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export function CardPlan({
  plan,
  hideFeatures = [],
  viewOnly,
  discount,
  onClose,
  classOverlay,
  paymentMethod = 'FULL_PAYMENT',
}: {
  plan: PlanDataType;
  hideFeatures?: string[];
  viewOnly?: boolean;
  discount?: number;
  onClose?: () => void;
  classOverlay?: string;
  paymentMethod?: 'FULL_PAYMENT' | 'INSTALLMENT';
}) {
  const { data: session } = useSession();
  const { websiteSubCategory, webCategoryData } = useWebsiteSubCategory();
  const {
    useAuth: { setShowAuth },
  } = useAppContext();

  const webSubData =
    webCategoryData.length > 0 ? webCategoryData[0].WebsiteSubCategory : [];

  const router = useRouter();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const searchParams = useSearchParams();
  const planIdQuery = searchParams.get('planId');
  const voucherCodeQuery = searchParams.get('voucherCode');

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAllBenefits, setShowAllBenefits] = useState(false);
  const [liveClassDetails, setLiveClassDetails] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const isCourse =
    plan.PlanSubscription?.PlanFeature?.some(
      (item) => item.type === 'COURSE',
    ) ?? false;
  const isDocument =
    plan.PlanSubscription?.PlanFeature?.some(
      (item) => item.type === 'DOCUMENT',
    ) ?? false;
  const isPrivate =
    plan.PlanSubscription?.PlanFeature?.some(
      (item) => item.type === 'PRIVATE',
    ) ?? false;

  // Enhanced marketplace indicators
  const isPopular =
    plan.name.toLowerCase().includes('popular') ||
    plan.name.toLowerCase().includes('terpopuler');
  const isRecommended = plan.recommended || false;
  const isBestSeller = plan.name.toLowerCase().includes('bestseller');
  const isLimitedTime = !!plan.originalPrice && plan.originalPrice > plan.price;

  const getDiscountPercentage = () => {
    if (!plan.originalPrice || plan.originalPrice <= plan.price) return 0;
    return Math.round(
      ((plan.originalPrice - plan.price) / plan.originalPrice) * 100,
    );
  };

  useEffect(() => {
    if (!session && planIdQuery) {
      setShowAuth({
        redirect: `/price?planId=${planIdQuery}${voucherCodeQuery ? `&voucherCode=${voucherCodeQuery}` : ''}`,
        open: true,
      });
    }
    console.log({
      planIdQuery,
      planId: plan.id,
      type: 'paket',
    });
    if (planIdQuery === plan.id && session) {
      buttonRef.current?.click();
      router.replace(window.location.pathname);
    }
  }, [planIdQuery, session, voucherCodeQuery]);

  const platfroms = plan.PlanSubscription
    ? plan.PlanSubscription?.PlanSubscriptionBundle?.map((item) =>
        item.websiteSubCategoryId.toUpperCase(),
      )
    : plan.PlanLimitation
      ? webSubData.map((item) => item.id.toUpperCase())
      : [];

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
      isPrivate,
      hideFeatures,
    },
    useViewData: {
      platfroms,
      getDiscountPercentage,
      isPopular,
      isRecommended,
      isBestSeller,
      isLimitedTime,
      isWishlisted,
      setIsWishlisted,
      discount,
      viewOnly,
      classOverlay,
      buttonRef,
      paymentMethod,
    },
  };

  return (
    <ProviderContext.Provider value={Context}>
      <div
        className={cn(
          'w-full max-w-md group relative overflow-hidden bg-white rounded-3xl border-2 transition-all duration-200 touch-pan-x shadow-sm hover:shadow-lg',
          isRecommended && 'ring-2 ring-offset-2',
        )}
        style={{
          borderColor: isRecommended ? mainColor : '#e2e8f0',
          ...(isRecommended && ({ '--tw-ring-color': mainColor } as any)),
        }}
      >
        {/* Image Section - 4:5 Ratio, No Overlay */}
        <HeroImageSection />

        {/* Card Content */}
        <div className="p-5">
          {/* Product Title & Quick Info */}
          <ProductHeader />

          {/* Pricing Section - Prominent */}
          <PricingSection />

          {/* Key Features Preview */}
          <QuickFeatures />

          {/* CTA Buttons */}
          <ButtonSection />
        </div>
      </div>
    </ProviderContext.Provider>
  );
}

// New Hero Image Section - 4:5 Ratio, Clean, No Overlay
const HeroImageSection = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const {
    useData: { plan },
    useViewData: {
      isBestSeller,
      isPopular,
      isRecommended,
      isLimitedTime,
      getDiscountPercentage,
      isWishlisted,
      setIsWishlisted,
    },
  } = useProvider();

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <div className="relative w-full aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Image - Full Display, No Overlay */}
      {plan.image ? (
        <Image
          src={plan.image}
          alt={plan.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
          priority
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const fallback =
              e.currentTarget.parentElement?.querySelector('.fallback-icon');
            if (fallback) {
              (fallback as HTMLElement).style.display = 'flex';
            }
          }}
        />
      ) : null}

      {/* Fallback */}
      <div
        className={`fallback-icon absolute inset-0 flex flex-col items-center justify-center ${plan.image ? 'hidden' : 'flex'}`}
        style={{
          background: `linear-gradient(135deg, ${mainColor}15, ${secondaryColor}10)`,
        }}
      >
        <ImageIcon
          size={48}
          style={{ color: `${mainColor}60` }}
          className="mb-2"
        />
        <span
          className="text-sm font-medium"
          style={{ color: `${mainColor}60` }}
        >
          {plan.name}
        </span>
      </div>

      {/* Top Badges - Minimal & Clean */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
        {/* Left badges */}
        <div className="flex flex-col gap-1.5">
          {isBestSeller && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md border-0 font-semibold text-[10px] px-2 py-0.5 rounded-3xl">
              ⭐ TERLARIS
            </Badge>
          )}
          {isPopular && (
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md border-0 font-semibold text-[10px] px-2 py-0.5 rounded-3xl">
              🔥 TRENDING
            </Badge>
          )}
          {isRecommended && (
            <Badge
              className="text-white shadow-md border-0 font-semibold text-[10px] px-2 py-0.5 rounded-3xl"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              👑 TERBAIK
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="p-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-md hover:scale-110 transition-all duration-200"
        >
          <Heart
            size={16}
            className={cn(
              'transition-colors duration-200',
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500',
            )}
          />
        </button>
      </div>

      {/* Discount Badge - Bottom Left */}
      {isLimitedTime && getDiscountPercentage() > 0 && (
        <div className="absolute bottom-3 left-3 z-10">
          <Badge className="bg-red-500 text-white shadow-lg border-0 font-bold text-sm px-3 py-1 rounded-3xl">
            <Zap
              size={12}
              className="mr-1"
            />
            {getDiscountPercentage()}% OFF
          </Badge>
        </div>
      )}

      {/* Installment Badge - Bottom Right */}
      {plan.PlanInstallmentConfig && (
        <div className="absolute bottom-3 right-3 z-10">
          <Badge className="bg-blue-500 text-white shadow-lg border-0 font-semibold text-xs px-2.5 py-1 flex items-center gap-1 rounded-3xl">
            <Coins size={12} />
            Bisa Cicil
          </Badge>
        </div>
      )}

      {/* Max Users Warning - Bottom Center */}
      {plan.maxUsers && plan.totalUsers >= plan.maxUsers * 0.8 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-orange-500 text-white shadow-lg border-0 font-semibold text-xs px-2.5 py-1 flex items-center gap-1 rounded-3xl">
            <Users size={12} />
            Hampir Penuh
          </Badge>
        </div>
      )}
    </div>
  );
};

// Product Header - Title & Category
const ProductHeader = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const {
    useData: { plan },
    useViewData: { platfroms },
  } = useProvider();

  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  return (
    <div className="mb-3">
      {/* Category Tags */}
      <div className="flex items-center gap-1.5 mb-2">
        {platfroms.length === 0 &&
          plan.PlanSubscription?.WebsiteSubCategory && (
            <Badge
              variant="outline"
              className="text-[10px] font-medium border px-1.5 py-0"
              style={{
                borderColor: `${mainColor}40`,
                color: mainColor,
                backgroundColor: `${mainColor}05`,
              }}
            >
              {plan.PlanSubscription?.WebsiteSubCategory?.name || 'Paket'}
            </Badge>
          )}
        {platfroms.length > 0 &&
          platfroms.slice(0, 2).map((platform) => (
            <Badge
              key={platform}
              variant="outline"
              className="text-[10px] font-medium border px-1.5 py-0"
              style={{
                borderColor: `${mainColor}40`,
                color: mainColor,
                backgroundColor: `${mainColor}05`,
              }}
            >
              {platform}
            </Badge>
          ))}
        {platfroms.length > 2 && (
          <Badge
            variant="outline"
            className="text-[10px] font-medium border px-1.5 py-0"
            style={{
              borderColor: `${mainColor}40`,
              color: mainColor,
              backgroundColor: `${mainColor}05`,
            }}
          >
            +{platfroms.length - 2}
          </Badge>
        )}
        <Badge
          variant="outline"
          className="text-[10px] text-gray-600 border-gray-300 px-1.5 py-0"
        >
          {plan.PlanSubscription?.tier
            ? plan.PlanSubscription?.tier
            : plan.PlanLimitation
              ? 'Koin'
              : 'Standar'}
        </Badge>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold leading-tight text-gray-900 line-clamp-2 mb-1">
        {plan.name}
      </h3>

      {/* Description - Shorter */}
      {plan.description && (
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
          {plan.description}
        </p>
      )}
    </div>
  );
};

const PricingSection = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const {
    useData: { plan },
    useViewData: {
      isLimitedTime,
      getDiscountPercentage,
      discount,
      paymentMethod,
    },
  } = useProvider();

  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  // Check if plan has installment
  const hasInstallment = !!plan.PlanInstallmentConfig;
  const firstInstallmentPrice =
    plan.PlanInstallmentConfig?.PlanInstallmentSchedule[0]?.amount || 0;
  const fullPrice = discount || plan.price;

  // Calculate total installment price from all schedules
  const totalInstallmentPrice =
    plan.PlanInstallmentConfig?.PlanInstallmentSchedule.reduce(
      (sum, schedule) => sum + schedule.amount,
      0,
    ) ||
    plan.PlanInstallmentConfig?.totalAmount ||
    0;

  return (
    <div className="mb-3">
      {/* Price Display */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          {hasInstallment ? (
            // Cicilan: tampilkan harga cicilan pertama saja
            <>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-2xl font-black"
                  style={{ color: mainColor }}
                >
                  {formatPrice(firstInstallmentPrice)}
                </span>
                <span className="text-sm text-gray-500 font-medium">
                  /cicilan
                </span>
                {/* Tooltip untuk detail cicilan */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="ml-1 p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    >
                      <Info
                        size={14}
                        className="text-gray-400 hover:text-gray-600"
                      />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-72 p-4 rounded-3xl"
                    align="start"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b">
                        <Coins
                          className="w-4 h-4"
                          style={{ color: mainColor }}
                        />
                        <h4 className="font-bold text-sm">Detail Cicilan</h4>
                      </div>
                      <div className="space-y-2">
                        {plan.PlanInstallmentConfig?.PlanInstallmentSchedule.map(
                          (schedule, index) => (
                            <div
                              key={schedule.id}
                              className="flex justify-between items-center text-xs"
                            >
                              <span className="text-gray-600">
                                Cicilan #{schedule.installmentNumber}
                                {index === 0 && ' (Pertama)'}
                              </span>
                              <span className="font-semibold">
                                {formatPrice(schedule.amount)}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                      <div className="pt-2 border-t flex justify-between items-center">
                        <span className="text-sm font-bold">Total</span>
                        <span
                          className="text-base font-black"
                          style={{ color: mainColor }}
                        >
                          {formatPrice(totalInstallmentPrice)}
                        </span>
                      </div>
                      {plan.PlanInstallmentConfig?.gracePeriodDays &&
                        plan.PlanInstallmentConfig.gracePeriodDays > 0 && (
                          <div className="text-[10px] text-gray-500 pt-2 border-t">
                            Masa tenggang:{' '}
                            {plan.PlanInstallmentConfig.gracePeriodDays} hari
                          </div>
                        )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              {/* Tampilkan harga total yang dicoret */}
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm text-gray-500 line-through font-medium">
                  {formatPrice(totalInstallmentPrice)}
                </span>
                <span className="text-[10px] text-gray-600">
                  ({plan.PlanInstallmentConfig?.totalInstallments}x cicilan)
                </span>
              </div>
            </>
          ) : (
            // Full payment: tampilkan harga normal
            <>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-2xl font-black"
                  style={{ color: mainColor }}
                >
                  {formatPrice(fullPrice)}
                </span>
                {/* Original Price if there's discount */}
                {((plan.originalPrice && plan.originalPrice > plan.price) ||
                  discount) && (
                  <span className="text-sm text-gray-500 line-through font-medium">
                    {formatPrice(plan.originalPrice || plan.price)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-gray-600">
                  {plan.PlanSubscription?.expireDays
                    ? `~${formatPrice(Math.floor(fullPrice / (plan.PlanSubscription?.expireDays || 1)))} per hari`
                    : 'Harga spesial'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Discount Badge */}
        {getDiscountPercentage() > 0 && !hasInstallment && (
          <Badge className="bg-red-500 text-white font-bold text-xs px-2 py-0.5 rounded-3xl">
            -{getDiscountPercentage()}%
          </Badge>
        )}
      </div>

      {/* Key Info Pills */}
      <div className="flex flex-wrap gap-1.5">
        {/* Max Users Warning */}
        {plan.maxUsers && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-3xl bg-amber-50 border border-amber-200">
            <Users
              size={10}
              className="text-amber-600"
            />
            <span className="text-[10px] font-medium text-amber-700">
              {plan.totalUsers || 0}/{plan.maxUsers} slot
            </span>
          </div>
        )}

        {/* Installment Available */}
        {plan.PlanInstallmentConfig && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-3xl bg-blue-50 border border-blue-200">
            <Coins
              size={10}
              className="text-blue-600"
            />
            <span className="text-[10px] font-medium text-blue-700">
              Cicilan {plan.PlanInstallmentConfig.totalInstallments}x
            </span>
          </div>
        )}

        {/* Limited Time */}
        {isLimitedTime && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-3xl bg-red-50 border border-red-200">
            <Zap
              size={10}
              className="text-red-600"
            />
            <span className="text-[10px] font-medium text-red-700">
              Promo Terbatas
            </span>
          </div>
        )}

        {/* Timeline/Duration */}
        {plan.timeline && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-3xl bg-green-50 border border-green-200">
            <Shield
              size={10}
              className="text-green-600"
            />
            <span className="text-[10px] font-medium text-green-700">
              {plan.timeline}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Quick Features Preview - Compact
const QuickFeatures = () => {
  const {
    useData: { plan },
  } = useProvider();

  const features = plan.PlanSubscription?.PlanFeature || [];
  const benefits = plan.PlanBenefit || [];

  if (features.length === 0 && benefits.length === 0) return null;

  return (
    <div className="mb-3 pb-3 border-b border-gray-100">
      {/* Features */}
      {features.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {features.slice(0, 3).map((feature) => (
            <div
              key={feature.id}
              className="flex items-center gap-1 text-xs text-gray-700"
            >
              <span>
                {feature.type === 'COURSE'
                  ? '📚'
                  : feature.type === 'DOCUMENT'
                    ? '📄'
                    : '🎥'}
              </span>
              <span className="font-medium">
                {feature.type === 'COURSE'
                  ? 'Video Course'
                  : feature.type === 'DOCUMENT'
                    ? 'Materi'
                    : 'Live Class'}
              </span>
            </div>
          ))}
          {features.length > 3 && (
            <span className="text-xs text-gray-500">
              +{features.length - 3} fitur
            </span>
          )}
        </div>
      )}

      {/* Top Benefits */}
      {benefits.length > 0 && (
        <div className="space-y-1">
          {benefits.slice(0, 2).map((benefit) => (
            <div
              key={benefit.id}
              className="flex items-start gap-1.5"
            >
              <span className="text-green-500 mt-0.5">✓</span>
              <span className="text-xs text-gray-700 line-clamp-1">
                {benefit.title}
              </span>
            </div>
          ))}
          {benefits.length > 2 && (
            <span className="text-xs text-gray-500 ml-5">
              +{benefits.length - 2} benefit lainnya
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Old components below are kept for backward compatibility but not used in main render
const MaxUsersInfo = () => {
  const {
    useData: { plan },
  } = useProvider();

  if (!plan.maxUsers) return null;

  return (
    <div className="mb-4 p-3 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-100 rounded-3xl">
          <Users className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-800">Kuota Terbatas</p>
          <p className="text-xs text-amber-700">
            {plan.totalUsers || 0} / {plan.maxUsers} pengguna aktif
          </p>
        </div>
        <Badge className="bg-amber-500 text-white text-xs font-bold px-2 py-1">
          LIMITED
        </Badge>
      </div>
    </div>
  );
};

const InstallmentInfo = () => {
  const {
    useData: { plan },
    useViewData: { paymentMethod, discount },
  } = useProvider();
  if (!plan.PlanInstallmentConfig) return null;
  return (
    <div className="mb-4 p-3 rounded-3xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-blue-100 rounded-3xl">
          <Coins className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-blue-800">
            Cicilan Tersedia
          </p>
          <p className="text-xs text-blue-700">
            {plan.PlanInstallmentConfig.totalInstallments}x tanpa bunga
          </p>
        </div>
      </div>

      {/* Detail Cicilan */}
      <div className="space-y-2 ml-11">
        {plan.PlanInstallmentConfig.PlanInstallmentSchedule.map(
          (schedule, index) => {
            const amount = schedule.amount;
            return (
              <div
                key={schedule.id}
                className="text-xs text-blue-700"
              >
                <span className="font-semibold">
                  Cicilan #{schedule.installmentNumber}:
                </span>{' '}
                {formatPrice(amount)}
                {index === 0
                  ? ' (Pembayaran pertama)'
                  : ` (${schedule.daysAfterFirstPayment} hari setelah)`}
              </div>
            );
          },
        )}
      </div>

      {/* Masa Tenggang */}
      {plan.PlanInstallmentConfig.gracePeriodDays > 0 && (
        <div className="mt-2 pt-2 border-t border-blue-200 text-xs text-blue-700">
          <span className="font-semibold">Masa Tenggang:</span>{' '}
          {plan.PlanInstallmentConfig.gracePeriodDays} hari
        </div>
      )}
    </div>
  );
};

const TabsSection = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const {
    useData: { plan },
    useState: { activeTab, setActiveTab },
  } = useProvider();

  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const tabCount =
    (plan.PlanBenefit.length > 0 ? 1 : 0) +
    (plan.PlanLimitation ? 1 : 0) +
    (plan.PlanSubscription ? 1 : 0) +
    1;

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList
        className={cn(
          'grid w-full mb-4 h-8 bg-gray-100 p-1 rounded-3xl grid-cols-4',
        )}
        style={{
          gridTemplateColumns: `repeat(${tabCount}, minmax(0, 1fr))`,
        }}
      >
        <TabsTrigger
          value="overview"
          className="text-xs font-medium rounded-3xl data-[state=active]:shadow-md transition-all data-[state=active]:bg-white"
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
        {plan.PlanSubscription && (
          <TabsTrigger
            value="features"
            className="text-xs font-medium rounded-3xl data-[state=active]:shadow-md transition-all data-[state=active]:bg-white"
          >
            <Sparkles
              size={14}
              className="mr-1"
            />
            <span className="hidden sm:inline">Fitur</span>
          </TabsTrigger>
        )}
        {plan.PlanLimitation && (
          <TabsTrigger
            value="limitations"
            className="text-xs font-medium rounded-3xl data-[state=active]:shadow-md transition-all data-[state=active]:bg-white"
          >
            <Coins
              size={14}
              className="mr-1"
            />
            <span className="hidden sm:inline">Koin</span>
          </TabsTrigger>
        )}
        {plan.PlanBenefit.length > 0 && (
          <TabsTrigger
            value="benefits"
            className="text-xs font-medium rounded-3xl data-[state=active]:shadow-md transition-all data-[state=active]:bg-white"
          >
            <Gift
              size={14}
              className="mr-1"
            />
            <span className="hidden sm:inline">Benefit</span>
          </TabsTrigger>
        )}
      </TabsList>

      {/* Tab Content */}
      <div className="min-h-[200px] rounded-3xl border border-gray-100 p-4 bg-white shadow-sm">
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
  );
};

const ButtonSection = () => {
  const { setTransactionPopUp } = useAppContext();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { data: session } = useSession();
  const {
    useData: { plan },
    useViewData: { viewOnly, classOverlay, buttonRef },
  } = useProvider();

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <div className="space-y-2">
      {/* Primary CTA */}
      {!viewOnly && (
        <>
          {plan.maxUsers && plan.totalUsers >= plan.maxUsers ? (
            <Button
              ref={buttonRef}
              className="w-full h-11 text-sm font-bold shadow-md transition-all duration-300 text-white border-0 cursor-not-allowed opacity-60 rounded-3xl"
              size="lg"
              disabled
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <Users
                size={16}
                className="mr-2"
              />
              <span>Kuota Penuh</span>
            </Button>
          ) : (
            <DialogPayment
              plan={plan}
              classOverlay={classOverlay}
            >
              <Button
                ref={buttonRef}
                className="w-full h-11 text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 text-white border-0 rounded-3xl"
                size="lg"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
                onClick={() => {
                  try {
                    // Tracking logic here if needed
                  } catch (pixelError) {
                    console.warn('Pixel tracking error:', pixelError);
                  }
                }}
              >
                <ShoppingCart
                  size={16}
                  className="mr-2"
                />
                <span>Beli Sekarang</span>
              </Button>
            </DialogPayment>
          )}
        </>
      )}

      {/* Secondary CTA - Detail Button */}
      {!viewOnly && (
        <Link href={`/price/${plan.slug}`}>
          <Button
            variant="outline"
            size="lg"
            className="w-full border h-10 font-semibold transition-all duration-300 group bg-white text-sm rounded-3xl"
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
              trackUnifiedEvent({
                eventName: 'ViewContent',
                customData: {
                  contents: [{ id: plan.id, quantity: 1 }],
                  content_id: plan.id,
                  content_name: plan.name,
                  content_type: 'product',
                  value: plan.price,
                  currency: 'IDR',
                },
              });

              setTransactionPopUp(false);
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            <span>Lihat Detail</span>
          </Button>
        </Link>
      )}
    </div>
  );
};
