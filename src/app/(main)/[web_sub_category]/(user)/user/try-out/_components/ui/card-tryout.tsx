'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
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
import { pixel } from '@/lib/pixel/_core'; // ✅ Import pixel untuk tracking Lead
import { cn, getDateString } from '@/lib/utils';
import { IconTailedArrowUp45 } from '@/styles/icon';
import type {
  TryoutRegistration,
  TryoutSessionParticipant,
} from '@/types/database';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Play,
  Star,
  Tag,
  Trophy,
} from 'lucide-react';
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
  const { websiteSubCategory } = useWebsiteSubCategory();
  const {
    useAuth: { setShowAuth },
  } = useAppContext();

  const searchParams = useSearchParams();
  const id = searchParams?.get('id');

  const router = useRouter();
  const { data: session } = useSession();

  const [showDetail, setShowDetail] = useState<CardTryoutProps | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

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
    websiteSubCategoryId: string;
  }) => {
    const { websiteSubCategoryId, ...restPayload } = payload;
    await mutateGeneral('/tryout/registerTryOut', {
      payload: restPayload,
      params: { website_sub_category_id: websiteSubCategoryId },
      type: 'post',
      async onSuccess() {
        if (refresh) {
          await refresh();
        }
      },
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
          websiteSubCategoryId:
            showDetail.WebsiteSubCategory?.id || website_sub_category_id || '',
        });

        // ✅ Track Lead Event - User mendaftar try out
        try {
          pixel.meta.track(
            'Lead',
            {
              content_name: `Tryout Registration - ${showDetail.title}`,
              content_type: 'tryout',
              value: isPremium ? 1 : 0, // 1 untuk premium, 0 untuk gratis
              currency: 'IDR',
              contents: [{ id: showDetail.id, quantity: 1 }],
            },
            {
              // Advanced Matching data
              em: session?.user?.email,
              ph: session?.user?.phone || undefined, // ✅ Handle null value
              fn: session?.user?.name?.split(' ')[0],
              ln: session?.user?.name?.split(' ').slice(1).join(' '),
            },
          );

          pixel.tiktok.track('Lead', {
            content_name: `Tryout Registration - ${showDetail.title}`,
            content_type: 'tryout',
            value: isPremium ? 1 : 0,
            currency: 'IDR',
            content_id: `tryout_registration_${showDetail.id}`, // ✅ Required untuk TikTok VSA
          });
        } catch (pixelError) {
          console.warn(
            'Pixel tracking error on tryout registration:',
            pixelError,
          );
        }

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
    if (item.isRegistered) {
      return {
        className: 'bg-green-50 text-green-700 border-green-200 font-medium',
        title: 'Terdaftar',
        icon: <CheckCircle className="w-3 h-3" />,
      };
    } else if (!item.isRegistered) {
      return {
        className: 'bg-blue-50 text-blue-700 border-blue-200 font-medium',
        title: 'Belum Daftar',
        icon: <Star className="w-3 h-3" />,
      };
    } else if (item.isActive) {
      return {
        className:
          'bg-orange-50 text-orange-700 border-orange-200 font-medium animate-pulse',
        title: 'Berlangsung',
        icon: <Play className="w-3 h-3" />,
      };
    }
    return {
      className: 'bg-gray-50 text-gray-700 border-gray-200 font-medium',
      title: 'Unknown',
      icon: <Star className="w-3 h-3" />,
    };
  };

  const getButtonValue = (item: CardTryoutProps) => {
    if (item.isRegistered && item.isJoin && item.isDone) {
      return {
        title: 'Lihat Hasil & Pembahasan',
        icon: <Eye className="w-4 h-4" />,
        variant: 'results',
      };
    } else if (item.isRegistered) {
      return {
        title: 'Mulai Tryout',
        icon: <Play className="w-4 h-4" />,
        variant: 'start',
      };
    } else {
      return {
        title: 'Daftar Sekarang',
        icon: <Trophy className="w-4 h-4" />,
        variant: 'register',
      };
    }
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
        data?.map((item, i: number) => {
          const badgeData = getBadgeValue(item);
          const buttonData = getButtonValue(item);

          return (
            <Card
              key={i}
              className="group relative overflow-hidden border-2 border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] bg-white rounded-3xl"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-20">
                <Badge
                  className={cn('flex items-center gap-1', badgeData.className)}
                >
                  {badgeData.icon}
                  <span className="text-xs font-medium">{badgeData.title}</span>
                </Badge>
              </div>

              {/* Free Badge */}
              <div className="absolute top-4 left-4 z-20">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  <span className="text-xs">GRATIS</span>
                </Badge>
              </div>

              <CardContent className="p-0">
                {/* Hero Image Section */}
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  {item.image ? (
                    <Image
                      src={`${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/tryout/${item.image}`}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                      }}
                    >
                      <Trophy className="w-12 h-12 text-white opacity-50" />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg lg:text-xl font-bold leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs lg:text-sm text-white/80 mt-1">
                      {item.WebsiteSubCategory?.name}
                    </p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 lg:p-6 space-y-4">
                  {/* Stats Grid - Match Course Gradient Style */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Durasi - Blue */}
                    <div
                      className="p-3 rounded-2xl border-2 text-center"
                      style={{
                        background: `linear-gradient(to bottom right, rgb(239 246 255), rgb(219 234 254))`,
                        borderColor: 'rgb(191 219 254)',
                      }}
                    >
                      <Clock className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                      <div className="text-sm font-bold text-blue-700">
                        {item.TryoutSession.reduce(
                          (acc, s) => acc + s.duration,
                          0,
                        )}
                      </div>
                      <div className="text-xs text-blue-600 font-medium">
                        Menit
                      </div>
                    </div>

                    {/* Soal - Green */}
                    <div
                      className="p-3 rounded-2xl border-2 text-center"
                      style={{
                        background: `linear-gradient(to bottom right, rgb(240 253 244), rgb(220 252 231))`,
                        borderColor: 'rgb(187 247 208)',
                      }}
                    >
                      <BookOpen className="w-4 h-4 text-green-600 mx-auto mb-1" />
                      <div className="text-sm font-bold text-green-700">
                        {item.TryoutSession.reduce(
                          (acc, s) => acc + s._count.TryoutQuestion,
                          0,
                        )}
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        Soal
                      </div>
                    </div>

                    {/* Peserta - Purple */}
                    {/* <div
                      className="p-3 rounded-2xl border-2 text-center"
                      style={{
                        background: `linear-gradient(to bottom right, rgb(250 245 255), rgb(243 232 255))`,
                        borderColor: 'rgb(233 213 255)',
                      }}
                     >
                      <Users className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                      <div className="text-sm font-bold text-purple-700">
                        {item._count.TryoutRegistration}
                      </div>
                      <div className="text-xs text-purple-600 font-medium">
                        Peserta
                      </div>
                    </div> */}
                  </div>

                  {/* Dates Section - Match Course Style */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Tanggal Mulai - Orange */}
                    <div
                      className="p-3 rounded-2xl border-2 text-center"
                      style={{
                        background: `linear-gradient(to bottom right, rgb(255 247 237), rgb(254 237 213))`,
                        borderColor: 'rgb(254 215 170)',
                      }}
                    >
                      <Calendar className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                      <div className="text-xs text-orange-600 font-medium mb-1">
                        Mulai
                      </div>
                      <div className="text-sm font-bold text-orange-700">
                        {getDateString(item.startDate)}
                      </div>
                    </div>

                    {/* Tanggal Selesai - Pink */}
                    <div
                      className="p-3 rounded-2xl border-2 text-center"
                      style={{
                        background: `linear-gradient(to bottom right, rgb(253 242 248), rgb(252 231 243))`,
                        borderColor: 'rgb(251 207 232)',
                      }}
                    >
                      <Calendar className="w-4 h-4 text-pink-600 mx-auto mb-1" />
                      <div className="text-xs text-pink-600 font-medium mb-1">
                        Pembahasan
                      </div>
                      <div className="text-sm font-bold text-pink-700">
                        {getDateString(item.endDate)}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex justify-center">
                    <Badge className="flex items-center gap-1 text-xs bg-gray-50 text-gray-700 border-gray-200 font-medium">
                      <Tag className="w-3 h-3" />
                      {item.WebsiteSubCategory?.name}
                    </Badge>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 lg:p-6 pt-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="w-full h-12 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
                        style={{
                          background: `linear-gradient(135deg, ${item.WebsiteSubCategory?.main_color || mainColor}, ${item.WebsiteSubCategory?.secondary_color || secondaryColor})`,
                        }}
                        onClick={() => {
                          // Check if user is logged in first
                          if (!session) {
                            const currentPath = window.location.pathname;
                            setShowAuth({
                              redirect: `${currentPath}?id=${item.id}`,
                              open: true,
                            });
                            return;
                          }

                          if (reloadHref && item.WebsiteSubCategory) {
                            localStorage.setItem(
                              'website_sub_category_id',
                              item.WebsiteSubCategory.id,
                            );
                            router.push(
                              `${window.location.origin}/${item.WebsiteSubCategory.id}/user/try-out?id=${item.id}`,
                            );
                          } else {
                            setShowDetail(item);
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {buttonData.icon}
                          <span>{buttonData.title}</span>
                          <IconTailedArrowUp45
                            w={16}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {item.status === 'ongoing'
                        ? 'Lanjutkan tryout yang sedang berlangsung.'
                        : item.isRegistered
                          ? 'Mulai mengerjakan try out.'
                          : 'Daftar untuk mengikuti tryout ini.'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardFooter>
            </Card>
          );
        })}

      {/* Enhanced Modal */}
      {showDetail && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={() => setShowDetail(null)}
          />
          <div
            id="register-tryout-modal"
            className="relative w-[calc(100%-2rem)] max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="p-6 lg:p-8">
              {!showDetail.isRegistered ? (
                <>
                  {/* Registration Modal Component */}
                  <RegistrationProofModal
                    showDetail={showDetail}
                    setShowDetail={setShowDetail}
                    onRegistrationComplete={handleRegistration}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                  />
                </>
              ) : (
                /* Registered State */
                <div className="text-center space-y-6">
                  <div
                    className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Sudah Terdaftar!
                    </h2>
                    <p className="text-gray-600">
                      Kamu sudah terdaftar untuk try out ini
                    </p>
                  </div>

                  <Link
                    href={
                      isTesting
                        ? `/${showDetail.WebsiteSubCategory?.id || website_sub_category_id}/admin/tryout/testing/try-out/${showDetail.id}`
                        : `/${showDetail.WebsiteSubCategory?.id || website_sub_category_id}/user/try-out/${showDetail.id}`
                    }
                    className="inline-flex items-center gap-2 w-full h-12 justify-center rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    {showDetail.isDone && showDetail.isJoin ? (
                      <>
                        <Eye className="w-4 h-4" />
                        <span>Lihat Hasil</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Mulai Try Out</span>
                      </>
                    )}
                    <IconTailedArrowUp45 w={16} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
