'use client';

import { RegistrationUserTryout } from '@/components/_shared/account/registration-user-tryout';
import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { toaster } from '@/components/ui/toaster';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Done from './_components/done';
import Terbaru from './_components/terbaru';
import DialogRecomendation from './_components/ui/dialog-recomendation';
import OnBoarding from './_components/ui/onboarding';
import SummaryTryout from './_components/ui/summary-tryout';
import Upcoming from './_components/upcoming';
import UpcomingOtherWeb from './_components/upcoming-other-web';

export default function TryOutPage() {
  const Router = useRouter();
  const pathname = usePathname();
  // const isTesting = pathname?.toLowerCase().includes('testing') || false;
  const searchParams = useSearchParams();
  const payment = searchParams?.get('payment');

  useEffect(() => {
    if (payment === 'success') {
      toaster({
        title: 'Success',
        description: 'Pembelian Berhasil',
        condition: 'success',
      });
      Router.push(`/${website_sub_category_id}/user/bimarena/try-out`);
    }
  }, [payment]);

  useEffect(() => {
    // ✅ ENRICHED VIEWCONTENT EVENT DATA
    trackUnifiedEvent({
      eventName: 'ViewContent',
      customData: {
        content_name: 'Tryout Page',
        content_type: 'page',
        page_path: `/user/bimarena/try-out`,
        content_id: 'tryout_page_main',
      },
    });
  }, []);

  return (
    <div>
      <Content />
    </div>
  );
}

const Content = () => {
  const searchParams = useSearchParams();
  const order_id = searchParams?.get('order_id');
  const transaction_status = searchParams?.get('transaction_status');
  const register_tryout = searchParams?.get('register_tryout');

  const Router = useRouter();
  const { data: session } = useSession();
  const { onBoarding, setOnBoarding } = useAppContext();

  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tryoutAccount, setTryoutAccount] = useState<{
    userTryOutId: string;
  }>();

  const [isHideGeneralSection, setIsHideGeneralSection] =
    useState<boolean>(false);
  const [isHideTargetValue, setIsHideTargetValue] = useState<boolean>(false);

  const [univOption, setUnivOption] = useState<string | undefined>();

  const getUserTryout = async () => {
    getGeneral(`/user/getUserTryOut?userId=${session?.user.id}`, {
      setData: setTryoutAccount,
      setLoading: setIsLoading,
      toast: {
        hideError: true,
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
    getUserTryout();
  }, []);

  useEffect(() => {
    const getOnboarding = localStorage.getItem('on-boarding');
    const onBoarding = {
      chat: true,
      notes: true,
      quiz: true,
      tryout: true,
    };
    if (!getOnboarding) {
      localStorage.setItem('on-boarding', JSON.stringify(onBoarding));
    } else {
      const data = JSON.parse(getOnboarding);
      const isValid =
        data &&
        typeof data.chat === 'boolean' &&
        typeof data.notes === 'boolean' &&
        typeof data.quiz === 'boolean' &&
        typeof data.tryout === 'boolean';
      if (isValid) {
        setOnBoarding({ ...data });
      }
    }
  }, []);

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (register_tryout === 'success' || (order_id && transaction_status)) {
      setOpen(true);
    }
  }, [register_tryout, order_id, transaction_status]);

  if (isLoading) return null;

  return (
    <RegistrationUserTryout
      getUserTryout={({ userTryOutId }) => {
        setTryoutAccount({ userTryOutId });
      }}
    >
      <div className="relative">
        <div className="min-h-screen">
          <div className="container mx-auto max-w-7xl px-4 py-8">
            <DialogRecomendation
              openExternal={open}
              setOpenExternal={setOpen}
            />
            <OnBoarding
              open={onBoarding.tryout}
              type="tryout"
            />

            {/* Sections with consistent mb-12 spacing */}
            <SummaryTryout />
            {tryoutAccount?.userTryOutId && (
              <>
                <Terbaru id={tryoutAccount!.userTryOutId} />
                <Upcoming id={tryoutAccount!.userTryOutId} />
                <Done id={tryoutAccount!.userTryOutId} />
                <UpcomingOtherWeb id={tryoutAccount!.userTryOutId} />
              </>
            )}
          </div>
        </div>
      </div>
    </RegistrationUserTryout>
  );
};
