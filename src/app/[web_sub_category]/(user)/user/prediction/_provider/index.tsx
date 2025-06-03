'use client';

import { useGet } from '@/lib/fetch-helper/useGet';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { calculateSubtestScore } from './helper';

type Props = {
  children: React.ReactNode;
};

export default function Provider({ children }: Props) {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [selectedPrograms, setSelectedPrograms] =
    useState<UniversityType['studyProgramList'][0]>();

  const [utbkScores, setUtbkScores] = useState(UTBK_DATA);

  const [simakScores, setSIMAKScores] = useState(SIMAK_DATA);

  const { data: University } = useGet<UniversityType>('/universitas/single', {
    params: { name: 'ui' },
  });

  const studyChoices = University?.studyProgramList || [];

  // UTBK SCORE
  const utbkScore = utbkScores.reduce((acc, item) => acc + item.score, 0);
  const utbkAvg = utbkScore / utbkScores.length;
  const utbkPercentage = (utbkAvg / 1000) * 100;

  // SIMAK SCORE
  const simakScore = simakScores.reduce(
    (acc, item) => acc + calculateSubtestScore(item.value),
    0,
  );
  const simakRawScore = simakScores.reduce((acc, item) => {
    const benar = item.value.benar * 4;
    const salah = -item.value.salah;
    return acc + (benar + salah);
  }, 0);
  const simakAvg = simakScore / 6;
  const simakPercentage = (simakRawScore / 540) * 100;

  // FINAL
  const finalScore = (utbkAvg + simakAvg) / 2;
  const finalPercentage = ((utbkAvg / 1000 + simakRawScore / 540) / 2) * 100;

  const Context = {
    selectedPrograms,
    setSelectedPrograms,
    University,
    studyChoices,
    currentStep,
    setCurrentStep,
    utbkScores,
    setUtbkScores,
    simakScores,
    setSIMAKScores,
    useScoreSimak: {
      simakRawScore,
      simakScore,
      simakAvg,
      simakPercentage,
    },
    useScoreUtbk: {
      utbkScore,
      utbkAvg,
      utbkPercentage,
    },
    useScoreFinal: {
      finalScore,
      finalPercentage,
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
  selectedPrograms:
    | {
        study: string;
        averageScore: number | null;
        passingGrade?: number;
      }
    | undefined;
  setSelectedPrograms: Dispatch<
    SetStateAction<
      | {
          study: string;
          averageScore: number | null;
          passingGrade?: number;
        }
      | undefined
    >
  >;
  University: UniversityType | null;
  studyChoices: {
    study: string;
    averageScore: number | null;
    passingGrade?: number;
  }[];
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  utbkScores: {
    name: string;
    label: string;
    score: number;
  }[];
  setUtbkScores: Dispatch<
    SetStateAction<
      {
        name: string;
        label: string;
        score: number;
      }[]
    >
  >;
  simakScores: SubTest[];
  setSIMAKScores: Dispatch<SetStateAction<SubTest[]>>;
  useScoreSimak: {
    simakRawScore: number;
    simakScore: number;
    simakAvg: number;
    simakPercentage: number;
  };
  useScoreUtbk: {
    utbkScore: number;
    utbkAvg: number;
    utbkPercentage: number;
  };
  useScoreFinal: {
    finalScore: number;
    finalPercentage: number;
  };
};

type UniversityType = {
  university: string;
  initials: string;
  averageScore: number;
  referensi: string | null;
  studyProgramList: {
    study: string;
    averageScore: number | null;
    passingGrade?: number;
  }[];
};

const UTBK_DATA = [
  {
    name: 'penalaran_umum',
    label: 'Penalaran Umum',
    score: 0,
  },
  {
    name: 'pengetahuan_pemahaman_umum',
    label: 'Pengetahuan & Pemahaman Umum',
    score: 0,
  },
  {
    name: 'pemahaman_bacaan_menulis',
    label: 'Pemahaman Bacaan & Menulis',
    score: 0,
  },
  {
    name: 'penalaran_kuantitatif',
    label: 'Penalaran Kuantitatif',
    score: 0,
  },
  {
    name: 'literasi_bahasa_indonesia',
    label: 'Literasi Bahasa Indonesia',
    score: 0,
  },
  {
    name: 'literasi_bahasa_inggris',
    label: 'Literasi Bahasa Inggris',
    score: 0,
  },
  {
    name: 'matematika',
    label: 'Matematika',
    score: 0,
  },
];

type SubTest = {
  label: string;
  initial: string;
  name: string;
  value: {
    benar: number;
    salah: number;
    kosong: number;
  };
  total_question: number;
  type: {
    name: 'kemampuan_dasar' | 'kemampuan_akademik';
    label: string;
  };
};

const SIMAK_DATA: SubTest[] = [
  {
    label: 'Matematika Dasar',
    initial: 'Mat Das',
    name: 'matematika_dasar',
    value: { benar: 0, salah: 0, kosong: 0 },
    total_question: 15,
    type: { name: 'kemampuan_dasar', label: 'Kemampuan Dasar' },
  },
  {
    label: 'Bahasa Indo',
    initial: 'B Indo',
    name: 'bahasa_indo',
    value: { benar: 0, salah: 0, kosong: 0 },
    total_question: 15,
    type: { name: 'kemampuan_dasar', label: 'Kemampuan Dasar' },
  },
  {
    label: 'Bahasa Inggris',
    initial: 'B Ing',
    name: 'bahasa_inggris',
    value: { benar: 0, salah: 0, kosong: 0 },
    total_question: 15,
    type: { name: 'kemampuan_dasar', label: 'Kemampuan Dasar' },
  },
  {
    label: 'Verbal',
    name: 'verbal',
    initial: 'Verbal',
    value: { benar: 0, salah: 0, kosong: 0 },
    total_question: 20,
    type: { name: 'kemampuan_akademik', label: 'Kemampuan Akademik' },
  },
  {
    label: 'Kuantitatif',
    name: 'kuantitatif',
    initial: 'Kuantitatif',
    value: { benar: 0, salah: 0, kosong: 0 },
    total_question: 35,
    type: { name: 'kemampuan_akademik', label: 'Kemampuan Akademik' },
  },
  {
    label: 'Logika',
    name: 'logika',
    initial: 'Logika',
    value: { benar: 0, salah: 0, kosong: 0 },
    total_question: 25,
    type: { name: 'kemampuan_akademik', label: 'Kemampuan Akademik' },
  },
];
