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
import { cn } from '@/lib/utils';
import {
  getPriceByDiscountFixedAmount,
  getPriceByDiscountPercentage,
} from '@/lib/utils/currency';
import { Voucher } from '@/types/database';
import {
  ArrowRight,
  Award,
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
  type = 'plan',
  children,
}: {
  plan: PlanDataType;
  onClose?: () => void;
  type?: 'limit' | 'plan';
  children: ReactNode;
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
  const checkoutData = {
    deliveryTime: 'Akses instan setelah pembayaran',
    guarantee: '30 hari uang kembali',
    support: 'Support 24/7',
    securePayment: 'Pembayaran aman dengan SSL',
  };

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
    await handlePayment(
      telp,
      plan.PlanSubscription.websiteSubCategoryId,
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
          if (voucherCodeQuery && plan) {
            setVoucherCode(voucherCodeQuery);
            checkVoucherCode({
              payload: { voucherCode: voucherCodeQuery, planId: plan.id },
            });
          }
          if (session?.user.phone) {
            setTelp(session.user.phone);
          }
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
        classOverlay="z-[9999999999999999]"
        className="sm:max-w-7xl w-[95vw] max-h-[95vh] p-0 bg-gradient-to-br from-white via-gray-50 to-blue-50/30"
      >
        {/* Marketplace-Style Header */}
        <div className="relative bg-white border-b border-gray-200 p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/50 to-transparent" />
          <DialogHeader className="relative text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div
                className="p-2 rounded-xl shadow-lg"
                style={{ backgroundColor: `${mainColor}10` }}
              >
                <ShoppingBag
                  size={24}
                  style={{ color: mainColor }}
                />
              </div>
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Checkout Premium
              </DialogTitle>
            </div>
            <DialogDescription className="text-lg text-gray-600">
              Selesaikan pembelian untuk akses instant ke konten premium
            </DialogDescription>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Shield
                  size={16}
                  className="text-green-500"
                />
                <span>Pembayaran Aman</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Truck
                  size={16}
                  className="text-blue-500"
                />
                <span>Akses Instan</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Award
                  size={16}
                  className="text-purple-500"
                />
                <span>Garansi 30 Hari</span>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col-reverse xl:grid xl:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto"
        >
          {/* Product Summary - Left Column */}
          <div className="xl:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Star
                      size={16}
                      style={{ color: mainColor }}
                    />
                    Ringkasan Pesanan
                  </h3>
                </div>

                <div className="p-4 max-h-[70vh] overflow-y-auto">
                  <CardPlan
                    plan={plan}
                    discount={discountPrice || undefined}
                    viewOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form - Right Columns */}
          <div className="xl:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${mainColor}20` }}
                  >
                    <Users
                      size={20}
                      style={{ color: mainColor }}
                    />
                  </div>
                  Informasi Kontak
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Data ini diperlukan untuk komunikasi terkait pesanan Anda
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Phone Number Input - Enhanced */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
                    <Phone
                      size={16}
                      className="text-gray-500"
                    />
                    Nomor Telepon
                    <Badge
                      variant="destructive"
                      className="text-xs"
                    >
                      Required
                    </Badge>
                  </Label>
                  <div className="relative">
                    <Input
                      type="tel"
                      placeholder="Contoh: 08123456789"
                      value={telp}
                      onChange={(e) => setTelp(e.target.value)}
                      className="h-14 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200 pl-12"
                      required
                    />
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Shield
                      size={16}
                      className="text-blue-600 mt-0.5 flex-shrink-0"
                    />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium">
                        Mengapa kami memerlukan nomor telepon?
                      </p>
                      <p className="text-blue-600 mt-1">
                        Untuk konfirmasi pembelian dan support jika diperlukan.
                        Data Anda aman dengan enkripsi SSL.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Voucher Section - Enhanced */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-200">
                    <Tag
                      size={20}
                      className="text-green-700"
                    />
                  </div>
                  Kode Promo & Voucher
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Punya kode promo? Gunakan untuk mendapat diskon tambahan!
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Input
                        type="text"
                        placeholder="Masukkan kode voucher atau promo"
                        value={voucherCode}
                        disabled={!!discountPrice}
                        onChange={(e) =>
                          setVoucherCode(e.target.value.toUpperCase())
                        }
                        className="h-14 text-base border-2 border-gray-200 focus:border-green-500 rounded-xl transition-all duration-200 pl-12 pr-4"
                      />
                      <Tag
                        size={18}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'h-14 px-8 border-2 rounded-xl font-semibold transition-all duration-200',
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
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : discountPrice ? (
                        <>
                          <Zap
                            size={16}
                            className="mr-2"
                          />
                          Hapus
                        </>
                      ) : (
                        <>
                          <Gift
                            size={16}
                            className="mr-2"
                          />
                          Terapkan
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Voucher Success State */}
                  {discountPrice && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <CheckCircle2
                          size={20}
                          className="text-green-600"
                        />
                        <div>
                          <p className="font-semibold text-green-800">
                            Voucher berhasil diterapkan!
                          </p>
                          <p className="text-sm text-green-700">
                            Anda hemat {formatPrice(plan.price - discountPrice)}{' '}
                            dari pembelian ini
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary & Payment */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div
                className="p-6 border-b border-gray-100"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}10, ${secondaryColor}05)`,
                }}
              >
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${mainColor}20` }}
                  >
                    <CreditCard
                      size={20}
                      style={{ color: mainColor }}
                    />
                  </div>
                  Ringkasan Pembayaran
                </h3>
              </div>

              <div className="p-6 space-y-6">
                {/* Price Breakdown */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Harga paket</span>
                    <span className="font-semibold">
                      {formatPrice(plan.price)}
                    </span>
                  </div>

                  {discountPrice && (
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-green-600 flex items-center gap-2">
                        <Gift size={16} />
                        Diskon voucher
                      </span>
                      <span className="font-semibold text-green-600">
                        -{formatPrice(plan.price - discountPrice)}
                      </span>
                    </div>
                  )}

                  {plan.originalPrice && plan.originalPrice > plan.price && (
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-orange-600 flex items-center gap-2">
                        <Zap size={16} />
                        Diskon terbatas ({getDiscountPercentage()}%)
                      </span>
                      <span className="font-semibold text-orange-600">
                        -{formatPrice(plan.originalPrice - plan.price)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                    <span className="text-lg font-bold text-gray-800">
                      Total Pembayaran
                    </span>
                    <div className="text-right">
                      <span
                        className="text-2xl font-black"
                        style={{ color: mainColor }}
                      >
                        {formatPrice(discountPrice || plan.price)}
                      </span>
                      {(discountPrice ||
                        (plan.originalPrice &&
                          plan.originalPrice > plan.price)) && (
                        <p className="text-sm text-gray-500 line-through">
                          {formatPrice(plan.originalPrice || plan.price)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Checkout Benefits */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <Clock
                      size={20}
                      className="mx-auto mb-2 text-blue-500"
                    />
                    <p className="text-xs font-medium text-gray-700">
                      Akses Instan
                    </p>
                    <p className="text-xs text-gray-500">Setelah pembayaran</p>
                  </div>
                  <div className="text-center">
                    <Shield
                      size={20}
                      className="mx-auto mb-2 text-green-500"
                    />
                    <p className="text-xs font-medium text-gray-700">Garansi</p>
                    <p className="text-xs text-gray-500">30 hari</p>
                  </div>
                </div>

                {/* Payment Button - Enhanced */}
                <Button
                  type="submit"
                  className="w-full h-16 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 text-white border-0 relative overflow-hidden group"
                  disabled={loading || telp.length === 0}
                  style={{
                    background: loading
                      ? '#gray-400'
                      : `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 20px 40px ${mainColor}40`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = `0 10px 30px ${mainColor}30`;
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  {loading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin mr-3" />
                      Memproses Pembayaran...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-6 w-6 mr-3" />
                      Bayar Sekarang -{' '}
                      {formatPrice(discountPrice || plan.price)}
                      <ArrowRight className="h-6 w-6 ml-3" />
                    </>
                  )}
                </Button>

                {/* Security Note */}
                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Dengan melanjutkan, Anda menyetujui{' '}
                    <a
                      href="#"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Syarat & Ketentuan
                    </a>{' '}
                    dan{' '}
                    <a
                      href="#"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Kebijakan Privasi
                    </a>{' '}
                    kami
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-400">
                    <Shield size={12} />
                    <span>Pembayaran dienkripsi dengan SSL 256-bit</span>
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
