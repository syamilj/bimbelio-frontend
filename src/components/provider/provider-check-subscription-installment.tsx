'use client';

import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { ReactNode, useEffect } from 'react';
import { toaster } from '../ui/toaster';
import { useAppContext } from './provider-app';

export default function ProviderCheckSubscriptionInstallment({
  children,
}: {
  children: ReactNode;
}) {
  const { setPagesSetting } = useAppContext();

  const CheckSubscriptionInstallment = async () => {
    const res = await mutateGeneral('/user/checkSubscriptionInstallment', {
      type: 'post',
      hideToast: true,
    });
    return res;
  };

  useEffect(() => {
    const check = async () => {
      try {
        const res = await CheckSubscriptionInstallment();
        if (res?.status == 201) {
          window.location.reload();
        }
        if (res?.status === 202) {
          toaster({
            title: 'Subscription Ditangguhkan',
            condition: 'warning',
            description:
              'Pembayaran cicilan Anda tertunda. Silakan lakukan pembayaran untuk melanjutkan penggunaan layanan kami.',
            duration: 10000,
          });
          setPagesSetting('installment');
        }
        console.log('CheckSubscriptionInstallment', res);
        // if (res?.status === 202 || res?.status === 203) {
        //   signOut();
        // }
        return;
      } catch (error) {
        return;
      }
    };
    check();
  }, []);
  // console.log('CheckSubscriptionInstallment', checkSubs);

  return <>{children}</>;
}
