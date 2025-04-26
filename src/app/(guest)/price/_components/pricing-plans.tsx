"use client";

import { ReactElement, useEffect, useState } from "react";
import { Check, HelpCircle, Loader2Icon, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenTool, MessageSquare, BookOpen, FileText, Eye } from "lucide-react";
import {
  Plan,
  PlanFeature,
  PlanLimitation,
  PlanSubscription,
} from "@/types/database";
import { getGeneral, mutateGeneral } from "@/lib/fetch-helper";
import { useSession } from "@/components/provider/session-provider-auth";
import { useGuest } from "@/components/layout/layoutGuest";
import { useAppContext } from "@/components/provider/provider-app";
import { toaster } from "@/components/ui/toaster";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";

// type PlanType = {
//   name: string;
//   description: string;
//   price: {
//     monthly: number;
//     yearly: number;
//   };
//   features: string[];
//   coins: null | {
//     Notes: number;
//     Chat: number;
//     Quiz: number;
//     Tryout: number;
//     Vision: number;
//   };
//   limitations: {
//     Notes: string;
//     Chat: string;
//     Tryout: string;
//     Quiz: string;
//     Vision: string;
//   } | null;
//   popular: boolean;
//   buttonText: string;
//   buttonVariant: "outline" | "default";
//   color: string;
//   gradient: string;
// };

// type PlanType = Plan & {
//   PlanSubscription?: PlanSubscription & {
//     PlanFeature: PlanFeature[];
//   };
//   PlanLimitation?: PlanLimitation;
// };

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
  buttonVariant: "outline";
  color: string;
  gradient: string;
};

const coinColors = {
  Notes: "#3385ff",
  Chat: "#0066ff",
  Quiz: "#0099ff",
  Tryout: "#0052cc",
  Vision: "#00b8ff",
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
};

type PaymentPremium =
  | "1-month"
  | "3-month"
  | "limitasi_chat"
  | "limitasi_notes"
  | "limitasi_vision"
  | "limitasi_quiz"
  | "limitasi_all"
  | "tryout_unlock"
  | "plan";

