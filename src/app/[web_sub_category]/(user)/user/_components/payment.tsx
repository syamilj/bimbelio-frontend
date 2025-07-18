'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { cn, convertDaysToWords } from '@/lib/utils';
import { useEffect, useState, type ReactElement } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Card3D } from '@/components/ui/card-3d';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toaster } from '@/components/ui/toaster';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Label } from '@/components/ui/label';
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import {
  getPriceByDiscountFixedAmount,
  getPriceByDiscountPercentage,
} from '@/lib/utils/currency';
import { IconArrowTwk } from '@/styles/icon';
import {
  Plan,
  PlanFeature,
  PlanLimitation,
  PlanSubscription,
  Pricing,
  Voucher,
} from '@/types/database';
import {
  ArrowRight,
  BarChart2Icon,
  BookOpen,
  BookOpenIcon,
  BrainIcon,
  Check,
  CheckIcon,
  Eye,
  FileText,
  Loader2,
  Loader2Icon,
  MessageSquare,
  PenTool,
  Phone,
  Search,
  Shield,
  Sparkles,
  StarIcon,
  Tag,
  UsersIcon,
  VideoIcon,
  ZapIcon,
} from 'lucide-react';

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

type PlanType = {
  id: string;
  tier: string;
  name: string;
  description: string;
  price: number;
  features:
    | {
        name: string;
        features: string[];
      }[]
    | undefined;
  timeline: string | null;
  coins:
    | ({
        name: string;
        total: number;
      } | null)[]
    | undefined;
  limitations: {
    Notes: string | null;
    Chat: string | null;
    Tryout: string | null;
    Quiz: string | null;
    Vision: string | null;
  };
  popular: boolean;
  buttonText: string;
  buttonVariant: 'outline';
  color: string;
  gradient: string;
};

