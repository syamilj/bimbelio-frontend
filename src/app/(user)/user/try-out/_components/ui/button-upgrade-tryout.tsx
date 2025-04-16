"use client";

import { PaymentTryout } from "@/components/_shared/payment/payment-tryout";
import { useSession } from "@/components/provider/session-provider-auth";
import { getGeneral } from "@/lib/fetch-helper";
import { cn } from "@/lib/utils";
import { IconCrown } from "@/styles/icon";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ButtonUpgradeTryout() {
  const params = useParams();
  console.log({ params });
  const { data: session } = useSession();
  const [show, setShow] = useState<boolean>(false);
  // const { data: tryout } = api.tryout.getTryoutDataById.useQuery(
  //   { tryoutId: (params?.id as string) || "" },
  //   { refetchOnWindowFocus: false, enabled: !!params }
  // );

  const [tryout, setTryout] = useState<any>();
  useEffect(() => {
    getGeneral(
      `/tryout/getTryoutDataById?userId=${session?.user.id}&tryoutId=${
        (params?.id as string) || ""
      }`,
      {
        setData: setTryout,
      }
    );
  }, [params, session]);

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
          "flex h-fit w-fit items-center gap-[.5rem] rounded-[.8rem] bg-greenUpgrade px-[1rem] py-[.7rem] text-[.9rem] text-white duration-300 active:bg-greenUpgradeHover md:hover:bg-greenUpgradeHover md:active:bg-greenUpgrade"
        )}
        onClick={() => setShow(true)}
      >
        <IconCrown w={15} />
        <p className="font-regular">Buy tryout</p>
      </button>
    </>
  );
}
