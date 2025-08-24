import { SpinnerPage } from '@/components/ui/spinner';
import { ErrorType, useGet } from '@/lib/fetch-helper/useGet';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

type Props = {
  children: React.ReactNode;
  documentId: string;
};

export default function Provider({ children, documentId }: Props) {
  const [current, setCurrent] = useState(0);

  const {
    data: Quiz,
    isLoading: QuizIsLoading,
    error: QuizError,
    refetch: QuizRefetch,
  } = useGet<QuizType>(`/quiz/getQuiz`, {
    params: { documentId },
    useEffectDependencies: [documentId],
  });

  if (QuizIsLoading) return <SpinnerPage />;
  if (QuizError || !Quiz) return <div>Terjadi kesalahan!</div>;

  const Context = {
    useQuiz: {
      Quiz,
      QuizRefetch,
      QuizIsLoading,
      QuizError,
    },
    useState: {
      current,
      setCurrent,
    },
    useCurrentData: {
      id: Quiz[current]?.id ?? '',
      question: Quiz[current]?.question ?? '',
      answer: Quiz[current]?.answer ?? '',
      opsi: Quiz[current]?.opsi ?? null,
      attempts: Quiz[current]?.QuizAttempt ?? [],
      totalQuestions: Quiz.length,
    },
  };

  return (
    <ProviderContext.Provider value={Context}>
      {children}
    </ProviderContext.Provider>
  );
}

const ProviderContext = createContext<undefined | ProviderType>(undefined);

export const useProvider = () => {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error('useProvider must be used within an ProviderContext');
  }
  return context;
};

type ProviderType = {
  useQuiz: {
    Quiz: QuizType;
    QuizRefetch: () => Promise<
      | {
          message: string;
          status: number;
          data?: any;
          page?: number;
          total_pages?: number;
        }
      | undefined
    >;
    QuizIsLoading: boolean;
    QuizError: ErrorType<any> | null;
  };
  useState: {
    current: number;
    setCurrent: Dispatch<SetStateAction<number>>;
  };
  useCurrentData: {
    id: string;
    question: string;
    answer: string;
    opsi: any;
    attempts: {
      createdAt: string;
      userResponse: string;
      correctResponse: string | null;
      incorrectResponse: string | null;
      moreInfo: string | null;
    }[];
    totalQuestions: number;
  };
};

export type QuizType = {
  correct: boolean;
  userId: string;
  id: string;
  QuizAttempt: {
    createdAt: string;
    userResponse: string;
    correctResponse: string | null;
    incorrectResponse: string | null;
    moreInfo: string | null;
  }[];
  question: string;
  answer: string;
  opsi: any;
}[];
