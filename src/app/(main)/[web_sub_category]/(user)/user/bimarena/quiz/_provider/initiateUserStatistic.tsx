import { useGet } from '@/lib/fetch-helper/useGet';

export const initiateUserStatistic = ({
  volumeId,
}: {
  volumeId: string | null;
}) => {
  const {
    data: UserStatistic,
    isLoading: UserStatisticIsLoading,
    refetch: UserStatisticRefetch,
  } = useGet<{
    userStatistic: {
      rank: number;
      accuracy: number;
      totalScore: number;
      totalTryoutFinished: number;
      totalTryout: number;
      userEliminate: number;
      totalParticipant: number;
      averageScore: number;
      topPercentage: number;
      averageTime: number;
    };
    userTarget: {
      targetValue: number;
      univChoiceOne: string;
      univStudyChoiceOne: string;
      univChoiceTwo: string;
      univStudyChoiceTwo: string;
    };
    topFive: {
      image: string | null;
      name: string;
      totalScore: number;
      rank: number;
      maxScore: number;
    }[];
  }>('/quizTryout/getUserStatistics', {
    params: { id: volumeId },
    enabled: !!volumeId,
    useEffectDependencies: [volumeId],
  });

  console.log({ UserStatistic });

  return { UserStatistic, UserStatisticIsLoading, UserStatisticRefetch };
};
