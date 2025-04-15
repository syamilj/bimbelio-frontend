'use client';

import { PaymentTryout } from '@/components/_shared/payment/payment-tryout';
import { cn } from '@/lib/utils';
import { IconCrown } from '@/styles/icon';
import { api } from '@/trpc/react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function ButtonUpgradeTryout() {
  const params = useParams();
  console.log({ params });
  const [show, setShow] = useState<boolean>(false);
  const { data: tryout } = api.tryout.getTryoutDataById.useQuery(
    { tryoutId: (params?.id as string) || '' },
    { refetchOnWindowFocus: false, enabled: !!params },
  );

  console.log({ tryout });
  return (
    <>
      <PaymentTryout
        show={show}
        setShow={setShow}
        tryoutData={tryout === undefined ? null : tryout}
      />
      <button
        className={cn(
          'flex h-fit w-fit items-center gap-[.5rem] rounded-[.8rem] bg-greenUpgrade px-[1rem] py-[.7rem] text-[.9rem] text-white duration-300 active:bg-greenUpgradeHover md:hover:bg-greenUpgradeHover md:active:bg-greenUpgrade',
        )}
        onClick={() => setShow(true)}
      >
        <IconCrown w={15} />
        <p className="font-regular">Buy tryout</p>
      </button>
    </>
  );
}
