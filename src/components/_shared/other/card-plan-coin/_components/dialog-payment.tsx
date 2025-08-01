import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
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
import {
  getPriceByDiscountFixedAmount,
  getPriceByDiscountPercentage,
} from '@/lib/utils/currency';
import { Voucher } from '@/types/database';
import { ArrowRight, Loader2, Phone, Shield, Tag } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { CardPlanTopping } from '..';
import { PlanDataType } from '../../card-plan/_provider/types';

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
  const { setPagesSetting, setTransactionHistory, setTransactionPopUp } =
    useAppContext();
  const { data: session } = useSession();

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
    // await onSubmit(
    //   telp,
    //   plan.PlanSubscription.websiteSubCategoryId,
    //   voucherCode,
    // );
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
          if (voucherCodeQuery && plan) {
            setVoucherCode(voucherCodeQuery);
            checkVoucherCode({
              payload: { voucherCode: voucherCodeQuery, planId: plan.id },
            });
            //   checkVoucherCodeQuery();
          }
          if (session?.user.phone) {
            setTelp(session.user.phone);
          }
          if (!session) {
            // setShowAuth({
            //   redirect: `/price?planId=${plan.id}${voucherCodeQuery ? `&voucherCode=${voucherCodeQuery}` : ''}`,
            //   open: true,
            // });
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
        className="sm:max-w-6xl w-[95vw] max-h-[90vh] p-0"
      >
        <div className="bg-linear-to-br from-blue-50 via-white to-indigo-50 p-8">
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
            <div className="flex justify-center lg:justify-start lg:border-r lg:max-h-[70vh] w-full lg:w-auto">
              <div className="w-full lg:overflow-y-auto px-8 border-0 py-4 flex justify-center items-start">
                <CardPlanTopping
                  plan={plan}
                  discount={discountPrice || undefined}
                  viewOnly
                />
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
                      <div className="h-2 w-2 bg-blue-400 rounded-full mt-2 mr-2 shrink-0"></div>
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
    </Dialog>
  );
}
