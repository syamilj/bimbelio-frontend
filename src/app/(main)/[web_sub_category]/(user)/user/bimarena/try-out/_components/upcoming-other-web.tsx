import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Skeleton } from '@/components/ui/skeleton';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import {
  ArrowRight,
  Globe,
  GraduationCap,
  Layers,
  Sparkles,
  Star,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import CardTryOut, { CardTryoutProps } from './ui/card-tryout';

interface GroupedTryout {
  webSubName: string;
  webSubColor: string;
  webSubSecondaryColor: string;
  count: number;
  totalQuestions: number;
  totalSubtests: number;
  tryouts: CardTryoutProps[];
}

export default function UpcomingOtherWeb({
  id,
  onCountReady,
}: {
  id: string;
  onCountReady?: (count: number) => void;
}) {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const [cards, setCards] = useState<CardTryoutProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getData = async () => {
    if (!session) return;
    await getGeneral(
      `/tryout/getTryOutCardUpcomingAnotherWeb?userId=${session?.user.id}`,
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

  // Active program filter
  const [activeProgram, setActiveProgram] = useState<string | null>(null);

  // Group tryouts by WebsiteSubCategory
  const grouped = useMemo<GroupedTryout[]>(() => {
    if (!cards?.length) return [];
    const map = new Map<string, GroupedTryout>();

    for (const card of cards) {
      const webSub = (card as any).WebsiteSubCategory;
      const key = webSub?.name || 'Lainnya';
      const color = webSub?.main_color || '#6B7280';
      const secondaryColor = webSub?.secondary_color || color;

      if (!map.has(key)) {
        map.set(key, {
          webSubName: key,
          webSubColor: color,
          webSubSecondaryColor: secondaryColor,
          count: 0,
          totalQuestions: 0,
          totalSubtests: 0,
          tryouts: [],
        });
      }

      const group = map.get(key)!;
      group.count++;
      group.tryouts.push(card);
      const questions =
        card.TryoutSession?.reduce(
          (sum: number, s: any) => sum + (s._count?.TryoutQuestion || 0),
          0,
        ) || 0;
      group.totalQuestions += questions;
      group.totalSubtests += card.TryoutSession?.length || 0;
    }

    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [cards]);

  // Filter displayed groups
  const displayedGroups = useMemo(() => {
    if (!activeProgram) return grouped;
    return grouped.filter((g) => g.webSubName === activeProgram);
  }, [grouped, activeProgram]);

  if (!cards && !isLoading) {
    return <div>Error</div>;
  }

  return (
    <div className="p-4 md:p-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-3xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
          }}
        >
          <Globe className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-slate-800">
              Explore Programs
            </h3>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200/60">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span className="text-[9px] font-black text-amber-700 tracking-wide">
                CROSS-PROGRAM
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Try out dari program studi lain — perluas latihanmu!
          </p>
        </div>
      </div>

      {/* Program Chips — filter by program */}
      {!isLoading && grouped.length > 0 && (
        <div className="mb-4">
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: 'none' }}
          >
            {/* All chip */}
            <button
              onClick={() => setActiveProgram(null)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-3xl text-xs font-bold transition-all flex-shrink-0 border ${
                !activeProgram
                  ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Semua
              <span
                className={`text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none ${
                  !activeProgram ? 'bg-white/20' : 'bg-slate-100'
                }`}
              >
                {cards.length}
              </span>
            </button>
            {grouped.map((group) => (
              <button
                key={group.webSubName}
                onClick={() =>
                  setActiveProgram(
                    activeProgram === group.webSubName
                      ? null
                      : group.webSubName,
                  )
                }
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-3xl text-xs font-bold transition-all flex-shrink-0 border ${
                  activeProgram === group.webSubName
                    ? 'text-white shadow-md border-transparent'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
                style={
                  activeProgram === group.webSubName
                    ? {
                        background: `linear-gradient(135deg, ${group.webSubColor}, ${group.webSubSecondaryColor})`,
                      }
                    : { color: group.webSubColor }
                }
              >
                <GraduationCap className="w-3.5 h-3.5" />
                {group.webSubName}
                <span
                  className={`text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none ${
                    activeProgram === group.webSubName ? 'bg-white/25' : ''
                  }`}
                  style={
                    activeProgram !== group.webSubName
                      ? { backgroundColor: `${group.webSubColor}15` }
                      : {}
                  }
                >
                  {group.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats Bar */}
      {!isLoading && cards && cards.length > 0 && !activeProgram && (
        <div className="mb-5 p-3 rounded-3xl bg-gradient-to-r from-amber-50/80 via-orange-50/50 to-rose-50/80 border border-amber-100/60">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-lg font-black text-slate-800">
                {grouped.length}
              </p>
              <p className="text-[9px] font-bold text-amber-600/80 uppercase tracking-wider">
                Program
              </p>
            </div>
            <div className="w-px h-8 bg-amber-200/50" />
            <div className="text-center">
              <p className="text-lg font-black text-slate-800">
                {cards.length}
              </p>
              <p className="text-[9px] font-bold text-orange-600/80 uppercase tracking-wider">
                Try Out
              </p>
            </div>
            <div className="w-px h-8 bg-amber-200/50" />
            <div className="text-center">
              <p className="text-lg font-black text-slate-800">
                {grouped.reduce((a, g) => a + g.totalSubtests, 0)}
              </p>
              <p className="text-[9px] font-bold text-rose-600/80 uppercase tracking-wider">
                Subtes
              </p>
            </div>
            <div className="w-px h-8 bg-amber-200/50" />
            <div className="text-center">
              <p className="text-lg font-black text-slate-800">
                {grouped.reduce((a, g) => a + g.totalQuestions, 0)}
              </p>
              <p className="text-[9px] font-bold text-purple-600/80 uppercase tracking-wider">
                Soal
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grouped by WebSub */}
      {!isLoading && displayedGroups.length > 0 && (
        <div className="space-y-6">
          {displayedGroups.map((group) => (
            <div key={group.webSubName}>
              {/* Group Header — Card-style */}
              <div
                className="flex items-center gap-3 mb-3 p-3 rounded-3xl border"
                style={{
                  backgroundColor: `${group.webSubColor}08`,
                  borderColor: `${group.webSubColor}20`,
                }}
              >
                <div
                  className="w-9 h-9 rounded-3xl flex items-center justify-center shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${group.webSubColor}, ${group.webSubSecondaryColor})`,
                  }}
                >
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-black text-slate-800 truncate block">
                    {group.webSubName}
                  </span>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {group.count} try out · {group.totalSubtests} subtes ·{' '}
                    {group.totalQuestions} soal
                  </p>
                </div>
                <ArrowRight
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: group.webSubColor }}
                />
              </div>

              {/* Cards for this group */}
              <div
                className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x md:grid md:grid-cols-2 md:overflow-visible md:pb-0 md:mx-0 md:px-0 md:gap-5 lg:grid-cols-3"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <CardTryOut
                  data={group.tryouts}
                  userTryOutId={id}
                  isPrivate
                  refresh={getData}
                  reloadHref
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && cards?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
              <Globe className="w-10 h-10 text-amber-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center shadow-lg">
              <Star className="w-3 h-3 text-white" />
            </div>
          </div>
          <h4 className="text-base font-black text-slate-700 mb-1">
            Belum ada dari program lain
          </h4>
          <p className="text-sm text-slate-400 max-w-xs">
            Try out dari program studi lain akan muncul di sini saat tersedia
          </p>
        </div>
      )}

      {isLoading && (
        <div className="space-y-4">
          {/* Skeleton chips */}
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-10 w-24 rounded-3xl flex-shrink-0"
              />
            ))}
          </div>
          <Skeleton className="h-16 w-full rounded-3xl" />
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
        </div>
      )}
    </div>
  );
}
