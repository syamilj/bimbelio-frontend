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
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import {
  Plan,
  PlanFeature,
  PlanLimitation,
  PlanSubscription,
  Pricing,
} from '@/types/database';
import {
  BarChart2Icon,
  BookOpen,
  BookOpenIcon,
  BrainIcon,
  CheckIcon,
  Eye,
  FileText,
  Loader2Icon,
  MessageSquare,
  PenTool,
  RocketIcon,
  Sparkles,
  StarIcon,
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
  features: string[] | undefined;
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

  const getData = async () => {
    await getGeneral('/plan/getAllPlanForPricingPage', {
      onSuccess({ data }) {
        setTopping(data.topping);
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

  const handlePayment = async (phoneNumber: string) => {
    if (type === '') return;
    try {
      const res = await addPayment({ telp: phoneNumber, type, planId });
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
          className="max-w-[95vw] sm:max-w-[800px] p-0"
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
                defaultValue="limitasi"
                className="w-full"
              >
                <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-1">
                  {/* <TabsTrigger
                    value="premium"
                    className="text-sm font-medium sm:text-base"
                  >
                    Paket Premium
                  </TabsTrigger> */}
                  <TabsTrigger
                    value="limitasi"
                    className="text-sm font-medium sm:text-base"
                  >
                    Top-up Fitur
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

                <TabsContent value="limitasi">
                  <div className="flex flex-col md:flex-row items-center md:justify-center gap-4 mx-auto">
                    {topping.map((pack) => (
                      <CardTopping
                        data={pack}
                        key={pack.name}
                        onSelect={() => {
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

      <ConfirmPhoneDialog
        isOpen={showPhoneConfirm}
        onClose={() => setShowPhoneConfirm(false)}
        onSubmit={handlePayment}
      />
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

function BundlePackageCard({
  price,
  features,
  onSelect,
}: {
  price: string;
  features: { amount: number; title: string; icon: any }[];
  onSelect: () => void;
}): ReactElement {
  return (
    <Card3D className="mt-6 overflow-hidden border-2 border-main">
      <CardHeader className="bg-gradient-to-r from-main to-white text-white p-6">
        <CardTitle className="text-xl flex items-center gap-2">
          <RocketIcon className="h-6 w-6" />
          Paket Bundling Hemat
        </CardTitle>
        <CardDescription className="text-white/80 text-sm">
          Dapatkan semua fitur dengan harga spesial
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {features.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm"
            >
              <div className="p-1 rounded-md bg-main/10 shrink-0">
                <item.icon className="h-4 w-4 text-main" />
              </div>
              <span>
                +{item.amount} {item.title}
              </span>
            </div>
          ))}
        </div>
        <Button
          className="w-full bg-main hover:bg-main/90 text-white text-lg h-auto py-3"
          onClick={onSelect}
        >
          {price}
        </Button>
      </CardContent>
    </Card3D>
  );
}

function ConfirmPhoneDialog({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phoneNumber: string) => Promise<void>;
}): ReactElement {
  const [loading, setLoading] = useState(false);
  const [telp, setTelp] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(telp);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-[425px] w-[95vw]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Konfirmasi Pembayaran
          </DialogTitle>
          <DialogDescription className="text-center">
            Harap isi nomor teleponmu untuk melanjutkan ke laman pembayaran.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Input
              type="tel"
              placeholder="Nomor Telepon"
              onChange={(e) => setTelp(e.target.value)}
              className="w-full"
              required
            />
            <p className="text-sm text-muted-foreground">
              *Nomor teleponmu dibutuhkan untuk menghubungi kamu jika terdapat
              kendala.
            </p>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading || telp.length === 0}
          >
            {loading ? (
              <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {loading ? 'Memproses...' : 'Bayar'}
          </Button>
        </form>
      </DialogContent>
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

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
};
