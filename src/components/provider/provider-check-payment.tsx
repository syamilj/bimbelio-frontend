'use client';
import { Payment } from '@/app/[web_sub_category]/(user)/user/_components/payment';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { CreditCard, Shield } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { DialogJoinDiscord } from '../_shared/dialog/dialog-join-discord';
import { toaster } from '../ui/toaster';

export default function ProviderCheckPayment({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const order_id = searchParams?.get('order_id');
  const transaction_status = searchParams?.get('transaction_status');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [inviteLink, setInviteLink] = useState<string | null>(null);

  const checkPayment = async (order_id: string) => {
    setIsLoading(true);
    const res = await mutateGeneral(`/payment/checkPayment`, {
      payload: { order_id },
      type: 'post',
      hideToast: true,
      onSuccess() {
        router.push(`${window.location.pathname}`);
        setIsLoading(false);
      },
      onError() {
        router.push(`${window.location.pathname}`);
        setIsLoading(false);
      },
    });
    setIsLoading(false);
    console.log({ res });
    return res;
  };

  const handleCheckPayment = useDebouncedCallback(
    async (order_id: string, transaction_status: string) => {
      const res = await checkPayment(order_id);
      const inviteLink = res?.data?.inviteLink as string | undefined;
      if (
        res &&
        new Date(res?.data?.expired_time) > new Date() &&
        transaction_status === 'settlement'
      ) {
        toaster({
          title: 'Pembelian Berhasil',
          condition: 'success',
          description: 'Pembelian berhasil dilakukan',
        });

        if (inviteLink) {
          setInviteLink(inviteLink);
        }
      }
    },
    500,
  );
  useEffect(() => {
    if (order_id && transaction_status) {
      handleCheckPayment(`${order_id}`, `${transaction_status}`);
    } else {
      setIsLoading(false);
    }
  }, [order_id, transaction_status]);

  useEffect(() => {
    if (inviteLink) {
      document.getElementById('openJoin')?.click();
    }
    return () => {};
  }, [inviteLink]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 border border-gray-100">
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Icon and spinner container */}
            <div className="relative">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            {/* Text content */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Memverifikasi Pembayaran
              </h3>
              <p className="text-sm text-gray-600">
                Mohon tunggu sebentar, kami sedang memproses pembayaran Anda
              </p>
            </div>

            {/* Security indicator */}
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-full">
              <Shield className="w-3 h-3" />
              <span>Transaksi Aman & Terenkripsi</span>
            </div>

            {/* Progress dots animation */}
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
    // return (
    //   <div className="flex w-full h-full fixed top-0 left-0 justify-center items-center">
    //     <div className="flex flex-col itnpmems-center justify-center">
    //       <p>Check Payment</p>
    //       <Loader2 className="animate-spin w-4 h-4" />
    //     </div>
    //   </div>
    // );
  }

  return (
    <>
      <Payment />
      {children}
      <DialogJoinDiscord inviteLink={inviteLink || ''}>
        <button
          id="openJoin"
          hidden
        >
          Open
        </button>
      </DialogJoinDiscord>
    </>
  );
}
