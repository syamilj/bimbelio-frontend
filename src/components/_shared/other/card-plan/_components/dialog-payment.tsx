'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toaster } from '@/components/ui/toaster';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { ErrorType } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { cn } from '@/lib/utils';
import {
  getPriceByDiscountFixedAmount,
  getPriceByDiscountPercentage,
} from '@/lib/utils/currency';
import { formatPhoneNumber } from '@/lib/utils/phone';
import { Voucher } from '@/types/database';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Coins,
  CreditCard,
  Loader2,
  Phone,
  ShoppingBag,
  Tag,
  Zap,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { PlanDataType } from '../_provider/types';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export function DialogPayment({
  plan,
  onClose,
  onOpen, // ✅ NEW: Handler untuk InitiateCheckout tracking
  type = 'plan',
  children,
  classOverlay,
}: {
  plan: PlanDataType;
  onClose?: () => void;
  onOpen?: () => void; // ✅ NEW: Callback saat dialog dibuka
  type?: 'limit' | 'plan';
  children: ReactNode;
  classOverlay?: string;
}) {
  const {
    setTransactionPopUp,
    useAuth: { setShowAuth },
  } = useAppContext();
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  const [isOpen, setIsOpen] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<
    'FULL_PAYMENT' | 'INSTALLMENT' | null
  >(null);

  const searchParams = useSearchParams();
  const voucherCodeQuery = searchParams.get('voucherCode');
  const [loading, setLoading] = useState(false);

  const [telp, setTelp] = useState('');
  const [voucherCode, setVoucherCode] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value) || '';
    setTelp(formatted);
  };

  const [discountPrice, setDiscountPrice] = useState<number | null>(null);
  const {
    mutate: checkVoucherCode,
    isLoading,
    error,
  } = useMutation<Voucher>('/voucher/checkVoucherCode', 'post', {
    onSuccess({ data }) {
      if (!data) return;
      const type = data.type;
      const discount = data.discount;
      if (type === 'Fixed_Amount') {
        if (paymentMethod === 'INSTALLMENT' && plan.PlanInstallmentConfig) {
          const discountInstallment =
            discount /
            plan.PlanInstallmentConfig.PlanInstallmentSchedule.length;
          const firstInstallmentPrice =
            plan.PlanInstallmentConfig.PlanInstallmentSchedule[0].amount;
          setDiscountPrice(
            getPriceByDiscountFixedAmount(
              firstInstallmentPrice,
              discountInstallment,
            ),
          );
        } else {
          setDiscountPrice(getPriceByDiscountFixedAmount(plan.price, discount));
        }
      } else if (type === 'Percentage') {
        if (paymentMethod === 'FULL_PAYMENT') {
          setDiscountPrice(getPriceByDiscountPercentage(plan.price, discount));
        } else if (plan.PlanInstallmentConfig) {
          const firstInstallmentPrice =
            plan.PlanInstallmentConfig.PlanInstallmentSchedule[0].amount;
          setDiscountPrice(
            getPriceByDiscountPercentage(firstInstallmentPrice, discount),
          );
        }
      }
    },
  });

  console.log({ error });

  const getDiscountPercentage = () => {
    if (!plan.originalPrice || plan.originalPrice <= plan.price) return 0;
    return Math.round(
      ((plan.originalPrice - plan.price) / plan.originalPrice) * 100,
    );
  };
  const applyVoucherCode = async (planId: string) => {
    await checkVoucherCode({ payload: { voucherCode, planId } });
  };

  const addPayment = async (payload: any) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const res = await mutateGeneral('/payment/addPayment', {
      payload: { ...payload, userId: session?.user.id, url },
      params: { website_sub_category_id: 'undefined' },
      type: 'post',
    });
    return res;
  };

  const handlePayment = async (
    phoneNumber: string,
    plan_website_sub_category_id?: string,
    voucherCode?: string,
  ) => {
    try {
      // console.log('handlePayment called with:', {
      //   telp: phoneNumber,
      //   type,
      //   planId: plan.id,
      //   plan_website_sub_category_id,
      //   voucherCode,
      //   paymentType: paymentMethod,
      // });
      // return;
      const res = await addPayment({
        telp: phoneNumber,
        type,
        planId: plan.id,
        plan_website_sub_category_id,
        voucherCode,
        paymentType: paymentMethod,
      });
      setIsOpen(false);
      // window.snap.pay(`${res?.data.token}`, {
      //   onClose: () => {
      //     setPagesSetting('rt');
      //     setTransactionHistory(true);
      //   },
      // });
      console.log('resData : ', res?.data.invoiceUrl);
      console.log('Token : ', res?.data.token);
      // window.open(res?.data.invoiceUrl, '_blank')?.focus();
      if (res?.data.invoiceUrl) {
        window.location.href = res?.data.invoiceUrl;
      }

      // ✅ ENRICHED PURCHASE EVENT DATA - Lebih lengkap untuk tracking yang optimal
      const purchaseValue = discountPrice || plan.price;

      const fullName = session?.user?.name || '';
      const [firstName, ...restNameParts] = fullName.split(' ').filter(Boolean);
      const lastName = restNameParts.length
        ? restNameParts.join(' ')
        : undefined;

      trackUnifiedEvent({
        eventName: 'AddToCart',
        customData: {
          contents: [{ id: plan.id, quantity: 1 }],
          content_name: plan.name,
          content_type: 'product',
          value: purchaseValue,
          currency: 'IDR',
          num_items: 1,
          order_id: res?.data?.order_id || `order_${Date.now()}`,
          content_id: plan.id,
        },
        user: session?.user
          ? {
              userId: session.user.id?.toString?.() || undefined,
              email: session.user.email || undefined,
              phone: session.user.phone || telp || undefined,
              firstName: firstName || undefined,
              lastName,
            }
          : telp
            ? { phone: telp }
            : undefined,
      });
    } catch (error) {
      toaster({
        title: 'Gagal',
        condition: 'warning',
        description: 'Coba lagi nanti!',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // ✅ ADDPAYMENTINFO TRACKING - Track saat user klik "Bayar Sekarang"
    try {
      const purchaseValue = discountPrice || plan.price;
      const fullName = session?.user?.name || '';
      const [firstName, ...restNameParts] = fullName.split(' ').filter(Boolean);
      const lastName = restNameParts.length
        ? restNameParts.join(' ')
        : undefined;

      trackUnifiedEvent({
        eventName: 'AddPaymentInfo',
        customData: {
          content_name: plan.name,
          content_type: 'product',
          value: purchaseValue,
          currency: 'IDR',
          contents: [{ id: plan.id, quantity: 1 }],
          content_id: plan.id,
        },
        user: session?.user
          ? {
              userId: session.user.id?.toString?.() || undefined,
              email: session.user.email || undefined,
              phone: session.user.phone || telp || undefined,
              firstName: firstName || undefined,
              lastName,
            }
          : telp
            ? { phone: telp }
            : undefined,
      });
    } catch (pixelError) {
      console.warn('Pixel tracking error on add payment info:', pixelError);
    }

    await handlePayment(
      telp,
      plan.PlanSubscription?.websiteSubCategoryId,
      voucherCode,
    );
    setTransactionPopUp(false);
    setLoading(false);
    if (onClose) onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          // ✅ INITIATE CHECKOUT TRACKING - Track saat dialog payment dibuka
          const purchaseValue = discountPrice || plan.price;
          const fullName = session?.user?.name || '';
          const [firstName, ...restNameParts] = fullName
            .split(' ')
            .filter(Boolean);
          const lastName = restNameParts.length
            ? restNameParts.join(' ')
            : undefined;

          trackUnifiedEvent({
            eventName: 'InitiateCheckout',
            customData: {
              contents: [{ id: plan.id, quantity: 1 }],
              content_name: plan.name,
              content_type: 'product',
              value: purchaseValue,
              currency: 'IDR',
              num_items: 1,
              content_id: plan.id,
            },
            user: session?.user
              ? {
                  userId: session.user.id?.toString?.() || undefined,
                  email: session.user.email || undefined,
                  phone: session.user.phone || undefined,
                  firstName: firstName || undefined,
                  lastName,
                }
              : undefined,
          });

          // ✅ Trigger onOpen callback jika ada
          if (onOpen) onOpen();

          if (voucherCodeQuery && plan) {
            setVoucherCode(voucherCodeQuery);
            checkVoucherCode({
              payload: { voucherCode: voucherCodeQuery, planId: plan.id },
            });
          }
          if (session?.user.phone) {
            setTelp(formatPhoneNumber(session.user.phone) || '');
          }
          console.log({ session });
          if (!session) {
            setShowAuth({
              redirect: `/price?planId=${plan.id}${voucherCodeQuery ? `&voucherCode=${voucherCodeQuery}` : ''}`,
              open: true,
            });
            setIsOpen(false);
            return;
          }
          if (plan.PlanInstallmentConfig) {
            setPaymentMethod(null);
          } else {
            setPaymentMethod('FULL_PAYMENT');
          }
        }
        if (!open) {
          setDiscountPrice(null);
          setTelp('');
          setVoucherCode('');
        }
        if (onClose) onClose();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        classOverlay={cn('!bg-slate-900/20 backdrop-blur-sm', classOverlay)}
        className="md:max-w-xl w-[95vw] max-h-[90vh] p-0 rounded-3xl border-2 border-slate-200 bg-white shadow-2xl overflow-hidden"
      >
        {/* Compact Header */}
        <HeaderSection />

        {/* Payment Method Selection - Tampil jika ada installment config dan belum pilih method */}
        {plan.PlanInstallmentConfig && paymentMethod === null && (
          <PaymentMethodSelection
            plan={plan}
            setPaymentMethod={setPaymentMethod}
            discountPrice={discountPrice}
          />
        )}

        {paymentMethod !== null && (
          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto"
          >
            {/* Customer Information */}
            <FormUserInformation
              handlePhoneChange={handlePhoneChange}
              telp={telp}
            />

            {/* Voucher Section */}
            <FormVoucher
              applyVoucherCode={applyVoucherCode}
              discountPrice={discountPrice}
              error={error}
              isLoading={isLoading}
              plan={plan}
              setDiscountPrice={setDiscountPrice}
              setVoucherCode={setVoucherCode}
              voucherCode={voucherCode}
              paymentMethod={paymentMethod}
            />

            {/* Order Summary & Payment */}
            <FormCheckoutSummary
              discountPrice={discountPrice}
              getDiscountPercentage={getDiscountPercentage}
              loading={loading}
              plan={plan}
              telp={telp}
              paymentMethod={paymentMethod}
            />
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

const PaymentMethodSelection = ({
  plan,
  setPaymentMethod,
  discountPrice,
}: {
  plan: PlanDataType;
  setPaymentMethod: (method: 'FULL_PAYMENT' | 'INSTALLMENT' | null) => void;
  discountPrice: number | null;
}) => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const firstInstallmentPrice =
    plan.PlanInstallmentConfig?.PlanInstallmentSchedule[0]?.amount ||
    plan.price;

  return (
    <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-slate-900">
          Pilih Metode Pembayaran
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Pilih cara pembayaran yang sesuai untuk Anda
        </p>
      </div>

      <div className="space-y-3">
        {/* Option 1: Full Payment */}
        <button
          onClick={() => setPaymentMethod('FULL_PAYMENT')}
          className="group w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 bg-white transition-all text-left flex items-center gap-4 cursor-pointer active:scale-[0.98]"
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
            style={{ backgroundColor: `${mainColor}15` }}
          >
            <CreditCard size={22} style={{ color: mainColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Bayar Penuh</h3>
            <p className="text-xs text-slate-500">Sekali bayar, langsung akses</p>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-base font-bold" style={{ color: mainColor }}>
              {formatPrice(discountPrice || plan.price)}
            </span>
            {plan.originalPrice && plan.originalPrice > plan.price && (
              <p className="text-[10px] text-slate-400 line-through">
                {formatPrice(plan.originalPrice)}
              </p>
            )}
          </div>
          <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
        </button>

        {/* Option 2: Installment Payment */}
        <button
          onClick={() => setPaymentMethod('INSTALLMENT')}
          className="group w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 bg-white transition-all text-left cursor-pointer active:scale-[0.98]"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-100 group-hover:scale-110 transition-transform">
              <Coins size={22} className="text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Cicilan {plan.PlanInstallmentConfig?.totalInstallments}x
                </h3>
                {plan.PlanInstallmentConfig?.gracePeriodDays && (
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Tenggang {plan.PlanInstallmentConfig.gracePeriodDays} hari
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">Tanpa bunga, bayar bertahap</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-base font-bold text-emerald-600">
                {formatPrice(firstInstallmentPrice)}
              </span>
              <p className="text-[10px] text-slate-500">/cicilan pertama</p>
            </div>
            <ArrowRight size={18} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </div>

          {/* Installment breakdown with due dates */}
          <div className="space-y-2 p-3 bg-slate-50 rounded-xl">
            {plan.PlanInstallmentConfig?.PlanInstallmentSchedule.map(
              (schedule) => (
                <div key={schedule.id} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-emerald-600">{schedule.installmentNumber}</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-700">Cicilan {schedule.installmentNumber}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock size={8} />
                        {schedule.installmentNumber === 1
                          ? 'Bayar sekarang'
                          : `Hari ke-${schedule.daysAfterFirstPayment}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">
                    {formatPrice(schedule.amount)}
                  </span>
                </div>
              ),
            )}
          </div>
        </button>
      </div>

      {/* Tips */}
      <div className="mt-4 p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-[10px] text-amber-700">
          <span className="font-semibold">💡 Tips:</span> Cicilan tanpa bunga, bisa diangsur sesuai jadwal!
        </p>
      </div>
    </div>
  );
};

const HeaderSection = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <div className="relative">
      {/* Top gradient bar */}
      <div
        className="h-1"
        style={{
          background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
        }}
      />
      <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-slate-100">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <ShoppingBag size={18} style={{ color: mainColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base font-bold text-slate-900">
                Checkout
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Selesaikan pembelian untuk akses premium
              </DialogDescription>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
                <CheckCircle2 size={10} className="text-emerald-500" />
                <span>Aman</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
                <Zap size={10} style={{ color: mainColor }} />
                <span>Instan</span>
              </div>
            </div>
          </div>
        </DialogHeader>
      </div>
    </div>
  );
};

const FormUserInformation = ({
  handlePhoneChange,
  telp,
}: {
  telp: string;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const isValid = telp.startsWith('+62') && telp.length >= 12;

  return (
    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
      <Label className="text-xs font-semibold text-slate-700 flex items-center gap-2 mb-2">
        <Phone size={12} className="text-slate-500" />
        Nomor WhatsApp
        <span className="text-[10px] px-1.5 py-0.5 bg-red-500 text-white rounded-full">Wajib</span>
      </Label>
      <div className="relative">
        <Input
          type="tel"
          placeholder="+62812 3456 7890"
          value={telp}
          onChange={handlePhoneChange}
          className={cn(
            "h-10 text-sm rounded-xl pl-9 pr-10 border-2",
            isValid ? "border-emerald-300 bg-emerald-50/50" : "border-slate-200 bg-white"
          )}
          required
        />
        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        {telp && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid ? (
              <CheckCircle2 size={16} className="text-emerald-500" />
            ) : (
              <div className="w-2 h-2 bg-amber-400 rounded-full" />
            )}
          </div>
        )}
      </div>
      <p className="text-[10px] text-slate-500 mt-1.5">
        Format: 08xxx atau +62xxx • Enkripsi SSL
      </p>
    </div>
  );
};

const FormVoucher = ({
  voucherCode,
  setVoucherCode,
  discountPrice,
  setDiscountPrice,
  isLoading,
  applyVoucherCode,
  error,
  plan,
  paymentMethod,
}: {
  voucherCode: string;
  setVoucherCode: React.Dispatch<React.SetStateAction<string>>;
  discountPrice: number | null;
  setDiscountPrice: React.Dispatch<React.SetStateAction<number | null>>;
  isLoading: boolean;
  applyVoucherCode: (planId: string) => void;
  error: ErrorType<any> | null;
  plan: PlanDataType;
  paymentMethod: 'FULL_PAYMENT' | 'INSTALLMENT';
}) => {
  const firstInstallmentPrice =
    plan.PlanInstallmentConfig?.PlanInstallmentSchedule[0].amount || null;

  return (
    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Kode voucher (opsional)"
            value={voucherCode}
            disabled={!!discountPrice}
            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
            className="h-9 text-sm border border-slate-200 rounded-xl pl-8 bg-white"
          />
          <Tag size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            'h-9 px-3 rounded-xl text-xs font-semibold',
            discountPrice
              ? 'border-red-200 text-red-600 hover:bg-red-50'
              : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50',
          )}
          onClick={() => {
            if (!discountPrice) {
              applyVoucherCode(plan.id);
            } else {
              setDiscountPrice(null);
              setVoucherCode('');
            }
          }}
          disabled={isLoading || (!voucherCode.trim() && !discountPrice)}
        >
          {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : discountPrice ? 'Hapus' : 'Cek'}
        </Button>
      </div>

      {error && (
        <p className="text-[10px] text-red-600 mt-1.5">⚠️ {error.message}</p>
      )}

      {discountPrice && (
        <div className="flex items-center gap-2 mt-2 p-2 bg-emerald-100 rounded-lg">
          <CheckCircle2 size={14} className="text-emerald-600" />
          <span className="text-xs font-medium text-emerald-700">
            Hemat {paymentMethod === 'INSTALLMENT' && firstInstallmentPrice
              ? formatPrice(firstInstallmentPrice - discountPrice)
              : formatPrice(plan.price - discountPrice)}
          </span>
        </div>
      )}
    </div>
  );
};

const FormCheckoutSummary = ({
  plan,
  discountPrice,
  getDiscountPercentage,
  loading,
  telp,
  paymentMethod,
}: {
  plan: PlanDataType;
  discountPrice: number | null;
  getDiscountPercentage: () => number;
  loading: boolean;
  telp: string;
  paymentMethod: 'FULL_PAYMENT' | 'INSTALLMENT' | null;
}) => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const installmentPrice =
    plan.PlanInstallmentConfig?.PlanInstallmentSchedule[0].amount || 0;

  const isValid = telp.startsWith('+62') && telp.length >= 12;
  const finalPrice = paymentMethod === 'FULL_PAYMENT'
    ? (discountPrice || plan.price)
    : (discountPrice || installmentPrice);

  return (
    <div className="space-y-3">
      {/* Price Summary */}
      <div className="p-4 bg-white rounded-2xl border-2 border-slate-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-slate-500">
            {paymentMethod === 'INSTALLMENT' ? 'Cicilan pertama' : 'Total bayar'}
          </span>
          {(discountPrice || (plan.originalPrice && plan.originalPrice > plan.price)) && (
            <span className="text-[10px] text-slate-400 line-through">
              {formatPrice(paymentMethod === 'FULL_PAYMENT' ? (plan.originalPrice || plan.price) : installmentPrice)}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold" style={{ color: mainColor }}>
            {formatPrice(finalPrice)}
          </span>
          {discountPrice && (
            <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
              Hemat {formatPrice(
                paymentMethod === 'FULL_PAYMENT'
                  ? plan.price - discountPrice
                  : installmentPrice - discountPrice
              )}
            </span>
          )}
        </div>
      </div>

      {/* Payment Button */}
      <Button
        type="submit"
        className="w-full h-12 text-sm font-bold text-white border-0 rounded-2xl shadow-lg"
        disabled={loading || !isValid}
        style={{
          background: (loading || !isValid)
            ? '#cbd5e1'
            : `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
        }}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Memproses...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Bayar Sekarang
            <ArrowRight className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
};
