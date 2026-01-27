import { useGet } from '@/lib/fetch-helper/useGet';
import {
  QuizVolume,
  Tryout,
  TryoutCategory,
  TryoutResult,
  TryoutSession,
  TryoutSubCategory,
} from '@/types/database';
import { useState } from 'react';

export const initiateVolume = () => {
  const [selectedVolumeId, setSelectedVolumeId] = useState<string | null>(null);

  const { data: QuizVolumeList } = useGet<QuizVolume[]>(
    '/quizTryout/getQuizVolumeList',
    {
      params: {
        take: 50,
        page: 1,
      },
    },
  );

  const {
    data: SingleQuizVolume,
    isLoading: SingleQuizVolumeIsLoading,
    refetch: SingleQuizVolumeRefetch,
  } = useGet<
    QuizVolume & {
      Tryout: (Tryout & {
        TryoutCategory: TryoutCategory;
        TryoutSubCategory: TryoutSubCategory;
        TryoutSession: TryoutSession & {
          CorrectAnswersCount: number;
          WrongAnswersCount: number;
        };
        TryoutQuestionCount: number;
        TryoutResult: TryoutResult | null;
        isDone: boolean;
      })[];
    }
  >('/quizTryout/getSingleQuizVolume', {
    params: { id: selectedVolumeId },
    enabled: !!selectedVolumeId,
    useEffectDependencies: [selectedVolumeId],
  });

  console.log({ SingleQuizVolume, selectedVolumeId });

  return {
    selectedVolumeId,
    setSelectedVolumeId,
    QuizVolumeList,
    SingleQuizVolume,
    SingleQuizVolumeIsLoading,
    SingleQuizVolumeRefetch,
  };
};
