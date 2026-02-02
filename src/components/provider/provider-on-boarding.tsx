'use client';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

export default function ProviderOnBoarding({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userOnBoarding, setUserOnBoarding] = useState({
    COURSE: true,
    DOCUMENT: true,
    QUIZ: true,
    TRYOUT: true,
  });

  const { isLoading, refetch } = useGet('/user/getUserOnBoarding', {
    onSuccess: ({ data }) => {
      if (data) {
        console.log({ userOnBoardingFetch: data });

        setUserOnBoarding(data);
      }
    },
    hideToast: true,
  });

  const { mutate: addUserOnBoarding } = useMutation(
    '/user/addUserOnBoarding',
    'post',
    {
      hideToast: true,
    },
  );

  const handleAddUserOnBoarding = (
    payload: {
      type: 'COURSE' | 'DOCUMENT' | 'QUIZ' | 'TRYOUT';
      step: number;
    }[],
  ) => {
    setUserOnBoarding((prev) => ({
      ...prev,
      [payload[0].type]: true,
    }));
    addUserOnBoarding({
      payload: { payload },
    });
  };

  console.log({ userOnBoarding });

  const Context = {
    userOnBoarding,
    setUserOnBoarding,
    refetch,
    isLoading,
    handleAddUserOnBoarding,
  };

  return (
    <OnBoardingContext.Provider value={Context}>
      {children}
    </OnBoardingContext.Provider>
  );
}

interface OnBoardingContextType {
  userOnBoarding: {
    COURSE: boolean;
    DOCUMENT: boolean;
    QUIZ: boolean;
    TRYOUT: boolean;
  };
  setUserOnBoarding: Dispatch<
    SetStateAction<{
      COURSE: boolean;
      DOCUMENT: boolean;
      QUIZ: boolean;
      TRYOUT: boolean;
    }>
  >;
  refetch: () => Promise<
    | {
        message: string;
        status: number;
        data?: any;
        page?: number | undefined;
        total_pages?: number | undefined;
      }
    | undefined
  >;
  isLoading: boolean;
  handleAddUserOnBoarding: (
    payload: {
      type: 'COURSE' | 'DOCUMENT' | 'QUIZ' | 'TRYOUT';
      step: number;
    }[],
  ) => void;
}

const OnBoardingContext = createContext<OnBoardingContextType | undefined>(
  undefined,
);

export const useUserOnBoarding = () => {
  const context = useContext(OnBoardingContext);
  if (!context) {
    throw new Error(
      'useUserOnBoarding must be used within an OnBoardingContext',
    );
  }
  return context;
};
