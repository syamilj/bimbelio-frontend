'use client';

import { toaster } from '@/components/ui/toaster';
import { useGet } from '@/lib/fetch-helper/useGet';
import {
  Prediction,
  PredictionScore,
  PredictionScoreDetail,
  Tryout,
} from '@/types/database';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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
  const params = useParams();
  const router = useRouter();
  const predictionId = (params.predictionId || null) as string | null;
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [selectedPrograms, setSelectedPrograms] =
    useState<UniversityType['studyProgramList'][0]>();

  const [utbkScores, setUtbkScores] = useState(UTBK_DATA);

  const [tryoutId, setTryoutId] = useState<string | null>(null);
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

  // ===== FOR DEVELOPMENT
  // useEffect(() => {
  //   const utbkScoresSaved = localStorage.getItem('utbkScores');
  //   const simakScoresSaved = localStorage.getItem('simakScores');
  //   const selectedProgramsSaved = localStorage.getItem('selectedPrograms');
  //   if (utbkScoresSaved) {
  //     const data = JSON.parse(utbkScoresSaved);
  //     setUtbkScores(data);
  //   }
  //   if (simakScoresSaved) {
  //     const data = JSON.parse(simakScoresSaved);
  //     setSIMAKScores(data);
  //   }
  //   if (selectedProgramsSaved) {
  //     const data = JSON.parse(selectedProgramsSaved);
  //     setSelectedPrograms(data);
  //   }
  // }, []);

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
  const simakMaxScoreRAW = 520;

  // SIMAK SCORE SNBT
  const simakScoreSNBT = simakScores.reduce(
    (acc, item) => acc + calculateSubtestScore(item.value),
    0,
  );

  const { maxScore, minScore } = calculateSIMAKBounds();
  const simakAvgSNBT = convertSIMAKToSNBT(simakScoreRAW, minScore, maxScore);
  // const simakAvgSNBT = simakScoreSNBT / 6;

  // FINAL
  const finalScore = (utbkAvg + simakAvgSNBT) / 2;
  const finalPercentage = ((utbkAvg / 1000 + simakScoreRAW / 540) / 2) * 100;

  // ===== Selects Tryout ===================================
  const { data: SelectTryouts, isLoading: SelectTryoutsIsLoading } =
    useGet<SelectTryoutsType>('/prediction/getTryoutSelects');

  // ===== PredictionData ===================================
  const {
    data: PredictionData,
    isLoading: PredictionDataIsLoading,
    error,
  } = useGet<
    Prediction & {
      isLock: boolean;
      Tryout: Tryout;
      PredictionScore: (PredictionScore & {
        PredictionScoreDetail: PredictionScoreDetail[];
      })[];
    }
  >('/prediction/getPredictionById', {
    params: { id: predictionId },
    enabled: !!predictionId,
    useEffectDependencies: [predictionId],
    toast: {
      hideError: true,
    },
    onError({ message }) {
      if (predictionId === 'step') return;
      router.push('step?step=new');
      toaster({
        title: 'Error',
        condition: 'warning',
        description: message,
      });
    },
  });

  useEffect(() => {
    if (PredictionData) {
      const findUniv = studyChoices.find(
        (sc) => sc.study === PredictionData.study,
      );
      if (!findUniv) return;
      setSelectedPrograms({
        averageScore: findUniv.averageScore,
        study: findUniv.study,
        fakultas: findUniv.fakultas,
        fakultasInitials: findUniv.fakultasInitials,
        passingGrade: findUniv.passingGrade,
      });
      PredictionData.PredictionScore.forEach((psItem) => {
        if (psItem.type === 'UTBK') {
          setUtbkScores(
            psItem.PredictionScoreDetail.map((psdItem) => {
              return {
                label: psdItem.subCategory,
                name: psdItem.subCategory,
                score: psdItem.score,
              };
            }),
          );
        }
        if (psItem.type === 'SIMAK_UI') {
          setSIMAKScores(
            psItem.PredictionScoreDetail.map((psdItem) => {
              return {
                name: psdItem.subCategory,
                value: {
                  benar: psdItem.true || 0,
                  salah: psdItem.false || 0,
                  kosong: psdItem.empty || 0,
                },
                total_question: psdItem.totalQuestions || 0,
                type: {
                  name: psdItem.category,
                },
              };
            }),
          );
        }
      });
      setTryoutId(PredictionData?.Tryout?.id || null);
      setCurrentStep(4);
    }
  }, [PredictionData]);

  const isFinish = currentStep === 4 ? true : false;

  const isLock = PredictionData ? PredictionData.isLock : true;

  const searchParams = useSearchParams();
  const stepQuery = searchParams.get('step');
  const tryoutIdQuery = searchParams.get('tryoutId');

  const TryoutData = PredictionData?.Tryout;

  useEffect(() => {
    if (stepQuery === 'new') {
      setCurrentStep(1);
      setUtbkScores(UTBK_DATA);
      setSIMAKScores(SIMAK_DATA);
      setSelectedPrograms(undefined);
    }
  }, [stepQuery]);

  useEffect(() => {
    if (tryoutIdQuery && SelectTryouts && SelectTryouts.length > 0) {
      const findData = SelectTryouts.find(
        (item) => item.Tryout.id === tryoutIdQuery,
      );
      if (findData) setTryoutId(findData.Tryout.id);
    }
  }, [tryoutIdQuery, SelectTryouts]);

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
    useSelectTryouts: {
      SelectTryouts,
      SelectTryoutsIsLoading,
      tryoutId,
      setTryoutId,
    },
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
    useParams: {
      predictionId,
      tryoutId: tryoutIdQuery,
    },
    isFinish,
    isLock,
    TryoutData,
  };

  if (predictionId && PredictionDataIsLoading) {
    return (
      <div className="flex w-full justify-center items-center min-h-[70vh]">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  // if (predictionId && predictionId !== 'step' && !PredictionData && error) {
  //   return notFound();
  // }

  // if (error && predictionId !== 'step' && predictionId) {
  //   return notFound();
  // }

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
  useSelectTryouts: {
    SelectTryouts: SelectTryoutsType | null;
    SelectTryoutsIsLoading: boolean;
    tryoutId: string | null;
    setTryoutId: Dispatch<SetStateAction<string | null>>;
  };
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
  useParams: {
    predictionId: string | null;
    tryoutId: string | null;
  };
  isFinish: boolean;
  isLock: boolean;
  TryoutData: Tryout | undefined;
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
  name: string;
  // initial: string;
  // name: string;
  value: {
    benar: number;
    salah: number;
    kosong: number;
  };
  total_question: number;
  type: {
    // name: 'kemampuan_dasar' | 'kemampuan_akademik';
    // name: 'kemampuan_dasar' | 'kemampuan_akademik';
    name: string;
  };
};

const SIMAK_DATA: SubTest[] = [
  {
    name: 'Matematika Dasar',
    value: { benar: 0, salah: 0, kosong: 0 },
    total_question: 15,
    type: {
      name: 'Kemampuan Dasar',
    },
  },
  {
    name: 'Bahasa Indo',
    value: { benar: 0, salah: 0, kosong: 0 },
    total_question: 15,
    type: {
      name: 'Kemampuan Dasar',
    },
  },
  {
    name: 'Bahasa Inggris',
    value: { benar: 0, salah: 0, kosong: 0 },
    total_question: 15,
    type: {
      name: 'Kemampuan Dasar',
    },
  },
  {
    name: 'Verbal',
    value: { benar: 0, salah: 0, kosong: 0 },
    total_question: 20,
    type: {
      name: 'Kemampuan Akademik',
    },
  },
  {
    name: 'Kuantitatif',
    value: { benar: 0, salah: 0, kosong: 0 },
    total_question: 35,
    type: {
      name: 'Kemampuan Akademik',
    },
  },
  {
    name: 'Logika',
    value: { benar: 0, salah: 0, kosong: 0 },
    total_question: 25,
    type: {
      name: 'Kemampuan Akademik',
    },
  },
];

// const SIMAK_DATA: SubTest[] = [
//   {
//     label: 'Matematika Dasar',
//     initial: 'Mat Das',
//     name: 'matematika_dasar',
//     value: { benar: 0, salah: 0, kosong: 0 },
//     total_question: 15,
//     type: { name: 'kemampuan_dasar', label: 'Kemampuan Dasar' },
//   },
//   {
//     label: 'Bahasa Indo',
//     initial: 'B Indo',
//     name: 'bahasa_indo',
//     value: { benar: 0, salah: 0, kosong: 0 },
//     total_question: 15,
//     type: { name: 'kemampuan_dasar', label: 'Kemampuan Dasar' },
//   },
//   {
//     label: 'Bahasa Inggris',
//     initial: 'B Ing',
//     name: 'bahasa_inggris',
//     value: { benar: 0, salah: 0, kosong: 0 },
//     total_question: 15,
//     type: { name: 'kemampuan_dasar', label: 'Kemampuan Dasar' },
//   },
//   {
//     label: 'Verbal',
//     name: 'verbal',
//     initial: 'Verbal',
//     value: { benar: 0, salah: 0, kosong: 0 },
//     total_question: 20,
//     type: { name: 'kemampuan_akademik', label: 'Kemampuan Akademik' },
//   },
//   {
//     label: 'Kuantitatif',
//     name: 'kuantitatif',
//     initial: 'Kuantitatif',
//     value: { benar: 0, salah: 0, kosong: 0 },
//     total_question: 35,
//     type: { name: 'kemampuan_akademik', label: 'Kemampuan Akademik' },
//   },
//   {
//     label: 'Logika',
//     name: 'logika',
//     initial: 'Logika',
//     value: { benar: 0, salah: 0, kosong: 0 },
//     total_question: 25,
//     type: { name: 'kemampuan_akademik', label: 'Kemampuan Akademik' },
//   },
// ];

const convertSIMAKToSNBT = (
  rawScore: number,
  minScore: number,
  maxScore: number,
) => {
  // Normalisasi skor ke range 0-1
  const normalizedScore = Math.max(
    0,
    (rawScore - minScore) / (maxScore - minScore),
  );

  // Convert ke SNBT range (200-800)
  const snbtScore =
    SCORING_RULES.SNBT_MIN +
    normalizedScore * (SCORING_RULES.SNBT_MAX - SCORING_RULES.SNBT_MIN);

  return Math.max(
    SCORING_RULES.SNBT_MIN,
    Math.min(SCORING_RULES.SNBT_MAX, snbtScore),
  );
};

const SCORING_RULES = {
  BENAR: 4,
  SALAH: -1,
  KOSONG: 0,
  UTBK_MIN: 100,
  UTBK_MAX: 1000,
  SNBT_MIN: 200,
  SNBT_MAX: 800,
} as const;

const calculateSIMAKBounds = () => {
  const totalQuestions = Object.values(SUBTEST_QUESTIONS).reduce(
    (sum, count) => sum + count,
    0,
  );
  return {
    maxScore: totalQuestions * SCORING_RULES.BENAR, // Semua benar = 125 × 4 = 500
    minScore: totalQuestions * SCORING_RULES.SALAH, // Semua salah = 125 × (-1) = -125
  };
};

// Konstanta untuk perhitungan yang akurat
const SUBTEST_QUESTIONS = {
  matdas: 15,
  bindo: 15,
  bing: 15,
  verbal: 20,
  kuantitatif: 35,
  logika: 25,
} as const;

type SelectTryoutsType =
  | undefined
  | {
      Tryout: {
        id: string;
        title: string;
      };
      Datas: {
        sessionResultId: string;
        sessionId: string;
        category: {
          id: string;
          name: string;
        };
        subCategory: {
          id: string;
          name: string;
        };
        value: {
          benar: number;
          salah: number;
          kosong: number;
          totalQuestions: number;
        };
      }[];
    }[];