export function Payment() {
  const { data: session } = useSession();
  const {
    transactionPopUp,
    setTransactionPopUp,
    setPagesSetting,
    setTransactionHistory,
  } = useAppContext();

  const [type, setType] = useState<PaymentPremium | ''>('');
  const [planData, setPlanData] = useState<PlanType | null>(null);
  const [showPhoneConfirm, setShowPhoneConfirm] = useState(false);

  // const addPayment = api.payment.addPayment.useMutation();

  const addPayment = async (payload: any) => {
    const data = await mutateGeneral('/payment/addPayment', {
      payload: { ...payload, userId: session?.user.id },
      type: 'post',
    });
    return data;
  };

  // const { data: pricing, isLoading: pricingIsLoading } =
  //   api.pricing.getAllPricing.useQuery(undefined, {
  //     refetchOnWindowFocus: false,
  //   });
  const [planId, setPlanId] = useState<string | null>(null);
  const [pricing, setPricing] = useState<Pricing[]>([]);
  const [pricingIsLoading, setPricingIsLoading] = useState<any>();

  const [topping, setTopping] = useState<PlanType[]>([]);
  const [subscription, setSubscription] = useState<PlanType[]>([]);
  const [bundles, setBundles] = useState<PlanType[]>([]);

  const getData = async () => {
    await getGeneral('/plan/getAllPlanForPricingPage', {
      onSuccess({ data }) {
        setTopping(data.topping);
        setSubscription(data.subscriptions);
        setBundles(data.bundles);
      },
    });
  };

  useEffect(() => {
    // getGeneral('/pricing/getAllPricing', {
    //   setData: setPricing,
    //   setLoading: setPricingIsLoading,
    // });
    getData();
  }, []);

  const handlePayment = async (
    phoneNumber: string,
    plan_website_sub_category_id?: string,
    voucherCode?: string,
  ) => {
    if (type === '') return;
    try {
      const res = await addPayment({
        telp: phoneNumber,
        type,
        planId,
        plan_website_sub_category_id,
        voucherCode,
      });
      window.snap.pay(`${res?.data.token}`, {
        onClose: () => {
          setTransactionPopUp(false);
          setPagesSetting('rt');
          setTransactionHistory(true);
        },
      });
    } catch (error) {
      toaster({
        title: 'Gagal',
        condition: 'warning',
        description: 'Coba lagi nanti!',
      });
    }
  };

  const handlePackageSelect = (planId?: string) => {
    if (planId) setPlanId(planId);
    setTransactionPopUp(false);
    setShowPhoneConfirm(true);
  };

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
          {pricingIsLoading && (
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
              </Tabs>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {planData && (
        <DialogPayment
          plan={planData}
          isOpen={showPhoneConfirm}
          onClose={() => setShowPhoneConfirm(false)}
          onSubmit={handlePayment}
        />
      )}
    </>
  );
}

const PlanSection = ({
  // type,
  setType,
  handlePackageSelect,
}: {
  type: PaymentPremium | '';
  setType: React.Dispatch<React.SetStateAction<PaymentPremium | ''>>;
  handlePackageSelect: (planId?: string) => void;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [plans, setPlans] = useState<
    (Plan & {
      PlanSubscription?: PlanSubscription & {
        PlanFeature: PlanFeature[];
      };
      PlanLimitation?: PlanLimitation;
    })[]
  >([]);

  useEffect(() => {
    getGeneral('/plan/getAllPlan', {
      setData: setPlans,
      setLoading: setIsLoading,
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2Icon className="h-8 w-8 animate-spin text-main" />
      </div>
    );
  }
  const getPricing = (pricing: number) => {
    if (!pricing) return '-';
    return `Rp${pricing.toLocaleString('id-ID', { style: 'decimal' })}`;
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        {plans.map((plan, i) => (
          <PremiumPackageCard
            key={i}
            title={plan.name}
            price={getPricing(plan.price)}
            duration={
              plan.PlanSubscription?.expireDays
                ? `/${convertDaysToWords(plan.PlanSubscription?.expireDays)}`
                : '-'
            }
            features={[
              'Unlimited Chat AI',
              'Unlimited Notes',
              '500 generate Latihan Soal',
              '300 aksi Vision',
              'Akses semua materi premium',
              'Konsultasi dengan tutor',
              'Analisis performa AI',
            ]}
            onSelect={() => {
              setType('plan');
              handlePackageSelect(plan.id);
            }}
            gradient="from-[#0095FF] to-[#0047AB]"
            recommended
          />
        ))}
        {/* <PremiumPackageCard
          title="Paket Pro"
          price={"10000"}
          duration="/3 bulan"
          features={[
            "Unlimited Chat AI",
            "Unlimited Notes",
            "500 generate Latihan Soal",
            "300 aksi Vision",
            "Akses semua materi premium",
            "Konsultasi dengan tutor",
            "Analisis performa AI",
          ]}
          onSelect={() => {
            // setType("3-month");
            // handlePackageSelect();
          }}
          gradient="from-[#0095FF] to-[#0047AB]"
          recommended
        />
        <PremiumPackageCard
          title="Paket Dasar"
          price={"1000"}
          duration="/bulan"
          features={[
            "500 pertanyaan Chat AI",
            "1.000 kata Notes",
            "200 generate Latihan Soal",
            "100 aksi Vision",
            "Akses materi dasar",
          ]}
          onSelect={() => {
            // setType("1-month");
            // handlePackageSelect();
          }}
          gradient="from-[#FF8C42] to-[#FF5C97]"
        /> */}
      </div>

      <FeaturesOverview />
    </>
  );
};

function PremiumPackageCard({
  title,
  price,
  duration,
  features,
  onSelect,
  gradient,
  recommended = false,
}: {
  title: string;
  price: string;
  duration: string;
  features: string[];
  onSelect: () => void;
  gradient: string;
  recommended?: boolean;
}): ReactElement {
  return (
    <Card3D
      className={cn(
        'group relative h-full overflow-hidden rounded-2xl border-2 transition-colors',
        recommended
          ? 'border-main shadow-lg'
          : 'border-border hover:border-main/50',
      )}
    >
      {recommended && (
        <div className="absolute -right-12 top-7 z-10 rotate-45 bg-main px-12 py-1.5 text-sm font-semibold text-white">
          Recommended
        </div>
      )}
      <div className="relative flex flex-col h-full">
        <CardHeader className="space-y-2 p-6">
          <CardTitle className="text-2xl font-bold sm:text-3xl">
            <span className={`bg-gradient bg-clip-text text-transparent`}>
              {title}
            </span>
          </CardTitle>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight sm:text-4xl">
              {price}
            </span>
            <span className="text-base text-muted-foreground">{duration}</span>
            {recommended && (
              <Badge
                variant="secondary"
                className="ml-2 bg-main/10 text-main"
              >
                Hemat 20%
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-4 p-6 pt-0">
          <ul className="space-y-3">
            {features.map((feature, i) => (
              <li
                key={i}
                className="flex items-start gap-3"
              >
                {recommended ? (
                  <StarIcon className="mt-0.5 h-5 w-5 shrink-0 text-main" />
                ) : (
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-main" />
                )}
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="p-6">
          <Button
            size="lg"
            className={cn(
              'w-full text-base font-medium',
              recommended
                ? 'bg-main text-white hover:bg-main/90'
                : `bg-gradient-to-r ${gradient} text-white hover:opacity-90`,
            )}
            onClick={onSelect}
          >
            Pilih Paket
          </Button>
        </CardFooter>
      </div>
    </Card3D>
  );
}

function FeaturesOverview(): ReactElement {
  const features = [
    {
      icon: BrainIcon,
      title: 'AI Learning Assistant',
      desc: 'Belajar dengan bantuan AI 24/7',
      gradient: 'from-blue-500 to-indigo-500',
    },
    {
      icon: BookOpenIcon,
      title: 'Materi Premium',
      desc: 'Akses ke semua materi',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: VideoIcon,
      title: 'Video Pembelajaran',
      desc: 'Video penjelasan detail',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: UsersIcon,
      title: 'Konsultasi Tutor',
      desc: 'Tanya jawab dengan ahli',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: BarChart2Icon,
      title: 'Analisis Performa',
      desc: 'Pantau perkembanganmu',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: ZapIcon,
      title: 'Latihan Interaktif',
      desc: 'Latihan soal adaptif',
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <section className="rounded-2xl bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm sm:p-8">
      <h3 className="mb-6 text-xl font-semibold">Yang kamu dapatkan:</h3>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        {features.map((item, i) => (
          <Card3D
            key={i}
            className="group overflow-hidden border transition-colors hover:border-main/50"
          >
            <CardContent className="p-4 text-center">
              <div
                className={cn(
                  'mx-auto mb-4 w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white transition-transform group-hover:scale-110',
                  item.gradient,
                )}
              >
                <item.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </CardContent>
          </Card3D>
        ))}
      </div>
    </section>
  );
}

function TopUpFeatureCard({
  icon: Icon,
  title,
  amount,
  price,
  onClick,
}: {
  icon: any;
  title: string;
  amount: string;
  price: string;
  onClick: () => void;
}): ReactElement {
  return (
    <Card3D className="overflow-hidden h-full border-2 border-main">
      <CardHeader className="p-4 bg-gradient-to-br from-background to-background/80">
        <div className="flex items-center justify-center gap-2">
          <div className="p-2 w-fit rounded-lg bg-main/10">
            <Icon className="h-5 w-5 text-main" />
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-3">
        <Button
          variant="outline"
          className="w-full h-auto p-3 flex justify-between items-center bg-main hover:bg-main/90 text-white hover:text-white"
          onClick={onClick}
        >
          <span>{amount}</span>
          <span className="font-semibold">{price}</span>
        </Button>
      </CardContent>
    </Card3D>
  );
}

function DialogPayment({
  plan,
  isOpen,
  onClose,
  onSubmit,
}: {
  plan: PlanType;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    phoneNumber: string,
    plan_website_sub_category_id?: string,
    voucherCode?: string,
  ) => Promise<void>;
}): ReactElement {
  const { websiteSubCategory, webCategoryData } = useWebsiteSubCategory();
  const [step, setStep] = useState<'web_choice' | 'telp'>('web_choice');
  const [loading, setLoading] = useState(false);

  const [telp, setTelp] = useState('');
  const [webSubCatId, setWebSubCatId] = useState<string>('');
  const [voucherCode, setVoucherCode] = useState('');

  const [discountPrice, setDiscountPrice] = useState<number | null>(null);

  console.log({ websiteSubCategory, webCategoryData });

  const {
    mutate: checkVoucherCode,
    success,
    isLoading,
  } = useMutation<Voucher>('/voucher/checkVoucherCode', 'post', {
    onSuccess({ data }) {
      if (!data) return;
      const type = data.type;
      const discount = data.discount;
      if (type === 'Fixed_Amount') {
        setDiscountPrice(getPriceByDiscountFixedAmount(plan.price, discount));
      } else if (type === 'Percentage') {
        setDiscountPrice(getPriceByDiscountPercentage(plan.price, discount));
      }
    },
  });

  const applyVoucherCode = async (planId: string) => {
    await checkVoucherCode({ payload: { voucherCode, planId } });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(telp, webSubCatId, voucherCode);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setStep('web_choice');
          setDiscountPrice(null);
          setTelp('');
          setVoucherCode('');
        }
        onClose();
      }}
    >
      {step === 'web_choice' && (
        <DialogContent className="max-w-xl w-full sm:space-x-2 p-0 overflow-hidden bg-background border shadow-xl">
          <DialogHeader className="relative p-6 pb-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold">
                  Pilih Kategori Bimbelio
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Pilih kategori yang sesuai dengan tujuan belajarmu
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto">
            {webCategoryData.length > 0 ? (
              <div className="p-4 space-y-6">
                {webCategoryData.map((cat) => (
                  <div
                    key={cat.id}
                    className="space-y-3"
                  >
                    {/* Category Header */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-1 h-6 rounded-full"
                        style={{ backgroundColor: cat.main_color || '#0096FF' }}
                      />
                      <h3 className="font-bold text-lg text-foreground">
                        {cat.name}
                      </h3>
                    </div>

                    {/* Subcategories Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-4">
                      {cat.WebsiteSubCategory.map((sub) => {
                        const isSelected = webSubCatId === sub.id;

                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setWebSubCatId(sub.id);
                            }}
                            className={cn(
                              'group relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300 hover:shadow-md border',
                              isSelected
                                ? 'border-transparent shadow-lg scale-[1.02]'
                                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700',
                            )}
                            style={{
                              backgroundColor: isSelected
                                ? sub.main_color
                                : 'transparent',
                            }}
                          >
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-5">
                              <div
                                className="w-full h-full"
                                style={{
                                  backgroundColor: isSelected
                                    ? 'white'
                                    : sub.main_color,
                                }}
                              />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 flex items-center justify-between">
                              <div className="flex-1">
                                <h4
                                  className={cn(
                                    'font-semibold text-sm transition-colors',
                                    isSelected
                                      ? 'text-white'
                                      : 'text-foreground group-hover:text-foreground',
                                  )}
                                >
                                  {sub.name}
                                </h4>
                                <p
                                  className={cn(
                                    'text-xs mt-1 transition-colors',
                                    isSelected
                                      ? 'text-white/80'
                                      : 'text-muted-foreground',
                                  )}
                                >
                                  Kategori pembelajaran terbaik
                                </p>
                              </div>

                              {/* Selection Indicator */}
                              <div
                                className={cn(
                                  'flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-200',
                                  isSelected
                                    ? 'bg-white border-white'
                                    : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400',
                                )}
                              >
                                {isSelected && (
                                  <Check
                                    className="w-3 h-3 text-current"
                                    style={{ color: sub.main_color }}
                                  />
                                )}
                              </div>
                            </div>

                            {/* Hover Effect */}
                            <div
                              className={cn(
                                'absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity',
                                !isSelected && 'bg-current',
                              )}
                              style={{ color: sub.main_color }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Search className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Tidak ada hasil</h3>
                <p className="text-muted-foreground text-sm">
                  Tidak ada kategori yang sesuai dengan pencarian Anda
                </p>
              </div>
            )}
          </div>

          <div className="flex w-full justify-end items-center px-8">
            <Button
              className="items-center justify-center gap-2 bg-main-default hover:bg-main-default/90"
              onClick={() => {
                if (webSubCatId.length == 0) {
                  toaster({
                    title: 'Upss',
                    description: 'Pilih category yang diinginkan',
                    condition: 'warning',
                    duration: 2000,
                  });
                  return;
                }
                setStep('telp');
              }}
            >
              Selanjutnya
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-muted/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>💡 Kategori dapat diubah sewaktu-waktu</span>
              <span>
                {webCategoryData.reduce(
                  (acc, cat) => acc + cat.WebsiteSubCategory.length,
                  0,
                )}{' '}
                kategori tersedia
              </span>
            </div>
          </div>
        </DialogContent>
      )}
      {step === 'telp' && (
        <DialogContent className="sm:max-w-6xl w-[95vw] max-h-[90vh] p-0">
          <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
            <DialogHeader className="text-center mb-8">
              <DialogTitle className="text-3xl font-bold text-main-default">
                Konfirmasi Pembayaran
              </DialogTitle>
              <DialogDescription className="text-lg text-gray-600 mt-2">
                Harap isi nomor teleponmu untuk melanjutkan ke laman pembayaran
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col-reverse lg:grid grid-cols-2 gap-8 max-w-5xl mx-auto"
            >
              {/* Plan Card */}
              <div className="flex justify-center lg:justify-start lg:border-r lg:max-h-[70vh] w-full lg:w-auto">
                <div className="w-full lg:overflow-y-auto px-8 border-0 py-4">
                  <Card
                    className={`flex w-full flex-col rounded-2xl overflow-hidden border-0 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      plan.popular ? 'shadow-xl ring-2 ring-[#0066ff]' : ''
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 transform translate-x-0 -translate-y-0 z-10">
                        <Badge className="bg-[#0066ff] text-white font-medium px-3 py-1 shadow-md">
                          <Sparkles className="h-3.5 w-3.5 mr-1" /> Populer
                        </Badge>
                      </div>
                    )}
                    <div className="h-3 bg-gradient-default"></div>
                    <CardHeader className="pb-0 pt-6">
                      <CardTitle className="text-[#0a2540] text-2xl">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="text-[#64748b]">
                        {plan.description}
                      </CardDescription>
                      <div className="flex gap-4">
                        <div
                          className={cn(
                            'mt-4 relative flex items-center w-fit px-2 justify-center',
                            discountPrice && 'opacity-60',
                          )}
                        >
                          {discountPrice && (
                            <span className="absolute w-full h-[2px] bg-gray-600" />
                          )}
                          <span className="text-4xl font-bold text-[#0a2540]">
                            {formatPrice(plan.price)}
                          </span>
                          <span className="text-[#64748b] ml-1">
                            /{plan.timeline}
                          </span>
                        </div>
                        {discountPrice && (
                          <div
                            className={cn(
                              'mt-4 relative flex items-center w-fit',
                            )}
                          >
                            <span className="text-4xl font-bold text-[#0a2540]">
                              {formatPrice(discountPrice)}
                            </span>
                            <span className="text-[#64748b] ml-1">
                              /{plan.timeline}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 pt-6">
                      {plan.coins && (
                        <div
                          className="mb-6 p-5 rounded-xl relative overflow-hidden"
                          style={{
                            background: `linear-gradient(to right, ${websiteSubCategory?.main_color}08, ${websiteSubCategory?.main_color}15)`,
                            boxShadow: `0 4px 12px ${websiteSubCategory?.main_color}10`,
                          }}
                        >
                          <div
                            className="absolute top-0 right-0 w-24 h-24 opacity-10"
                            style={{
                              background: `radial-gradient(circle, ${websiteSubCategory?.main_color} 0%, transparent 70%)`,
                              transform: 'translate(30%, -30%)',
                            }}
                          ></div>
                          <div className="mb-3">
                            <span className="text-sm font-medium text-main-default">
                              Bonus Coin
                            </span>
                          </div>{' '}
                          <div className="grid grid-cols-5 gap-2">
                            {plan.coins.map((coin) => {
                              const item = {
                                icon:
                                  coin?.name === 'chat'
                                    ? MessageSquare
                                    : coin?.name === 'notes'
                                      ? PenTool
                                      : coin?.name === 'quiz'
                                        ? BookOpen
                                        : coin?.name === 'tryout'
                                          ? FileText
                                          : coin?.name === 'vision'
                                            ? Eye
                                            : PenTool,
                              };
                              return (
                                <div
                                  className="flex flex-col items-center"
                                  key={coin?.name}
                                >
                                  <item.icon className="h-5 w-5 mb-1 text-main-default" />
                                  <span className="text-xs text-[#4a5568] font-medium">
                                    {coin?.name}
                                  </span>
                                  <span className="text-sm font-bold text-main-default">
                                    {coin?.total}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="space-y-3 px-1">
                        {plan.features?.map((feature, index) => (
                          <div
                            key={index}
                            className="space-y-3 px-1"
                          >
                            <div
                              key={feature.name}
                              className="flex items-start"
                            >
                              <div
                                className="h-5 w-5 rounded-full flex items-center justify-center mr-3 mt-0.5 shrink-0 bg-gradient-default"
                                // style={{
                                //   boxShadow: `0 2px 4px ${websiteSubCategory?.main_color}30`,
                                // }}
                              >
                                <Check className="h-3 w-3 text-white" />
                              </div>
                              <span className="text-main-default text-sm font-semibold">
                                {feature.name}
                              </span>
                            </div>
                            <div className="space-y-3">
                              {feature.features.map((detail) => (
                                <div
                                  key={detail}
                                  className="flex items-start"
                                >
                                  {/* <Undo className="h-3 w-3 text-white" /> */}
                                  <IconArrowTwk
                                    w={15}
                                    className="text-main-default mr-2 ml-2"
                                  />
                                  <span className="text-main-default  text-sm">
                                    {detail}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Form Section */}
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50">
                  <div className="flex items-center mb-6">
                    <Shield className="h-6 w-6 text-green-500 mr-3" />
                    <span className="text-lg font-semibold text-gray-800">
                      Informasi Pembayaran
                    </span>
                  </div>

                  <div className="space-y-6">
                    {/* Phone Number Input */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium text-gray-700 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        Nomor Telepon
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        type="tel"
                        placeholder="Masukkan nomor telepon"
                        value={telp}
                        onChange={(e) => setTelp(e.target.value)}
                        className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors"
                        required
                      />
                      <div className="flex items-start">
                        <div className="h-2 w-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          Nomor teleponmu dibutuhkan untuk menghubungi kamu jika
                          terdapat kendala
                        </p>
                      </div>
                    </div>

                    {/* Voucher Code Input */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium text-gray-700 flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-gray-500" />
                        Kode Voucher
                        <span className="text-gray-400 text-sm ml-2">
                          (opsional)
                        </span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Masukkan kode voucher"
                          value={voucherCode}
                          disabled={!!discountPrice}
                          onChange={(e) => setVoucherCode(e.target.value)}
                          className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="h-12 px-6 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl font-medium bg-transparent"
                          onClick={() => {
                            if (!discountPrice) {
                              applyVoucherCode(plan.id);
                            } else {
                              setDiscountPrice(null);
                            }
                          }}
                          disabled={isLoading || !voucherCode.trim()}
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : discountPrice ? (
                            'Ubah'
                          ) : (
                            'Terapkan'
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-semibold bg-main-default hover:bg-main-default/90 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={loading || telp.length === 0}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-3" />
                      Memproses Pembayaran...
                    </>
                  ) : (
                    <>
                      Lanjutkan Pembayaran
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Dengan melanjutkan, kamu menyetujui{' '}
                    <a
                      href="#"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Syarat & Ketentuan
                    </a>{' '}
                    kami
                  </p>
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}

type CardProps = {
  data: PlanType;
  onSelect?: () => void;
};

const CardTopping = ({ data, onSelect }: CardProps) => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  return (
    <Card
      key={data.name}
      className={`rounded-2xl w-full max-w-[285px] overflow-hidden border-0 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        data.popular ? 'shadow-xl ring-2 ring-[#0066ff]' : ''
      }`}
    >
      {data.popular && (
        <div className="absolute top-0 right-0 transform translate-x-0 -translate-y-0 z-10">
          <Badge className="bg-[#0066ff] text-white font-medium px-3 py-1 shadow-md">
            <Sparkles className="h-3.5 w-3.5 mr-1" /> Best Value
          </Badge>
        </div>
      )}
      <div className="h-3 bg-gradient-default"></div>
      <CardHeader className="pt-6">
        <CardTitle className="text-xl text-[#0a2540] flex items-center">
          <div className="h-8 w-8 rounded-full mr-2 flex items-center justify-center shadow-sm bg-gradient-default">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="white"
                strokeWidth="2"
              />
              <circle
                cx="12"
                cy="12"
                r="6"
                fill="white"
              />
            </svg>
          </div>
          {data.name}
        </CardTitle>
        {data.coins && (
          <div
            className="mt-4 p-4 rounded-xl border border-main-default/10"
            style={{
              background: `linear-gradient(to right, ${websiteSubCategory?.main_color}08, ${websiteSubCategory?.main_color}15)`,
              boxShadow: `0 4px 12px ${websiteSubCategory?.main_color}10`,
            }}
          >
            <div className="grid grid-cols-5 gap-2">
              {data.coins.map((coin) => {
                const item = {
                  icon:
                    coin?.name === 'chat'
                      ? MessageSquare
                      : coin?.name === 'notes'
                        ? PenTool
                        : coin?.name === 'quiz'
                          ? BookOpen
                          : coin?.name === 'tryout'
                            ? FileText
                            : coin?.name === 'vision'
                              ? Eye
                              : PenTool,
                };
                return (
                  <div
                    className="flex flex-col items-center"
                    key={coin?.name}
                  >
                    <item.icon className="h-5 w-5 mb-1 text-main-default" />
                    <span className="text-xs text-[#4a5568] font-medium">
                      {coin?.name}
                    </span>
                    <span className="text-sm font-bold text-main-default">
                      {coin?.total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[#0a2540]">
          {formatPrice(data.price)}
        </div>
        <p className="text-[#64748b] mt-1">Sekali bayar</p>
      </CardContent>
      <CardFooter className="pb-6">
        <Button
          variant="outline"
          className="w-full rounded-xl h-12 font-medium shadow-md transition-all duration-300 hover:shadow-lg bg-gradient-default text-white hover:text-white hover:opacity-85"
          onClick={() => onSelect && onSelect()}
        >
          Beli Sekarang
        </Button>
      </CardFooter>
    </Card>
  );
};

const CardPricing = ({ data, onSelect }: CardProps) => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  return (
    <Card
      key={data.name}
      className={`flex w-full max-w-[340px] min-w-[300px] flex-col rounded-2xl overflow-hidden border-0 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        data.popular ? 'shadow-xl ring-2 ring-[#0066ff]' : ''
      }`}
    >
      {data.popular && (
        <div className="absolute top-0 right-0 transform translate-x-0 -translate-y-0 z-10">
          <Badge className="bg-[#0066ff] text-white font-medium px-3 py-1 shadow-md">
            <Sparkles className="h-3.5 w-3.5 mr-1" /> Populer
          </Badge>
        </div>
      )}
      <div className="h-3 bg-gradient-default"></div>
      <CardHeader className="pb-0 pt-6">
        <CardTitle className="text-[#0a2540] text-2xl">{data.name}</CardTitle>
        <CardDescription className="text-[#64748b]">
          {data.description}
        </CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold text-[#0a2540]">
            {formatPrice(data.price)}
          </span>
          <span className="text-[#64748b] ml-1">/{data.timeline}</span>
          {/* {billingCycle === "yearly" && (
            <div className="text-sm text-[#64748b] mt-1">
              Ditagih {formatPrice(data.price.yearly)} per tahun
            </div>
          )} */}
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-6">
        {data.coins && (
          <div
            className="mb-6 p-5 rounded-xl relative overflow-hidden"
            style={{
              background: `linear-gradient(to right, ${websiteSubCategory?.main_color}08, ${websiteSubCategory?.main_color}15)`,
              boxShadow: `0 4px 12px ${websiteSubCategory?.main_color}10`,
            }}
          >
            <div
              className="absolute top-0 right-0 w-24 h-24 opacity-10"
              style={{
                background: `radial-gradient(circle, ${websiteSubCategory?.main_color} 0%, transparent 70%)`,
                transform: 'translate(30%, -30%)',
              }}
            ></div>
            <div className="mb-3">
              <span className="text-sm font-medium text-main-default">
                Bonus Coin
              </span>
            </div>{' '}
            <div className="grid grid-cols-5 gap-2">
              {data.coins.map((coin) => {
                const item = {
                  icon:
                    coin?.name === 'chat'
                      ? MessageSquare
                      : coin?.name === 'notes'
                        ? PenTool
                        : coin?.name === 'quiz'
                          ? BookOpen
                          : coin?.name === 'tryout'
                            ? FileText
                            : coin?.name === 'vision'
                              ? Eye
                              : PenTool,
                };
                return (
                  <div
                    className="flex flex-col items-center"
                    key={coin?.name}
                  >
                    <item.icon className="h-5 w-5 mb-1 text-main-default" />
                    <span className="text-xs text-[#4a5568] font-medium">
                      {coin?.name}
                    </span>
                    <span className="text-sm font-bold text-main-default">
                      {coin?.total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-3 px-1">
          {data.features?.map((feature, index) => (
            <div
              key={index}
              className="space-y-3 px-1"
            >
              <div
                key={feature.name}
                className="flex items-start"
              >
                <div
                  className="h-5 w-5 rounded-full flex items-center justify-center mr-3 mt-0.5 shrink-0 bg-gradient-default"
                  // style={{
                  //   boxShadow: `0 2px 4px ${websiteSubCategory?.main_color}30`,
                  // }}
                >
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-main-default text-sm font-semibold">
                  {feature.name}
                </span>
              </div>
              <div className="space-y-3">
                {feature.features.map((detail) => (
                  <div
                    key={detail}
                    className="flex items-start"
                  >
                    {/* <Undo className="h-3 w-3 text-white" /> */}
                    <IconArrowTwk
                      w={15}
                      className="text-main-default mr-2 ml-2"
                    />
                    <span className="text-main-default  text-sm">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-6">
        <Button
          variant={'outline'}
          className="w-full rounded-xl h-12 font-medium shadow-md transition-all duration-300 hover:shadow-lg bg-gradient-default text-white hover:text-white hover:opacity-85"
          onClick={() => onSelect && onSelect()}
        >
          Mulai Berlangganan
        </Button>
      </CardFooter>
    </Card>
  );
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
};
