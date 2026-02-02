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
      onSuccess({ data }) {
        if (selectedVolumeId === null && data && data[0]) {
          setSelectedVolumeId(data[0]?.id || null);
        }
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
          NotAnswersCount: number;
        };
        TryoutQuestionCount: number;
        TryoutResult: TryoutResult | null;
        isDone: boolean;
        totalParticipant: number;
      })[];
      totalUserSubscribed: number;
    }
  >('/quizTryout/getSingleQuizVolume', {
    params: { id: selectedVolumeId },
    enabled: !!selectedVolumeId,
    useEffectDependencies: [selectedVolumeId],
  });

  console.log({ SingleQuizVolume, selectedVolumeId });

  const isVolumeStarted = (() => {
    if (SingleQuizVolume?.startDate) {
      const startDate = new Date(SingleQuizVolume.startDate);
      const currentDate = new Date();
      return currentDate > startDate;
    }
    return false;
  })();

  const isVolumeEnded = (() => {
    if (SingleQuizVolume?.endDate) {
      const endDate = new Date(SingleQuizVolume.endDate);
      const currentDate = new Date();
      return currentDate > endDate;
    }
    return false;
  })();

  return {
    selectedVolumeId,
    setSelectedVolumeId,
    QuizVolumeList,
    SingleQuizVolume,
    SingleQuizVolumeIsLoading,
    SingleQuizVolumeRefetch,
    isVolumeStarted,
    isVolumeEnded,
  };
};
