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

type OnBoardingObjectType = {
  COURSE: boolean;
  DOCUMENT_CHAT_AI: boolean;
  DOCUMENT_NOTES: boolean;
  DOCUMENT_QUIZ: boolean;
  QUIZ: boolean;
  TRYOUT: boolean;
  CHAT_AI: boolean;
};

type OnBoardingListType =
  | 'COURSE'
  | 'DOCUMENT_CHAT_AI'
  | 'DOCUMENT_NOTES'
  | 'DOCUMENT_QUIZ'
  | 'QUIZ'
  | 'TRYOUT'
  | 'CHAT_AI';

export default function ProviderOnBoarding({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userOnBoarding, setUserOnBoarding] = useState<OnBoardingObjectType>({
    COURSE: false,
    DOCUMENT_CHAT_AI: false,
    DOCUMENT_NOTES: false,
    DOCUMENT_QUIZ: false,
    QUIZ: false,
    TRYOUT: false,
    CHAT_AI: false,
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
      type: OnBoardingListType;
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
  userOnBoarding: OnBoardingObjectType;
  setUserOnBoarding: Dispatch<SetStateAction<OnBoardingObjectType>>;
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
      type: OnBoardingListType;
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
