// src/components/_shared/other/card-plan/_provider/provider.tsx
import {
  createContext,
  Dispatch,
  RefObject,
  SetStateAction,
  useContext,
} from 'react';
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
    isPrivate: boolean;
    hideFeatures: string[];
  };
  useViewData: {
    platfroms: string[];
    getDiscountPercentage: () => number;
    isPopular: boolean;
    isRecommended: boolean;
    isBestSeller: boolean;
    isLimitedTime: boolean;
    isWishlisted: boolean;
    setIsWishlisted: Dispatch<SetStateAction<boolean>>;
    discount: number | undefined;
    viewOnly: boolean | undefined;
    classOverlay: string | undefined;
    buttonRef: RefObject<HTMLButtonElement | null>;
    paymentMethod: 'FULL_PAYMENT' | 'INSTALLMENT';
  };
};

export const useProvider = () => {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error('useProvider must be used within an ProviderContext');
  }
  return context;
};
