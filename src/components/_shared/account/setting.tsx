import male from '@/_assets/default-profile/male.png';
import ButtonPayment from '@/app/(main)/[web_sub_category]/(user)/user/_components/button-payment';
import { useAppContext } from '@/components/provider/provider-app';
import { useUserLimitation } from '@/components/provider/provider-limitation';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
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
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50 backdrop-blur-sm">
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
              onClick={() => setTransactionHistory(false)}
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
            onValueChange={setPage}
            className="w-full flex flex-col flex-1 overflow-hidden"
          >
            {/* Tabs Navigation */}
            <div className="border-b-2 border-gray-100 bg-gray-50/50">
              <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 h-auto">
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
                  setTransactionHistory={setTransactionHistory}
                  mainColor={mainColor}
                  secondaryColor={secondaryColor}
                />
              </TabsContent>

              <TabsContent
                value="history"
                className="mt-0 h-full overflow-y-auto"
              >
                <HistoryTab
                  data={data}
                  mainColor={mainColor}
                  secondaryColor={secondaryColor}
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
  secondaryColor,
}: any) => (
  <div className="p-8 space-y-6 mb-50">
    <div
      className="rounded-3xl p-8 text-white overflow-hidden relative border-2 border-white/20 shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
      }}
    >
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-8">
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
          <div
            className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl hover:shadow-2xl transition-all cursor-pointer"
            onClick={() => document.getElementById('ubahFotoProfile')?.click()}
          >
            <Image
              src={preview || profileImage || male}
              alt="Profile"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          {profile && (
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center bg-green-500 text-white text-sm font-bold shadow-lg">
              ✓
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-black mb-2">{session?.user?.name}</h3>
          <p className="text-white/90 mb-4 font-medium">
            {session?.user.email}
          </p>
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() =>
                document.getElementById('ubahFotoProfile')?.click()
              }
              className="rounded-2xl text-white font-bold bg-white/20 hover:bg-white/30 border-2 border-white/30 backdrop-blur-sm transition-all shadow-sm hover:shadow-md"
            >
              <User className="w-4 h-4 mr-2" />
              Ubah Foto
            </Button>

            {profile && !loading && (
              <>
                <Button
                  onClick={() => setProfile(undefined)}
                  className="rounded-2xl bg-white/10 hover:bg-white/20 text-white border-2 border-white/20 backdrop-blur-sm font-bold transition-all shadow-sm"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleChangeProfile}
                  className="rounded-2xl text-white font-bold bg-white/40 hover:bg-white/50 border-2 border-white/30 backdrop-blur-sm transition-all shadow-sm hover:shadow-md"
                >
                  Simpan
                </Button>
              </>
            )}

            {loading && (
              <div className="flex items-center px-4 bg-white/10 rounded-2xl backdrop-blur-sm border-2 border-white/20">
                <Spinner />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Account Details Card */}
    <Card className="border-2 border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
      <CardHeader className="pb-4">
        <CardTitle
          className="text-lg font-black flex items-center gap-2"
          style={{ color: mainColor }}
        >
          <div
            className="w-8 h-8 rounded-2xl flex items-center justify-center text-white"
            style={{ backgroundColor: mainColor }}
          >
            <User className="w-4 h-4" />
          </div>
          Informasi Akun
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-bold text-gray-500">Nama Lengkap</p>
          <p className="text-lg font-black text-gray-900">
            {session?.user?.name}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-bold text-gray-500">Email</p>
          <p className="text-lg font-black text-gray-900">
            {session?.user.email}
          </p>
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
  secondaryColor,
}: any) => (
  <div className="p-8 space-y-6">
    <div className="text-center mb-8">
      <h2
        className="text-2xl font-black mb-2"
        style={{ color: mainColor }}
      >
        Subscription & Coin
      </h2>
      <p className="text-gray-500 font-medium">
        Kelola langganan dan tagihan Kamu
      </p>
    </div>

    {data?.waiting?.length > 0 ? (
      <Card
        className="border-2 border-gray-100 rounded-3xl shadow-sm overflow-hidden"
        style={{
          borderTop: `4px solid ${mainColor}`,
        }}
      >
        <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b-2 border-orange-100">
          <CardTitle className="text-lg text-orange-700 font-black flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Tagihan Pending
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
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
      <Card className="border-2 border-gray-100 rounded-3xl shadow-sm">
        <CardContent className="p-8">
          <Plans />
          <div className="mt-8 pt-8 border-t-2 border-gray-100">
            <ButtonPayment text="Upgrade Subscription" />
          </div>
        </CardContent>
      </Card>
    )}
  </div>
);