export default function PricingPlans() {
  const { setShowAuth } = useGuest();
  const { data: session } = useSession();

  const [subscription, setSubscription] = useState<PlanType[]>([]);
  const [bundles, setBundles] = useState<PlanType[]>([]);
  const [topping, setTopping] = useState<PlanType[]>([]);

  const [productCompare, setProductCompare] = useState<{
    subscription: PlanType[];
    bundles: PlanType[];
    listCompare: string[];
  }>();

  const { setPagesSetting, setTransactionHistory } = useAppContext();

  const getData = async () => {
    await getGeneral("/plan/getAllPlanForPricingPage", {
      onSuccess({ message, status, data }) {
        setSubscription(data.subscriptions);
        setBundles(data.bundles);
        setTopping(data.topping);
        setProductCompare(data.productCompare);
      },
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const [planId, setPlanId] = useState<string | null>(null);
  const [type, setType] = useState<"limit" | "plan" | "">("");

  const [showPhoneConfirm, setShowPhoneConfirm] = useState(false);

  const handlePackageSelect = (planId?: string) => {
    if (!session) {
      setShowAuth((prev) => ({ ...prev, login: true }));
      return;
    }
    if (planId) setPlanId(planId);
    setShowPhoneConfirm(true);
  };

  const addPayment = async (payload: any) => {
    const res = await mutateGeneral("/payment/addPayment", {
      payload: { ...payload, userId: session?.user.id },
      type: "post",
    });
    return res;
  };

  const handlePayment = async (phoneNumber: string) => {
    if (type === "") return;
    try {
      const res = await addPayment({ telp: phoneNumber, type, planId });
      window.snap.pay(`${res?.data.token}`, {
        onClose: () => {
          setPagesSetting("rt");
          setTransactionHistory(true);
        },
      });
    } catch (error) {
      toaster({
        title: "Gagal",
        condition: "warning",
        description: "Coba lagi nanti!",
      });
    }
  };

  return (
    <div className="space-y-16">
      <ConfirmPhoneDialog
        isOpen={showPhoneConfirm}
        onClose={() => setShowPhoneConfirm(false)}
        onSubmit={handlePayment}
      />
      <div className="text-center mb-16">
        <div className="inline-block bg-main/10 text-main rounded-full px-4 py-1 text-sm font-medium mb-4">
          Pilih Paket Terbaik
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 text-[#0a2540]">
          Sudah Siap Mulai Belajar?
        </h1>
        <p className="text-xl text-[#4a5568] max-w-2xl mx-auto">
          Pilih paket yang sesuai dengan kebutuhanmu dan mulai perjalanan
          belajar bersama TutorSNBT
        </p>
      </div>
      <Tabs defaultValue="bundle" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-[#e6f0ff] p-1 rounded-full">
          <TabsTrigger value="bundle" className="rounded-full">
            Paket Bundle
          </TabsTrigger>
          <TabsTrigger value="subscription" className="rounded-full">
            Paket Berlangganan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscription">
          <div className="flex justify-center gap-4 mx-auto">
            {subscription.map((plan, i) => (
              <CardPricing key={i} data={plan} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bundle">
          <div className="flex justify-center gap-4 mx-auto">
            {bundles.map((bundle, i) => (
              <CardPricing
                key={i}
                data={bundle}
                onSelect={() => {
                  setType("plan");
                  handlePackageSelect(bundle.id);
                }}
              />
            ))}
          </div>
        </TabsContent>
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

        <div className="flex justify-center gap-4 mx-auto">
          {topping.map((pack) => (
            <CardTopping
              data={pack}
              key={pack.name}
              onSelect={() => {
                setType("plan");
                handlePackageSelect(pack.id);
              }}
            />
          ))}
        </div>
      </div>

      {/* <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-block bg-[#e6f0ff] text-[#0066ff] rounded-full px-4 py-1 text-sm font-medium mb-4">
            Perbandingan
          </div>
          <h2 className="text-3xl font-bold text-[#0a2540] mb-4">
            Perbandingan Biaya Coin per Fitur
          </h2>
          <p className="text-[#4a5568] max-w-2xl mx-auto">
            Bandingkan biaya coin untuk setiap fitur di berbagai paket
            berlangganan
          </p>
        </div>

        {productCompare && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#e2e8f0]">
                  <th className="text-left py-4 px-4 text-[#0a2540] font-medium">
                    Fitur
                  </th>
                  {productCompare.subscription.map((plan) => (
                    <th key={plan.name} className="text-center py-4 px-4">
                      <div className="font-medium text-[#0a2540]  whitespace-nowrap">
                        {plan.name}
                      </div>
                      <div
                        className="text-xs font-normal mt-1 inline-block px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${plan.color}15`,
                          color: plan.color,
                        }}
                      >
                        {plan.tier}
                      </div>
                    </th>
                  ))}
                  {productCompare.bundles.map((plan) => (
                    <th key={plan.name} className="text-center py-4 px-4">
                      <div className="font-medium text-[#0a2540]  whitespace-nowrap">
                        {plan.name}
                      </div>
                      <div
                        className="text-xs font-normal mt-1 inline-block px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${plan.color}15`,
                          color: plan.color,
                        }}
                      >
                        {plan.tier}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {productCompare.listCompare.map((limitation, idx) => (
                  <tr
                    key={limitation}
                    className={`${
                      idx % 2 === 0 ? "bg-[#f8fafc]" : ""
                    } border-b border-[#e2e8f0] last:border-0`}
                  >
                    <td className="py-4 px-4 flex items-center text-[#0a2540]">
                      {limitation}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-[#64748b] ml-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-60">
                              {limitation === "Course" ||
                              limitation === "Dokumen"
                                ? `Jumlah ${limitation.toLowerCase()} yang dapat diakses`
                                : `Jumlah coin yang dibutuhkan untuk menggunakan fitur ${limitation.toLowerCase()}`}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    {productCompare.subscription.map((plan) => {
                      const value =
                        plan.limitations[
                          limitation as keyof typeof plan.limitations
                        ];
                      return (
                        <td
                          key={`${plan.name}-${limitation}`}
                          className="text-center py-4 px-4 text-[#4a5568]"
                        >
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm bg-green-100 text-green-600 whitespace-nowrap",
                              !value && "bg-red-100 text-red-600"
                            )}
                          >
                            {limitation !== "Document" &&
                              limitation !== "Course" && (
                                <div className="h-4 w-4 rounded-full flex items-center justify-center">
                                  {!value && <X className="w-3 h-3" />}
                                  {value && limitation === "Notes" && (
                                    <PenTool className="h-2 w-2" />
                                  )}
                                  {value && limitation === "Chat" && (
                                    <MessageSquare className="h-2 w-2" />
                                  )}
                                  {value && limitation === "Quiz" && (
                                    <BookOpen className="h-2 w-2" />
                                  )}
                                  {value && limitation === "Tryout" && (
                                    <FileText className="h-2 w-2" />
                                  )}
                                  {value && limitation === "Vision" && (
                                    <Eye className="h-2 w-2" />
                                  )}
                                </div>
                              )}
                            {value}
                          </span>
                        </td>
                      );
                    })}
                    {productCompare.bundles.map((plan) => {
                      const value =
                        plan.limitations[
                          limitation as keyof typeof plan.limitations
                        ];
                      return (
                        <td
                          key={`${plan.name}-${limitation}`}
                          className="text-center py-4 px-4 text-[#4a5568]"
                        >
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm bg-green-100 text-green-600 whitespace-nowrap",
                              !value && "bg-red-100 text-red-600"
                            )}
                          >
                            {limitation !== "Document" &&
                              limitation !== "Course" && (
                                <div className="h-4 w-4 rounded-full flex items-center justify-center">
                                  {!value && <X className="w-3 h-3" />}
                                  {value && limitation === "Notes" && (
                                    <PenTool className="h-2 w-2" />
                                  )}
                                  {value && limitation === "Chat" && (
                                    <MessageSquare className="h-2 w-2" />
                                  )}
                                  {value && limitation === "Quiz" && (
                                    <BookOpen className="h-2 w-2" />
                                  )}
                                  {value && limitation === "Tryout" && (
                                    <FileText className="h-2 w-2" />
                                  )}
                                  {value && limitation === "Vision" && (
                                    <Eye className="h-2 w-2" />
                                  )}
                                </div>
                              )}
                            {value}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div> */}
    </div>
  );
}

type CardProps = {
  data: PlanType;
  onSelect?: () => void;
};

const CardPricing = ({ data, onSelect }: CardProps) => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  return (
    <Card
      key={data.name}
      className={`flex w-full max-w-[340px] min-w-[300px] flex-col rounded-2xl overflow-hidden border-0 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        data.popular ? "shadow-xl ring-2 ring-[#0066ff]" : ""
      }`}
    >
      {data.popular && (
        <div className="absolute top-0 right-0 transform translate-x-0 -translate-y-0 z-10">
          <Badge className="bg-[#0066ff] text-white font-medium px-3 py-1 shadow-md">
            <Sparkles className="h-3.5 w-3.5 mr-1" /> Populer
          </Badge>
        </div>
      )}
      <div className="h-3 bg-gradient"></div>
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
                transform: "translate(30%, -30%)",
              }}
            ></div>
            <div className="mb-3">
              <span className="text-sm font-medium text-main">Bonus Coin</span>
            </div>{" "}
            <div className="grid grid-cols-5 gap-2">
              {data.coins.map((coin) => {
                const item = {
                  icon:
                    coin?.name === "chat"
                      ? MessageSquare
                      : coin?.name === "notes"
                      ? PenTool
                      : coin?.name === "quiz"
                      ? BookOpen
                      : coin?.name === "tryout"
                      ? FileText
                      : coin?.name === "vision"
                      ? Eye
                      : PenTool,
                };
                return (
                  <div className="flex flex-col items-center" key={coin?.name}>
                    <item.icon className="h-5 w-5 mb-1 text-main" />
                    <span className="text-xs text-[#4a5568] font-medium">
                      {coin?.name}
                    </span>
                    <span className="text-sm font-bold text-main">
                      {coin?.total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <ul className="space-y-3 px-1">
          {data.features?.map((feature) => (
            <li key={feature} className="flex items-start">
              <div
                className="h-5 w-5 rounded-full flex items-center justify-center mr-3 mt-0.5 shrink-0 bg-gradient"
                style={{
                  boxShadow: `0 2px 4px ${websiteSubCategory?.main_color}30`,
                }}
              >
                <Check className="h-3 w-3 text-white" />
              </div>
              <span className="text-[#4a5568] text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-2 pb-6">
        <Button
          variant={data.buttonVariant}
          className="w-full rounded-xl h-12 font-medium shadow-md transition-all duration-300 hover:shadow-lg bg-gradient text-white hover:text-white hover:opacity-85"
          onClick={() => onSelect && onSelect()}
        >
          {data.buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

const CardTopping = ({ data, onSelect }: CardProps) => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  return (
    <Card
      key={data.name}
      className={`rounded-2xl w-full max-w-[285px] overflow-hidden border-0 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        data.popular ? "shadow-xl ring-2 ring-[#0066ff]" : ""
      }`}
    >
      {data.popular && (
        <div className="absolute top-0 right-0 transform translate-x-0 -translate-y-0 z-10">
          <Badge className="bg-[#0066ff] text-white font-medium px-3 py-1 shadow-md">
            <Sparkles className="h-3.5 w-3.5 mr-1" /> Best Value
          </Badge>
        </div>
      )}
      <div className="h-3 bg-gradient"></div>
      <CardHeader className="pt-6">
        <CardTitle className="text-xl text-[#0a2540] flex items-center">
          <div className="h-8 w-8 rounded-full mr-2 flex items-center justify-center shadow-sm bg-gradient">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
              <circle cx="12" cy="12" r="6" fill="white" />
            </svg>
          </div>
          {data.name}
        </CardTitle>
        {data.coins && (
          <div
            className="mt-4 p-4 rounded-xl border border-main/10"
            style={{
              background: `linear-gradient(to right, ${websiteSubCategory?.main_color}08, ${websiteSubCategory?.main_color}15)`,
              boxShadow: `0 4px 12px ${websiteSubCategory?.main_color}10`,
            }}
          >
            <div className="grid grid-cols-5 gap-2">
              {data.coins.map((coin) => {
                const item = {
                  icon:
                    coin?.name === "chat"
                      ? MessageSquare
                      : coin?.name === "notes"
                      ? PenTool
                      : coin?.name === "quiz"
                      ? BookOpen
                      : coin?.name === "tryout"
                      ? FileText
                      : coin?.name === "vision"
                      ? Eye
                      : PenTool,
                };
                return (
                  <div className="flex flex-col items-center" key={coin?.name}>
                    <item.icon className="h-5 w-5 mb-1 text-main" />
                    <span className="text-xs text-[#4a5568] font-medium">
                      {coin?.name}
                    </span>
                    <span className="text-sm font-bold text-main">
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
          className="w-full rounded-xl h-12 font-medium shadow-md transition-all duration-300 hover:shadow-lg bg-gradient text-white hover:text-white hover:opacity-85"
          onClick={() => onSelect && onSelect()}
        >
          Beli Sekarang
        </Button>
      </CardFooter>
    </Card>
  );
};

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
  const [telp, setTelp] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(telp);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] w-[95vw]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Konfirmasi Pembayaran
          </DialogTitle>
          <DialogDescription className="text-center">
            Harap isi nomor teleponmu untuk melanjutkan ke laman pembayaran.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? "Memproses..." : "Bayar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
