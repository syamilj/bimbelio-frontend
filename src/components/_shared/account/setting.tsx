import male from '@/_assest/default-profile/male.png';
import ButtonPayment from '@/app/(user)/user/_components/button-payment';
import { useAppContext } from '@/components/provider/provider-app';
import { useUserLimitation } from '@/components/provider/provider-limitation';
import { useSession } from '@/components/provider/session-provider-auth';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toaster } from '@/components/ui/toaster';
import { env } from '@/env.mjs';
import axiosInstance from '@/lib/axios/axiosInstance';
import { getGeneral } from '@/lib/fetch-helper';
import { response, responseError } from '@/lib/response';
import {
  getDateString,
  getHours,
  getHoursDetail,
  imageProfile,
} from '@/lib/utils';
import { IconCopy, IconCrown, IconX } from '@/styles/icon';
import { supabase } from '@/supabaseClient';
import { Transaction } from '@/types/database';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// HistoryPayment Component
const HistoryPayment = ({ pages }: { pages?: string }) => {
  const router = useRouter();
  const { setTransactionPopUp, setTransactionHistory } = useAppContext();

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
          console.log(error);
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

  return (
    <div className="fixed left-0 top-0 z-[1000] flex h-full w-full items-center justify-center bg-[#0000007a]">
      <div className="h-full w-full max-w-[800px] overflow-hidden bg-white md:max-h-[600px] md:rounded-[1.5rem]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-main-gray-input p-[1.5rem]">
          <h1 className="text-[1.2rem] font-semibold">Profile</h1>
          <div
            onClick={() => {
              setTransactionHistory(false);
            }}
          >
            <IconX className="cursor-pointer text-main-gray-text duration-300 hover:text-main-gray-text2" />
          </div>
        </div>

        {/* Content */}
        <div className="flex h-full w-full flex-col md:flex-row">
          {/* Sidebar Menu */}
          <div className="flex shrink-0 gap-[.5rem] overflow-auto whitespace-nowrap border-r border-main-gray-input px-[.5rem] py-[1.5rem] md:flex-col">
            <div
              className={`${
                page === 'account' ? 'bg-main text-white' : 'text-bla'
              } w-[210px] cursor-pointer rounded-[.6rem] px-[1rem] py-[.6rem] text-[.9rem]`}
              onClick={() => setPage('account')}
            >
              Akun
            </div>
            <div
              className={`${
                page === 'rt' ? 'bg-main text-white' : 'text-bla'
              } w-[210px] cursor-pointer rounded-[.6rem] px-[1rem] py-[.6rem] text-[.9rem]`}
              onClick={() => setPage('rt')}
            >
              Subscription dan Coin
            </div>
            <div
              className={`${
                page === 'riwayat' ? 'bg-main text-white' : 'text-bla'
              } w-[210px] cursor-pointer rounded-[.6rem] px-[1rem] py-[.6rem] text-[.9rem]`}
              onClick={() => setPage('riwayat')}
            >
              Riwayat transaksi
            </div>
            <ButtonPayment text={'Subscription'} />
          </div>

          {/* Page Content */}
          {page === 'account' && (
            <div className="w-full p-[1.5rem]">
              <h1 className="font-regular text-[1.2rem]">Akun</h1>
              <div>
                <div className="my-[1rem] h-[1px] w-full bg-main-gray-input" />
                <div className="flex flex-col gap-[.5rem]">
                  <div className="flex flex-col gap-[1rem]">
                    <p className="font-medium">Informasi Akun</p>
                    <div className="relative flex w-full items-center justify-between gap-[1rem]">
                      <input
                        id="ubahFotoProfile"
                        type="file"
                        className="absolute left-0 top-0 w-0 p-0"
                        onChange={(e) => {
                          if (e.target.files) {
                            setProfile(e.target.files[0]);
                          }
                        }}
                      />
                      <div className="flex gap-[1rem]">
                        <div className="h-[3.5rem] w-[3.5rem] overflow-hidden rounded-[.5rem]">
                          {preview !== '' ? (
                            <Image
                              src={preview}
                              alt="Bimbelio - Bimbel AI untuk SNBT/UTBK"
                              width={500}
                              height={300}
                              layout="responsive"
                            />
                          ) : (
                            <Image
                              src={profileImage !== '' ? profileImage : male}
                              alt="Bimbelio - Bimbel AI untuk SNBT/UTBK"
                              width={500}
                              height={300}
                              layout="responsive"
                            />
                          )}
                        </div>
                        <div className="flex h-full flex-col justify-between py-[.2rem]">
                          <p className="font-medium">{session?.user?.name}</p>
                          <p className="font-regular text-[.9rem] text-main-gray-text">
                            {session?.user.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        className="rounded-[.8rem] border border-main-gray-disabled px-[1rem] py-[.5rem] text-[.9rem] font-medium text-main-gray-text duration-200 md:hover:border-main md:hover:bg-main md:hover:text-white"
                        onClick={() => {
                          document.getElementById('ubahFotoProfile')?.click();
                        }}
                      >
                        Ubah foto profile
                      </Button>
                    </div>
                    {profile && !loading ? (
                      <div className="flex w-full justify-end">
                        <div className="flex items-center gap-[.5rem]">
                          <Button
                            className="rounded-[.8rem] px-[1rem] py-[.5rem] text-[.9rem] font-medium text-main-gray-text md:hover:text-black"
                            onClick={() => setProfile(undefined)}
                          >
                            Batalkan
                          </Button>
                          <Button
                            className="rounded-[.8rem] border border-main-gray-disabled px-[1rem] py-[.5rem] text-[.9rem] font-medium text-main-gray-text duration-200 md:hover:border-main md:hover:bg-main md:hover:text-white"
                            onClick={handleChangeProfile}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : profile && loading ? (
                      <div className="flex w-full justify-end">
                        <div className="flex h-[40px] items-center justify-center px-[1rem]">
                          <Spinner />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          )}

          {page === 'rt' && (
            <div className="w-full p-[1.5rem]">
              <h1 className="font-regular text-[1.2rem]">
                Subscription dan Coin
              </h1>
              <div className="my-[1rem] h-[1px] w-full bg-main-gray-input" />
              {data?.waiting?.length > 0 ? (
                <p className="mb-[.5rem] text-[.9rem] text-main-gray-text">
                  Kamu memiliki tagihan yang perlu dibayar:
                </p>
              ) : (
                <>
                  <p className="mb-[.5rem] text-[.9rem] text-main-gray-text">
                    Kamu tidak memiliki tagihan yang perlu dibayar
                  </p>
                  <div className="flex h-[380px] flex-col gap-[.5rem] overflow-y-auto pr-[.5rem]">
                    <Plans />
                    {!session?.user.tier && (
                      <div className="font-regular flex flex-col gap-[1rem] text-[.9rem] text-main-gray-text">
                        <p>
                          Kamu belum beli subscription. Yuk,{' '}
                          <span className="text-main">beli subscription</span>{' '}
                          untuk menikmati layanan terbaik dan lebih lengkap!
                        </p>
                        <Button
                          className="flex w-fit items-center gap-[.5rem] rounded-[.8rem] bg-main px-[1rem] py-[.7rem] text-white duration-300 hover:bg-main/85 active:bg-main"
                          onClick={() => {
                            setTransactionPopUp(true);
                            setTransactionHistory(false);
                          }}
                        >
                          <IconCrown />
                          <p className="font-regular">Subscription</p>
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
              <div className="flex h-[380px] flex-col gap-[.5rem] overflow-y-auto pr-[.5rem]">
                {data?.waiting?.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex flex-col gap-[1.5rem] rounded-[1.5rem] bg-bg-layout p-[1rem]"
                  >
                    <div
                      id="heading"
                      className="flex flex-col gap-[.8rem]"
                    >
                      <div className="flex items-center gap-[.5rem]">
                        <p className="font-semibold">
                          {(item.item_details.length > 0 &&
                            item.item_details[0]?.name) ||
                            '-'}
                        </p>
                        <IconCrown className="text-main-yellow" />
                      </div>
                      <div className="flex w-full items-center justify-between">
                        <p className="text-[.8rem] text-main-gray-text">
                          ID: {item.transaction_details.order_id}
                        </p>
                        <div>
                          <IconCopy className="text-main" />
                        </div>
                      </div>
                    </div>
                    <div
                      id="info"
                      className="grid grid-cols-2"
                    >
                      <div className="flex flex-col justify-between">
                        <p className="text-[.8rem] text-main-gray-text">
                          Nominal tagihan:
                        </p>
                        <h1 className="text-[1.2rem] font-semibold">
                          {item.transaction_details.gross_amount.toLocaleString(
                            'id-ID',
                            { style: 'currency', currency: 'IDR' },
                          )}
                        </h1>
                      </div>
                      <div className="flex flex-col justify-between">
                        <p className="text-[.8rem] text-main-gray-text">
                          Batas waktu pembayaran:
                        </p>
                        <h1 className="font-regular text-[1rem]">
                          {getDateString(item.expired_time)} .{' '}
                          {getHoursDetail(item.expired_time)}
                        </h1>
                      </div>
                    </div>
                    <div
                      id="action"
                      className="flex items-center"
                    >
                      <Button
                        className="active:main rounded-[.8rem] bg-main px-[1.5rem] py-[.8rem] text-[.9rem] text-white duration-300 hover:bg-main/85"
                        onClick={() => handlePay(item.token)}
                      >
                        Bayar sekarang
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {page === 'riwayat' && (
            <div className="w-full p-[1.5rem]">
              <h1 className="font-regular text-[1.2rem]">Riwayat Transaksi</h1>
              <div className="my-[1rem] h-[1px] w-full bg-main-gray-input" />
              <div className="flex h-[380px] flex-col gap-[.5rem] overflow-y-auto pr-[.5rem]">
                {data?.riwayat?.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex flex-col gap-[1.5rem] rounded-[1.5rem] bg-bg-layout p-[1rem]"
                  >
                    <div
                      id="heading"
                      className="flex flex-col gap-[1.5rem]"
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-[.5rem]">
                          <p className="font-semibold">
                            {(item.item_details.length > 0 &&
                              item.item_details[0]?.name) ||
                              '-'}
                          </p>
                          <IconCrown className="text-main-yellow" />
                        </div>
                        {item.settlement_time ? (
                          <div className="rounded-[1rem] bg-main px-[.6rem] py-[.2rem] text-[.8rem] text-white">
                            Berhasil
                          </div>
                        ) : (
                          <div className="rounded-[1rem] bg-main-yellow px-[.6rem] py-[.2rem] text-[.8rem] text-black">
                            Menunggu
                          </div>
                        )}
                      </div>
                      <div className="flex w-full items-center justify-between">
                        <div className="text-[.8rem] text-main-gray-text">
                          <p>
                            {getDateString(item.transaction_time)} .{' '}
                            {getHours(item.transaction_time)}
                          </p>
                        </div>
                        <div className="flex items-center gap-[.5rem]">
                          <p className="text-[.8rem] text-main-gray-text">
                            ID: {item.transaction_details.order_id}
                          </p>
                          <div>
                            <IconCopy className="text-main-gray-text" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPayment;
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
