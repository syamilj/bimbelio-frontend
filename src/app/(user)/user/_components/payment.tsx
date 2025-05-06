'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { FeatureLimitation } from '@/config/limitation';
import { cn, convertDaysToWords } from '@/lib/utils';
import { useEffect, useState, type ReactElement } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
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

import { useSession } from '@/components/provider/session-provider-auth';
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper';
import {
  Plan,
  PlanFeature,
  PlanLimitation,
  PlanSubscription,
  Pricing,
} from '@/types/database';
import {
  BarChart2Icon,
  BookOpenIcon,
  BrainIcon,
  CheckIcon,
  EyeIcon,
  Loader2Icon,
  RocketIcon,
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

  useEffect(() => {
    getGeneral('/pricing/getAllPricing', {
      setData: setPricing,
      setLoading: setPricingIsLoading,
    });
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

  const getPricing = (slug: string) => {
    if (!pricing) return '-';
    return `Rp${pricing
      .find((item) => item.slug === slug)
      ?.price.toLocaleString('id-ID', { style: 'decimal' })}`;
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
        <DialogContent className="max-w-[95vw] sm:max-w-[800px] p-0">
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
                  <span className="bg-gradient-to-r from-main to-white bg-clip-text text-transparent">
                    kamu
                  </span>
                </DialogTitle>
                <DialogDescription className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
                  Akses fitur premium untuk memaksimalkan potensi kelulusanmu
                </DialogDescription>
              </DialogHeader>

              <Tabs
                defaultValue="premium"
                className="w-full"
              >
                <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-2">
                  <TabsTrigger
                    value="premium"
                    className="text-sm font-medium sm:text-base"
                  >
                    Paket Premium
                  </TabsTrigger>
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
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        icon: BrainIcon,
                        title: 'Chat AI',
                        type: 'limitasi_chat',
                        amount: FeatureLimitation.premium.chat,
                      },
                      {
                        icon: EyeIcon,
                        title: 'Vision',
                        type: 'limitasi_vision',
                        amount: FeatureLimitation.premium.vision,
                      },
                      {
                        icon: BookOpenIcon,
                        title: 'Notes',
                        type: 'limitasi_notes',
                        amount: FeatureLimitation.premium.notes,
                      },
                      {
                        icon: BarChart2Icon,
                        title: 'Quiz',
                        type: 'limitasi_quiz',
                        amount: FeatureLimitation.premium.quiz,
                      },
                    ].map((item, i) => (
                      <TopUpFeatureCard
                        key={i}
                        icon={item.icon}
                        title={item.title}
                        amount={`+ ${item.amount}`}
                        price={getPricing(item.type)}
                        onClick={() => {
                          setType(item.type as PaymentPremium);
                          handlePackageSelect();
                        }}
                      />
                    ))}
                  </div>

                  <BundlePackageCard
                    price={getPricing('limitasi_all')}
                    features={[
                      {
                        amount: FeatureLimitation.premium.chat,
                        title: 'Chat AI',
                        icon: BrainIcon,
                      },
                      {
                        amount: FeatureLimitation.premium.notes,
                        title: 'Notes',
                        icon: BookOpenIcon,
                      },
                      {
                        amount: FeatureLimitation.premium.quiz,
                        title: 'Latihan Soal',
                        icon: BarChart2Icon,
                      },
                      {
                        amount: FeatureLimitation.premium.vision,
                        title: 'Vision',
                        icon: EyeIcon,
                      },
                    ]}
                    onSelect={() => {
                      setType('limitasi_all');
                      handlePackageSelect();
                    }}
                  />
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
