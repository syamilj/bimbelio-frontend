'use client';

import { PaymentTryout } from '@/components/_shared/payment/payment-tryout';
import { useSession } from '@/components/provider/provider-session-auth';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import { IconCrown } from '@/styles/icon';
import { useParams } from 'next/navigation';
import { cloneElement, isValidElement, useEffect, useState } from 'react';

export default function ButtonUpgradeTryout({
  children,
  tryoutId: id,
}: {
  children?: React.ReactNode;
  tryoutId?: string;
}) {
  const params = useParams();
  const { data: session } = useSession();
  const [show, setShow] = useState<boolean>(false);

  const tryoutId = id ? id : params?.id;

  const [tryout, setTryout] = useState<any>();
  useEffect(() => {
    getGeneral(
      `/tryout/getTryoutDataById?userId=${session?.user.id}&tryoutId=${
        (tryoutId as string) || ''
      }`,
      {
        setData: setTryout,
      },
    );
  }, [params, session]);

  const handleClick = () => {
    setShow(true);
  };
  return (
    <>
      <PaymentTryout
        show={show}
        setShow={setShow}
        tryoutData={tryout === undefined ? null : tryout}
      />
      {children && isValidElement(children) ? (
        cloneElement(
          children as React.ReactElement<{ onClick?: React.MouseEventHandler }>,
          {
            onClick: () => {
              handleClick();
            },
          },
        )
      ) : (
        <button
          className={cn(
            'flex h-fit w-fit items-center gap-[.5rem] rounded-[.8rem] bg-gradient px-[1rem] py-[.7rem] text-[.9rem] text-white duration-300 hover:opacity-85',
          )}
          onClick={() => setShow(true)}
        >
          <IconCrown w={15} />
          <p className="font-regular">Buy tryout</p>
        </button>
      )}
    </>
  );
}