// History Tab Component
const HistoryTab = ({ data, mainColor, secondaryColor }: any) => (
  <div className="p-8 space-y-6 mb-30">
    <div className="text-center mb-8 sticky top-0 bg-white pt-2 z-10">
      <h2
        className="text-2xl font-black mb-2"
        style={{ color: mainColor }}
      >
        Riwayat Transaksi
      </h2>
      <p className="text-gray-500 font-medium">Lihat semua transaksi Kamu</p>
    </div>

    {data?.riwayat?.length > 0 ? (
      <div className="space-y-4 pb-4">
        {data.riwayat.map((item: any, i: number) => (
          <Card
            key={i}
            className="border-2 border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            style={{
              borderLeft: `4px solid ${mainColor}`,
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-2xl"
                    style={{
                      backgroundColor: `${mainColor}20`,
                    }}
                  >
                    <CreditCard
                      className="w-6 h-6"
                      style={{ color: mainColor }}
                    />
                  </div>
                  <div>
                    <p className="font-black text-gray-900">
                      {item.item_details?.[0]?.name || 'Transaksi'}
                    </p>
                    <p className="text-sm text-gray-500 font-medium">
                      {getDateString(item.transaction_time)} •{' '}
                      {getHours(item.transaction_time)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className="font-black text-lg"
                    style={{ color: mainColor }}
                  >
                    {item.transaction_details.gross_amount.toLocaleString(
                      'id-ID',
                      {
                        style: 'currency',
                        currency: 'IDR',
                      },
                    )}
                  </p>
                  <Badge
                    className="mt-2 font-bold text-xs rounded-xl"
                    style={{
                      backgroundColor:
                        item.transaction_status === 'SETTLEMENT'
                          ? '#10b981'
                          : item.transaction_status === 'PENDING'
                            ? '#f59e0b'
                            : item.transaction_status === 'EXPIRE'
                              ? '#f5260b'
                              : '#5e5e5e',
                      color: 'white',
                    }}
                  >
                    {item.transaction_status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <div
        className="rounded-3xl p-12 text-center border-2 border-gray-100"
        style={{
          background: `linear-gradient(135deg, ${mainColor}10, ${secondaryColor}10)`,
        }}
      >
        <History
          className="w-16 h-16 mx-auto mb-4"
          style={{ color: mainColor }}
        />
        <h3 className="text-lg font-black text-gray-900 mb-2">
          Belum ada riwayat transaksi
        </h3>
        <p className="text-gray-500 font-medium">
          Semua transaksi Kamu akan ditampilkan di sini
        </p>
      </div>
    )}
  </div>
);

// Payment Card Component
const PaymentCard = ({ item, handlePay, mainColor }: any) => (
  <Card className="border-2 border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
    <CardContent className="p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-black text-gray-900">
            {item.item_details[0]?.name || '-'}
          </h3>
          <Crown className="w-4 h-4 text-yellow-500" />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-xl"
        >
          <IconCopy className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500 font-bold">Nominal</p>
          <p className="font-black text-lg text-gray-900">
            {item.transaction_details.gross_amount.toLocaleString('id-ID', {
              style: 'currency',
              currency: 'IDR',
            })}
          </p>
        </div>
        <div>
          <p className="text-gray-500 font-bold">Batas Waktu</p>
          <p className="font-bold text-gray-900">
            {getDateString(item.expired_time)} •{' '}
            {getHoursDetail(item.expired_time)}
          </p>
        </div>
      </div>

      <Button
        onClick={() => handlePay(item.token)}
        className="w-full rounded-2xl text-white font-bold border-2 shadow-sm hover:shadow-md"
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
    <div className="flex flex-col gap-6 rounded-3xl bg-gray-50 p-6 border-2 border-gray-100">
      <div
        id="heading"
        className="flex flex-col"
      >
        <div className="flex items-center gap-[.5rem]">
          <p className="font-black text-gray-900">{tier ? tier : 'Gratis'}</p>
          {tier && <IconCrown className="text-main-yellow" />}
        </div>
      </div>
      <div
        id="info"
        className="grid grid-cols-2 gap-y-8"
      >
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-gray-500 font-bold">
            Akses bahan ajar
          </p>
          <h1 className="text-[1rem] font-black text-gray-900">
            {!features?.course ? 'Terbatas' : 'Semua'}
          </h1>
        </div>
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-gray-500 font-bold">Akses Document</p>
          <h1 className="text-[1rem] font-black text-gray-900">
            {!features?.document ? 'Terbatas' : 'Semua'}
          </h1>
        </div>
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-gray-500 font-bold">Chat AI</p>
          <h1 className="text-[1rem] font-black text-gray-900">
            {role === 'ADMIN' ? '-' : userLimitation?.chat}/
            {userLimitation?.chatLimit
              ? userLimitation?.chatLimit
              : 'Unlimited'}{' '}
            <span className="font-medium text-[.8rem] text-gray-400">coin</span>
          </h1>
        </div>
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-gray-500 font-bold">Notes</p>
          <h1 className="text-[1rem] font-black text-gray-900">
            {role === 'ADMIN' ? '-' : userLimitation?.notes}/
            {userLimitation?.notesLimit
              ? userLimitation?.notesLimit
              : 'Unlimited'}{' '}
            <span className="font-medium text-[.8rem] text-gray-400">coin</span>
          </h1>
        </div>
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-gray-500 font-bold">Quiz</p>
          <h1 className="text-[1rem] font-black text-gray-900">
            {role === 'ADMIN' ? '-' : userLimitation?.quiz}/
            {userLimitation?.quizLimit
              ? userLimitation?.quizLimit
              : 'Unlimited'}{' '}
            <span className="font-medium text-[.8rem] text-gray-400">coin</span>
          </h1>
        </div>
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-gray-500 font-bold">Tryout</p>
          <h1 className="text-[1rem] font-black text-gray-900">
            {role === 'ADMIN' ? '-' : userLimitation?.tryout}/
            {userLimitation?.tryoutLimit
              ? userLimitation?.tryoutLimit
              : 'Unlimited'}{' '}
            <span className="font-medium text-[.8rem] text-gray-400">coin</span>
          </h1>
        </div>
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-gray-500 font-bold">Vision</p>
          <h1 className="text-[1rem] font-black text-gray-900">
            {role === 'ADMIN' ? '-' : userLimitation?.vision}/
            {userLimitation?.visionLimit
              ? userLimitation?.visionLimit
              : 'Unlimited'}{' '}
            <span className="font-medium text-[.8rem] text-gray-400">coin</span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default HistoryPayment;
