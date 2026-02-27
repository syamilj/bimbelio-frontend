import { useGet } from '@/lib/fetch-helper/useGet';

export const initiateLeaderboard = ({
  volumeId,
}: {
  volumeId: string | null;
}) => {
  type RankingEntry = {
    rank: number;
    User: {
      id: string;
      name: string;
      image: string | null;
      school: string;
      province: string;
      univChoice: string;
      majorChoice: string;
      targetValue: number | null;
    };
    totalScore: number;
    totalRawScore: number;
    maxScore: number;
    totalQuizFinished: number;
    totalQuiz: number;
    accuracy: number;
    averageTime: number;
    isPassed: boolean | null;
    passingGradeValue: number | null;
    passingGradeText: string | null;
  };

  const {
    data: Leaderboard,
    isLoading: LeaderboardIsLoading,
    refetch: LeaderboardRefetch,
  } = useGet<{
    topThreeUsers: {
      User: {
        id: string;
        name: string;
        image: string | null;
        school: string;
        province: string;
        univChoice: string;
        majorChoice: string;
      };
      totalScore: number;
      rank: number;
      maxScore: number;
    }[];
    userRankingArray: RankingEntry[];
    subCategoryLeaderboards: {
      id: string;
      name: string;
      code: string;
      topThreeUsers: RankingEntry[];
      userRankingArray: RankingEntry[];
    }[];
  }>('/quizTryout/getQuizVolumeLeaderboard', {
    params: { id: volumeId },
    enabled: !!volumeId,
    useEffectDependencies: [volumeId],
  });

  const TopThreeUsers = Leaderboard?.topThreeUsers || [];
  const UserRankingList = Leaderboard?.userRankingArray || [];
  const SubCategoryLeaderboards = Leaderboard?.subCategoryLeaderboards || [];

  return {
    TopThreeUsers,
    UserRankingList,
    SubCategoryLeaderboards,
    LeaderboardIsLoading,
    LeaderboardRefetch,
  };
};
