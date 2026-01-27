'use client';

import { createContext, useContext } from 'react';
import { initiateLeaderboard } from './initiateLeaderboard';
import { initiateQuiz } from './initiateQuiz';
import { initiateSubCategory } from './initiateSubCategory';
import { initiateUserProgress } from './initiateUserProgress';
import { initiateUserStatistic } from './initiateUserStatistic';
import { initiateVolume } from './initiateVolume';

export const QuizProvider = ({ children }: { children: React.ReactNode }) => {
  const useVolume = initiateVolume();

  const { selectedVolumeId } = useVolume;

  const useQuiz = initiateQuiz();

  const useSubCategory = initiateSubCategory();

  const useUserStatistic = initiateUserStatistic({
    volumeId: selectedVolumeId,
  });

  const useLeaderboard = initiateLeaderboard({ volumeId: selectedVolumeId });

  const useUserProgress = initiateUserProgress({ volumeId: selectedVolumeId });

  const Context = {
    useVolume,
    useQuiz,
    useSubCategory,
    useUserStatistic,
    useLeaderboard,
    useUserProgress,
  };

  return (
    <QuizContext.Provider value={Context}>{children}</QuizContext.Provider>
  );
};

interface ContextType {
  useVolume: ReturnType<typeof initiateVolume>;
  useQuiz: ReturnType<typeof initiateQuiz>;
  useSubCategory: ReturnType<typeof initiateSubCategory>;
  useUserStatistic: ReturnType<typeof initiateUserStatistic>;
  useLeaderboard: ReturnType<typeof initiateLeaderboard>;
  useUserProgress: ReturnType<typeof initiateUserProgress>;
}

export const QuizContext = createContext<ContextType | undefined>(undefined);

export const useQuizProvider = () => {
  const Context = useContext(QuizContext);
  if (!Context) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return Context;
};
