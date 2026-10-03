'use client';

import { RegistrationUserTryout } from '@/components/_shared/account/registration-user-tryout';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { ScrollWrapper } from '@/components/ui/scroll-wrapper';
import { toaster } from '@/components/ui/toaster';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { cn } from '@/lib/utils';
import { Calendar, CheckCircle, Globe, Zap } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import Done from './_components/done';
import Terbaru from './_components/terbaru';
import DialogRecomendation from './_components/ui/dialog-recomendation';
// import OnBoarding from './_components/ui/onboarding';
import SummaryTryout from './_components/ui/summary-tryout';
import Upcoming from './_components/upcoming';
import UpcomingOtherWeb from './_components/upcoming-other-web';

export default function TryOutPage() {
  const Router = useRouter();
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

const TAB_IDS = ['berlangsung', 'akan-datang', 'selesai', 'lainnya'] as const;
type TabId = (typeof TAB_IDS)[number];

const Content = () => {
  const searchParams = useSearchParams();
  const order_id = searchParams?.get('order_id');
  const transaction_status = searchParams?.get('transaction_status');
  const register_tryout = searchParams?.get('register_tryout');

  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tryoutAccount, setTryoutAccount] = useState<{
    userTryOutId: string;
  }>();

  const [_isHideGeneralSection, setIsHideGeneralSection] =
    useState<boolean>(false);
  const [_isHideTargetValue, setIsHideTargetValue] = useState<boolean>(false);

  const [_univOption, setUnivOption] = useState<string | undefined>();

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
        if (getData?.hideGeneral) setIsHideGeneralSection(true);
        if (getData?.hideTargetValue) setIsHideTargetValue(true);
        if (getData?.universityOption) setUnivOption(getData.universityOption);
      },
    });
  };

  useEffect(() => {
    getUserTryout();
  }, []);

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (register_tryout === 'success' || (order_id && transaction_status)) {
      setOpen(true);
    }
  }, [register_tryout, order_id, transaction_status]);

  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0066FF';

  // --- Smart Tab Defaulting ---
  const [activeTab, setActiveTab] = useState<TabId>('berlangsung');
  const [tabCounts, setTabCounts] = useState<Record<TabId, number | null>>({
    berlangsung: null,
    'akan-datang': null,
    selesai: null,
    lainnya: null,
  });
  const hasAutoSelected = useRef(false);

  const handleCountReady = useCallback(
    (tabId: TabId) => (count: number) => {
      setTabCounts((prev) => ({ ...prev, [tabId]: count }));
    },
    [],
  );

  // Auto-select first non-empty tab once all counts are reported
  useEffect(() => {
    if (hasAutoSelected.current) return;
    // Wait until at least berlangsung is reported
    if (tabCounts.berlangsung === null) return;

    // Priority: berlangsung > akan-datang > selesai > lainnya
    for (const id of TAB_IDS) {
      const count = tabCounts[id];
      if (count === null) continue; // hasn't loaded yet
      if (count > 0) {
        setActiveTab(id);
        hasAutoSelected.current = true;
        return;
      }
    }

    // If berlangsung and akan-datang both reported 0, try selesai/lainnya
    const reported = TAB_IDS.filter((id) => tabCounts[id] !== null);
    if (reported.length >= 2 && !hasAutoSelected.current) {
      // All reported are 0, default to first one that has data, or stay on berlangsung
      const withData = reported.find((id) => (tabCounts[id] || 0) > 0);
      if (withData) {
        setActiveTab(withData);
        hasAutoSelected.current = true;
      } else if (reported.length === TAB_IDS.length) {
        // All loaded and all zero — stay on berlangsung
        hasAutoSelected.current = true;
      }
    }
  }, [tabCounts]);

  const tabItems: { id: TabId; label: string; icon: typeof Zap }[] = [
    {
      id: 'berlangsung',
      label: 'Aktif',
      icon: Zap,
    },
    {
      id: 'akan-datang',
      label: 'Mendatang',
      icon: Calendar,
    },
    {
      id: 'selesai',
      label: 'Selesai',
      icon: CheckCircle,
    },
    {
      id: 'lainnya',
      label: 'Explore',
      icon: Globe,
    },
  ];

  if (isLoading) return null;

  return (
    <RegistrationUserTryout
      getUserTryout={({ userTryOutId }) => {
        setTryoutAccount({ userTryOutId });
      }}
    >
      <div className="min-h-screen pb-12">
        <DialogRecomendation
          openExternal={open}
          setOpenExternal={setOpen}
        />
        {/* <OnBoarding type="tryout" /> */}

        {/* Hero Summary */}
        <div className="p-4 md:p-6">
          <SummaryTryout />
        </div>

        {/* Tab-based Content */}
        {tryoutAccount?.userTryOutId && (
          <div className="mx-auto max-w-7xl space-y-0 px-4 md:px-6">
            {/* Sleek Tab Navigation */}
            <div className="sticky top-0 z-30 bg-slate-50/80 py-2 backdrop-blur-xl">
              <ScrollWrapper className="flex gap-1.5 overflow-x-auto rounded-3xl border border-slate-200/80 bg-white p-1 shadow-sm">
                {tabItems.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const count = tabCounts[tab.id];
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'relative flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-3xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all md:text-sm',
                        isActive
                          ? 'text-white shadow-lg'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
                      )}
                    >
                      {/* Active bg via mainColor */}
                      {isActive && (
                        <div
                          className="absolute inset-0 rounded-3xl"
                          style={{ background: mainColor }}
                        />
                      )}
                      <div className="relative z-10 flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        <span>{tab.label}</span>
                        {count !== null && count > 0 && (
                          <span
                            className={cn(
                              'rounded-full px-1.5 py-0.5 text-[9px] leading-none font-black',
                              isActive
                                ? 'bg-white/25 text-white'
                                : 'bg-slate-100 text-slate-500',
                            )}
                          >
                            {count}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </ScrollWrapper>
            </div>

            {/* Tab Content Card */}
            <div className="mt-2 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
              <div className={cn(activeTab !== 'berlangsung' && 'hidden')}>
                <Terbaru
                  id={tryoutAccount!.userTryOutId}
                  onCountReady={handleCountReady('berlangsung')}
                />
              </div>
              <div className={cn(activeTab !== 'akan-datang' && 'hidden')}>
                <Upcoming
                  id={tryoutAccount!.userTryOutId}
                  onCountReady={handleCountReady('akan-datang')}
                />
              </div>
              <div className={cn(activeTab !== 'selesai' && 'hidden')}>
                <Done
                  id={tryoutAccount!.userTryOutId}
                  onCountReady={handleCountReady('selesai')}
                />
              </div>
              <div className={cn(activeTab !== 'lainnya' && 'hidden')}>
                <UpcomingOtherWeb
                  id={tryoutAccount!.userTryOutId}
                  onCountReady={handleCountReady('lainnya')}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </RegistrationUserTryout>
  );
};
