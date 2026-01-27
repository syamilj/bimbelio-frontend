import { useGet } from '@/lib/fetch-helper/useGet';
import { Subcategory } from '@/types/database';
import { ColorList } from './_color-list';

export const initiateUserProgress = ({
  volumeId,
}: {
  volumeId: string | null;
}) => {
  const {
    data: UserProgressData,
    isLoading: UserProgressIsLoading,
    refetch: UserProgressRefetch,
  } = useGet<{
    chart: {
      lineChartData: Record<string, string | number>[];
      radarChartData: {
        subject: string;
        userScore: number;
        avgScore: number;
        fullMark: number;
      }[];
      subCategories: (Subcategory & {
        code: string;
      })[];
    };
    progress: {
      totalQuiz: number;
      totalQuizFinished: number;
      percentage: number;
      subCategories: {
        name: string;
        total: number;
        totalFinished: number;
        percentage: number;
      }[];
    };
    answerAnalysis: {
      totalQuestion: number;
      correctAnswers: number;
      wrongAnswers: number;
      notAnswered: number;
    };
  }>('/quizTryout/getUserProgress', {
    params: { id: volumeId },
    enabled: !!volumeId,
    useEffectDependencies: [volumeId],
  });

  const UserProgress = {
    ...UserProgressData,
    chart: {
      ...UserProgressData?.chart,
      subCategories:
        UserProgressData?.chart.subCategories.map((item, index) => ({
          ...item,
          color: ColorList[index % ColorList.length],
        })) || [],
    },
  };

  console.log({ UserProgress });

  return {
    UserProgress,
    UserProgressIsLoading,
    UserProgressRefetch,
  };
};
