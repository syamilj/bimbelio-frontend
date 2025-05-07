'use client';

import {
  SessionProps,
  TryoutProps,
} from '@/app/[web_sub_category]/(admin)/admin/tryout/edit/[tryoutId]/page';
import { createContext, Dispatch, SetStateAction, useContext } from 'react';

interface EditTryoutContextProps {
  tryout: TryoutProps | null;
  currentIndexEdit: number | null;
  setCurrentIndexEdit: Dispatch<SetStateAction<number | null>>;
  questionIndex: number;
  setQuestionIndex: Dispatch<SetStateAction<number>>;
  showDetailTryout: boolean;
  setShowDetailTryout: Dispatch<SetStateAction<boolean>>;
  setTryout: Dispatch<SetStateAction<TryoutProps | null>>;
  sessions: SessionProps[];
  setSessions: Dispatch<SetStateAction<SessionProps[]>>;
  startDate: string;
  setStartDate: Dispatch<SetStateAction<string>>;
  startDateTime: string;
  setStartDateTime: Dispatch<SetStateAction<string>>;
  endDate: string;
  setEndDate: Dispatch<SetStateAction<string>>;
  endDateTime: string;
  setEndDateTime: Dispatch<SetStateAction<string>>;
  resultDate: string;
  setResultDate: Dispatch<SetStateAction<string>>;
  resultDateTime: string;
  setResultDateTime: Dispatch<SetStateAction<string>>;
  EditSession: SessionProps | null;
  assessmentType: string;
  setAssesmentType: Dispatch<SetStateAction<string>>;
  category:
    | ({
        TryoutSubCategory: {
          id: string;
          name: string;
          categoryId: string;
        }[];
      } & {
        description: string | null;
        id: string;
        createAt: Date;
        updateAt: Date;
        image: string | null;
        name: string;
        slug: string;
      })[]
    | undefined;
  isLoading: boolean;
}

export const EditTryoutContext = createContext<
  EditTryoutContextProps | undefined
>(undefined);

export const useEditTryoutContext = () => {
  const context = useContext(EditTryoutContext);
  if (!context) {
    throw new Error(
      'useEditTryoutContext must be wrapper in EditTryoutContext.Provider',
    );
  }
  return context as EditTryoutContextProps;
};
