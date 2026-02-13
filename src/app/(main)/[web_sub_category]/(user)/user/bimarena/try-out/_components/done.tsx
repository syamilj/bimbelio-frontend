import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import {
  Award,
  BarChart3,
  CheckCircle,
  Medal,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import CardTryOut, { CardTryoutProps } from './ui/card-tryout';

export default function Done({
  id,
  onCountReady,
}: {
  id: string;
  onCountReady?: (count: number) => void;
}) {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const isSNBT =
    websiteSubCategory?.name?.toUpperCase().includes('SNBT') || false;

  const [tab, setTab] = useState<'all' | 'joined'>('all');

  const [cards, setCards] = useState<CardTryoutProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getData = async () => {
    if (!session) return;
    await getGeneral(`/tryout/getTryOutCardDone?userId=${session?.user.id}`, {
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

  // Calculate score stats from completed tryouts
  const scoreStats = useMemo(() => {
    if (!cards?.length) return null;
    // Cards with TryoutResult data
    const withResults = cards.filter(
      (c: any) => c.TryoutResult && c.TryoutResult.length > 0,
    );
    if (!withResults.length) return null;

    const scores = withResults.map((c: any) => {
      const rawScore = c.TryoutResult[0]?.totalScore || 0;
      if (isSNBT) {
        const subtestCount = c.TryoutSession?.length || 1;
        return subtestCount > 1
          ? Math.round(rawScore / subtestCount)
          : rawScore;
      }
      return rawScore;
    });
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const avg = Math.round(
      scores.reduce((a: number, b: number) => a + b, 0) / scores.length,
    );

    return {
      total: cards.length,
      withResults: withResults.length,
      max,
      min,
      avg,
    };
  }, [cards, isSNBT]);

  const filteredCards = cards.filter((c) => {
    if (tab === 'all') return true;
    if (c.isJoin && c.isRegistered) return true;
    return false;
  });

  console.log({ tab });

  if (!cards && !isLoading) {
    return <div>Error</div>;
  }

  return (
    <div className="p-4 md:p-6">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-3xl bg-purple-100 flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-purple-600" />
        </div>
        <div>
          <h3 className="text-base font-black text-slate-800">Selesai</h3>
          <p className="text-xs text-slate-400 font-medium">
            Lihat hasil dan pembahasan try out
          </p>
        </div>
        {!isLoading && cards && cards.length > 0 && (
          <span className="ml-auto text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            {cards.length} TO
          </span>
        )}
      </div>

      {/* Score Stats Summary */}
      {!isLoading && scoreStats && (
        <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="flex items-center gap-2.5 p-3 rounded-3xl bg-purple-50/80 border border-purple-100">
            <div className="w-8 h-8 rounded-3xl bg-purple-500 flex items-center justify-center flex-shrink-0">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-black text-slate-800 leading-tight">
                {scoreStats.total}
              </p>
              <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wide">
                Total TO
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-3xl bg-emerald-50/80 border border-emerald-100">
            <div className="w-8 h-8 rounded-3xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-black text-slate-800 leading-tight">
                {scoreStats.max}
              </p>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                {isSNBT ? 'Tertinggi/Sub' : 'Tertinggi'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-3xl bg-blue-50/80 border border-blue-100">
            <div className="w-8 h-8 rounded-3xl bg-blue-500 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-black text-slate-800 leading-tight">
                {scoreStats.avg}
              </p>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                {isSNBT ? 'Rata-rata/Sub' : 'Rata-rata'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-3xl bg-amber-50/80 border border-amber-100">
            <div className="w-8 h-8 rounded-3xl bg-amber-500 flex items-center justify-center flex-shrink-0">
              <Medal className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-black text-slate-800 leading-tight">
                {scoreStats.withResults}
              </p>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">
                Dgn Hasil
              </p>
            </div>
          </div>
        </div>
      )}

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as any)}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger
            value="all"
            className="text-sm font-bold"
          >
            Semua
          </TabsTrigger>
          <TabsTrigger
            value="joined"
            className="text-sm font-bold"
          >
            Diikuti
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Cards - Horizontal Scroll Mobile / Grid Desktop */}
      {!isLoading && filteredCards && filteredCards.length > 0 && (
        <div
          className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x md:grid md:grid-cols-2 md:overflow-visible md:pb-0 md:mx-0 md:px-0 md:gap-5 lg:grid-cols-3"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <CardTryOut
            data={filteredCards}
            userTryOutId={id}
            refresh={getData}
          />
        </div>
      )}

      {!isLoading && filteredCards?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 rounded-3xl bg-purple-50 flex items-center justify-center mb-4">
            <Award className="w-10 h-10 text-purple-300" />
          </div>
          <h4 className="text-base font-bold text-slate-700 mb-1">
            Belum ada try out yang selesai
          </h4>
          <p className="text-sm text-slate-400 max-w-xs">
            Selesaikan try out pertamamu untuk melihat hasil dan pembahasannya
            di sini
          </p>
        </div>
      )}

      {isLoading && (
        <div
          className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x md:grid md:grid-cols-2 md:overflow-visible md:pb-0 md:mx-0 md:px-0 md:gap-5 lg:grid-cols-3"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {Array.from({ length: 3 }).map((_, i: number) => (
            <Skeleton
              key={i}
              className="h-[420px] min-w-[80%] sm:min-w-[320px] md:min-w-0 md:w-full rounded-3xl shrink-0 snap-center"
            />
          ))}
        </div>
      )}
    </div>
  );
}
