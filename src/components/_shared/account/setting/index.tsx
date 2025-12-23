import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toaster } from '@/components/ui/toaster';
import { env } from '@/env.mjs';
import axiosInstance from '@/lib/axios/axiosInstance';
import { useGet } from '@/lib/fetch-helper/useGet';
import { response, responseError } from '@/lib/response';
import { cn, imageProfile } from '@/lib/utils';
import { supabase } from '@/supabaseClient';
import {
  Subscription,
  SubscriptionInstallment,
  SubscriptionInstallmentLimitation,
  Transaction,
} from '@/types/database';
import Cookies from 'js-cookie';
import { Coins, Crown, History, Settings, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AccountTab } from './components/account-tab';
import { HistoryPaymentTab } from './components/history-payment-tab';
import { SubscriptionTab } from './components/subscription-tab';
import { TabInstallment } from './components/tab-installment';

// HistoryPayment Component
export default function AccountSetting() {
  const router = useRouter();
  const {
    setTransactionPopUp,
    setPagesSetting: setPage,
    pagesSetting: page,
  } = useAppContext();
  const { websiteSubCategory } = useWebsiteSubCategory();

  console.log({ page });

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  // const [page, setPage] = useState<string>(pages ? pages : 'account');
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<File | undefined>();
  const [preview, setPreview] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string>('');

  const { data: session } = useSession();

  const [isShow, setIsShow] = useState<boolean>(false);

  const { data: paymentData, refetch } = useGet<{
    waiting: Transaction[];
    riwayat: Transaction[];
    installment: (Subscription & {
      SubscriptionInstallment: (SubscriptionInstallment & {
        SubscriptionInstallmentLimitation?: SubscriptionInstallmentLimitation | null;
        paymentLink: string | null;
      })[];
    })[];
  }>('/payment/getPaymentInProses', {
    params: {
      userId: session?.user.id,
    },
    toast: {
      hideError: true,
    },
    onError({ status, message }) {
      if (status !== 403) {
        toaster({
          title: 'Gagal',
          description: message,
          condition: 'warning',
        });
      }
    },
    enabled: !!session,
    useEffectDependencies: [session, page],
  });

  const data = paymentData || { waiting: [], riwayat: [] };

  console.log({ intallmenr: paymentData?.installment });

  // useEffect(() => {
  //   getGeneral(`/payment/getPaymentInProses?userId=${session?.user.id}`, {
  //     setData: setData,
  //   });
  // }, [session, page]);

  useEffect(() => {
    if (data.waiting.length > 0 && !isShow) {
      setPage('history');
      setIsShow(true);
    }
  }, [data, isShow]);

  const handlePay = async (token: string) => {
    window.snap.pay(token, {
      onClose: () => {
        toaster({
          title: 'Gagal',
          description: 'Pembayaran belum selesai!',
          condition: 'warning',
        });
      },
    });
  };

  const updateProfileImage = async (data: any) => {
    try {
      const res = await axiosInstance.put(`/user/updateProfileImage`, data);
      setProfile(undefined);
      setTimeout(() => {
        router.refresh();
      }, 500);
      return response(res, true);
    } catch (error) {
      return responseError(error, true);
    }
  };

  const handleChangeProfile = async () => {
    try {
      setLoading(true);
      if (profile) {
        const fileName = `${
          env.NEXT_PUBLIC_SUPABASE_URL
        }/storage/v1/object/public/img/${session?.user.id}-${new Date()}`;
        const { data, error } = await supabase.storage
          .from('img')
          .upload(`${session?.user.id}-${new Date()}`, profile);
        if (data) {
          setProfileImage(fileName);
          Cookies.set('image-profile', fileName);
          await updateProfileImage({ image: fileName });
          setLoading(false);
        }
        if (error) {
          toaster({
            title: 'Upss',
            condition: 'warning',
            description: 'Gagal upload gambar profil!',
            duration: 3000,
          });
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  // Preview image when profile changes
  useEffect(() => {
    setPreview('');
    if (profile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
      };

      reader.readAsDataURL(profile);
    }
  }, [profile]);

  // Set initial profile image
  useEffect(() => {
    if (imageProfile && imageProfile !== 'null') {
      setProfileImage(imageProfile);
    }
  }, []);

  const tabs = [
    {
      value: 'account',
      label: 'Akun',
      icon: <User className="w-4 h-4" />,
    },
    {
      value: 'subscription',
      label: 'Subscription',
      icon: <Crown className="w-4 h-4" />,
    },
    {
      value: 'installment',
      label: 'Cicilan',
      icon: <Coins className="w-4 h-4" />,
    },
    {
      value: 'history',
      label: 'Riwayat',
      icon: <History className="w-4 h-4" />,
    },
  ];

  return (
    <div
      className={cn(
        'fixed inset-0 z-1000 flex items-center justify-center bg-black/50 backdrop-blur-sm',
        page === undefined && 'hidden',
      )}
    >
      <div className="w-full max-w-4xl h-full max-h-[90vh] m-4 bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100">
        {/* Header with Gradient */}
        <div
          className="relative px-8 py-6 text-white overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-3xl font-black mb-2 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                  <Settings className="w-6 h-6" />
                </div>
                Pengaturan Profil
              </h1>
              <p className="text-white/90 font-medium">
                Kelola akun dan preferensi Kamu
              </p>
            </div>
            <Button
              onClick={() => setPage(undefined)}
              className="rounded-2xl bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 shadow-sm hover:shadow-md"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-full flex-col overflow-hidden">
          <Tabs
            value={page}
            onValueChange={setPage as any}
            className="w-full flex flex-col flex-1 overflow-hidden"
          >
            {/* Tabs Navigation */}
            <div className="border-b-2 border-gray-100 bg-gray-50/50">
              <TabsList className="grid w-full grid-cols-4 bg-transparent p-0 h-auto">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold transition-all duration-300 data-[state=active]:bg-white rounded-none border-b-2 cursor-pointer hover:bg-gray-100/50 relative text-gray-600"
                    isActiveClassName="bg-main/20 text-main"
                    style={{
                      borderColor:
                        page === tab.value ? mainColor : 'transparent',
                      color: page === tab.value ? mainColor : undefined,
                    }}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-hidden">
              <TabsContent
                value="account"
                className="mt-0 h-full overflow-y-auto"
              >
                <AccountTab
                  session={session}
                  profile={profile}
                  setProfile={setProfile}
                  preview={preview}
                  profileImage={profileImage}
                  loading={loading}
                  handleChangeProfile={handleChangeProfile}
                  mainColor={mainColor}
                  secondaryColor={secondaryColor}
                />
              </TabsContent>

              <TabsContent
                value="subscription"
                className="mt-0 h-full overflow-y-auto"
              >
                <SubscriptionTab
                  data={data}
                  handlePay={handlePay}
                  setTransactionPopUp={setTransactionPopUp}
                  mainColor={mainColor}
                  secondaryColor={secondaryColor}
                />
              </TabsContent>

              <TabsContent
                value="installment"
                className="mt-0 h-full overflow-y-auto"
              >
                <TabInstallment
                  installment={paymentData?.installment || []}
                  mainColor={mainColor}
                  secondaryColor={secondaryColor}
                />
              </TabsContent>

              <TabsContent
                value="history"
                className="mt-0 h-full overflow-y-auto"
              >
                <HistoryPaymentTab
                  data={data.riwayat as any}
                  mainColor={mainColor}
                  secondaryColor={secondaryColor}
                  refetch={refetch}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
