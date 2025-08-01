// src/components/_shared/other/card-plan/_provider/provider.tsx
import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { PlanDataType } from './types';

export const ProviderContext = createContext<undefined | ProviderType>(
  undefined,
);

type ProviderType = {
  useState: {
    activeTab: string;
    setActiveTab: Dispatch<SetStateAction<string>>;
    showAllBenefits: boolean;
    setShowAllBenefits: Dispatch<SetStateAction<boolean>>;
    liveClassDetails: null;
    setLiveClassDetails: Dispatch<SetStateAction<null>>;
  };
  useData: {
    plan: PlanDataType;
    isCourse: boolean;
    isDocument: boolean;
    hideFeatures: string[];
  };
};

export const useProvider = () => {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error('useProvider must be used within an ProviderContext');
  }
  return context;
};
