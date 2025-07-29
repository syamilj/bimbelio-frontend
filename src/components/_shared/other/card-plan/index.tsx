'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
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
import { Eye, Gift } from 'lucide-react';
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
  const {
    useAuth: { setShowAuth },
    setTransactionPopUp,
  } = useAppContext();

  const router = useRouter();

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
      <Card className="w-full max-w-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        {/* Header dengan badges */}
        <CardHeader className="relative">
          {/* Popular/Recommended badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-1">
            {/* {plan.isPopular && (
            <Badge className="bg-yellow-500 text-white shadow-lg">
              <Star
                size={12}
                className="mr-1"
              />
              Popular
            </Badge>
          )}
          {plan.isRecommended && (
            <Badge className="bg-green-500 text-white shadow-lg">
              <Crown
                size={12}
                className="mr-1"
              />
              Recommended
            </Badge>
          )} */}
          </div>

          {/* Discount badge */}
          {plan.originalPrice && getDiscountPercentage() > 0 && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-red-500 text-white shadow-lg">
                -{getDiscountPercentage()}%
              </Badge>
            </div>
          )}

          <div className="pt-8">
            <CardTitle className="text-xl font-bold text-center mb-2">
              {plan.name}
            </CardTitle>
            <CardDescription className="text-center text-sm text-gray-600 mb-4">
              {plan.description}
            </CardDescription>

            {/* Pricing */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div
                  className={cn(
                    'text-3xl font-bold text-gray-900',
                    discount && 'opacity-60 relative flex items-center',
                  )}
                >
                  {discount && (
                    <span className="absolute w-full h-[2px] bg-gray-600" />
                  )}
                  {formatPrice(plan.price)}
                </div>
                {discount && (
                  <div className="text-3xl font-bold text-gray-900">
                    {formatPrice(discount)}
                  </div>
                )}
              </div>
              {plan.originalPrice && plan.originalPrice > plan.price && (
                <div className="text-sm text-gray-500 line-through">
                  Harga normal: {formatPrice(plan.originalPrice)}
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger
                value="overview"
                className="text-xs"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="limitations"
                className="text-xs"
              >
                Limits
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="text-xs"
              >
                Features
              </TabsTrigger>
              <TabsTrigger
                value="benefits"
                className="text-xs"
              >
                Benefits
              </TabsTrigger>
            </TabsList>

            <div className="min-h-[300px]">
              <TabsContent value="overview">
                <RenderOverviewTab />
              </TabsContent>
              <TabsContent value="limitations">
                <RenderLimitationTab />
              </TabsContent>
              <TabsContent value="features">
                <RenderFeatureTab />
              </TabsContent>
              <TabsContent value="benefits">
                <RenderBenefitTab />
              </TabsContent>
            </div>
          </Tabs>

          <div className="mt-6 space-y-3">
            {!viewOnly && (
              <Link href={`/price/${plan.id}`}>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full px-4 border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-semibold transition-all duration-300 hover:shadow-lg group bg-transparent"
                  onClick={() => {
                    setTransactionPopUp(false);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Lihat Detail</span>
                </Button>
              </Link>
            )}
            {!viewOnly && (
              <DialogPayment plan={plan}>
                <Button
                  ref={buttonRef}
                  className="w-full"
                  size="lg"
                  // onClick={onClick}
                >
                  <Gift
                    size={16}
                    className="mr-2"
                  />
                  Pilih Plan Ini
                </Button>
              </DialogPayment>
            )}

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Upgrade atau downgrade kapan saja
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ProviderContext.Provider>
  );
}
