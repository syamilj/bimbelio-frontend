"use client";

import { useAppContext } from "@/components/provider/provider-app";
import { toaster } from "@/components/ui/toaster";
import OnBoarding from "@/components/workspace/_component/onboarding";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Done from "./done";
import Terbaru from "./terbaru";
import RegistrationTryOut from "./ui/registration-try-out";
import SummaryTryout from "./ui/summary-tryout";
import Upcoming from "./upcoming";
import axiosInstance from "@/lib/axios/axiosInstance";
import { response } from "@/lib/response";
import { UserTryout } from "@/types/database";
import { getGeneral } from "@/lib/fetch-helper";
import { useSession } from "@/components/provider/session-provider-auth";
import UpcomingOtherWeb from "./upcoming-other-web";

export default function TryOutClient() {
  const Router = useRouter();
  const pathname = usePathname();
  const isTesting = pathname?.toLowerCase().includes("testing") || false;
  // const { query } = Router;
  const searchParams = useSearchParams();
  const payment = searchParams?.get("payment");

  useEffect(() => {
    if (payment === "success") {
      toaster({
        title: "Success",
        description: "Pembelian Berhasil",
        condition: "success",
      });
      Router.push("/user/try-out");
    }
  }, [payment]);

  if (isTesting) {
    return <Content />;
  }
  return <Content />;
}

const Content = () => {
  const Router = useRouter();
  const { data: session } = useSession();

  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tryoutAccount, setTryoutAccount] = useState<{
    userTryOutId: string;
    UserTryout: UserTryout;
  }>();

  const [isHideGeneralSection, setIsHideGeneralSection] =
    useState<boolean>(false);
  const [isHideTargetValue, setIsHideTargetValue] = useState<boolean>(false);

  const [univOption, setUnivOption] = useState<string | undefined>();

  const getUserTryout = async () => {
    const res = await getGeneral(
      `/user/getUserTryOut?userId=${session?.user.id}`,
      {
        setData: setTryoutAccount,
        setLoading: setIsLoading,
        onError({ data }) {
          const getData: {
            hideGeneral: boolean;
            hideTargetValue: boolean;
            universityOption: string | undefined;
          } = data;
          console.log({ data });
          if (getData.hideGeneral) setIsHideGeneralSection(true);
          if (getData.hideTargetValue) setIsHideTargetValue(true);
          if (getData.universityOption) setUnivOption(getData.universityOption);
        },
      }
    );
  };

  useEffect(() => {
    getUserTryout();
  }, []);

  const { onBoarding, setOnBoarding } = useAppContext();

  useEffect(() => {
    const getOnboarding = localStorage.getItem("on-boarding");
    const onBoarding = {
      chat: true,
      notes: true,
      quiz: true,
      tryout: true,
    };
    if (!getOnboarding) {
      localStorage.setItem("on-boarding", JSON.stringify(onBoarding));
    } else {
      const data = JSON.parse(getOnboarding);
      const isValid =
        data &&
        typeof data.chat === "boolean" &&
        typeof data.notes === "boolean" &&
        typeof data.quiz === "boolean" &&
        typeof data.tryout === "boolean";
      if (isValid) {
        setOnBoarding({ ...data });
      }
    }
    console.log("getOnboarding", getOnboarding);
  }, []);

  if (isLoading) return null;

  return (
    <div className="relative">
      {tryoutAccount?.userTryOutId ? (
        <div className="flex flex-col gap-[2rem] px-[1rem] md:px-0">
          <OnBoarding open={onBoarding.tryout} type="tryout" />
          <div className="font-regular flex flex-col gap-[.5rem]">
            <SummaryTryout />
          </div>

          <div className="font-regular flex flex-col gap-[.5rem]">
            <Terbaru id={tryoutAccount.userTryOutId} />
          </div>

          <div className="font-regular flex flex-col gap-[.5rem]">
            <Upcoming id={tryoutAccount.userTryOutId} />
          </div>

          <div className="font-regular flex flex-col gap-[.5rem]">
            <Done id={tryoutAccount.userTryOutId} />
          </div>

          <div className="font-regular flex flex-col gap-[.5rem]">
            <UpcomingOtherWeb id={tryoutAccount.userTryOutId} />
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {step === 1 ? (
            <div className="flex w-[calc(100%-2rem)] max-w-[380px] flex-col items-center rounded-[1.5rem] bg-white p-[2rem] text-center shadow-lg md:w-full">
              <div className="flex flex-col gap-[1rem]">
                <p className="font-semibold">Akun Belum Terverifikasi</p>
                <p className="font-regular text-main-gray-text">
                  Untuk menggunakan fitur try out, harap verifikasi akunmu
                  terlebih dahulu
                </p>
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  className="w-[156px] rounded-[.8rem] py-[.8rem] text-[.85rem] font-medium text-main-gray-text duration-200 md:hover:text-main-gray-text2"
                  onClick={() => Router.back()}
                >
                  Kembali
                </button>
                <button
                  className="font-regular w-[156px] rounded-[.8rem] bg-main py-[.8rem] text-[.85rem] text-white duration-200 hover:bg-main/85"
                  onClick={() => setStep(2)}
                >
                  Verifikasi Akun
                </button>
              </div>
            </div>
          ) : (
            <RegistrationTryOut
              getUserTryout={getUserTryout}
              isHideGeneralSection={isHideGeneralSection}
              isHideTargetValue={isHideTargetValue}
              univOption={univOption}
            />
          )}
        </div>
      )}
    </div>
  );
};
