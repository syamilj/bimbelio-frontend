'use client';

import { CardTryoutProps } from '@/app/(main)/[web_sub_category]/(user)/user/try-out/_components/ui/card-tryout';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent } from '@/components/ui/card';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn, getDateString } from '@/lib/utils';
import { WebsiteSubCategory } from '@/types/database';
import { Calendar, Clock, Target, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const TryoutSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { data: session } = useSession();
  const pathname = usePathname();

  const [cards, setCards] = useState<
    (CardTryoutProps & { WebsiteSubCategory: WebsiteSubCategory })[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getData = async () => {
    await getGeneral(
      `/tryout/getTryOutCardUpcoming2?userId=${session?.user.id}`,
      {
        setData: setCards,
        setLoading: setIsLoading,
      },
    );
  };

  useEffect(() => {
    getData();
  }, [session]);

  const isMainLandingPage = pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');

  if (!isLoading && cards.length === 0) {
    return null;
  }

  return (
    <section
      id="tryout"
      className={cn(
        'py-16 md:py-20 px-4 bg-gray-50',
        !isLoading && cards.length === 0 && 'hidden',
      )}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white mb-4"
            style={{ backgroundColor: mainColor }}
          >
            <Target className="w-4 h-4" />
            Plus, Ini Juga
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Try Out <span style={{ color: mainColor }}>Semua Jenis Ujian</span>
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            SNBT, Ujian Mandiri PTN, sampai SKD Kedinasan — semua ada Try Out-nya.
            Pakai sistem IRT yang prediksi skor akurat. Udah include di paket.
          </p>
        </div>

        {/* Info Pill */}
        <div className="flex justify-center mb-8">
          <div
            className="flex items-center gap-2 px-5 py-2 rounded-2xl border"
            style={{
              backgroundColor: `${mainColor}10`,
              borderColor: `${mainColor}30`,
            }}
          >
            <Target className="w-4 h-4" style={{ color: mainColor }} />
            <span className="text-sm font-semibold" style={{ color: mainColor }}>
              {cards.length} Try Out Tersedia
            </span>
          </div>
        </div>

        {/* Try Out Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden rounded-2xl">
                <CardContent className="p-0">
                  <div className="h-32 bg-gray-200 animate-pulse"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {cards.slice(0, 3).map((card) => {
              const webSubCat = card.WebsiteSubCategory?.name.toLowerCase().replace(/\s+/g, '-') ?? 'tryout';
              const startDate = getDateString(card.startDate);
              const totalSessions = card.TryoutSession?.length ?? 0;
              const totalParticipants = card._count?.TryoutRegistration ?? 0;

              return (
                <Link
                  key={card.id}
                  href={`/${webSubCat}/user/try-out/${card.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors bg-white">
                    <CardContent className="p-0">
                      {/* Image */}
                      <div
                        className="h-32 relative overflow-hidden"
                        style={{
                          background: card.image
                            ? `url(${card.image})`
                            : mainColor,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute top-3 right-3">
                          <span className="bg-white px-3 py-1 rounded-full text-gray-900 font-semibold text-xs">
                            {card.status === 'ACTIVE' ? 'Aktif' : 'Upcoming'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-3">
                        <h3 className="font-semibold text-base line-clamp-2 text-gray-900 group-hover:opacity-80 transition-opacity">
                          {card.title}
                        </h3>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{startDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            <span>{totalParticipants}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs" style={{ color: mainColor }}>
                          <Clock className="w-3.5 h-3.5" />
                          <span className="font-semibold">{totalSessions} Sesi</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default TryoutSection;
