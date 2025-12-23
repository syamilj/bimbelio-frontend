'use client';

import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { ReactNode, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useSession } from './provider-session-auth';

export default function ProviderCheckSubscriptionPending({
  children,
}: {
  children: ReactNode;
}) {
  const [checkSubs, setCheckSubs] = useState<boolean>(true);
  const { data: session } = useSession();
  const CheckSubscription = async () => {
    if (!website_sub_category_id) return;
    const res = await mutateGeneral('/user/checkSubscriptionPending', {
      payload: { userId: session?.user.id },
      params: { website_sub_category_id },
      type: 'post',
      hideToast: true,
    });
    return res;
  };

  const check = useDebouncedCallback(async () => {
    try {
      const res = await CheckSubscription();
      console.log('Pending : ', res);
      if (res?.status == 201) {
        window.location.reload();
      }
      // if (res?.status === 202 || res?.status === 203) {
      //   signOut();
      // }
      return;
    } catch (error) {
      return;
    }
  }, 1000);

  useEffect(() => {
    if (session && checkSubs) {
      check();
      setCheckSubs(false);
    }
  }, [session, checkSubs]);

  // const checkPayment = api.payment.checkPayment.useMutation();

  // const checkPayment = async (order_id: string) => {
  //   const res = await mutateGeneral('/payment/checkPayment', {
  //     payload: { order_id },
  //     type: 'post',
  //     hideToast: true,
  //     onSuccess() {
  //       router.push(`${window.location.pathname}`);
  //     },
  //     onError() {
  //       router.push(`${window.location.pathname}`);
  //     },
  //   });
  //   return res;
  // };

  // const handleCheckPayment = useDebouncedCallback(
  //   async (order_id: string, transaction_status: string) => {
  //     const res = await checkPayment(order_id);
  //     if (
  //       res &&
  //       new Date(res?.data?.expired_time) > new Date() &&
  //       transaction_status === 'settlement'
  //     ) {
  //       toaster({
  //         title: 'Pembelian Berhasil',
  //         condition: 'success',
  //         description: 'Pembelian berhasil dilakukan',
  //       });
  //     }
  //   },
  //   500,
  // );
  // useEffect(() => {
  //   if (order_id && transaction_status) {
  //     handleCheckPayment(`${order_id}`, `${transaction_status}`);
  //   }
  // }, [order_id, transaction_status]);

  return <>{children}</>;
}
