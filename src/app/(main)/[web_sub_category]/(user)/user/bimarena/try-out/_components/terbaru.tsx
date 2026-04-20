import { useSession } from '@/components/provider/provider-session-auth';
import { Badge } from '@/components/ui/badge';
import { ScrollWrapper } from '@/components/ui/scroll-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { BookOpen, Clock, Layers, Play, Zap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import CardTryOut, { CardTryoutProps } from './ui/card-tryout';

export default function Terbaru({
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
    await getGeneral(`/tryout/getTryOutCard?userId=${session?.user.id}`, {
      setData: setCards,
      setLoading: setIsLoading,
    });
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

  // Compute overview stats
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
    return { totalQuestions, totalSubtests, totalDuration, registered };
  }, [cards]);

  if (!cards && !isLoading) {
    return <div>Error</div>;
  }

  return (
    <div className="p-4 md:p-6">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-3xl bg-emerald-100 flex items-center justify-center">
          <Play className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-base font-black text-slate-800">
            Sedang Berlangsung
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Try out yang bisa kamu kerjakan sekarang
          </p>
        </div>
        {!isLoading && cards && cards.length > 0 && (
          <Badge className="ml-auto bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold gap-1 animate-pulse">
            <Zap className="w-3 h-3" />
            {cards.length} Aktif
          </Badge>
        )}
      </div>

      {/* Quick overview banner */}
      {!isLoading && overview && cards.length > 0 && (
        <div
          className="mb-4 flex items-center gap-3 overflow-x-auto py-2"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 flex-shrink-0">
            <BookOpen className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-700">
              {overview.totalQuestions} soal
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 flex-shrink-0">
            <Layers className="w-3 h-3 text-blue-500" />
            <span className="text-[10px] font-bold text-blue-700">
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
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 flex-shrink-0">
              <Zap className="w-3 h-3 text-amber-500" />
              <span className="text-[10px] font-bold text-amber-700">
                {overview.registered} terdaftar
              </span>
            </div>
          )}
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
            refresh={getData}
          />
        </ScrollWrapper>
      )}

      {!isLoading && cards?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 flex items-center justify-center mb-4">
            <Play className="w-10 h-10 text-emerald-300" />
          </div>
          <h4 className="text-base font-bold text-slate-700 mb-1">
            Tidak ada try out berlangsung
          </h4>
          <p className="text-sm text-slate-400 max-w-xs">
            Belum ada try out yang aktif saat ini. Cek tab &quot;Akan
            Datang&quot; untuk try out berikutnya
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
