"use client";

import { toaster } from "@/components/ui/toaster";
import { getDateString, getHours } from "@/lib/utils";

import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useSession } from "./session-provider-auth";
import { signOut } from "@/lib/auth-helper";
import { mutateGeneral } from "@/lib/fetch-helper";

export default function CheckSubscription({
  children,
}: {
  children: ReactNode;
}) {
  const [checkSubs, setCheckSubs] = useState<boolean>(true);
  const [checkLog, setCheckLog] = useState<boolean>(true);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const order_id = searchParams?.get("order_id");
  const transaction_status = searchParams?.get("transaction_status");

  //   const { mutateAsync: buyTryoutCheck } =
  //     api.payment.buyTryoutPremiumRedirect.useMutation();

  console.log("session", session);

  useEffect(() => {
    if (checkLog && session) {
      const data: any = session;
      const expires = new Date(data?.user.expire);
      const now = new Date();
      if (expires < now) {
        console.log({
          expires: `${getDateString(expires)} | ${getHours(expires)}`,
          now: `${getDateString(now)} | ${getHours(now)}`,
        });
        setCheckLog(false);
        signOut();
        console.log("Sudah expire");
      } else if (expires > now) {
        console.log({
          expires: `${getDateString(expires)} | ${getHours(expires)}`,
          now: `${getDateString(now)} | ${getHours(now)}`,
        });
        console.log("Belum Expires");
        setCheckLog(false);
      }
    }
  }, [session, checkLog]);

  // const CheckSubscription = api.user.checkSubscription.useMutation();

  const CheckSubscription = async () => {
    const data = await mutateGeneral("/user/checkSubscription", {
      payload: { userId: session?.user.id },
      type: "post",
      hideToast: true,
    });
    return data;
  };

  useEffect(() => {
    const check = async () => {
      try {
        const res = await CheckSubscription();
        console.log("Subscription", res);
        if (res?.status == 201) {
          window.location.reload();
        }
        // if (res?.status === 202 || res?.status === 203) {
        //   signOut();
        // }
        return;
      } catch (error) {
        console.log("Failed Check Subscription", error);
        return;
      }
    };
    if (session && checkSubs) {
      check();
      setCheckSubs(false);
    }
  }, [session, checkSubs]);

  // const checkPayment = api.payment.checkPayment.useMutation();

  const checkPayment = async (order_id: string) => {
    const data = await mutateGeneral("/payment/checkPayment", {
      payload: { order_id },
      type: "post",
      hideToast: true,
      onSuccess() {
        router.push(`${window.location.pathname}`);
      },
      onError() {
        router.push(`${window.location.pathname}`);
      },
    });
    return data;
  };

  const handleCheckPayment = useCallback(
    async (order_id: string, transaction_status: string) => {
      const data = await checkPayment(order_id);
      if (
        data &&
        new Date(data?.expired_time) > new Date() &&
        transaction_status === "settlement"
      ) {
        toaster({
          title: "Pembelian Berhasil",
          condition: "success",
          description: "Pembelian berhasil dilakukan",
        });
      }
    },
    [checkPayment]
  );

  useEffect(() => {
    if (order_id && transaction_status) {
      handleCheckPayment(`${order_id}`, `${transaction_status}`);
    }
  }, [order_id, transaction_status]);

  return <>{children}</>;
}
