'use client';

import { LeaderboardContext } from '@/app/[web_sub_category]/(user)/user/leaderboard/_components/provider-leaderboard';
import { RankingStats } from '@/app/[web_sub_category]/(user)/user/leaderboard/_components/ranking-stats';
import { RankingTable } from '@/app/[web_sub_category]/(user)/user/leaderboard/_components/ranking-table';
import { TopWinners } from '@/app/[web_sub_category]/(user)/user/leaderboard/_components/top-winners';
import { TryOutSelector } from '@/app/[web_sub_category]/(user)/user/leaderboard/_components/tryout-selector';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface RankingTryoutProps {
  tryoutId: string;
  topScore: number;
  bottomScore: number;
  averageScore: number;
  totalParticipants: number;
  rankingData: {
    rank: number;
    maxScore: number;
    totalScore: number;
    averageScore: number;
    name: string;
    userId: string;
    school: string | undefined;
    univChoice: string | undefined;
    univStudyChoice: string | undefined;
    image: string | null;
    // categoryResult: {
    //   category: string;
    //   totalScore: number;
    //   averageScore: number;
    //   isUnlocked: boolean;
    // }[];
    sessionResult: {
      totalScore: number;
      sessionId: string;
      category: string;
      subCategory: string;
      isUnlocked: boolean;
      maxScore: number;
    }[];
  }[];
  AnalisisCategory: {
    name: string;
    totalScore: number;
    totalTheta: number;
    avgScore: number;
    avgTheta: number;
  }[];
  StatisticsCategory: {
    category: string;
    session: {
      min: number;
      q1: number;
      median: number;
      mean: number;
      stdDev: number;
      q3: number;
      max: number;
      total: number;
      subCategory: string;
    }[];
  }[];
  DistributionScore: {
    range: string;
    count: number;
  }[];
}

export default function LeaderboardClient() {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [selectedTryOut, setSelectedTryOut] = useState<string>('');

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  // const { data: RankingTryout, isLoading: RankingTryoutIsLoading } =
  //   api.leaderboard.getTryoutRankingResult.useQuery(
  //     { tryoutId: selectedTryOut },
  //     { refetchOnWindowFocus: false }
  //   );

  const [RankingTryout, setRankingTryout] = useState<RankingTryoutProps>();
  const [RankingTryoutIsLoading, setRankingTryoutIsLoading] =
    useState<boolean>(true);

  useEffect(() => {
    if (!selectedTryOut) {
      setRankingTryoutIsLoading(false);
      return;
    }
    getGeneral(
      `/leaderboard/getTryoutRankingResult?tryoutId=${selectedTryOut}&userId=${session?.user.id}`,
      {
        setData: setRankingTryout,
        setLoading: setRankingTryoutIsLoading,
      },
    );
  }, [selectedTryOut, session]);

  return (
    <LeaderboardContext.Provider
      value={{
        RankingTryout,
        selectedTryOut,
        setSelectedTryOut,
        RankingTryoutIsLoading,
      }}
    >
      <div>
        <div className="container mx-auto max-w-7xl px-4 py-6">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <Trophy className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h1
              className="text-2xl md:text-3xl font-bold mb-2"
              style={{ color: mainColor }}
            >
              Peringkat
            </h1>
            <p className="text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto text-sm md:text-base">
              Lihat peringkat dan performa terbaik dari semua peserta try out
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Top Section: Selector & Winners */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <TryOutSelector />
              </div>
              <div className="lg:col-span-2">
                <TopWinners />
              </div>
            </div>

            {/* Stats Section */}
            <RankingStats />

            {/* Table Section */}
            <RankingTable />
          </div>
        </div>
      </div>
    </LeaderboardContext.Provider>
  );
}
