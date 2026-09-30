'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { toaster } from '@/components/ui/toaster';
import { env } from '@/env.mjs';
import axiosInstance from '@/lib/axios/axiosInstance';
import { useGet } from '@/lib/fetch-helper/useGet';
import { response, responseError } from '@/lib/response';
import { cn, imageProfile } from '@/lib/utils';
import { storage } from '@/supabaseClient';
import {
  Subscription,
  SubscriptionInstallment,
  SubscriptionInstallmentLimitation,
  Transaction,
} from '@/types/database';
import Cookies from 'js-cookie';
import { Coins, Crown, GraduationCap, History, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AccountTab } from './components/account-tab';
import { HistoryPaymentTab } from './components/history-payment-tab';
import { SubscriptionTab } from './components/subscription-tab';
import { TabInstallment } from './components/tab-installment';
import { TargetTab } from './components/target-tab';

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
      const res = await axiosInstance.post(`/user/updateProfileImage`, data);
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
        const { data, error } = await storage
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
    { value: 'account', label: 'Akun', icon: User },
    { value: 'target', label: 'Target', icon: GraduationCap },
    { value: 'subscription', label: 'Subscription', icon: Crown },
    { value: 'installment', label: 'Cicilan', icon: Coins },
    { value: 'history', label: 'Riwayat', icon: History },
  ];

  return (
    <div
      className={cn(
        'fixed inset-0 z-1000 flex items-center justify-center bg-black/40 backdrop-blur-sm',
        page === undefined && 'hidden',
      )}
    >
      {/* Backdrop click to close */}
      <div
        className="absolute inset-0"
        onClick={() => setPage(undefined)}
      />

      <div className="relative w-full max-w-xl max-h-[80vh] m-4 bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl flex flex-col">
        {/* Header */}
        <div
          className="px-6 py-5 flex items-center justify-between shrink-0"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
        >
          <div>
            <h1 className="text-lg font-black text-white">Pengaturan Profil</h1>
            <p className="text-xs text-white/60 mt-0.5">
              Kelola akun dan preferensi kamu
            </p>
          </div>
          <button
            onClick={() => setPage(undefined)}
            className="w-8 h-8 rounded-3xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Custom Pill Tabs */}
        <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-100 shrink-0">
          <div className="flex gap-1 p-1 bg-slate-100 rounded-3xl">
            {tabs.map((tab) => {
              const isActive = page === tab.value;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.value}
                  onClick={() => (setPage as any)(tab.value)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-3xl transition-all cursor-pointer',
                    isActive
                      ? 'text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-600',
                  )}
                  style={isActive ? { backgroundColor: mainColor } : undefined}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {page === 'account' && (
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
          )}
          {page === 'target' && (
            <TargetTab
              userId={session?.user.id}
              websiteSubCategoryId={websiteSubCategory?.id}
              mainColor={mainColor}
              secondaryColor={secondaryColor}
            />
          )}
          {page === 'subscription' && (
            <SubscriptionTab
              data={data}
              handlePay={handlePay}
              setTransactionPopUp={setTransactionPopUp}
              mainColor={mainColor}
              secondaryColor={secondaryColor}
            />
          )}
          {page === 'installment' && (
            <TabInstallment
              installment={paymentData?.installment || []}
              mainColor={mainColor}
              secondaryColor={secondaryColor}
            />
          )}
          {page === 'history' && (
            <HistoryPaymentTab
              data={data.riwayat as any}
              mainColor={mainColor}
              refetch={refetch}
            />
          )}
        </div>
      </div>
    </div>
  );
}
