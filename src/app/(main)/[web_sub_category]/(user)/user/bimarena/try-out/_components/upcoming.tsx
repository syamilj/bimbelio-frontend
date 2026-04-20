import { useSession } from '@/components/provider/provider-session-auth';
import { Badge } from '@/components/ui/badge';
import { ScrollWrapper } from '@/components/ui/scroll-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { getDateStringShort } from '@/lib/utils';
import {
  BookOpen,
  Calendar,
  CalendarClock,
  Clock,
  Layers,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import CardTryOut, { CardTryoutProps } from './ui/card-tryout';

export default function Upcoming({
  id,
  onCountReady,
}: {
  id: string;
  onCountReady?: (count: number) => void;
}) {
  const { data: session } = useSession();

  const [cards, setCards] = useState<CardTryoutProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getData = async () => {
    if (!session) return;
    await getGeneral(
      `/tryout/getTryOutCardUpcoming?userId=${session?.user.id}`,
      {
        setData: setCards,
        setLoading: setIsLoading,
      },
    );
  };

  useEffect(() => {
    getData();
  }, [session]);

  // Report count to parent for smart tab selection
  useEffect(() => {
    if (!isLoading && onCountReady) {
      onCountReady(cards?.length || 0);
    }
  }, [isLoading, cards]);

  // Compute overview + nearest tryout info
  const overview = useMemo(() => {
    if (!cards?.length) return null;
    const totalQuestions = cards.reduce((sum, c) => {
      return (
        sum +
        (c.TryoutSession?.reduce(
          (s: number, sess: any) => s + (sess._count?.TryoutQuestion || 0),
          0,
        ) || 0)
      );
    }, 0);
    const totalSubtests = cards.reduce(
      (sum, c) => sum + (c.TryoutSession?.length || 0),
      0,
    );
    const totalDuration = cards.reduce((sum, c) => {
      return (
        sum +
        (c.TryoutSession?.reduce(
          (s: number, sess: any) => s + (sess.duration || 0),
          0,
        ) || 0)
      );
    }, 0);
    const registered = cards.filter((c) => c.isRegistered).length;

    // Nearest tryout (sorted ascending by startDate from BE)
    const nearest = cards[0];
    const nearestDate = nearest ? new Date(nearest.startDate) : null;
    const now = new Date();
    let daysUntil: string | null = null;
    if (nearestDate) {
      const diffMs = nearestDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) daysUntil = 'Hari ini';
      else if (diffDays === 1) daysUntil = 'Besok';
      else if (diffDays <= 7) daysUntil = `${diffDays} hari lagi`;
      else daysUntil = getDateStringShort(nearestDate);
    }

    return {
      totalQuestions,
      totalSubtests,
      totalDuration,
      registered,
      nearest,
      daysUntil,
    };
  }, [cards]);

  if (!cards && !isLoading) {
    return <div>Error</div>;
  }

  return (
    <div className="p-4 md:p-6">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-3xl bg-blue-100 flex items-center justify-center">
          <Calendar className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h3 className="text-base font-black text-slate-800">Akan Datang</h3>
          <p className="text-xs text-slate-400 font-medium">
            Daftar sekarang agar tidak ketinggalan
          </p>
        </div>
        {!isLoading && cards && cards.length > 0 && (
          <span className="ml-auto text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            {cards.length} TO
          </span>
        )}
      </div>

      {/* Nearest tryout banner + overview tags */}
      {!isLoading && overview && cards.length > 0 && (
        <div className="mb-4 space-y-3">
          {/* Countdown banner for nearest */}
          {overview.daysUntil && overview.nearest && (
            <div className="p-3 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-3xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                <CalendarClock className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-blue-800 truncate">
                  {overview.nearest.title}
                </p>
                <p className="text-[10px] text-blue-500 font-medium">
                  Try out terdekat
                </p>
              </div>
              <Badge className="bg-blue-500 text-white border-0 text-xs font-bold flex-shrink-0">
                {overview.daysUntil}
              </Badge>
            </div>
          )}

          {/* Quick stats tags */}
          <div
            className="flex items-center gap-2 overflow-x-auto"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 flex-shrink-0">
              <BookOpen className="w-3 h-3 text-blue-500" />
              <span className="text-[10px] font-bold text-blue-700">
                {overview.totalQuestions} soal
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 flex-shrink-0">
              <Layers className="w-3 h-3 text-indigo-500" />
              <span className="text-[10px] font-bold text-indigo-700">
                {overview.totalSubtests} subtes
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 flex-shrink-0">
              <Clock className="w-3 h-3 text-purple-500" />
              <span className="text-[10px] font-bold text-purple-700">
                {overview.totalDuration} menit
              </span>
            </div>
            {overview.registered > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 flex-shrink-0">
                <Zap className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-700">
                  {overview.registered} terdaftar
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cards - Horizontal Scroll Mobile / Grid Desktop */}
      {!isLoading && cards && cards.length > 0 && (
        <ScrollWrapper
          className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x md:grid md:grid-cols-2 md:overflow-visible md:pb-0 md:mx-0 md:px-0 md:gap-5 lg:grid-cols-3"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <CardTryOut
            data={cards}
            userTryOutId={id}
            // isPrivate
            refresh={getData}
          />
        </ScrollWrapper>
      )}

      {!isLoading && cards?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mb-4">
            <Calendar className="w-10 h-10 text-blue-300" />
          </div>
          <h4 className="text-base font-bold text-slate-700 mb-1">
            Belum ada try out yang akan datang
          </h4>
          <p className="text-sm text-slate-400 max-w-xs">
            Try out baru akan segera hadir. Pantau terus halaman ini!
          </p>
        </div>
      )}

      {isLoading && (
        <ScrollWrapper
          className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x md:grid md:grid-cols-2 md:overflow-visible md:pb-0 md:mx-0 md:px-0 md:gap-5 lg:grid-cols-3"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {Array.from({ length: 3 }).map((_, i: number) => (
            <Skeleton
              key={i}
              className="h-[420px] min-w-[80%] sm:min-w-[320px] md:min-w-0 md:w-full rounded-3xl shrink-0 snap-center"
            />
          ))}
        </ScrollWrapper>
      )}
    </div>
  );
}
