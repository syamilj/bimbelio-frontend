"use client";

import { LeaderboardContext } from "@/app/(user)/user/leaderboard/_components/provider-leaderboard";
import { RankingStats } from "@/app/(user)/user/leaderboard/_components/ranking-stats";
import { RankingTable } from "@/app/(user)/user/leaderboard/_components/ranking-table";
import { TopWinners } from "@/app/(user)/user/leaderboard/_components/top-winners";
import { TryOutSelector } from "@/app/(user)/user/leaderboard/_components/tryout-selector";
import { useSession } from "@/components/provider/session-provider-auth";
import { getGeneral } from "@/lib/fetch-helper";
import { useEffect, useState } from "react";

export interface RankingTryoutProps {
  topScore: number;
  bottomScore: number;
  averageScore: number;
  totalParticipants: number;
  rankingData: {
    rank: number;
    totalScore: number;
    averageScore: number;
    name: string;
    userId: string;
    school: string | undefined;
    univChoice: string | undefined;
    univStudyChoice: string | undefined;
    image: string | null;
    categoryResult: {
      category: string;
      totalScore: number;
      averageScore: number;
    }[];
  }[];
  analisisCategory: {
    category: string;
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
  const [selectedTryOut, setSelectedTryOut] = useState<string>("");

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
      }
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
      <div id="leaderboard" className="mx-auto px-4 py-8 mt-[-3rem]">
        <div className="mb-8 flex flex-col gap-8 md:flex-row">
          <div className="w-full md:w-1/3">
            <TryOutSelector />
          </div>
          <div className="w-full md:w-2/3">
            <TopWinners />
          </div>
        </div>

        <RankingStats />
        <RankingTable />
      </div>
    </LeaderboardContext.Provider>
  );
}
