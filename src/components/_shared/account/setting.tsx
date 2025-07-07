import male from '@/_assets/default-profile/male.png';
import ButtonPayment from '@/app/[web_sub_category]/(user)/user/_components/button-payment';
import { useAppContext } from '@/components/provider/provider-app';
import { useUserLimitation } from '@/components/provider/provider-limitation';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toaster } from '@/components/ui/toaster';
import { env } from '@/env.mjs';
import axiosInstance from '@/lib/axios/axiosInstance';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { response, responseError } from '@/lib/response';
import {
  getDateString,
  getHours,
  getHoursDetail,
  imageProfile,
} from '@/lib/utils';
import { IconCopy, IconCrown } from '@/styles/icon';
import { supabase } from '@/supabaseClient';
import { Transaction } from '@/types/database';
import Cookies from 'js-cookie';
import { CreditCard, Crown, History, Settings, User, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// HistoryPayment Component
const HistoryPayment = ({ pages }: { pages?: string }) => {
  const router = useRouter();
  const { setTransactionPopUp, setTransactionHistory } = useAppContext();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [page, setPage] = useState<string>(pages ? pages : 'account');
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<File | undefined>();
  const [preview, setPreview] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string>('');

  const { data: session } = useSession();

  const [data, setData] = useState<{
    waiting: Transaction[];
    riwayat: Transaction[];
  }>({ riwayat: [], waiting: [] });

  useEffect(() => {
    getGeneral(`/payment/getPaymentInProses?userId=${session?.user.id}`, {
      setData: setData,
    });
  }, [session]);

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
      value: 'history',
      label: 'Riwayat',
      icon: <History className="w-4 h-4" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl h-full max-h-[90vh] m-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b border-gray-200 relative overflow-hidden"
          style={{ backgroundColor: `${mainColor}05` }}
        >
          <div className="relative z-10">
            <h1
              className="text-2xl font-bold flex items-center gap-3"
              style={{ color: mainColor }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${mainColor}15` }}
              >
                <Settings
                  className="w-5 h-5"
                  style={{ color: mainColor }}
                />
              </div>
              Pengaturan Profil
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola akun dan preferensi Anda
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTransactionHistory(false)}
            className="rounded-xl hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Decorative elements */}
          <div
            className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
            style={{ backgroundColor: mainColor }}
          />
        </div>

        {/* Content */}
        <div className="flex h-full">
          <Tabs
            value={page}
            onValueChange={setPage}
            className="w-full flex flex-col"
          >
            {/* Sidebar Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50/50">
              <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 h-auto">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 rounded-none border-b-2 border-transparent"
                    style={{
                      borderColor:
                        page === tab.value ? mainColor : 'transparent',
                      color: page === tab.value ? mainColor : undefined,
                    }}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-auto">
              <TabsContent
                value="account"
                className="mt-0 h-full"
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
                />
              </TabsContent>

              <TabsContent
                value="subscription"
                className="mt-0 h-full"
              >
                <SubscriptionTab
                  data={data}
                  handlePay={handlePay}
                  setTransactionPopUp={setTransactionPopUp}
                  setTransactionHistory={setTransactionHistory}
                  mainColor={mainColor}
                />
              </TabsContent>

              <TabsContent
                value="history"
                className="mt-0 h-full"
              >
                <HistoryTab
                  data={data}
                  mainColor={mainColor}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Account Tab Component
const AccountTab = ({
  session,
  profile,
  setProfile,
  preview,
  profileImage,
  loading,
  handleChangeProfile,
  mainColor,
}: any) => (
  <div className="p-6 space-y-6">
    <Card className="border-2 border-gray-100 rounded-2xl shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle
          className="text-lg font-bold flex items-center gap-2"
          style={{ color: mainColor }}
        >
          <User className="w-5 h-5" />
          Informasi Akun
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <input
              id="ubahFotoProfile"
              type="file"
              className="absolute inset-0 w-0 h-0 opacity-0"
              onChange={(e) => {
                if (e.target.files) {
                  setProfile(e.target.files[0]);
                }
              }}
            />
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-gray-100 shadow-lg">
              <Image
                src={preview || profileImage || male}
                alt="Profile"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            {profile && (
              <div
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                style={{ backgroundColor: mainColor }}
              >
                ✓
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {session?.user?.name}
              </h3>
              <p className="text-gray-600">{session?.user.email}</p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() =>
                  document.getElementById('ubahFotoProfile')?.click()
                }
                className="rounded-xl border-2 hover:shadow-md transition-all duration-200"
                style={{ borderColor: `${mainColor}40`, color: mainColor }}
              >
                <User className="w-4 h-4 mr-2" />
                Ubah Foto
              </Button>

              {profile && !loading && (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setProfile(undefined)}
                    className="rounded-xl"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleChangeProfile}
                    className="rounded-xl text-white"
                    style={{ backgroundColor: mainColor }}
                  >
                    Simpan
                  </Button>
                </>
              )}

              {loading && (
                <div className="flex items-center px-4">
                  <Spinner />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Subscription Tab Component
const SubscriptionTab = ({
  data,
  handlePay,
  setTransactionPopUp,
  setTransactionHistory,
  mainColor,
}: any) => (
  <div className="p-6 space-y-6">
    <div className="text-center mb-6">
      <h2
        className="text-xl font-bold mb-2"
        style={{ color: mainColor }}
      >
        Subscription & Coin
      </h2>
      <p className="text-gray-600">Kelola langganan dan tagihan Anda</p>
    </div>

    {data?.waiting?.length > 0 ? (
      <Card className="border-2 border-yellow-200 bg-yellow-50 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg text-yellow-700 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Tagihan Pending
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.waiting.map((item: any, i: number) => (
            <PaymentCard
              key={i}
              item={item}
              handlePay={handlePay}
              mainColor={mainColor}
            />
          ))}
        </CardContent>
      </Card>
    ) : (
      <Card className="border-2 border-gray-100 rounded-2xl">
        <CardContent className="p-6">
          <Plans />
          <div className="mt-6 pt-6 border-t border-gray-200">
            <ButtonPayment text="Upgrade Subscription" />
          </div>
        </CardContent>
      </Card>
    )}
  </div>
);

// History Tab Component
const HistoryTab = ({ data, mainColor }: any) => (
  <div className="p-6 space-y-6">
    <Card className="border-2 border-gray-100 rounded-2xl">
      <CardHeader>
        <CardTitle
          className="text-lg font-bold flex items-center gap-2"
          style={{ color: mainColor }}
        >
          <History className="w-5 h-5" />
          Riwayat Transaksi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {data?.riwayat?.length > 0 ? (
            data.riwayat.map((item: any, i: number) => (
              <TransactionCard
                key={i}
                item={item}
                mainColor={mainColor}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada riwayat transaksi</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
);

// Payment Card Component
const PaymentCard = ({ item, handlePay, mainColor }: any) => (
  <Card className="border border-gray-200 rounded-xl">
    <CardContent className="p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{item.item_details[0]?.name || '-'}</h3>
          <Crown className="w-4 h-4 text-yellow-500" />
        </div>
        <Button
          variant="ghost"
          size="sm"
        >
          <IconCopy className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Nominal</p>
          <p className="font-bold text-lg">
            {item.transaction_details.gross_amount.toLocaleString('id-ID', {
              style: 'currency',
              currency: 'IDR',
            })}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Batas Waktu</p>
          <p className="font-medium">
            {getDateString(item.expired_time)} •{' '}
            {getHoursDetail(item.expired_time)}
          </p>
        </div>
      </div>

      <Button
        onClick={() => handlePay(item.token)}
        className="w-full rounded-xl text-white"
        style={{ backgroundColor: mainColor }}
      >
        Bayar Sekarang
      </Button>
    </CardContent>
  </Card>
);

// Transaction Card Component
const TransactionCard = ({ item, mainColor }: any) => (
  <Card className="border border-gray-200 rounded-xl">
    <CardContent className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">
            {item.item_details[0]?.name || '-'}
          </h3>
          <Crown className="w-4 h-4 text-yellow-500" />
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            item.settlement_time
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {item.settlement_time ? 'Berhasil' : 'Pending'}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <p>
          {getDateString(item.transaction_time)} •{' '}
          {getHours(item.transaction_time)}
        </p>
        <div className="flex items-center gap-1">
          <span>ID: {item.transaction_details.order_id}</span>
          <IconCopy className="w-3 h-3" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Plans Component
const Plans = () => {
  const { userLimitation } = useUserLimitation();
  const { data: session } = useSession();
  const features = session?.user.feature;
  const role = session?.user.role;
  const tier = session?.user.tier;
  return (
    <div className="flex flex-col gap-[1.5rem] rounded-[1.5rem] bg-bg-layout p-[1rem]">
      <div
        id="heading"
        className="flex flex-col"
      >
        <div className="flex items-center gap-[.5rem]">
          <p className="font-semibold">{tier ? tier : 'Gratis'}</p>
          {tier && <IconCrown className="text-main-yellow" />}
        </div>
      </div>
      <div
        id="info"
        className="grid grid-cols-2 gap-y-[2rem]"
      >
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-main-gray-text">Akses bahan ajar</p>
          <h1 className="text-[1rem] font-medium">
            {!features?.course ? 'Terbatas' : 'Semua'}
          </h1>
        </div>
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-main-gray-text">Akses Document</p>
          <h1 className="text-[1rem] font-medium">
            {!features?.document ? 'Terbatas' : 'Semua'}
          </h1>
        </div>
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-main-gray-text">Chat AI</p>
          <h1 className="text-[1rem] font-medium">
            {role === 'ADMIN' ? '-' : userLimitation?.chat}/
            {userLimitation?.chatLimit
              ? userLimitation?.chatLimit
              : 'Unlimited'}{' '}
            <span className="font-regular text-[.8rem] text-main-gray-disabled">
              coin
            </span>
          </h1>
        </div>
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-main-gray-text">Notes</p>
          <h1 className="text-[1rem] font-medium">
            {role === 'ADMIN' ? '-' : userLimitation?.notes}/
            {userLimitation?.notesLimit
              ? userLimitation?.notesLimit
              : 'Unlimited'}{' '}
            <span className="font-regular text-[.8rem] text-main-gray-disabled">
              coin
            </span>
          </h1>
        </div>
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-main-gray-text">Quiz</p>
          <h1 className="text-[1rem] font-medium">
            {role === 'ADMIN' ? '-' : userLimitation?.quiz}/
            {userLimitation?.quizLimit
              ? userLimitation?.quizLimit
              : 'Unlimited'}{' '}
            <span className="font-regular text-[.8rem] text-main-gray-disabled">
              coin
            </span>
          </h1>
        </div>
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-main-gray-text">Tryout</p>
          <h1 className="text-[1rem] font-medium">
            {role === 'ADMIN' ? '-' : userLimitation?.tryout}/
            {userLimitation?.tryoutLimit
              ? userLimitation?.tryoutLimit
              : 'Unlimited'}{' '}
            <span className="font-regular text-[.8rem] text-main-gray-disabled">
              coin
            </span>
          </h1>
        </div>
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-main-gray-text">Vision</p>
          <h1 className="text-[1rem] font-medium">
            {role === 'ADMIN' ? '-' : userLimitation?.vision}/
            {userLimitation?.visionLimit
              ? userLimitation?.visionLimit
              : 'Unlimited'}{' '}
            <span className="font-regular text-[.8rem] text-main-gray-disabled">
              coin
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default HistoryPayment;
