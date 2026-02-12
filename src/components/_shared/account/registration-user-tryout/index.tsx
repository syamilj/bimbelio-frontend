import { useSession } from '@/components/provider/provider-session-auth';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { GenderEnum } from '@/types/database';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import RegistrationTryOut from './registration-try-out';

export const RegistrationUserTryout = ({
  children,
  getUserTryout,
}: {
  children: ReactNode;
  getUserTryout?: (data: DataType) => void;
}) => {
  const Router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isHideGeneralSection, setIsHideGeneralSection] =
    useState<boolean>(false);
  const [isHideTargetValue, setIsHideTargetValue] = useState<boolean>(false);

  const [univOption, setUnivOption] = useState<string | undefined>();
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  const fetchUserTryout = async () => {
    getGeneral(`/user/getUserTryOut?userId=${session?.user.id}`, {
      // setData: setTryoutAccount,
      setLoading: setIsLoading,
      toast: {
        hideError: true,
      },
      onSuccess({ data }) {
        console.log('data tryout user', data);
        if (data?.userTryOutId) {
          setIsRegistered(true);
        }
        if (data && getUserTryout) {
          getUserTryout(data as any);
        }
      },
      onError({ data }) {
        const getData: {
          hideGeneral: boolean;
          hideTargetValue: boolean;
          universityOption: string | undefined;
        } = data;
        if (getData.hideGeneral) setIsHideGeneralSection(true);
        if (getData.hideTargetValue) setIsHideTargetValue(true);
        if (getData.universityOption) setUnivOption(getData.universityOption);
      },
    });
  };

  useEffect(() => {
    fetchUserTryout();
  }, []);

  if (isLoading) return null;

  if (isRegistered && !isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {step === 1 ? (
        <div className="flex w-[calc(100%-2rem)] max-w-[380px] flex-col items-center rounded-3xl bg-white p-8 text-center shadow-lg md:w-full">
          <div className="flex flex-col gap-4">
            <p className="font-semibold">Akun Belum Terverifikasi</p>
            <p className="font-regular text-main-gray-text">
              Untuk menggunakan fitur try out, harap verifikasi akunmu terlebih
              dahulu
            </p>
          </div>
          <div className="mt-4 flex gap-4">
            <button
              className="w-[156px] rounded-3xl py-[.8rem] text-[.85rem] font-medium text-main-gray-text duration-200 md:hover:text-main-gray-text2 cursor-pointer"
              onClick={() => Router.back()}
            >
              Kembali
            </button>
            <button
              className="font-regular w-[156px] rounded-3xl bg-main py-[.8rem] text-[.85rem] text-white duration-200 hover:bg-main/85 cursor-pointer"
              onClick={() => setStep(2)}
            >
              Verifikasi Akun
            </button>
          </div>
        </div>
      ) : (
        <RegistrationTryOut
          getUserTryout={fetchUserTryout}
          isHideGeneralSection={isHideGeneralSection}
          isHideTargetValue={isHideTargetValue}
          univOption={univOption}
        />
      )}
    </div>
  );
};

type DataType = {
  gender: GenderEnum;
  age: number;
  phone: string;
  kabupaten: string;
  provinsi: string;
  channel: string;
  website_sub_category_id: string;
  id: string;
  userTryOutId: string;
  targetValue: number | null;
  univChoiceOne: string | null;
  univStudyChoiceOne: string | null;
  univChoiceTwo: string | null;
  univStudyChoiceTwo: string | null;
};
