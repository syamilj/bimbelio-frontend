'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
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
  Gift,
  Loader2,
  Phone,
  Shield,
  ShoppingBag,
  Star,
  Tag,
  Truck,
  Users,
  Zap,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { CardPlan } from '..';
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
        // classOverlay="z-[9999999999999999]"
        classOverlay={classOverlay}
        className="md:max-w-7xl w-[95vw] max-h-[95vh] p-0 bg-gradient-to-br from-white via-gray-50 to-blue-50/30"
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
            className="flex flex-col lg:grid lg:grid-cols-5 gap-4 p-4 max-h-[75vh] overflow-y-auto"
          >
            {/* Product Summary - Compact Left Column (40%) */}
            <CardPreview
              plan={plan}
              discountPrice={discountPrice}
              paymentMethod={paymentMethod}
            />

            {/* Checkout Form - Right Columns (60%) */}
            <div className="lg:col-span-3 space-y-4 order-1 lg:order-2">
              {/* Customer Information - Compact */}
              <FormUserInformation
                handlePhoneChange={handlePhoneChange}
                telp={telp}
              />

              {/* Voucher Section - Compact */}
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

              {/* Order Summary & Payment - Compact */}
              <FormCheckoutSummary
                discountPrice={discountPrice}
                getDiscountPercentage={getDiscountPercentage}
                loading={loading}
                plan={plan}
                telp={telp}
                paymentMethod={paymentMethod}
              />
            </div>
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
    <div className="p-6 max-h-[75vh] overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Pilih Metode Pembayaran
        </h2>
        <p className="text-sm text-gray-600">
          Pilih cara pembayaran yang paling sesuai untuk Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option 1: Full Payment */}
        <button
          onClick={() => setPaymentMethod('FULL_PAYMENT')}
          className="group relative p-6 rounded-3xl border-2 border-gray-200 hover:border-blue-400 bg-white hover:bg-blue-50 transition-all duration-300 text-left"
        >
          <div className="flex items-start gap-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <CreditCard
                size={24}
                style={{ color: mainColor }}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">Bayar Penuh</h3>
              <p className="text-sm text-gray-600 mb-4">
                Selesaikan pembayaran sekarang dengan sekali transaksi
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-2xl font-black"
                  style={{ color: mainColor }}
                >
                  {formatPrice(discountPrice || plan.price)}
                </span>
                {(discountPrice ||
                  (plan.originalPrice && plan.originalPrice > plan.price)) && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(plan.originalPrice || plan.price)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Hover indicator */}
          <div className="absolute top-3 right-3 w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-blue-400 group-hover:bg-blue-400 transition-all" />
        </button>

        {/* Option 2: Installment Payment */}
        <button
          onClick={() => setPaymentMethod('INSTALLMENT')}
          className="group relative p-6 rounded-3xl border-2 border-gray-200 hover:border-green-400 bg-white hover:bg-green-50 transition-all duration-300 text-left"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-green-100">
              <Coins
                size={24}
                className="text-green-600"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">
                Cicilan Tanpa Bunga
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Bayar dengan {plan.PlanInstallmentConfig?.totalInstallments}x
                cicilan
              </p>

              {plan.PlanInstallmentConfig?.gracePeriodDays && (
                <div className="ml-0 flex items-center gap-1 text-blue-600 bg-blue-50 p-1.5 rounded mb-4">
                  <span className="text-xs">📅</span>
                  <span className="font-semibold text-xs">
                    Masa tenggang: {plan.PlanInstallmentConfig.gracePeriodDays}{' '}
                    hari
                  </span>
                </div>
              )}

              {/* Installment breakdown preview */}
              <div className="space-y-2 mb-3 max-h-40 overflow-y-auto pr-2">
                {plan.PlanInstallmentConfig?.PlanInstallmentSchedule.map(
                  (schedule, idx) => (
                    <div
                      key={schedule.id}
                      className="text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">
                          Cicilan #{schedule.installmentNumber}:
                        </span>
                        <span className="text-green-600 font-bold">
                          {formatPrice(schedule.amount)}
                        </span>
                      </div>

                      {/* Due date info */}
                      {idx === 0 && (
                        <span className="ml-0 mt-0.5 text-gray-500 text-xs">
                          Pembayaran pertama
                        </span>
                      )}
                      {idx > 0 && (
                        <div className="ml-0 mt-0.5 text-gray-500 text-xs">
                          {schedule.daysAfterFirstPayment} hari setelah
                          pembayaran pertama
                        </div>
                      )}

                      {/* Late Fee Info */}
                      {schedule.lateFeeType !== 'NONE' && (
                        <div className="ml-0 mt-1 flex items-center gap-1 text-orange-600">
                          <span className="text-xs">
                            ⚠️ Denda jika terlambat bayar:
                          </span>
                          <span className="font-semibold">
                            {schedule.lateFeeType === 'PERCENTAGE'
                              ? `${schedule.lateFeeAmount}%`
                              : formatPrice(schedule.lateFeeAmount || 0)}
                          </span>
                          {schedule.lateFeeType === 'PERCENTAGE' && (
                            <span className="text-gray-500 text-xs">
                              (~
                              {formatPrice(
                                (schedule.amount *
                                  (schedule.lateFeeAmount || 0)) /
                                  100,
                              )}
                              )
                            </span>
                          )}
                        </div>
                      )}

                      {/* Masa Tenggang Info - untuk cicilan pertama */}
                    </div>
                  ),
                )}
              </div>

              <div className="flex items-baseline gap-2 pt-2 border-t border-green-100">
                <span className="text-lg font-bold text-green-600">
                  Mulai dari {formatPrice(firstInstallmentPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Hover indicator */}
          <div className="absolute top-3 right-3 w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-green-400 group-hover:bg-green-400 transition-all" />
        </button>
      </div>

      {/* Info section */}
      <div className="mt-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <span className="font-semibold">💡 Tips:</span> Pilih cicilan jika
            ingin membagi pembayaran, atau pilih bayar penuh untuk transaksi
            cepat.
          </p>
        </div>
      </div>
    </div>
  );
};

