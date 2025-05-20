'use client';
import { mutateGeneral } from '@/lib/fetch-helper';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
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

  const checkPayment = async (order_id: string) => {
    const res = await mutateGeneral('/payment/checkPayment', {
      payload: { order_id },
      type: 'post',
      hideToast: true,
      onSuccess() {
        router.push(`${window.location.pathname}`);
      },
      onError() {
        router.push(`${window.location.pathname}`);
      },
    });
    return res;
  };

  const handleCheckPayment = useDebouncedCallback(
    async (order_id: string, transaction_status: string) => {
      const res = await checkPayment(order_id);
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
      }
    },
    500,
  );
  useEffect(() => {
    if (order_id && transaction_status) {
      handleCheckPayment(`${order_id}`, `${transaction_status}`);
    }
  }, [order_id, transaction_status]);
  return <>{children}</>;
}
