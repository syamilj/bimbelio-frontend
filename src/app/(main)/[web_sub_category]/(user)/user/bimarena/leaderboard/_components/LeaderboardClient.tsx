'use client';

import { LeaderboardContext } from '@/app/(main)/[web_sub_category]/(user)/user/bimarena/leaderboard/_components/provider-leaderboard';
import { RankingStats } from '@/app/(main)/[web_sub_category]/(user)/user/bimarena/leaderboard/_components/ranking-stats';
import { RankingTable } from '@/app/(main)/[web_sub_category]/(user)/user/bimarena/leaderboard/_components/ranking-table';
import { TopWinners } from '@/app/(main)/[web_sub_category]/(user)/user/bimarena/leaderboard/_components/top-winners';
import { TryOutSelector } from '@/app/(main)/[web_sub_category]/(user)/user/bimarena/leaderboard/_components/tryout-selector';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { PageShell, SectionHeader } from '@/components/ds';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { trackUnifiedEvent } from '@/lib/tracking/track';
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
    benar: number;
    salah: number;
    kosong: number;
    totalQuestions: number;
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
  isIRT: boolean;
}

export default function LeaderboardClient() {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [selectedTryOut, setSelectedTryOut] = useState<string>('');

  // const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

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

  useEffect(() => {
    const fullName = session?.user?.name || '';
    const [firstName, ...restNameParts] = fullName.split(' ').filter(Boolean);
    const lastName = restNameParts.length ? restNameParts.join(' ') : undefined;

    trackUnifiedEvent({
      eventName: 'ViewContent',
      customData: {
        content_name: 'Leaderboard',
        content_type: 'page',
        content_id: 'leaderboard_page',
      },
      user: session?.user
        ? {
            userId: session.user.id?.toString?.() || undefined,
            email: session.user.email || undefined,
            phone: session.user.phone || undefined,
            firstName: firstName || undefined,
            lastName,
          }
        : undefined,
    });
  }, [session]);

  return (
    <LeaderboardContext.Provider
      value={{
        RankingTryout,
        selectedTryOut,
        setSelectedTryOut,
        RankingTryoutIsLoading,
      }}
    >
      <PageShell bgClassName="bg-white" className="py-8">
          {/* Header Section */}
          <div className="mb-8">
            <SectionHeader
              icon={Trophy}
              iconColor="amber"
              title="Peringkat Try-Out"
              subtitle="Lihat peringkat dan performa terbaik dari semua peserta"
              size="lg"
            />
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
      </PageShell>
    </LeaderboardContext.Provider>
  );
}