const HeaderSection = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <div
      className="relative p-4 border-b"
      style={{
        background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}04)`,
      }}
    >
      <DialogHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div
            className="p-1.5 rounded-lg"
            style={{ backgroundColor: `${mainColor}15` }}
          >
            <ShoppingBag
              size={18}
              style={{ color: mainColor }}
            />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Checkout
          </DialogTitle>
        </div>
        <DialogDescription className="text-sm text-gray-600 text-center">
          Selesaikan pembelian untuk akses instant ke konten premium
        </DialogDescription>

        {/* Compact Trust Badges */}
        <div className="flex items-center justify-center gap-6 mt-3">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Shield
              size={12}
              className="text-green-500"
            />
            <span>Pembayaran Aman</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Truck
              size={12}
              className="text-blue-500"
            />
            <span>Akses Instan</span>
          </div>
        </div>
      </DialogHeader>
    </div>
  );
};

const CardPreview = ({
  plan,
  discountPrice,
  paymentMethod,
}: {
  plan: PlanDataType;
  discountPrice: number | null;
  paymentMethod: 'FULL_PAYMENT' | 'INSTALLMENT';
}) => {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  return (
    <div className="lg:col-span-2 order-2 lg:order-1">
      <div className="bg-gray-50 rounded-3xl border p-4">
        <h3 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
          <Star
            size={14}
            style={{ color: mainColor }}
          />
          Ringkasan Pesanan
        </h3>
        <CardPlan
          plan={plan}
          discount={discountPrice || undefined}
          viewOnly
          paymentMethod={paymentMethod}
        />
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
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  return (
    <div className="bg-white rounded-3xl border">
      <div
        className="p-3 border-b"
        style={{ backgroundColor: `${mainColor}05` }}
      >
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <div
            className="p-1 rounded"
            style={{ backgroundColor: `${mainColor}20` }}
          >
            <Users
              size={14}
              style={{ color: mainColor }}
            />
          </div>
          Informasi Kontak
        </h3>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Phone
              size={12}
              className="text-gray-500"
            />
            Nomor Telepon
            <Badge
              variant="destructive"
              className="text-xs px-1 py-0 text-white"
            >
              Required
            </Badge>
          </Label>
          <div className="relative">
            <Input
              type="tel"
              placeholder="+62851 1234 5678"
              value={telp}
              onChange={handlePhoneChange}
              className="h-12 text-sm border border-gray-200 focus:border-blue-500 rounded-lg pl-10 pr-4 transition-all duration-200"
              required
            />
            <Phone
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            {/* Phone number indicator */}
            {telp && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {telp.startsWith('+62') && telp.length >= 12 ? (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                ) : (
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
            <Shield
              size={12}
              className="text-blue-600 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="font-medium mb-1">Format otomatis tersedia</p>
              <ul className="space-y-0.5 text-blue-600">
                <li>• Ketik: 08123456789 → +6281234567890</li>
                <li>• Ketik: 81234567890 → +6281234567890</li>
                <li>• Data aman dengan enkripsi SSL</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
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
  const { websiteSubCategory } = useWebsiteSubCategory();

  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const firstInstallmentPrice =
    plan.PlanInstallmentConfig?.PlanInstallmentSchedule[0].amount || null;

  return (
    <div className="bg-white rounded-3xl border">
      <div
        className="p-3 border-b"
        style={{ backgroundColor: `${secondaryColor}05` }}
      >
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <div className="p-1 rounded bg-green-200">
            <Tag
              size={14}
              className="text-green-700"
            />
          </div>
          Kode Promo & Voucher
        </h3>
      </div>

      <div className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Masukkan kode voucher atau promo"
                value={voucherCode}
                disabled={!!discountPrice}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                className="h-10 text-sm border border-gray-200 focus:border-green-500 rounded-lg pl-8"
              />
              <Tag
                size={14}
                className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                'h-10 px-4 border rounded-lg text-sm font-medium',
                discountPrice
                  ? 'border-red-200 text-red-600 hover:bg-red-50'
                  : 'border-green-200 text-green-600 hover:bg-green-50',
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
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : discountPrice ? (
                'Hapus'
              ) : (
                'Terapkan'
              )}
            </Button>
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">
                ⚠️ {error.message}
              </p>
            </div>
          )}
        </div>

        {/* Voucher Success State - Compact */}
        {discountPrice && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={16}
                className="text-green-600"
              />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Voucher berhasil diterapkan!
                </p>
                <p className="text-xs text-green-700">
                  Kamu hemat{' '}
                  {paymentMethod === 'INSTALLMENT' && firstInstallmentPrice
                    ? formatPrice(firstInstallmentPrice - discountPrice)
                    : formatPrice(plan.price - discountPrice)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
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

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const installmentPrice =
    plan.PlanInstallmentConfig?.PlanInstallmentSchedule[0].amount || 0;

  return (
    <div className="bg-white rounded-3xl border">
      <div
        className="p-3 border-b"
        style={{
          backgroundColor: `${mainColor}08`,
        }}
      >
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <div
            className="p-1 rounded"
            style={{ backgroundColor: `${mainColor}20` }}
          >
            <CreditCard
              size={14}
              style={{ color: mainColor }}
            />
          </div>
          Ringkasan Pembayaran
        </h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Price Breakdown - Compact */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Harga paket</span>
            {paymentMethod === 'FULL_PAYMENT' && (
              <span className="font-medium">{formatPrice(plan.price)}</span>
            )}
            {paymentMethod === 'INSTALLMENT' &&
              plan.PlanInstallmentConfig?.PlanInstallmentSchedule && (
                <span className="font-medium">
                  {formatPrice(installmentPrice)}
                </span>
              )}
          </div>

          {discountPrice && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-green-600 flex items-center gap-1">
                <Gift size={12} />
                Diskon voucher
              </span>
              <span className="font-medium text-green-600">
                -
                {paymentMethod === 'FULL_PAYMENT'
                  ? formatPrice(plan.price - discountPrice)
                  : formatPrice(installmentPrice - discountPrice)}
              </span>
            </div>
          )}

          {plan.originalPrice && plan.originalPrice > plan.price && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-orange-600 flex items-center gap-1">
                <Zap size={12} />
                Diskon ({getDiscountPercentage()}%)
              </span>
              <span className="font-medium text-orange-600">
                -{formatPrice(plan.originalPrice - plan.price)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="font-bold text-gray-800">Total</span>
            <div className="text-right">
              <span
                className="text-lg font-black"
                style={{ color: mainColor }}
              >
                {paymentMethod === 'FULL_PAYMENT'
                  ? formatPrice(discountPrice || plan.price)
                  : formatPrice(discountPrice || installmentPrice)}
              </span>
              {(discountPrice ||
                (plan.originalPrice && plan.originalPrice > plan.price)) && (
                <p className="text-xs text-gray-500 line-through">
                  {formatPrice(plan.originalPrice || plan.price)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Compact Benefits */}
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <Clock
            size={16}
            className="mx-auto mb-1 text-blue-500"
          />
          <p className="text-xs font-medium text-gray-700">Akses Instan</p>
          <p className="text-xs text-gray-500">Setelah pembayaran</p>
        </div>

        {/* Payment Button - Compact but Prominent */}
        <Button
          type="submit"
          className="w-full h-12 text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-white border-0 relative overflow-hidden group"
          disabled={
            loading ||
            telp.length === 0 ||
            !telp.startsWith('+62') ||
            telp.length < 12
          }
          style={{
            background: loading
              ? '#gray-400'
              : `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
        >
          <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Memproses...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Bayar{' '}
              {paymentMethod === 'FULL_PAYMENT'
                ? formatPrice(discountPrice || plan.price)
                : formatPrice(discountPrice || installmentPrice)}
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>

        {/* Security Note - Compact */}
        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Dengan melanjutkan, Kamu menyetujui{' '}
            <a
              href="#"
              className="text-blue-600 hover:underline"
            >
              Syarat & Ketentuan
            </a>{' '}
            kami
          </p>
          <div className="flex items-center justify-center gap-1 mt-1 text-xs text-gray-400">
            <Shield size={10} />
            <span>Pembayaran dienkripsi SSL 256-bit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
