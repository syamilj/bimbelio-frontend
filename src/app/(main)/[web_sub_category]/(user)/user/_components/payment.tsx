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

import { EmptyPlan } from '@/components/_shared/empty/empty-plan';
import { CardPlan } from '@/components/_shared/other/card-plan';
import { PlanDataType } from '@/components/_shared/other/card-plan/_provider/types';
import { useGet } from '@/lib/fetch-helper/useGet';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2Icon } from 'lucide-react';
import { useEffect } from 'react';
import { PaymentFilterDropdown } from './PaymentFilterDropdown';
import { usePaymentFilters } from './usePaymentFilters';

type PricingDataType = {
  plans: PlanDataType[];
  topping: PlanDataType[];
  productCompare: {
    subscription: PlanDataType[];
    bundles: PlanDataType[];
    listCompare: string[];
  };
};

export function Payment() {
  const { transactionPopUp, setTransactionPopUp } = useAppContext();
  const { websiteSubCategory, webCategoryData } = useWebsiteSubCategory();

  const {
    data: PricingData,
    isLoading,
    error,
  } = useGet<PricingDataType>('/plan/getAllPlanByWebCategory');

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const categoryOptions =
    webCategoryData.length > 0 ? webCategoryData[0].WebsiteSubCategory : [];

  const filters = usePaymentFilters({ plans: PricingData?.plans });

  // Analytics tracking
  useEffect(() => {
    if (transactionPopUp && PricingData) {
      trackUnifiedEvent({
        eventName: 'ViewContent',
        customData: {
          content_name: 'Payment Dialog',
          content_type: 'pricing',
          content_id: 'payment_modal',
        },
      });
    }
  }, [transactionPopUp, PricingData]);

  if (error) {
    return (
      <Dialog
        open={transactionPopUp}
        onOpenChange={setTransactionPopUp}
      >
        <DialogContent className="mb:max-w-md">
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
    <Dialog
      open={transactionPopUp}
      onOpenChange={setTransactionPopUp}
    >
      <DialogContent
        className="md:max-w-[95vw] h-[95vh] p-0"
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
              <DialogTitle className="text-center text-3xl font-black leading-tight tracking-tight sm:text-4xl text-gray-900">
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
              <DialogDescription className="mx-auto mt-3 max-w-2xl text-base text-gray-500 sm:text-lg">
                Akses fitur premium untuk memaksimalkan potensi kelulusanmu
              </DialogDescription>
            </DialogHeader>

            <div className="w-full max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative z-20"
              >
                <PaymentFilterDropdown
                  filters={filters}
                  mainColor={mainColor}
                  secondaryColor={secondaryColor}
                  categoryOptions={categoryOptions}
                  resultCount={filters.filteredAndSortedPlans.length}
                />
              </motion.div>

              {filters.filteredAndSortedPlans.length === 0 ? (
                <EmptyPlan
                  type="bundle"
                  categoryName={'awda'}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {filters.filteredAndSortedPlans.map((bundle, i) => (
                    <CardPlan
                      key={i}
                      plan={bundle}
                      discount={bundle.discount}
                      classOverlay="z-[10001]"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
