'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { env } from '@/env.mjs';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn, getDateString, getDateTryoutString, getHours } from '@/lib/utils';
import { IconTailedArrowUp45, IconX } from '@/styles/icon';
import { hexToRgba } from '@/styles/main-styles';
import type {
  TryoutRegistration,
  TryoutSessionParticipant,
} from '@/types/database';
import { Award, BookOpen, Calendar, Clock, Tag, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import RegistrationProofModal from './registration-proof-modal';

interface ProofItem {
  id: string;
  title: string;
  instruction: string;
  icon: ReactNode;
  link: string;
  points: number;
  required: boolean;
  step: number;
  completed: boolean;
  uploaded: boolean;
  loading: boolean;
  fileName: string;
  uploadType?: 'action' | 'file';
}

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
  reloadHref?: boolean;
}

export default function CardTryOut({
  data,
  isPrivate,
  refresh,
  reloadHref,
}: card) {
  const pathname = usePathname();
  const isTesting = pathname?.toLowerCase().includes('testing') || false;

  const searchParams = useSearchParams();
  const id = searchParams?.get('id');

  const router = useRouter();
  const { data: session } = useSession();

  const [showDetail, setShowDetail] = useState<CardTryoutProps | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (showDetail) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
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
        router.push(`${pathname}?register_tryout=success`);
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
    const data = {
      className: '',
      title: '',
    };

    if (item.isRegistered && item.isJoin && item.isDone) {
      data.title = 'Lihat Hasil & Pembahasan';
    } else if (item.isRegistered) {
      data.title = 'Mulai Tryout';
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
            {/* <div
              className="absolute bottom-[2rem] right-[-2rem] z-[10] text-main/20"
              style={{
                color: hexToRgba(item.WebsiteSubCategory?.main_color, 0.2),
              }}
            >
              <IconCrown
                w={180}
                className="rotate-[-20deg]"
              />
            </div> */}
            <Badge
              className={cn(
                'absolute right-4 top-4 bg-main text-white z-[11]',
                getBadgeValue(item)?.className,
              )}
            >
              {getBadgeValue(item)?.title}
            </Badge>
            {/* <CardHeader className="relative z-[2]">
              <CardTitle
                className="text-[1.3rem] font-bold text-main"
                style={{
                  color: item.WebsiteSubCategory?.main_color,
                }}
              >
                {item.title}
              </CardTitle>
            </CardHeader> */}
            <CardContent className="relative z-[2] p-0">
              {/* Header */}
              <div className="relative h-[200px] w-full overflow-hidden">
                {item.image && (
                  <Image
                    src={
                      `${env.NEXT_PUBLIC_SUPABASE_IMG_URL || '/placeholder.svg'}/tryout/${item.image}` ||
                      'placeholder.svg'
                    }
                    alt={item.title}
                    fill
                    className="object-cover transition-transform object-[90%_20%] duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}

                <div
                  className="absolute inset-0 "
                  style={{
                    background: `linear-gradient(to top, ${hexToRgba(item.WebsiteSubCategory?.main_color, 0.5)}, ${hexToRgba(item.WebsiteSubCategory?.main_color, 0.3)}, ${hexToRgba(item.WebsiteSubCategory?.main_color, 0.2)})`,
                  }}
                />

                {/* Price */}
                <div className="absolute left-4 top-4 z-10">
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-blue-600 shadow-md flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-yellow-500" />
                    Gratis!
                  </span>
                </div>

                {/* Category & Title */}
                <div className="absolute bottom-0 left-0 w-full p-4 text-center">
                  <span className="mb-2 inline-block rounded-full bg-yellow-400 px-4 py-1 text-sm font-bold text-blue-900">
                    {/* {item.WebsiteSubCategory.name} */}
                  </span>
                  <h3 className="text-xl font-bold text-white md:text-2xl">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="mb-4 grid grid-cols-3 gap-2">
                  {[
                    {
                      title: 'Durasi',
                      icon: Clock,
                      total: item.TryoutSession.reduce(
                        (acc, item) => acc + item.duration,
                        0,
                      ),
                    },
                    {
                      title: 'Soal',
                      icon: BookOpen,
                      total: item.TryoutSession.reduce(
                        (acc, session) => acc + session._count.TryoutQuestion,
                        0,
                      ),
                    },
                    {
                      title: 'Peserta',
                      icon: Users,
                      total: item._count.TryoutRegistration,
                    },
                  ].map((cItem, cIndex) => (
                    <div
                      key={cIndex}
                      className="rounded-xl bg-main p-2 text-center flex flex-col items-center"
                      style={{
                        backgroundColor: hexToRgba(
                          item.WebsiteSubCategory?.main_color,
                          0.1,
                        ),
                      }}
                    >
                      <div className="text-xs text-gray-600 flex items-center gap-1">
                        <cItem.icon
                          className="h-3.5 w-3.5 text-main"
                          style={{
                            color: item.WebsiteSubCategory?.main_color,
                          }}
                        />
                        {cItem.title}
                      </div>
                      <div
                        className="text-sm font-bold text-main"
                        style={{
                          color: item.WebsiteSubCategory?.main_color,
                        }}
                      >
                        {cItem.total}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-4 flex items-center justify-center flex-wrap gap-1.5">
                  {['tryout'].map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-main/10 px-2 py-0.5 text-xs font-medium text-main flex items-center gap-1"
                      style={{
                        backgroundColor: hexToRgba(
                          item.WebsiteSubCategory?.main_color,
                          0.1,
                        ),
                        color: item.WebsiteSubCategory?.main_color,
                      }}
                    >
                      <Tag className="h-2.5 w-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mb-4 grid grid-cols-2 gap-2">
                  {[
                    {
                      icon: Calendar,
                      title: 'Mulai',
                      date: item.startDate,
                    },
                    {
                      icon: Calendar,
                      title: 'Selesai',
                      date: item.endDate,
                    },
                  ].map((cItem, cIndex) => (
                    <div
                      key={cIndex}
                      className="flex flex-col items-center rounded-lg bg-main/10 p-2 text-xs"
                      style={{
                        backgroundColor: hexToRgba(
                          item.WebsiteSubCategory?.main_color,
                          0.1,
                        ),
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <cItem.icon
                          className="h-3.5 w-3.5 text-main"
                          style={{
                            color: item.WebsiteSubCategory?.main_color,
                          }}
                        />
                        <span className="font-medium text-gray-700">
                          {cItem.title}
                        </span>
                      </div>
                      <span
                        className="mt-1 text-sm font-bold text-main"
                        style={{
                          color: item.WebsiteSubCategory?.main_color,
                        }}
                      >
                        {getDateString(cItem.date)}
                      </span>
                    </div>
                  ))}
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
                        if (reloadHref && item.WebsiteSubCategory) {
                          localStorage.setItem(
                            'website_sub_category_id',
                            item.WebsiteSubCategory.id,
                          );
                          // window.location.href = `${window.location.origin}/${item.WebsiteSubCategory.id}/user/try-out?id=${item.id}`;
                          router.push(
                            `${window.location.origin}/${item.WebsiteSubCategory.id}/user/try-out?id=${item.id}`,
                          );
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
              setShowDetail(null);
            }}
          />
          <div
            id="register-tryout-modal"
            className="relative flex w-[calc(100%-2rem)] max-w-[500px] flex-col gap-[1rem] rounded-[1rem] bg-white p-[2rem] shadow-cardSoft md:w-full max-h-[90vh] overflow-y-auto"
          >
            {!showDetail.isRegistered ? (
              <>
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
                <RegistrationProofModal
                  showDetail={showDetail}
                  setShowDetail={setShowDetail}
                  onRegistrationComplete={handleRegistration}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </>
            ) : showDetail.isRegistered ? (
              <div className="mt-[1rem] flex w-full items-center justify-center">
                <Link
                  href={
                    isTesting
                      ? `/${website_sub_category_id}/admin/tryout/testing/try-out/${showDetail.id}`
                      : `/${website_sub_category_id}/user/try-out/${showDetail.id}`
                  }
                  className="flex w-full cursor-pointer items-center justify-center gap-[.5rem] rounded-[.8rem] bg-main py-[.8rem] text-center text-[.9rem] text-white hover:bg-main/80"
                >
                  Mulai try out
                  <IconTailedArrowUp45 w={15} />
                </Link>
              </div>
            ) : showDetail.isRegistered &&
              showDetail.isDone &&
              !showDetail.isJoin ? (
              <div className="mt-[1rem] flex w-full items-center justify-center"></div>
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
