import { useGet } from '@/lib/fetch-helper/useGet';
import {
  QuizVolume,
  Tryout,
  TryoutCategory,
  TryoutResult,
  TryoutSession,
  TryoutSubCategory,
} from '@/types/database';
import { useEffect, useState } from 'react';

const getCacheKey = () => {
  if (typeof window === 'undefined') return 'bimarena:quiz:selectedVolume:unknown';

  const pathSegment = window.location.pathname.split('/')[1] || 'unknown';
  return `bimarena:quiz:selectedVolume:${pathSegment}`;
};

export const initiateVolume = () => {
  const [selectedVolumeId, setSelectedVolumeId] = useState<string | null>(null);

  const { data: QuizVolumeList, isLoading: QuizVolumeListIsLoading } = useGet<QuizVolume[]>(
    '/quizTryout/getQuizVolumeList',
    {
      params: {
        take: 50,
        page: 1,
      },
      onSuccess({ data }) {
        if (!data || data.length === 0) return;

        const isSelectedStillAvailable = selectedVolumeId
          ? data.some((vol) => vol.id === selectedVolumeId)
          : false;

        if (!isSelectedStillAvailable) {
          setSelectedVolumeId(data[0]?.id || null);
        }
      },
    },
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cacheKey = getCacheKey();
    const cached = localStorage.getItem(cacheKey);
    if (cached && cached !== selectedVolumeId) {
      setSelectedVolumeId(cached);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cacheKey = getCacheKey();
    if (selectedVolumeId) {
      localStorage.setItem(cacheKey, selectedVolumeId);
    }
  }, [selectedVolumeId]);

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
        isFreePreview?: boolean;
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
    QuizVolumeListIsLoading,
    SingleQuizVolume,
    SingleQuizVolumeIsLoading,
    SingleQuizVolumeRefetch,
    isVolumeStarted,
    isVolumeEnded,
  };
};
