'use client';

import { RankingTryoutProps } from '@/app/(main)/[web_sub_category]/(user)/user/leaderboard/_components/LeaderboardClient';
import { createContext, Dispatch, SetStateAction, useContext } from 'react';

interface ContextType {
  RankingTryout: RankingTryoutProps | undefined;
  setSelectedTryOut: Dispatch<SetStateAction<string>>;
  selectedTryOut: string;
  RankingTryoutIsLoading: boolean;
}

export const LeaderboardContext = createContext<ContextType | undefined>(
  undefined,
);

export const useLeaderboardContext = () => {
  const Context = useContext(LeaderboardContext);
  if (!Context) {
    throw new Error(
      'useLeaderboardContext must be used within a LeaderboardProvider',
    );
  }
  return Context;
};
