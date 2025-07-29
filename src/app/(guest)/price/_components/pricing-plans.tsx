'use client';
import { CardPlan } from '@/components/_shared/other/card-plan';
import { CardPlanTopping } from '@/components/_shared/other/card-plan-coin';
import { PlanDataType } from '@/components/_shared/other/card-plan/_provider/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGet } from '@/lib/fetch-helper/useGet';

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
  productCompare?: {
    subscription: PlanType[];
    bundles: PlanType[];
    listCompare: string[];
  };
};

export default function PricingPlans() {
  const { data: PricingData } = useGet<PricingDataType>(
    '/plan/getAllPlanByWebCategory',
  );

  const topping = PricingData?.topping || [];

  return (
    <div className="space-y-16">
      <div className="text-center mb-16">
        <div className="inline-block bg-main-default/10 text-main-default rounded-full px-4 py-1 text-sm font-medium mb-4">
          Pilih Paket Terbaik
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 text-[#0a2540]">
          Sudah Siap Mulai Belajar?
        </h1>
        <p className="text-xl text-[#4a5568] max-w-2xl mx-auto">
          Pilih paket yang sesuai dengan kebutuhanmu dan mulai perjalanan
          belajar bersama Bimbelio
        </p>
      </div>
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
            {/* {ws.webSubCategoryName} */}
            <Tabs
              defaultValue="bundle"
              className="w-full"
            >
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-[#e6f0ff] p-1 rounded-full">
                <TabsTrigger
                  value="bundle"
                  className="rounded-full data-[state=active]:bg-main-default"
                >
                  Paket Bundle
                </TabsTrigger>
                <TabsTrigger
                  value="subscription"
                  className="rounded-full data-[state=active]:bg-main-default"
                >
                  Paket Berlangganan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="subscription">
                <div className="flex justify-center gap-4 mx-auto flex-wrap">
                  {ws.subscriptions.map((plan, i) => (
                    <CardPlan
                      key={i}
                      plan={plan}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="bundle">
                <div className="flex justify-center gap-4 mx-auto flex-wrap">
                  {ws.bundles.map((bundle, i) => (
                    <CardPlan
                      key={i}
                      plan={bundle}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        ))}
      </Tabs>
      <div className="mt-0">
        <div className="text-center mb-8">
          <div className="inline-block bg-[#e6f0ff] text-[#0066ff] rounded-full px-4 py-1 text-sm font-medium mb-4">
            Tambah Coin
          </div>
          <h2 className="text-3xl font-bold text-[#0a2540] mb-4">
            Paket Coin Tambahan
          </h2>
          <p className="text-[#4a5568] max-w-2xl mx-auto">
            Tambah coin untuk mengakses lebih banyak fitur seperti notes, chat,
            tryout, quiz, dan vision
          </p>
        </div>

        <div className="flex justify-center gap-4 mx-auto flex-wrap">
          {topping.map((pack) => (
            <CardPlanTopping
              plan={pack}
              key={pack.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
