'use client';

import { useAppContext } from '@/components/provider/provider-app';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { CardPlan } from '@/components/_shared/other/card-plan';
import { CardPlanTopping } from '@/components/_shared/other/card-plan-coin';
import { PlanDataType } from '@/components/_shared/other/card-plan/_provider/types';
import { useGet } from '@/lib/fetch-helper/useGet';
import { Loader2Icon } from 'lucide-react';

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

  const { data: PricingData, isLoading } = useGet<PricingDataType>(
    '/plan/getAllPlanByWebCategory',
  );

  const topping = PricingData?.topping || [];

  return (
    <>
      <Dialog
        open={transactionPopUp}
        onOpenChange={setTransactionPopUp}
      >
        <DialogContent
          className="max-w-[95vw] h-[95vh] p-0"
          classOverlay="z-[10000]"
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
                  <span className="bg-gradient bg-clip-text text-transparent">
                    kamu
                  </span>
                </DialogTitle>
                <DialogDescription className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
                  Akses fitur premium untuk memaksimalkan potensi kelulusanmu
                </DialogDescription>
              </DialogHeader>

              <Tabs
                className="w-full"
                defaultValue="snbt"
              >
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-8 bg-[#e6f0ff] p-1 rounded-full">
                  {PricingData?.webSubCategory.map((ws) => (
                    <TabsTrigger
                      value={ws.webSubCategoryId}
                      className="rounded-full data-[state=active]:bg-main-default"
                    >
                      {ws.webSubCategoryName}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {PricingData?.webSubCategory.map((ws) => (
                  <TabsContent
                    value={ws.webSubCategoryId}
                    className="w-full"
                  >
                    <Tabs
                      defaultValue="coin"
                      className="w-full"
                    >
                      <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-3">
                        <TabsTrigger
                          value="bundle"
                          className="text-sm font-medium sm:text-base data-[state=active]:bg-main-default"
                        >
                          Bundle
                        </TabsTrigger>
                        <TabsTrigger
                          value="subscription"
                          className="text-sm font-medium sm:text-base data-[state=active]:bg-main-default"
                        >
                          Berlangganan
                        </TabsTrigger>
                        <TabsTrigger
                          value="coin"
                          className="text-sm font-medium sm:text-base data-[state=active]:bg-main-default"
                        >
                          Coin
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="bundle">
                        <div className="flex flex-col md:flex-row items-start md:justify-center gap-4 mx-auto flex-wrap">
                          {ws.bundles.map((bundle, i) => (
                            <CardPlan
                              key={i}
                              plan={bundle}
                              // onSelect={() => {
                              //   setPlanData(bundle);
                              //   setType('plan');
                              //   handlePackageSelect(bundle.id);
                              // }}
                            />
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="subscription">
                        <div className="flex flex-col md:flex-row items-start md:justify-center gap-4 mx-auto">
                          {ws.subscriptions.map((plan, i) => (
                            <CardPlan
                              key={i}
                              plan={plan}
                              // onSelect={() => {
                              //   setPlanData(plan);
                              //   setType('plan');
                              //   handlePackageSelect(plan.id);
                              // }}
                            />
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="coin">
                        <div className="flex flex-col md:flex-row items-start md:justify-center gap-4 mx-auto">
                          {topping.map((pack) => (
                            <CardPlanTopping
                              plan={pack}
                              key={pack.name}
                              // onSelect={() => {
                              //   setPlanData(pack);
                              //   setType('plan');
                              //   handlePackageSelect(pack.id);
                              // }}
                            />
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>
                ))}
              </Tabs>

              {/* <Tabs
                defaultValue="coin"
                className="w-full"
              >
                <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-3">
                  <TabsTrigger
                    value="bundle"
                    className="text-sm font-medium sm:text-base data-[state=active]:bg-main-default"
                  >
                    Bundle
                  </TabsTrigger>
                  <TabsTrigger
                    value="subscription"
                    className="text-sm font-medium sm:text-base data-[state=active]:bg-main-default"
                  >
                    Berlangganan
                  </TabsTrigger>
                  <TabsTrigger
                    value="coin"
                    className="text-sm font-medium sm:text-base data-[state=active]:bg-main-default"
                  >
                    Coin
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="premium"
                  className="space-y-8"
                >
                  <PlanSection
                    type={type}
                    setType={setType}
                    handlePackageSelect={handlePackageSelect}
                  />
                </TabsContent>

                <TabsContent value="bundle">
                  <div className="flex flex-col md:flex-row items-start md:justify-center gap-4 mx-auto flex-wrap">
                    {bundles.map((bundle, i) => (
                      <CardPricing
                        key={i}
                        data={bundle}
                        onSelect={() => {
                          setPlanData(bundle);
                          setType('plan');
                          handlePackageSelect(bundle.id);
                        }}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="subscription">
                  <div className="flex flex-col md:flex-row items-start md:justify-center gap-4 mx-auto">
                    {subscription.map((plan, i) => (
                      <CardPricing
                        key={i}
                        data={plan}
                        onSelect={() => {
                          setPlanData(plan);
                          setType('plan');
                          handlePackageSelect(plan.id);
                        }}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="coin">
                  <div className="flex flex-col md:flex-row items-start md:justify-center gap-4 mx-auto">
                    {topping.map((pack) => (
                      <CardTopping
                        data={pack}
                        key={pack.name}
                        onSelect={() => {
                          setPlanData(pack);
                          setType('plan');
                          handlePackageSelect(pack.id);
                        }}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs> */}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
