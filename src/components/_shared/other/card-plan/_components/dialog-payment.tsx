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
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { pixel } from '@/lib/pixel/_core';
import { cn } from '@/lib/utils';
import {
  getPriceByDiscountFixedAmount,
  getPriceByDiscountPercentage,
} from '@/lib/utils/currency';
import { Voucher } from '@/types/database';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
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
    setPagesSetting,
    setTransactionHistory,
    setTransactionPopUp,
    useAuth: { setShowAuth },
  } = useAppContext();
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [isOpen, setIsOpen] = useState(false);

  const searchParams = useSearchParams();
  const voucherCodeQuery = searchParams.get('voucherCode');
  const [loading, setLoading] = useState(false);

  const [telp, setTelp] = useState('');
  const [voucherCode, setVoucherCode] = useState('');

  // Format phone number function
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Auto-add +62 if starts with 0
    if (digits.startsWith('0')) {
      return '+62' + digits.slice(1);
    }

    // Auto-add +62 if starts with 8
    if (digits.startsWith('8')) {
      return '+62' + digits;
    }

    // If already starts with 62, add +
    if (digits.startsWith('62')) {
      return '+' + digits;
    }

    // If starts with +62, keep as is
    if (value.startsWith('+62')) {
      return '+62' + digits.slice(2);
    }

    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setTelp(formatted);
  };

  const [discountPrice, setDiscountPrice] = useState<number | null>(null);
  const { mutate: checkVoucherCode, isLoading } = useMutation<Voucher>(
    '/voucher/checkVoucherCode',
    'post',
    {
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
    },
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

  // Mock marketplace data
  // const checkoutData = {
  //   deliveryTime: 'Akses instan setelah pembayaran',
  //   support: 'Support 24/7',
  //   securePayment: 'Pembayaran aman dengan SSL',
  // };

  const applyVoucherCode = async (planId: string) => {
    await checkVoucherCode({ payload: { voucherCode, planId } });
  };

  const addPayment = async (payload: any) => {
    const res = await mutateGeneral('/payment/addPayment', {
      payload: { ...payload, userId: session?.user.id },
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
      const res = await addPayment({
        telp: phoneNumber,
        type,
        planId: plan.id,
        plan_website_sub_category_id,
        voucherCode,
      });
      setIsOpen(false);
      window.snap.pay(`${res?.data.token}`, {
        onClose: () => {
          setPagesSetting('rt');
          setTransactionHistory(true);
        },
      });

      // ✅ ENRICHED PURCHASE EVENT DATA - Lebih lengkap untuk tracking yang optimal
      const purchaseValue = discountPrice || plan.price;
      // const categoryName =
      //   plan.PlanSubscription?.WebsiteSubCategory?.name || 'Unknown';

      // ✅ ADVANCED MATCHING - Enhanced Meta tracking dengan user data
      const advancedMatchingData: any = {};

      if (session?.user?.email) {
        advancedMatchingData.em = await pixel.meta.hashUserData(
          session.user.email,
        );
      }
      if (session?.user?.phone || telp) {
        const phoneNumber = session?.user?.phone || telp;
        advancedMatchingData.ph = await pixel.meta.hashUserData(phoneNumber);
      }
      if (session?.user?.name) {
        const nameParts = session.user.name.split(' ');
        if (nameParts[0]) {
          advancedMatchingData.fn = await pixel.meta.hashUserData(nameParts[0]);
        }
        if (nameParts[1]) {
          advancedMatchingData.ln = await pixel.meta.hashUserData(nameParts[1]);
        }
      }

      pixel.meta.track(
        'Purchase',
        {
          contents: [{ id: plan.id, quantity: 1 }], // ✅ Format yang benar untuk Meta
          content_name: plan.name,
          content_type: 'product',
          value: purchaseValue,
          currency: 'IDR',
          num_items: 1,
          order_id: res?.data?.order_id || `order_${Date.now()}`, // Order ID from payment response
        },
        advancedMatchingData,
      ); // ✅ Advanced matching data

      pixel.tiktok.track('Purchase', {
        content_id: plan.id, // ✅ FIX: TikTok content_id parameter yang missing
        content_name: plan.name,
        content_type: 'product', // ✅ Tambahan content_type
        value: purchaseValue,
        currency: 'IDR',
        order_id: res?.data?.order_id || `order_${Date.now()}`,
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
      pixel.meta.track(
        'AddPaymentInfo',
        {
          content_name: plan.name,
          content_type: 'product',
          value: purchaseValue,
          currency: 'IDR',
          contents: [{ id: plan.id, quantity: 1 }],
        },
        {
          // Advanced Matching data
          em: session?.user?.email,
          ph: session?.user?.phone || undefined,
          fn: session?.user?.name?.split(' ')[0],
          ln: session?.user?.name?.split(' ').slice(1).join(' '),
        },
      );

      pixel.tiktok.track('AddPaymentInfo', {
        content_id: plan.id,
        content_name: plan.name,
        content_type: 'product',
        value: purchaseValue,
        currency: 'IDR',
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
          pixel.meta.track('InitiateCheckout', {
            contents: [{ id: plan.id, quantity: 1 }],
            content_name: plan.name,
            content_type: 'product',
            value: purchaseValue,
            currency: 'IDR',
            num_items: 1,
          });

          pixel.tiktok.track('InitiateCheckout', {
            content_id: plan.id,
            content_name: plan.name,
            content_type: 'product',
            value: purchaseValue,
            currency: 'IDR',
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
            setTelp(formatPhoneNumber(session.user.phone));
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

        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:grid lg:grid-cols-5 gap-4 p-4 max-h-[75vh] overflow-y-auto"
        >
          {/* Product Summary - Compact Left Column (40%) */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-gray-50 rounded-xl border p-4">
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
              />
            </div>
          </div>

          {/* Checkout Form - Right Columns (60%) */}
          <div className="lg:col-span-3 space-y-4 order-1 lg:order-2">
            {/* Customer Information - Compact */}
            <div className="bg-white rounded-xl border">
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
                      <p className="font-medium mb-1">
                        Format otomatis tersedia
                      </p>
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

            {/* Voucher Section - Compact */}
            <div className="bg-white rounded-xl border">
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
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="Masukkan kode voucher atau promo"
                      value={voucherCode}
                      disabled={!!discountPrice}
                      onChange={(e) =>
                        setVoucherCode(e.target.value.toUpperCase())
                      }
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
                    disabled={
                      isLoading || (!voucherCode.trim() && !discountPrice)
                    }
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
                          Kamu hemat {formatPrice(plan.price - discountPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary & Payment - Compact */}
            <div className="bg-white rounded-xl border">
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
                    <span className="font-medium">
                      {formatPrice(plan.price)}
                    </span>
                  </div>

                  {discountPrice && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-600 flex items-center gap-1">
                        <Gift size={12} />
                        Diskon voucher
                      </span>
                      <span className="font-medium text-green-600">
                        -{formatPrice(plan.price - discountPrice)}
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
                        {formatPrice(discountPrice || plan.price)}
                      </span>
                      {(discountPrice ||
                        (plan.originalPrice &&
                          plan.originalPrice > plan.price)) && (
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
                  <p className="text-xs font-medium text-gray-700">
                    Akses Instan
                  </p>
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
                      Bayar {formatPrice(discountPrice || plan.price)}
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
