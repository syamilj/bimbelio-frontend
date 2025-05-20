'use client';

import { getGeneral } from '@/lib/fetch-helper';
import { createContext, useContext, useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

export default function Provider({ children }: Props) {
  const [UniversityOptions, setUniversityOptions] =
    useState<UniversityOptionsType>([]);

  useEffect(() => {
    getGeneral('/universitas', {
      setData: setUniversityOptions,
    });
  }, []);

  const Context = {
    UniversityOptions,
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
  UniversityOptions: UniversityOptionsType;
};

type UniversityOptionsType = {
  university: string;
  initials: string;
  averageScore: number;
  referensi: string | null;
  studyProgramList: {
    study: string;
    averageScore: number | null;
    passingGrade?: number;
  }[];
}[];
