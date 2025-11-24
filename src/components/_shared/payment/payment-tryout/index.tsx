import { CardTryoutProps } from '@/app/(main)/[web_sub_category]/(user)/user/try-out/_components/ui/card-tryout';
import { useSession } from '@/components/provider/provider-session-auth';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn, getDateTryoutString, getHours } from '@/lib/utils';
import { IconCrown, IconX } from '@/styles/icon';
import { Pricing, Tryout } from '@/types/database';
import { Loader2 } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { toaster } from '../../../ui/toaster';

export const PaymentTryout = ({
  tryoutData,
  show,
  setShow,
}: {
  tryoutData: CardTryoutProps | Tryout | null;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data: session } = useSession();

  const [loading, setLoading] = useState<boolean>(false);

  // const { data: pricing, isLoading: pricingIsLoading } =
  //   api.pricing.getPricingBySlug.useQuery(
  //     {
  //       slug: 'tryout_unlock',
  //     },
  //     {
  //       refetchOnWindowFocus: false,
  //     },
  //   );

  const [pricing, setPricing] = useState<Pricing>();
  const [pricingIsLoading, setPricingIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getGeneral(`/pricing/getPricingBySlug?slug=tryout_unlock`, {
      setData: setPricing,
      setLoading: setPricingIsLoading,
    });
  }, []);

  // const addPayment = api.payment.buyTryoutPremium.useMutation();

  const addPayment = async (payload: {
    titleTryout: string;
    tryoutId: string;
  }) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const res = await mutateGeneral('/payment/buyTryoutPremium', {
      payload: { ...payload, userId: session?.user.id, url },
      type: 'post',
      toast: { hideSuccess: true },
    });
    return res;
  };

  const handlePayment = async () => {
    if (!tryoutData) return;
    setLoading(true);
    try {
      const res = await addPayment({
        titleTryout: tryoutData.title,
        tryoutId: tryoutData.id,
      });
      const token = res?.data?.token;
      // window.snap.pay(`${token}`, {
      //   onClose: () => {
      //     setShow(false);
      //     setTransactionHistory(true);
      //   },
      // });
      window.location.href = res?.data.invoiceUrl;
      setLoading(false);
    } catch (error) {
      toaster({
        title: 'Gagal',
        condition: 'warning',
        description: 'Coba lagi nanti!',
      });
      setLoading(false);
      return;
    }
  };

  if (!show) return null;

  return (
    <Dialog
      open={show}
      onOpenChange={setShow}
    >
      <DialogContent
        className="md:max-w-[425px] w-[95vw] p-0 rounded-3xl"
        hideClose
        classOverlay="z-[101]"
      >
        <div className="overflow-hidden rounded-3xl bg-white">
          <div className="flex items-center justify-between bg-main p-6">
            <div className="flex items-center gap-[.5rem] text-white">
              <p>Tryout Premium</p>
              <IconCrown className="text-main-yellow" />
            </div>
            <div
              onClick={() => {
                setShow(false);
              }}
            >
              <IconX className="cursor-pointer text-white duration-300 hover:text-main-gray-input" />
            </div>
          </div>
          {!tryoutData ? (
            <div className="w-full flex justify-center items-center h-[100px]">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-8 p-6">
              <p className="">
                Akses lengkap seluruh fitur premium pada tryout ini :
              </p>
              <div className="-mt-4 grid grid-cols-5 gap-y-2 text-[.9rem]">
                <p className="col-span-2 text-main-gray-text">Try out</p>
                <p className="col-span-3">: {tryoutData?.title} </p>
                <p className="col-span-2 text-main-gray-text">Pelaksanaan</p>
                <p className="col-span-3">
                  : {getDateTryoutString(tryoutData?.startDate)},{' '}
                  {getHours(tryoutData?.startDate)} WIB s/d <br />{' '}
                  <span className="text-transparent">:</span>{' '}
                  {getDateTryoutString(tryoutData?.endDate)},{' '}
                  {getHours(tryoutData?.endDate)} WIB
                </p>
                <p className="col-span-2 text-main-gray-text">
                  Periode Penilaian
                </p>
                <p className="col-span-3">
                  : {getDateTryoutString(tryoutData?.resultDate)},{' '}
                  {getHours(tryoutData?.resultDate)} WIB
                </p>
              </div>
              {pricingIsLoading || !pricing ? (
                <div className="flex w-full justify-center items-center h-[50px]">
                  <Loader2 className="animate-spin w-4 h-4" />
                </div>
              ) : (
                <button
                  className={cn(
                    'flex items-center justify-center rounded-2xl bg-main py-4 text-white duration-300 hover:bg-main/80 active:bg-main cursor-pointer',
                    loading && 'cursor-pointer hover:bg-main/80 active:bg-main',
                  )}
                  onClick={() => {
                    if (loading) return;
                    handlePayment();
                  }}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    `Beli Rp. ${pricing.price.toLocaleString('id-ID', {
                      style: 'decimal',
                    })}`
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  // return (
  //   <div className="fixed left-0 top-0 z-1000 flex h-full w-full items-center justify-center bg-[#0000007a]">
  //     <div className="mx-4 w-[400px] overflow-hidden rounded-3xl bg-white md:mx-4">
  //       <div className="flex items-center justify-between bg-main p-6">
  //         <div className="flex items-center gap-[.5rem] text-white">
  //           <p>Tryout Premium</p>
  //           <IconCrown className="text-main-yellow" />
  //         </div>
  //         <div
  //           onClick={() => {
  //             setShow(false);
  //           }}
  //         >
  //           <IconX className="cursor-pointer text-white duration-300 hover:text-main-gray-input" />
  //         </div>
  //       </div>
  //       {!tryoutData ? (
  //         <div className="w-full h-full flex justify-center items-center py-8">
  //           <Loader2 className="w-4 h-4 animate-spin" />
  //         </div>
  //       ) : (
  //         <div className="flex flex-col gap-8 p-6">
  //           <p className="">
  //             Akses lengkap seluruh fitur premium pada tryout ini :
  //           </p>
  //           <div className="-mt-4 grid grid-cols-5 gap-y-2 text-[.9rem]">
  //             <p className="col-span-2 text-main-gray-text">Try out</p>
  //             <p className="col-span-3">: {tryoutData?.title} </p>
  //             <p className="col-span-2 text-main-gray-text">Pelaksanaan</p>
  //             <p className="col-span-3">
  //               : {getDateTryoutString(tryoutData?.startDate)},{' '}
  //               {getHours(tryoutData?.startDate)} WIB s/d <br />{' '}
  //               <span className="text-transparent">:</span>{' '}
  //               {getDateTryoutString(tryoutData?.endDate)},{' '}
  //               {getHours(tryoutData?.endDate)} WIB
  //             </p>
  //             <p className="col-span-2 text-main-gray-text">
  //               Periode Penilaian
  //             </p>
  //             <p className="col-span-3">
  //               : {getDateTryoutString(tryoutData?.resultDate)},{' '}
  //               {getHours(tryoutData?.resultDate)} WIB
  //             </p>
  //           </div>
  //           {pricingIsLoading || !pricing ? (
  //             <div className="flex w-full justify-center items-center h-[50px]">
  //               <Loader2 className="animate-spin w-4 h-4" />
  //             </div>
  //           ) : (
  //             <button
  //               className={cn(
  //                 'flex items-center justify-center rounded-2xl bg-main py-4 text-white duration-300 hover:bg-main/85 active:bg-main',
  //                 loading && 'cursor-pointer hover:bg-main/85 active:bg-main',
  //               )}
  //               onClick={() => {
  //                 if (loading) return;
  //                 handlePayment();
  //               }}
  //             >
  //               {loading ? (
  //                 <Loader2 className="h-4 w-4 animate-spin" />
  //               ) : (
  //                 `Beli Rp. ${pricing.price.toLocaleString('id-ID', {
  //                   style: 'decimal',
  //                 })}`
  //               )}
  //             </button>
  //           )}
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
};
