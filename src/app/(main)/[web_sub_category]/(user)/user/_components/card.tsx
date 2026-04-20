'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { env } from '@/env.mjs';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { cn } from '@/lib/utils';
import { Crown, Lock, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  data: any;
}

export default function Card({ data }: CardProps) {
  const { data: session } = useSession();
  const isUnlocked = session?.user.feature.document || false;
  const { setTransactionPopUp } = useAppContext();

  const handleClick = (id: string, category: string, premium: boolean) => {
    // Jika document premium dan user belum unlock, jangan navigate
    if (premium && !isUnlocked) {
      return;
    }

    const LinkButton = document.getElementById(
      `hrefLink-${id}`,
    ) as HTMLButtonElement;
    LinkButton.click();
  };

  return (
    <>
      {data?.length > 0 &&
        data?.map((item: any, i: number) => {
          const isDocumentPremium = item.premium;
          const isLocked = isDocumentPremium && !isUnlocked;

          return (
            <div
              className="relative group"
              key={i}
            >
              <Link
                id={`hrefLink-${item.id}`}
                href={`/${website_sub_category_id}/user/workspace/${item.categoryId}/${item.id}?tab=chat`}
                className="hidden"
              />

              <div
                id="card"
                className={`relative flex cursor-pointer flex-col items-center justify-start overflow-hidden rounded-3xl bg-white shadow-sm border-2 transition-all duration-300 mb-4 ${
                  isLocked
                    ? 'border-amber-200 hover:shadow-md hover:border-amber-300'
                    : 'border-gray-100 hover:shadow-md hover:border-gray-200 hover:-translate-y-1'
                }`}
                onClick={() =>
                  handleClick(item.id, item.categoryId, item.premium)
                }
              >
                {/* Image Container */}
                <div className="relative h-90% h-full w-full overflow-hidden rounded-t-xl bg-white">
                  <Image
                    src={`${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/document/${item.img}`}
                    className={cn(
                      `h-full w-full object-cover transition-all duration-300`,
                      isLocked ? 'filter blur-sm' : 'group-hover:scale-105',
                    )}
                    width={500}
                    height={300}
                    alt="Bimbelio - Bimbel AI untuk PTN dan Kedinasan"
                  />

                  {/* Lock Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-md border-2 border-amber-200 transform group-hover:scale-105 transition-all duration-300">
                        <div className="flex flex-col items-center text-center space-y-3">
                          {/* Lock Icon with Animation */}
                          {/* <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-md opacity-60 animate-pulse"></div>
                            <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-full shadow-lg">
                              <Lock className="w-8 h-8 text-white drop-shadow-sm" />
                            </div>
                          </div> */}

                          {/* Text */}
                          <div className="flex items-center gap-2">
                            <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 p-1 rounded-3xl shadow-sm">
                              <Lock className="w-4 h-4 text-white drop-shadow-sm" />
                            </div>
                            <p className="text-sm font-bold text-gray-900">
                              Konten Premium
                            </p>
                          </div>

                          {/* Upgrade Button */}
                          <button
                            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-2 rounded-3xl text-xs font-bold shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1.5 group/btn cursor-pointer"
                            onClick={() => setTransactionPopUp(true)}
                          >
                            <Sparkles className="w-3 h-3 group-hover/btn:rotate-12 transition-transform duration-200" />
                            Upgrade Sekarang
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Container */}
                <div
                  id="text-container"
                  className={`flex w-full h-full flex-col justify-between border-t-2 border-gray-100 bg-white px-4 py-3 ${
                    isLocked ? 'opacity-75' : ''
                  }`}
                >
                  {/* Title */}
                  <p
                    id="title"
                    className={`text-sm font-bold leading-tight truncate whitespace-nowrap overflow-hidden text-ellipsis mb-2 transition-colors duration-200 ${
                      isLocked
                        ? 'text-gray-600'
                        : 'text-gray-900 group-hover:text-blue-600'
                    }`}
                  >
                    {item.title}
                  </p>

                  {/* Categories */}
                  <div className="flex gap-2 mb-2 flex-wrap">
                    <p
                      className={`
                        text-xs font-bold leading-tight truncate whitespace-nowrap overflow-hidden text-ellipsis
                        transition-colors duration-200 px-3 py-1.5 rounded-3xl shadow-sm text-white
                        ${
                          item.category?.name === 'Bahasa Inggris'
                            ? 'bg-blue-500'
                            : item.category?.name === 'Bahasa Indonesia'
                              ? 'bg-red-500'
                              : item.category?.name === 'Matematika Dasar'
                                ? 'bg-green-600'
                                : 'bg-gray-400'
                        }
                        ${isLocked ? 'opacity-60' : ''}
                      `}
                      title={item.category?.name}
                    >
                      {item.category?.name}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <p
                      className={`text-xs font-bold leading-tight truncate whitespace-nowrap overflow-hidden text-ellipsis transition-colors duration-200 bg-gray-50 text-gray-700 px-3 py-1.5 rounded-3xl border-2 border-gray-100 ${
                        isLocked
                          ? 'opacity-60'
                          : 'group-hover:text-blue-600 group-hover:border-blue-200'
                      }`}
                    >
                      {item.subCategory?.name}
                    </p>
                  </div>
                </div>

                {/* Top Badges */}
                <div className="absolute right-3 top-3 flex flex-col gap-1.5 z-20">
                  {isDocumentPremium && (
                    <div className="rounded-3xl bg-gradient-to-r from-amber-500 to-orange-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      Premium
                    </div>
                  )}
                  {item.new && (
                    <div className="rounded-3xl bg-orange-400 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                      Baru!
                    </div>
                  )}
                  {item.videoId && (
                    <div className="rounded-3xl bg-blue-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                      Video
                    </div>
                  )}
                </div>

                {/* Hover Border Effect */}
                <div
                  className={`absolute inset-0 rounded-3xl ring-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                    isLocked ? 'ring-amber-400' : 'ring-blue-400'
                  }`}
                />
              </div>
            </div>
          );
        })}
    </>
  );
}
