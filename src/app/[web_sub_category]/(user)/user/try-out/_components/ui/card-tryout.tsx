'use client';

import { PaymentTryout } from '@/components/_shared/payment/payment-tryout';
import { useUserLimitation } from '@/components/provider/provider-limitation';
import { useSession } from '@/components/provider/provider-session-auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { toaster } from '@/components/ui/toaster';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper';
import {
  cn,
  getDateStringShort,
  getDateTryoutString,
  getHours,
} from '@/lib/utils';
import {
  IconCrown,
  IconQuiz,
  IconTailedArrowUp45,
  IconTimer2,
  IconUserAdmin,
  IconX,
} from '@/styles/icon';
import { hexToRgba } from '@/styles/main-styles';
import {
  Pricing,
  TryoutRegistration,
  TryoutSessionParticipant,
} from '@/types/database';
import { Calendar, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import ButtonPayment from '../../../_components/button-payment';

interface CardTryout {
  id: string;
  title: string;
  restTime: number;
  status: string;
  startDate: Date;
  image?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  endDate: Date;
  resultDate: Date;
  createAt: Date;
  updateAt: Date;
  TryoutSession: {
    id: string;
    tryoutId: string;
    categoryId: string;
    name: string;
    slug: string;
    description: string | null;
    duration: number;
    assessmentType: string;
    thresholdValue: number | null;
    createAt: Date;
    updateAt: Date;
    TryoutCategory: { name: string };
    TryoutSubCategory: { name: string };
    TryoutSessionParticipant: TryoutSessionParticipant[];
    _count: {
      TryoutQuestion: number;
    };
  }[];
  TryoutRegistration: TryoutRegistration[];
  _count: {
    TryoutRegistration: number;
  };
  WebsiteSubCategory?: {
    id: string;
    name: string;
    createdAt: Date;
    main_color: string;
    secondary_color: string;
    updatedAt: Date;
    website_category_id: string;
  };
}

export interface CardTryoutProps extends CardTryout {
  isDone: boolean;
  isNotStarted: boolean;
  isRegistered: boolean;
  isActive: boolean;
  isJoin: boolean;
}

interface card {
  data: CardTryoutProps[];
  isPrivate?: boolean;
  userTryOutId: string;
  refresh?: () => any;
}

export default function CardTryOut({ data, isPrivate, refresh }: card) {
  const pathname = usePathname();
  const isTesting = pathname?.toLowerCase().includes('testing') || false;

  const searchParams = useSearchParams();
  const id = searchParams?.get('id');

  const router = useRouter();
  const { data: session } = useSession();

  // const [showUpgrade, setShowUpgrade] = useState<number>(99999);
  const [showDetail, setShowDetail] = useState<CardTryoutProps | null>(null);

  const [step, setStep] = useState<number>(1);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (showDetail) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [showDetail]);

  const getTimer = (date: any, item: CardTryoutProps): any => {
    const targetDate = new Date(date);
    const now = new Date();
    if (isNaN(targetDate.getTime()) || isNaN(now.getTime())) {
      return 'Tanggal tidak valid';
    }

    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      if (item.isDone) {
        return { start: false, value: 'Selesai' };
      } else {
        return { start: true, value: 'Mulai Tryout' };
      }
    }

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      };
      return {
        start: false,
        value: targetDate.toLocaleDateString('id-ID', options),
      };
    } else if (days >= 1) {
      return { start: false, value: `Mulai dalam ${days} hari` };
    } else if (hours >= 1) {
      return { start: false, value: `Mulai dalam ${hours} jam` };
    } else {
      return { start: false, value: `Mulai dalam ${minutes} menit` };
    }
  };

  const registerTryOut = async (payload: {
    tryoutId: string;
    userId: string;
    isPremium?: boolean;
  }) => {
    await mutateGeneral('/tryout/registerTryOut', {
      payload,
      type: 'post',
      onSuccess: refresh,
    });
  };

  const handleRegistration = async (isPremium?: boolean) => {
    try {
      setIsLoading(true);
      if (showDetail) {
        await registerTryOut({
          tryoutId: showDetail.id,
          userId: session?.user.id || '',
          isPremium,
        });
        setStep(1);
        setShowDetail(null);
      }
      setIsLoading(false);
      return;
    } catch (error) {
      setIsLoading(false);
      return;
    }
  };

  const getBadgeValue = (item: CardTryoutProps) => {
    let data = null;
    // if (item.isDone) {
    //   data = {
    //     className: 'bg-main text-white',
    //     title: 'Sudah Selesai',
    //   };
    // } else if (item.isNotStarted && item.isRegistered) {
    //   data = {
    //     className: 'bg-green-600 text-white',
    //     title: 'Terdaftar',
    //   };
    // } else if (item.isNotStarted && !item.isRegistered) {
    //   data = {
    //     className: 'bg-main-yellow text-black',
    //     title: 'Belum Daftar',
    //   };
    // } else if (item.isActive) {
    //   data = {
    //     className: 'bg-main-red text-white',
    //     title: 'Sedang Berlangsung',
    //   };
    // }
    if (item.isRegistered) {
      data = {
        className: 'bg-green-600 text-white',
        title: 'Terdaftar',
      };
    } else if (!item.isRegistered) {
      data = {
        className: 'bg-main-yellow text-black',
        title: 'Belum Daftar',
      };
    } else if (item.isActive) {
      data = {
        className: 'bg-main-red text-white',
        title: 'Sedang Berlangsung',
      };
    }

    return data;
  };

  const getButtonValue = (item: CardTryoutProps) => {
    let data = {
      className: '',
      title: '',
    };
    // if (item.isDone) {
    //   if (item.isRegistered && item.isJoin) {
    //     data.title = 'Lihat Hasil & Pembahasan';
    //   } else {
    //     data.title = 'Selesai';
    //   }
    // } else if (item.isRegistered) {
    //   data.title = 'Mulai Tryout';
    //   if (!item.isActive) {
    //     data.className =
    //       'bg-gray-400 md:hover:bg-gray-400 cursor-default text-white';
    //   }
    // } else if (!item.isRegistered) {
    //   data.title = 'Daftar Sekarang';
    // }

    if (item.isRegistered && item.isJoin && item.isDone) {
      data.title = 'Lihat Hasil & Pembahasan';
    } else if (item.isRegistered) {
      data.title = 'Mulai Tryout';
      // if (!item.isActive) {
      //   data.className =
      //     'bg-gray-400 md:hover:bg-gray-400 cursor-default text-white';
      // }
    } else if (!item.isRegistered) {
      data.title = 'Daftar Sekarang';
    }

    return data;
  };

  useEffect(() => {
    if (!id) return;
    const findData = data.find((item) => item.id === id);
    if (!findData) return;
    setShowDetail(findData);
  }, [id]);

  return (
    <>
      {data?.length > 0 &&
        data?.map((item, i: number) => (
          <Card
            key={i}
            className="relative overflow-hidden"
          >
            <div
              className="absolute bottom-[2rem] right-[-2rem] z-[1] text-main/20"
              style={{
                color: hexToRgba(item.WebsiteSubCategory?.main_color, 0.2),
              }}
            >
              <IconCrown
                w={180}
                className="rotate-[-20deg]"
              />
            </div>
            <Badge
              className={cn(
                'absolute right-4 top-4 bg-main text-white',
                getBadgeValue(item)?.className,
              )}
            >
              {getBadgeValue(item)?.title}
            </Badge>
            <CardHeader className="relative z-[2]">
              <CardTitle
                className="text-[1.3rem] font-bold text-main"
                style={{
                  color: item.WebsiteSubCategory?.main_color,
                }}
              >
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-[2]">
              <div className="grid gap-2">
                {/* Mulai Modifikasi di Sini */}
                {(() => {
                  // Mengelompokkan sesi berdasarkan kategori
                  const groupedSessions = item.TryoutSession.reduce(
                    (groups, session) => {
                      const categoryName = session.TryoutCategory.name;
                      if (!groups[categoryName]) {
                        groups[categoryName] = [];
                      }
                      groups[categoryName].push(session);
                      return groups;
                    },
                    {} as { [key: string]: (typeof item.TryoutSession)[0][] },
                  );

                  // Mengurutkan kategori sesuai dengan urutan yang diinginkan
                  const orderedCategories = [
                    'Tes Potensi Skolastik (TPS)',
                    'Tes Literasi',
                    'Tes Penalaran Matematika',
                  ];

                  return orderedCategories
                    .filter((category) => groupedSessions[category]) // Hanya kategori yang ada
                    .map((categoryName) => (
                      <div
                        key={categoryName}
                        className="mb-2"
                      >
                        {/* Judul Kategori */}
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold">
                            {categoryName}:
                          </h3>
                        </div>

                        {/* Daftar Subkategori */}
                        {groupedSessions[categoryName].map((session, index) => (
                          <div
                            key={session.id || index} // Pastikan setiap sesi memiliki id unik
                            className="flex justify-between items-center mb-2"
                          >
                            <div className="flex items-center ml-2">
                              <span className="text-sm">
                                - {session.TryoutSubCategory.name}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {session.duration} menit
                            </span>
                          </div>
                        ))}
                      </div>
                    ));
                })()}
                {/* Akhir Modifikasi di Sini */}
                <div className="flex items-center gap-2">
                  {/* <BookOpen className="h-4 w-4 text-main-gray-text" /> */}
                  <IconQuiz
                    w={16}
                    className="text-black/80"
                  />
                  <span className="text-sm font-semibold">
                    {item.TryoutSession.reduce(
                      (acc, session) => acc + session._count.TryoutQuestion,
                      0,
                    )}{' '}
                    Soal
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* <Users className="h-4 w-4 text-main-gray-text" /> */}
                  <IconUserAdmin
                    w={16}
                    className="text-black/80"
                  />
                  <span className="text-sm font-semibold">
                    {item._count.TryoutRegistration} Pendaftar
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-main-gray-text" />
                  <span className="text-sm font-semibold">
                    {`${getHours(item.startDate)}, ${getDateStringShort(
                      item.startDate,
                    )}`}{' '}
                    -{' '}
                    {`${getHours(item.endDate)}, ${getDateStringShort(
                      item.endDate,
                    )}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* <Timer className="h-4 w-4 text-main-gray-text" /> */}
                  <IconTimer2
                    w={16}
                    className="text-black/80"
                  />
                  <span className="text-sm font-semibold">
                    {getTimer(item.startDate, item)?.value}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="relative z-[2]">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className={cn(
                        'w-full bg-gradient text-white hover:opacity-85',
                        getButtonValue(item)?.className,
                      )}
                      style={{
                        backgroundImage: `linear-gradient(145deg, ${item.WebsiteSubCategory?.secondary_color}, ${item.WebsiteSubCategory?.main_color})`,
                      }}
                      onClick={() => {
                        if (item.WebsiteSubCategory) {
                          localStorage.setItem(
                            'website_sub_category_id',
                            item.WebsiteSubCategory.id,
                          );
                          // window.location.href = `${window.location.}${window.location.pathname}?id=${item.id}`;
                          window.location.href = `${window.location.origin}/${item.WebsiteSubCategory.id}/user/try-out?id=${item.id}`;
                        } else {
                          setShowDetail(item);
                        }
                      }}
                    >
                      {getButtonValue(item)?.title}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {item.status === 'ongoing'
                      ? 'Lanjutkan tryout yang sedang berlangsung.'
                      : 'Daftar untuk mengikuti tryout ini.'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardFooter>
          </Card>
        ))}
      {showDetail && (
        <div className="fixed left-0 top-0 z-[1000] flex h-full w-full items-center justify-center bg-black bg-opacity-50">
          <div
            className="absolute left-0 top-0 z-[-1] h-full w-full bg-transparent"
            onClick={() => {
              if (step !== 3) {
                setShowDetail(null);
                setStep(1);
              }
            }}
          />
          <div
            id="register-tryout-modal"
            className={cn(
              'relative flex w-[calc(100%-2rem)] max-w-[500px] flex-col gap-[1rem] rounded-[1rem] bg-white p-[2rem] shadow-cardSoft md:w-full max-h-[90vh] overflow-y-auto',
              step === 3 && 'max-w-[600px]',
            )}
          >
            {step === 1 && (
              <React.Fragment>
                <div
                  className="absolute right-4 top-4"
                  onClick={() => setShowDetail(null)}
                >
                  <IconX className="cursor-pointer text-main-gray-text duration-200 md:hover:text-main-gray-text2" />
                </div>
                <div className="flex w-full flex-col gap-[1rem]">
                  <h1 className="text-center font-medium">Detail Try Out</h1>
                  <div className="grid grid-cols-5 gap-y-2 text-[.9rem]">
                    <p className="col-span-2 text-main-gray-text">Try out</p>
                    <p className="col-span-3">: {showDetail.title} </p>
                    <p className="col-span-2 text-main-gray-text">
                      Pelaksanaan
                    </p>
                    <p className="col-span-3">
                      : {getDateTryoutString(showDetail.startDate)},{' '}
                      {getHours(showDetail.startDate)} WIB s/d <br />{' '}
                      <span className="text-transparent">:</span>{' '}
                      {getDateTryoutString(showDetail.endDate)},{' '}
                      {getHours(showDetail.endDate)} WIB
                    </p>
                    <p className="col-span-2 text-main-gray-text">
                      Periode Penilaian
                    </p>
                    <p className="col-span-3">
                      : {getDateTryoutString(showDetail.resultDate)},{' '}
                      {getHours(showDetail.resultDate)} WIB
                    </p>
                  </div>
                </div>
              </React.Fragment>
            )}
            {!showDetail.isRegistered ? (
              <RegisterTryout
                step={step}
                setStep={setStep}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setShowDetail={setShowDetail}
                onClick={handleRegistration}
                showDetail={showDetail}
              />
            ) : showDetail.isRegistered ? (
              <div className="mt-[1rem] flex w-full items-center justify-center">
                <Link
                  href={
                    isTesting
                      ? `/${website_sub_category_id}/admin/tryout/testing/try-out/${showDetail.id}`
                      : `/${website_sub_category_id}/user/try-out/${showDetail.id}`
                  }
                  className="flex w-full cursor-pointer items-center justify-center gap-[.5rem] rounded-[.8rem] bg-main py-[.8rem] text-center text-[.9rem] text-white hover:bg-main/80"
                  // onClick={() => {
                  //   if (isTesting) {
                  //     router.push(
                  //       `/admin/tryout/testing/try-out/${showDetail.id}`
                  //     );
                  //   } else if (!isPrivate) {
                  //     router.push(`/user/try-out/${showDetail.id}`);
                  //   }
                  // }}
                >
                  Mulai try out
                  <IconTailedArrowUp45 w={15} />
                </Link>
              </div>
            ) : showDetail.isRegistered &&
              showDetail.isDone &&
              !showDetail.isJoin ? (
              <div className="mt-[1rem] flex w-full items-center justify-center">
                {/* <div
                  className="flex w-full cursor-pointer items-center justify-center gap-[.5rem] rounded-[.8rem] bg-main py-[.8rem] text-center text-[.9rem] text-white hover:bg-main/80"
                  onClick={() => {
                    if (!isPrivate) router.push(`/try-out/${showDetail.id}`);
                  }}
                >
                  Lanjutkan try out
                  <IconTailedArrowUp45 w={15} />
                </div> */}
              </div>
            ) : showDetail.isDone &&
              showDetail.isRegistered &&
              showDetail.isJoin ? (
              <div
                className="flex w-full cursor-pointer items-center justify-center gap-[.5rem] rounded-[.8rem] bg-main py-[.8rem] text-center text-[.9rem] text-white hover:bg-main/80"
                onClick={() => {
                  if (isTesting) {
                    router.push(
                      `/${website_sub_category_id}/admin/tryout/testing/try-out/${showDetail.id}`,
                    );
                  } else if (!isPrivate)
                    router.push(
                      `/${website_sub_category_id}/user/try-out/${showDetail.id}`,
                    );
                }}
              >
                Lihat Hasil
                <IconTailedArrowUp45 w={15} />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}

const RegisterTryout = ({
  step,
  setStep,
  isLoading,
  setIsLoading,
  setShowDetail,
  onClick,
  showDetail,
}: {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setShowDetail: Dispatch<SetStateAction<CardTryoutProps | null>>;
  onClick: (isPremium?: boolean) => void;
  showDetail: CardTryoutProps | null;
}) => {
  const { userLimitation, checkLimitation } = useUserLimitation();
  const { data: session } = useSession();

  const [showPayment, setShowPayment] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectTypeRegistration, setSelectTypeRegistration] = useState<
    'free' | 'premium'
  >('free');

  const [click, setClick] = useState<{
    followTiktok: boolean;
    followTiktokLoad: boolean;
    followInstagram: boolean;
    followInstagramLoad: boolean;
    postinganInstagram: boolean;
    postinganInstagramLoad: boolean;
    tagInstagram: boolean;
    storyInstagram: boolean;
    grupWhatsapp: {
      checked: boolean;
      grup1: boolean;
      grup2: boolean;
      grup3: boolean;
    };
    joinGrupWhatsapp: boolean;
    joinGrupWhatsappLoad: boolean;
  }>({
    followTiktok: false,
    followTiktokLoad: false,
    followInstagram: false,
    followInstagramLoad: false,
    postinganInstagram: false,
    postinganInstagramLoad: false,
    tagInstagram: false,
    storyInstagram: false,
    grupWhatsapp: {
      checked: false,
      grup1: false,
      grup2: false,
      grup3: false,
    },
    joinGrupWhatsapp: false,
    joinGrupWhatsappLoad: false,
  });

  const [validate, setValidate] = useState<{
    followTiktok: boolean;
    followInstagram: boolean;
    postinganInstagram: boolean;
    tagInstagram: boolean;
    storyInstagram: boolean;
    grupWhatsapp: {
      checked: boolean;
      grup1: boolean;
      grup2: boolean;
      grup3: boolean;
    };
    joinGrupWhatsapp: boolean;
  }>({
    followTiktok: false,
    followInstagram: false,
    postinganInstagram: false,
    tagInstagram: false,
    storyInstagram: false,
    grupWhatsapp: {
      checked: false,
      grup1: false,
      grup2: false,
      grup3: false,
    },
    joinGrupWhatsapp: false,
  });

  // const { data: pricing, isLoading: pricingIsLoading } =
  //   api.pricing.getPricingBySlug.useQuery(
  //     {
  //       slug: "tryout_unlock",
  //     },
  //     {
  //       refetchOnWindowFocus: false,
  //     }
  //   );

  const [pricing, setPricing] = useState<Pricing>();
  const [pricingIsLoading, setPricingIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getGeneral(`/pricing/getPricingBySlug?slug=tryout_unlock`, {
      setData: setPricing,
      setLoading: setPricingIsLoading,
    });
  }, []);

  const handleRegistration = () => {
    if (
      !validate.followTiktok ||
      !validate.followInstagram ||
      !validate.postinganInstagram ||
      !validate.tagInstagram ||
      !validate.storyInstagram ||
      !validate.joinGrupWhatsapp
    ) {
      setError(true);
      return;
    }
    onClick();
  };

  useEffect(() => {
    if (showPayment === false && step === 3) {
      setShowDetail(null);
      setStep(1);
    }
  }, [showPayment]);

  useEffect(() => {
    const container = document.getElementById('register-tryout-modal') as
      | HTMLDivElement
      | undefined;
    if (container && selectTypeRegistration === 'premium' && step === 3) {
      container.classList.remove('shadow-cardSoft');
      container.classList.remove('bg-white');
      container.classList.add('bg-transparent');
    } else if (container) {
      container.classList.remove('bg-transparent');
      container.classList.add('shadow-cardSoft');
      container.classList.add('bg-white');
    }
  }, [selectTypeRegistration, step]);

  if (step === 1)
    return (
      <div>
        <p className="pt-[1rem] text-center text-[.9rem] text-main-gray-text">
          Apakah kamu akan mengikuti try out ini?
        </p>
        <div className="mt-[1rem] flex w-full items-center justify-center">
          <div
            className={cn(
              'flex h-[47px] w-full cursor-pointer items-center justify-center gap-[.5rem] rounded-[.8rem] bg-main text-center text-[.9rem] text-white hover:bg-main/80',
              isLoading && 'bg-main/80',
            )}
            // onClick={handleRegistration}
            onClick={async () => {
              if (session?.user.role !== 'USER') {
                onClick();
              } else if (
                userLimitation &&
                userLimitation.tryout < userLimitation.tryoutLimit
              ) {
                setIsLoading(true);
                const check = await checkLimitation({ tryout: true });
                if (check && check.status) {
                  onClick(true);
                } else {
                  setIsLoading(false);
                }
              } else {
                toaster({
                  title: 'Upss',
                  condition: 'warning',
                  description: 'Coin tryoutmu tidak cukup, coba opsi lain',
                  duration: 3000,
                });
                setStep(2);
              }
            }}
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                Daftar try out
                <IconTailedArrowUp45 w={15} />
              </>
            )}
          </div>
        </div>
      </div>
    );
  else if (step === 2)
    return (
      <div className="flex w-full flex-col gap-[1rem]">
        <h1 className="text-center font-medium">Pilih Tipe Pendaftaran</h1>
        <div className="flex flex-col gap-[1rem]">
          <div
            className="cursor-pointer"
            onClick={() => {
              setShowDetail(null);
            }}
          >
            <ButtonPayment
              className="w-full flex justify-center items-center"
              text="Top up"
              type="modal"
            />
          </div>
          {!showDetail?.isDone && (
            <Card
              onClick={() => setSelectTypeRegistration('free')}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                selectTypeRegistration === 'free'
                  ? 'border-2 border-main'
                  : 'border-2 hover:border-main/70',
              )}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Gratis
                  <span className="text-sm font-normal text-muted-foreground">
                    Rp 0
                  </span>
                </CardTitle>
                <CardDescription>
                  Daftar dengan mengikuti sosial media dan membagikan info Try
                  Out
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-1 text-sm">
                  <li>Akses ke semua materi Try Out</li>
                  <li>Hasil dan pembahasan setelah Try Out selesai</li>
                  <li>Peringkat nasional</li>
                </ul>
              </CardContent>
            </Card>
          )}
          <Card
            onClick={() => setSelectTypeRegistration('premium')}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              selectTypeRegistration === 'premium'
                ? 'border-2 border-main'
                : 'border-2 hover:border-main/70',
            )}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Premium
                {pricingIsLoading || !pricing ? (
                  <div className="">
                    <Loader2 className="animate-spin w-4 h-4" />
                  </div>
                ) : (
                  <span className="text-sm font-normal text-muted-foreground">
                    Rp{' '}
                    {pricing.price.toLocaleString('id-ID', {
                      style: 'decimal',
                    })}
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                Daftar cepat dengan fitur tambahan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc space-y-1 text-sm">
                <li>Semua fitur Gratis</li>
                <li>Akses prioritas saat Try Out berlangsung</li>
                <li>Analisis detail performa dan rekomendasi belajar</li>
                <li>Konsultasi dengan tutor</li>
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="mt-[1rem] flex w-full items-center justify-center">
          <div
            className={cn(
              'flex h-[47px] w-full cursor-pointer items-center justify-center gap-[.5rem] rounded-[.8rem] bg-main text-center text-[.9rem] text-white hover:bg-main/80',
              isLoading && 'bg-main/80',
            )}
            onClick={() => {
              setStep(3);
              if (selectTypeRegistration === 'premium') setShowPayment(true);
            }}
          >
            Selanjutnya
          </div>
        </div>
      </div>
    );
  else if (step === 3 && selectTypeRegistration === 'free')
    return (
      <>
        <div
          className="absolute right-4 top-4"
          onClick={() => setShowDetail(null)}
        >
          <IconX className="cursor-pointer text-main-gray-text duration-200 md:hover:text-main-gray-text2" />
        </div>
        <div className="flex w-full flex-col gap-[1rem]">
          <h1 className="text-center font-medium">Bukti Pendaftaran</h1>
          <div
            id="follow-tiktok"
            className="relative mb-[1rem] flex items-center justify-between gap-[2rem]"
          >
            {!validate.followTiktok && error && (
              <div className="absolute left-0 top-[100%] text-[.75rem] text-red-600">
                Checklist box diatas
              </div>
            )}
            <div className="flex flex-col items-start gap-[.5rem]">
              <p>Follow TikTok</p>
              <div className="flex items-center gap-[.5rem]">
                <input
                  type="checkbox"
                  className="ml-[.2rem] h-[1rem] w-[1rem] appearance-none rounded border-[1.8px] border-blue-600 bg-gray-100 ring-2 ring-blue-500 ring-offset-0 duration-300 checked:border-transparent checked:bg-blue-400 checked:ring-2 checked:ring-blue-500 checked:ring-offset-2 hover:cursor-pointer hover:ring-offset-2"
                  checked={validate.followTiktok}
                  disabled={!click.followTiktok ? true : false}
                  onChange={(e) => {
                    setValidate((prev) => ({
                      ...prev,
                      followTiktok: e.target.checked,
                    }));
                  }}
                />
                <p className="text-[.8rem] text-main-gray-text">
                  Saya sudah follow tiktok
                </p>
              </div>
            </div>
            <a
              href="https://www.tiktok.com/@bimbelio.official?is_from_webapp=1&sender_device=pc"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                className={cn(
                  'w-[108px] rounded-[.6rem] bg-main-gray-disabled duration-300 md:hover:bg-main-gray-disabled-hover',
                  click.followTiktok &&
                    'cursor-default bg-main md:hover:bg-main',
                )}
                onClick={() => {
                  setClick((prev) => ({ ...prev, followTiktokLoad: true }));
                  setTimeout(() => {
                    setClick((prev) => ({ ...prev, followTiktok: true }));
                  }, 6000);
                }}
              >
                {!click.followTiktok ? (
                  <>
                    {click.followTiktokLoad ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Follow'
                    )}
                  </>
                ) : (
                  <Check />
                )}
              </Button>
            </a>
          </div>
          <div
            id="follow-instagram"
            className="relative mb-[1rem] flex items-center justify-between gap-[2rem]"
          >
            {!validate.followInstagram && error && (
              <div className="absolute left-0 top-[100%] text-[.75rem] text-red-600">
                Checklist box diatas
              </div>
            )}
            <div className="flex flex-col items-start gap-[.5rem]">
              <p>Follow Instagram</p>
              <div className="flex items-center gap-[.5rem]">
                <input
                  type="checkbox"
                  className="ml-[.2rem] h-[1rem] w-[1rem] appearance-none rounded border-[1.8px] border-blue-600 bg-gray-100 ring-2 ring-blue-500 ring-offset-0 duration-300 checked:border-transparent checked:bg-blue-400 checked:ring-2 checked:ring-blue-500 checked:ring-offset-2 hover:cursor-pointer hover:ring-offset-2"
                  disabled={!click.followInstagram ? true : false}
                  checked={validate.followInstagram}
                  onChange={(e) => {
                    setValidate((prev) => ({
                      ...prev,
                      followInstagram: e.target.checked,
                    }));
                  }}
                />
                <p className="text-[.8rem] text-main-gray-text">
                  Saya sudah follow instagram
                </p>
              </div>
            </div>
            <a
              href="https://www.instagram.com/bimbelio.official?igsh=MThzd3MzbW45YW5zZQ=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                className={cn(
                  'w-[108px] rounded-[.6rem] bg-main-gray-disabled duration-300 md:hover:bg-main-gray-disabled-hover',
                  click.followInstagram &&
                    'cursor-default bg-main md:hover:bg-main',
                )}
                onClick={() => {
                  setClick((prev) => ({
                    ...prev,
                    followInstagram: true,
                  }));
                  setTimeout(() => {
                    setClick((prev) => ({ ...prev, followInstagram: true }));
                  }, 6000);
                }}
              >
                {!click.followInstagram ? (
                  <>
                    {click.followInstagram ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Follow'
                    )}
                  </>
                ) : (
                  <Check />
                )}
              </Button>
            </a>
          </div>
          {showDetail?.instagram && (
            <div
              id="like-instagram"
              className="relative mb-[1rem] flex items-center justify-between gap-[2rem]"
            >
              {!validate.postinganInstagram && error && (
                <div className="absolute left-0 top-[100%] text-[.75rem] text-red-600">
                  Checklist box diatas
                </div>
              )}
              <div className="flex flex-col items-start gap-[.5rem]">
                <p>Like Postingan Instagram</p>
                <div className="flex items-center gap-[.5rem]">
                  <input
                    type="checkbox"
                    className="ml-[.2rem] h-[1rem] w-[1rem] appearance-none rounded border-[1.8px] border-blue-600 bg-gray-100 ring-2 ring-blue-500 ring-offset-0 duration-300 checked:border-transparent checked:bg-blue-400 checked:ring-2 checked:ring-blue-500 checked:ring-offset-2 hover:cursor-pointer hover:ring-offset-2"
                    disabled={!click.postinganInstagram ? true : false}
                    checked={validate.postinganInstagram}
                    onChange={(e) => {
                      setValidate((prev) => ({
                        ...prev,
                        postinganInstagram: e.target.checked,
                      }));
                    }}
                  />
                  <p className="text-[.8rem] text-main-gray-text">
                    Saya sudah like postingan instagram
                  </p>
                </div>
              </div>
              <a
                href={showDetail.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  className={cn(
                    'w-[108px] rounded-[.6rem] bg-main-gray-disabled duration-300 md:hover:bg-main-gray-disabled-hover',
                    click.postinganInstagram &&
                      'cursor-default bg-main md:hover:bg-main',
                  )}
                  onClick={() => {
                    setClick((prev) => ({
                      ...prev,
                      postinganInstagramLoad: true,
                    }));
                    setTimeout(() => {
                      setClick((prev) => ({
                        ...prev,
                        postinganInstagram: true,
                      }));
                    }, 6000);
                  }}
                >
                  {!click.postinganInstagram ? (
                    <>
                      {click.postinganInstagramLoad ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Like'
                      )}
                    </>
                  ) : (
                    <Check />
                  )}
                </Button>
              </a>
            </div>
          )}
          {showDetail?.instagram && (
            <div
              id="like-instagram"
              className="relative mb-[1rem] flex items-center justify-between gap-[2rem]"
            >
              {!validate.tagInstagram && error && (
                <div className="absolute left-0 top-[100%] text-[.75rem] text-red-600">
                  Checklist box diatas
                </div>
              )}
              <div className="flex flex-col items-start gap-[.5rem]">
                <p>Tag 3 Teman Postingan Instagram</p>
                <div className="relative flex items-center gap-[.5rem]">
                  <input
                    id="tag-instagram"
                    type="file"
                    className="absolute left-0 top-0 h-0 w-0 p-0"
                    onChange={(e) => {
                      const value = e.target.files ? e.target.files[0] : null;
                      if (value && value.type.includes('image')) {
                        setClick((prev) => ({
                          ...prev,
                          tagInstagram: true,
                        }));
                      }
                      if (value && !value.type.includes('image'))
                        toaster({
                          title: 'Upss',
                          condition: 'warning',
                          description: 'File yang diupload tidak sesuai!!',
                          duration: 3000,
                        });
                    }}
                  />
                  <input
                    type="checkbox"
                    className="ml-[.2rem] h-[1rem] w-[1rem] appearance-none rounded border-[1.8px] border-blue-600 bg-gray-100 ring-2 ring-blue-500 ring-offset-0 duration-300 checked:border-transparent checked:bg-blue-400 checked:ring-2 checked:ring-blue-500 checked:ring-offset-2 hover:cursor-pointer hover:ring-offset-2"
                    disabled={!click.tagInstagram ? true : false}
                    checked={validate.tagInstagram}
                    onChange={(e) => {
                      setValidate((prev) => ({
                        ...prev,
                        tagInstagram: e.target.checked,
                      }));
                    }}
                  />
                  <p className="text-[.8rem] text-main-gray-text">
                    Saya sudah upload
                  </p>
                </div>
              </div>
              <Button
                className={cn(
                  'w-[108px] rounded-[.6rem] bg-main-gray-disabled duration-300 md:hover:bg-main-gray-disabled-hover',
                  click.tagInstagram &&
                    'cursor-default bg-main md:hover:bg-main',
                )}
                onClick={() => {
                  document.getElementById('tag-instagram')?.click();
                }}
              >
                {click.tagInstagram ? <Check /> : 'Upload'}
              </Button>
            </div>
          )}

          <div
            id="share-story"
            className="relative mb-[1rem] flex items-center justify-between gap-[2rem]"
          >
            {!validate.storyInstagram && error && (
              <div className="absolute left-0 top-[100%] text-[.75rem] text-red-600">
                Checklist box diatas
              </div>
            )}
            <div className="flex flex-col items-start gap-[.5rem]">
              <p>Share ke Story Instagram</p>
              <div className="relative flex items-center gap-[.5rem]">
                <input
                  id="story-instagram"
                  type="file"
                  className="absolute left-0 top-0 h-0 w-0 p-0"
                  onChange={(e) => {
                    const value = e.target.files ? e.target.files[0] : null;
                    if (value && value.type.includes('image')) {
                      setClick((prev) => ({
                        ...prev,
                        storyInstagram: true,
                      }));
                    }
                    if (value && !value.type.includes('image'))
                      toaster({
                        title: 'Upss',
                        condition: 'warning',
                        description: 'File yang diupload tidak sesuai!!',
                        duration: 3000,
                      });
                  }}
                />
                <input
                  type="checkbox"
                  className="ml-[.2rem] h-[1rem] w-[1rem] appearance-none rounded border-[1.8px] border-blue-600 bg-gray-100 ring-2 ring-blue-500 ring-offset-0 duration-300 checked:border-transparent checked:bg-blue-400 checked:ring-2 checked:ring-blue-500 checked:ring-offset-2 hover:cursor-pointer hover:ring-offset-2"
                  disabled={!click.storyInstagram ? true : false}
                  checked={validate.storyInstagram}
                  onChange={(e) => {
                    setValidate((prev) => ({
                      ...prev,
                      storyInstagram: e.target.checked,
                    }));
                  }}
                />
                <p className="text-[.8rem] text-main-gray-text">
                  Saya sudah upload bukti share
                </p>
              </div>
            </div>
            <Button
              className={cn(
                'w-[108px] rounded-[.6rem] bg-main-gray-disabled duration-300 md:hover:bg-main-gray-disabled-hover',
                click.storyInstagram &&
                  'cursor-default bg-main md:hover:bg-main',
              )}
              onClick={() => {
                document.getElementById('story-instagram')?.click();
              }}
            >
              {click.storyInstagram ? <Check /> : 'Upload'}
            </Button>
          </div>
          <div
            id="share-grup-whatsapp"
            className="relative mb-[1rem] flex items-start justify-between gap-[2rem] w-full"
          >
            {!validate.grupWhatsapp && error && (
              <div className="absolute left-0 top-[100%] text-[.75rem] text-red-600">
                Checklist box diatas
              </div>
            )}
            <div className="flex flex-col items-start gap-[.5rem] w-full">
              <p>Share ke 3 Grup Whatsapp</p>
              <div className="relative flex items-center gap-[.5rem]">
                <input
                  id="grup-whatsapp1"
                  type="file"
                  className="absolute left-0 top-0 h-0 w-0 p-0"
                  onChange={(e) => {
                    const value = e.target.files ? e.target.files[0] : null;

                    if (value && value.type.includes('image')) {
                      setClick((prev) => ({
                        ...prev,
                        grupWhatsapp: {
                          ...prev.grupWhatsapp,
                          grup1: true,
                        },
                      }));
                    }
                    if (value && !value.type.includes('image'))
                      toaster({
                        title: 'Upss',
                        condition: 'warning',
                        description: 'File yang diupload tidak sesuai!!',
                        duration: 3000,
                      });
                  }}
                />
                <input
                  id="grup-whatsapp2"
                  type="file"
                  className="absolute left-0 top-0 h-0 w-0 p-0"
                  onChange={(e) => {
                    const value = e.target.files ? e.target.files[0] : null;

                    if (value && value.type.includes('image')) {
                      setClick((prev) => ({
                        ...prev,
                        grupWhatsapp: {
                          ...prev.grupWhatsapp,
                          grup2: true,
                        },
                      }));
                    }
                    if (value && !value.type.includes('image'))
                      toaster({
                        title: 'Upss',
                        condition: 'warning',
                        description: 'File yang diupload tidak sesuai!!',
                        duration: 3000,
                      });
                  }}
                />
                <input
                  id="grup-whatsapp3"
                  type="file"
                  className="absolute left-0 top-0 h-0 w-0 p-0"
                  onChange={(e) => {
                    const value = e.target.files ? e.target.files[0] : null;

                    if (value && value.type.includes('image')) {
                      setClick((prev) => ({
                        ...prev,
                        grupWhatsapp: {
                          ...prev.grupWhatsapp,
                          grup3: true,
                        },
                      }));
                    }
                    if (value && !value.type.includes('image'))
                      toaster({
                        title: 'Upss',
                        condition: 'warning',
                        description: 'File yang diupload tidak sesuai!!',
                        duration: 3000,
                      });
                  }}
                />
                <input
                  type="checkbox"
                  className="ml-[.2rem] h-[1rem] w-[1rem] appearance-none rounded border-[1.8px] border-blue-600 bg-gray-100 ring-2 ring-blue-500 ring-offset-0 duration-300 checked:border-transparent checked:bg-blue-400 checked:ring-2 checked:ring-blue-500 checked:ring-offset-2 hover:cursor-pointer hover:ring-offset-2"
                  disabled={
                    !click.grupWhatsapp.grup1 ||
                    !click.grupWhatsapp.grup2 ||
                    !click.grupWhatsapp.grup3
                      ? true
                      : false
                  }
                  checked={validate.grupWhatsapp.checked}
                  onChange={(e) => {
                    setValidate((prev) => ({
                      ...prev,
                      grupWhatsapp: {
                        ...prev.grupWhatsapp,
                        checked: e.target.checked,
                      },
                    }));
                  }}
                />
                <p className="text-[.8rem] text-main-gray-text">
                  Saya sudah upload bukti share
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                className={cn(
                  'w-[108px] rounded-[.6rem] bg-main-gray-disabled duration-300 md:hover:bg-main-gray-disabled-hover',
                  click.grupWhatsapp.grup1 &&
                    'cursor-default bg-main md:hover:bg-main',
                )}
                onClick={() => {
                  document.getElementById('grup-whatsapp1')?.click();
                }}
              >
                {click.grupWhatsapp.grup1 ? <Check /> : 'Grup 1'}
              </Button>
              <Button
                className={cn(
                  'w-[108px] rounded-[.6rem] bg-main-gray-disabled duration-300 md:hover:bg-main-gray-disabled-hover',
                  click.grupWhatsapp.grup2 &&
                    'cursor-default bg-main md:hover:bg-main',
                )}
                onClick={() => {
                  document.getElementById('grup-whatsapp2')?.click();
                }}
              >
                {click.grupWhatsapp.grup2 ? <Check /> : 'Grup 2'}
              </Button>
              <Button
                className={cn(
                  'w-[108px] rounded-[.6rem] bg-main-gray-disabled duration-300 md:hover:bg-main-gray-disabled-hover',
                  click.grupWhatsapp.grup3 &&
                    'cursor-default bg-main md:hover:bg-main',
                )}
                onClick={() => {
                  document.getElementById('grup-whatsapp3')?.click();
                }}
              >
                {click.grupWhatsapp.grup3 ? <Check /> : 'Grup 3'}
              </Button>
            </div>
          </div>

          <div
            id="join-whatsapp"
            className="relative mb-[1rem] flex items-center justify-between gap-[2rem]"
          >
            {!validate.joinGrupWhatsapp && error && (
              <div className="absolute left-0 top-[100%] text-[.75rem] text-red-600">
                Checklist box diatas
              </div>
            )}
            <div className="flex flex-col items-start gap-[.5rem]">
              <p>Join Grup Belajar</p>
              <div className="flex items-center gap-[.5rem]">
                <input
                  type="checkbox"
                  className="ml-[.2rem] h-[1rem] w-[1rem] appearance-none rounded border-[1.8px] border-blue-600 bg-gray-100 ring-2 ring-blue-500 ring-offset-0 duration-300 checked:border-transparent checked:bg-blue-400 checked:ring-2 checked:ring-blue-500 checked:ring-offset-2 hover:cursor-pointer hover:ring-offset-2"
                  disabled={!click.joinGrupWhatsapp ? true : false}
                  checked={validate.joinGrupWhatsapp}
                  onChange={(e) => {
                    setValidate((prev) => ({
                      ...prev,
                      joinGrupWhatsapp: e.target.checked,
                    }));
                  }}
                />
                <p className="text-[.8rem] text-main-gray-text">
                  Saya sudah join Grup Belajar
                </p>
              </div>
            </div>
            <a
              href="https://chat.whatsapp.com/LMcwXg3olvX09TAXHhmUbz"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                className={cn(
                  'w-[108px] rounded-[.6rem] bg-main-gray-disabled duration-300 md:hover:bg-main-gray-disabled-hover',
                  click.joinGrupWhatsapp &&
                    'cursor-default bg-main md:hover:bg-main',
                )}
                onClick={() => {
                  setClick((prev) => ({ ...prev, joinGrupWhatsappLoad: true }));
                  setTimeout(() => {
                    setClick((prev) => ({ ...prev, joinGrupWhatsapp: true }));
                  }, 6000);
                }}
              >
                {!click.joinGrupWhatsapp ? (
                  <>
                    {click.joinGrupWhatsappLoad ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Follow'
                    )}
                  </>
                ) : (
                  <Check />
                )}
              </Button>
            </a>
          </div>
        </div>
        <div>
          <p className="pt-[1rem] text-start text-[.9rem] text-main-gray-text">
            👆🏼 Pastikan kamu telah mencentang semua kotak kecil di sebelah kiri.
          </p>
          <div className="mt-[1rem] flex w-full items-center justify-center">
            <div
              className={cn(
                'flex h-[47px] w-full cursor-pointer items-center justify-center gap-[.5rem] rounded-[.8rem] bg-main text-center text-[.9rem] text-white hover:bg-main/80',
                isLoading && 'bg-main/80',
              )}
              onClick={handleRegistration}
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  Daftar try out
                  <IconTailedArrowUp45 w={15} />
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  else if (step === 3 && selectTypeRegistration === 'premium')
    return (
      <PaymentTryout
        tryoutData={showDetail}
        setShow={setShowPayment}
        show={showPayment}
      />
    );
};
