'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CheckCircle2, Eye, Gift, Sparkles, Star, Zap } from 'lucide-react';
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
}: {
  plan: PlanDataType;
  hideFeatures?: string[];
  viewOnly?: boolean;
  discount?: number;
  onClose?: () => void;
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

  const isCourse = plan.PlanSubscription.PlanFeature.some(
    (item) => item.type === 'COURSE',
  );
  const isDocument = plan.PlanSubscription.PlanFeature.some(
    (item) => item.type === 'DOCUMENT',
  );

  // Check if this is a popular/recommended plan
  const isPopular =
    plan.name.toLowerCase().includes('popular') ||
    plan.name.toLowerCase().includes('terpopuler');
  const isRecommended =
    plan.name.toLowerCase().includes('recommended') ||
    plan.name.toLowerCase().includes('direkomendasikan');

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
      <Card
        className={cn(
          'w-full max-w-md group relative overflow-hidden bg-white border border-gray-100 hover:border-gray-200 transition-colors duration-200',
          isRecommended && 'ring-2 ring-offset-4 shadow-lg',
          isPopular && 'shadow-lg border-gray-200',
        )}
        style={{
          borderColor: isRecommended ? mainColor : undefined,
          boxShadow: isPopular
            ? `0 4px 20px ${mainColor}15`
            : '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        {/* Top accent bar for recommended plans */}
        {isRecommended && (
          <div
            className="absolute top-0 left-0 w-full h-1"
            style={{
              background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
            }}
          />
        )}

        {/* Header dengan badges dan status */}
        <CardHeader className="relative pb-3">
          {/* Status badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-1 z-10">
            {isPopular && (
              <Badge
                className="bg-white text-black shadow-md hover:bg-white border"
                style={{
                  borderColor: mainColor,
                  color: mainColor,
                }}
              >
                <Star
                  size={12}
                  className="mr-1"
                />
                Popular
              </Badge>
            )}
            {isRecommended && (
              <Badge
                className="text-white shadow-md hover:opacity-90"
                style={{ backgroundColor: mainColor }}
              >
                <Sparkles
                  size={12}
                  className="mr-1"
                />
                Direkomendasikan
              </Badge>
            )}
          </div>

          {/* Discount badge */}
          {plan.originalPrice && getDiscountPercentage() > 0 && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-red-500 text-white shadow-lg hover:bg-red-600">
                <Zap
                  size={12}
                  className="mr-1"
                />
                -{getDiscountPercentage()}%
              </Badge>
            </div>
          )}

          <div className="pt-6">
            {/* Plan Name */}
            <CardTitle
              className="text-xl font-bold mb-2"
              style={{ color: mainColor }}
            >
              {plan.name}
            </CardTitle>

            {/* Plan Description */}
            <CardDescription className="text-sm text-gray-600 mb-4 leading-relaxed">
              {plan.description}
            </CardDescription>

            {/* Pricing Section - Redesigned */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                {/* Current Price */}
                <div
                  className={cn(
                    'text-3xl font-bold',
                    discount && 'opacity-60 relative',
                  )}
                  style={{ color: mainColor }}
                >
                  {discount && (
                    <span className="absolute w-full h-[2px] bg-gray-600 top-1/2" />
                  )}
                  {formatPrice(plan.price)}
                </div>

                {/* Discounted Price */}
                {discount && (
                  <div
                    className="text-3xl font-bold"
                    style={{ color: mainColor }}
                  >
                    {formatPrice(discount)}
                  </div>
                )}
              </div>

              {/* Original Price */}
              {plan.originalPrice && plan.originalPrice > plan.price && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(plan.originalPrice)}
                  </span>
                  <span
                    className="text-sm font-medium px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${mainColor}15`,
                      color: mainColor,
                    }}
                  >
                    Hemat {getDiscountPercentage()}%
                  </span>
                </div>
              )}

              {/* Duration Info */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2
                  size={16}
                  style={{ color: mainColor }}
                />
                <span>Akses selamanya</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4">
          {/* Modern Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-4 h-10 bg-gray-50 p-1 rounded-lg">
              <TabsTrigger
                value="overview"
                className="text-xs font-medium rounded-md data-[state=active]:shadow-sm transition-all"
                style={
                  {
                    '--tw-ring-color': `${mainColor}20`,
                  } as React.CSSProperties
                }
              >
                Ringkasan
              </TabsTrigger>
              <TabsTrigger
                value="limitations"
                className="text-xs font-medium rounded-md data-[state=active]:shadow-sm transition-all"
                style={
                  {
                    '--tw-ring-color': `${mainColor}20`,
                  } as React.CSSProperties
                }
              >
                Batas
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="text-xs font-medium rounded-md data-[state=active]:shadow-sm transition-all"
                style={
                  {
                    '--tw-ring-color': `${mainColor}20`,
                  } as React.CSSProperties
                }
              >
                Fitur
              </TabsTrigger>
              <TabsTrigger
                value="benefits"
                className="text-xs font-medium rounded-md data-[state=active]:shadow-sm transition-all"
                style={
                  {
                    '--tw-ring-color': `${mainColor}20`,
                  } as React.CSSProperties
                }
              >
                Benefit
              </TabsTrigger>
            </TabsList>

            {/* Tab Content with better styling */}
            <div
              className="min-h-[280px] rounded-lg border border-gray-100 p-4"
              style={{
                background: `linear-gradient(135deg, ${mainColor}02, ${secondaryColor}02)`,
              }}
            >
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

          {/* CTA Section - Redesigned for marketplace feel */}
          <div className="mt-6 space-y-3">
            {!viewOnly && (
              <Link href={`/price/${plan.id}`}>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-2 hover:shadow-md font-semibold transition-all duration-300 group"
                  style={{
                    borderColor: `${mainColor}30`,
                    color: mainColor,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = mainColor;
                    e.currentTarget.style.backgroundColor = `${mainColor}05`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${mainColor}30`;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onClick={() => {
                    setTransactionPopUp(false);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Lihat Detail Lengkap</span>
                </Button>
              </Link>
            )}

            {!viewOnly && (
              <DialogPayment plan={plan}>
                <Button
                  ref={buttonRef}
                  className="w-full shadow-md hover:shadow-lg font-semibold transition-all duration-300"
                  size="lg"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    border: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = `0 8px 25px ${mainColor}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <Gift
                    size={16}
                    className="mr-2"
                  />
                  Pilih Paket Ini
                </Button>
              </DialogPayment>
            )}

            {/* Trust indicator */}
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <CheckCircle2
                  size={12}
                  style={{ color: mainColor }}
                />
                Upgrade atau downgrade kapan saja
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ProviderContext.Provider>
  );
}
