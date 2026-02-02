import { useGet } from '@/lib/fetch-helper/useGet';

export const initiateLeaderboard = ({
  volumeId,
}: {
  volumeId: string | null;
}) => {
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
    userRankingArray: {
      rank: number;
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
      maxScore: number;
      totalQuizFinished: number;
      totalQuiz: number;
      accuracy: number;
      averageTime: number;
    }[];
  }>('/quizTryout/getQuizVolumeLeaderboard', {
    params: { id: volumeId },
    enabled: !!volumeId,
    useEffectDependencies: [volumeId],
  });

  const TopThreeUsers = Leaderboard?.topThreeUsers || [];
  const UserRankingList = Leaderboard?.userRankingArray || [];

  return {
    TopThreeUsers,
    UserRankingList,
    LeaderboardIsLoading,
    LeaderboardRefetch,
  };
};
