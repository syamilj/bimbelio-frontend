'use client';

import { useGet } from '@/lib/fetch-helper/useGet';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
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

  const studyChoices =
    University?.studyProgramList.filter((item) => item.passingGrade) || [];

  useEffect(() => {
    if (selectedPrograms) {
      localStorage.setItem(
        'selectedPrograms',
        JSON.stringify(selectedPrograms),
      );
    }
    if (!utbkScores.every((item) => item.score === 0)) {
      localStorage.setItem('utbkScores', JSON.stringify(utbkScores));
    }
    if (
      !simakScores.every(
        (item) =>
          item.value.benar === 0 &&
          item.value.salah === 0 &&
          item.value.kosong === 0,
      )
    ) {
      localStorage.setItem('simakScores', JSON.stringify(simakScores));
    }
  }, [utbkScores, simakScores, selectedPrograms]);

  useEffect(() => {
    const utbkScoresSaved = localStorage.getItem('utbkScores');
    const simakScoresSaved = localStorage.getItem('simakScores');
    const selectedProgramsSaved = localStorage.getItem('selectedPrograms');
    if (utbkScoresSaved) {
      const data = JSON.parse(utbkScoresSaved);
      setUtbkScores(data);
    }
    if (simakScoresSaved) {
      const data = JSON.parse(simakScoresSaved);
      setSIMAKScores(data);
    }
    if (selectedProgramsSaved) {
      const data = JSON.parse(selectedProgramsSaved);
      setSelectedPrograms(data);
    }
  }, []);

  // UTBK SCORE
  const utbkScore = utbkScores.reduce((acc, item) => acc + item.score, 0);
  const utbkAvg = utbkScore / utbkScores.length;
  const utbkPercentage = (utbkAvg / 1000) * 100;

  // SIMAK SCORE RAW
  const simakScoreRAW = simakScores.reduce((acc, item) => {
    const benar = item.value.benar * 4;
    const salah = -item.value.salah;
    return acc + (benar + salah);
  }, 0);
  const simakPercentageRAW = (simakScoreRAW / 540) * 100;
  const simakMaxScoreRAW = 500;

  // SIMAK SCORE SNBT
  const simakScoreSNBT = simakScores.reduce(
    (acc, item) => acc + calculateSubtestScore(item.value),
    0,
  );
  const simakAvgSNBT = simakScoreSNBT / 6;

  // FINAL
  const finalScore = (utbkAvg + simakAvgSNBT) / 2;
  const finalPercentage = ((utbkAvg / 1000 + simakScoreRAW / 540) / 2) * 100;

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
      simakScoreRAW,
      simakMaxScoreRAW,
      simakPercentageRAW,
      simakScoreSNBT,
      simakAvgSNBT,
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
  selectedPrograms: UniversityType['studyProgramList'][0] | undefined;
  setSelectedPrograms: Dispatch<
    SetStateAction<UniversityType['studyProgramList'][0] | undefined>
  >;
  University: UniversityType | null;
  studyChoices: UniversityType['studyProgramList'];
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
    simakScoreRAW: number;
    simakMaxScoreRAW: number;
    simakPercentageRAW: number;
    simakScoreSNBT: number;
    simakAvgSNBT: number;
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

export type UniversityType = {
  university: string;
  initials: string;
  averageScore: number;
  referensi: string | null;
  studyProgramList: {
    study: string;
    fakultas?: string;
    fakultasInitials?: string;
    averageScore: number | null;
    passingGrade?: {
      sumber: {
        name: string;
        url: string;
      };
      tipe: 'SCORE' | 'PERCENTAGE';
      value: number;
    }[];
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
