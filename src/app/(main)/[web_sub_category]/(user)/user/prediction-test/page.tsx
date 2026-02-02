'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  Award,
  BarChart3,
  BookOpen,
  Calculator,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Info,
  Plus,
  School,
  Search,
  Target,
  Trash2,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface UTBKScores {
  penalaran_umum: number | null;
  ppu: number | null;
  pbm: number | null;
  kuantitatif: number | null;
  lit_indonesia: number | null;
  lit_inggris: number | null;
  matematika: number | null;
}

interface SubtestResult {
  benar: number;
  salah: number;
  kosong: number;
}

interface SIMAKScores {
  kemampuan_dasar: {
    matdas: SubtestResult;
    bindo: SubtestResult;
    bing: SubtestResult;
  };
  kemampuan_akademik: {
    verbal: SubtestResult;
    kuantitatif: SubtestResult;
    logika: SubtestResult;
  };
}

interface PassingGrade {
  sumber: string;
  tipe: 'skor' | 'persentase';
  nilai: number;
}

interface Program {
  id: string;
  nama: string;
  fakultas: string;
  passing_grades: PassingGrade[];
}

interface SelectedProgram {
  program: Program;
  customPassingGrades: PassingGrade[];
}

const AVAILABLE_PROGRAMS: Program[] = [
  {
    id: 'ilkom',
    nama: 'Ilmu Komputer',
    fakultas: 'FASILKOM',
    passing_grades: [
      { sumber: 'LTMPT 2024', tipe: 'skor', nilai: 720 },
      { sumber: 'EduRank', tipe: 'persentase', nilai: 74 },
      { sumber: 'Komunitas SIMAK', tipe: 'skor', nilai: 705 },
    ],
  },
  {
    id: 'teknik-elektro',
    nama: 'Teknik Elektro',
    fakultas: 'Teknik',
    passing_grades: [
      { sumber: 'LTMPT 2024', tipe: 'skor', nilai: 705 },
      { sumber: 'EduRank', tipe: 'persentase', nilai: 72 },
    ],
  },
  {
    id: 'kedokteran',
    nama: 'Kedokteran',
    fakultas: 'FK',
    passing_grades: [
      { sumber: 'LTMPT 2024', tipe: 'skor', nilai: 780 },
      { sumber: 'EduRank', tipe: 'persentase', nilai: 82 },
      { sumber: 'Komunitas SIMAK', tipe: 'skor', nilai: 775 },
    ],
  },
  {
    id: 'psikologi',
    nama: 'Psikologi',
    fakultas: 'Psikologi',
    passing_grades: [
      { sumber: 'LTMPT 2024', tipe: 'skor', nilai: 690 },
      { sumber: 'EduRank', tipe: 'persentase', nilai: 70 },
    ],
  },
  {
    id: 'akuntansi',
    nama: 'Akuntansi',
    fakultas: 'FEB',
    passing_grades: [
      { sumber: 'LTMPT 2024', tipe: 'skor', nilai: 685 },
      { sumber: 'EduRank', tipe: 'persentase', nilai: 69 },
    ],
  },
  {
    id: 'hukum',
    nama: 'Ilmu Hukum',
    fakultas: 'Hukum',
    passing_grades: [
      { sumber: 'LTMPT 2024', tipe: 'skor', nilai: 675 },
      { sumber: 'EduRank', tipe: 'persentase', nilai: 68 },
    ],
  },
  {
    id: 'manajemen',
    nama: 'Manajemen',
    fakultas: 'FEB',
    passing_grades: [
      { sumber: 'LTMPT 2024', tipe: 'skor', nilai: 680 },
      { sumber: 'EduRank', tipe: 'persentase', nilai: 69 },
    ],
  },
  {
    id: 'sastra-inggris',
    nama: 'Sastra Inggris',
    fakultas: 'FIB',
    passing_grades: [
      { sumber: 'LTMPT 2024', tipe: 'skor', nilai: 670 },
      { sumber: 'EduRank', tipe: 'persentase', nilai: 67 },
    ],
  },
];

const SUBTEST_QUESTIONS = {
  matdas: 15,
  bindo: 15,
  bing: 15,
  verbal: 20,
  kuantitatif: 35,
  logika: 25,
};

const STEPS = [
  {
    id: 1,
    title: 'Pilih Jurusan',
    description: 'Pilih maksimal 3 jurusan yang diinginkan',
    icon: School,
  },
  {
    id: 2,
    title: 'Input UTBK',
    description: 'Masukkan nilai 7 subtes UTBK',
    icon: BookOpen,
  },
  {
    id: 3,
    title: 'Input SIMAK',
    description: 'Masukkan hasil Try Out SIMAK UI',
    icon: Target,
  },
  {
    id: 4,
    title: 'Hasil Prediksi',
    description: 'Lihat prediksi kelulusan per jurusan',
    icon: Award,
  },
];

const UTBK_LABELS = {
  penalaran_umum: 'Penalaran Umum',
  ppu: 'Pengetahuan & Pemahaman Umum',
  pbm: 'Pemahaman Bacaan & Menulis',
  kuantitatif: 'Penalaran Kuantitatif',
  lit_indonesia: 'Literasi Bahasa Indonesia',
  lit_inggris: 'Literasi Bahasa Inggris',
  matematika: 'Matematika',
};

// Clean Chart Component
const SimpleBarChart = ({
  data,
  labels,
  title,
}: {
  data: number[];
  labels: string[];
  title: string;
}) => {
  const maxValue = Math.max(...data, 1);

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-700 text-center">
        {title}
      </h4>
      <div className="space-y-3">
        {data.map((value, index) => (
          <div
            key={index}
            className="space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600">
                {labels[index]}
              </span>
              <span className="text-xs font-bold text-gray-900">
                {value?.toFixed(1) || 0}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-main h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.max((value / maxValue) * 100, 2)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Score Card Component
const ScoreCard = ({
  title,
  value,
  subtitle,
  color = 'blue',
}: {
  title: string;
  value: string;
  subtitle?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
    orange: 'bg-orange-50 border-orange-200 text-orange-900',
  };

  return (
    <div className={cn('p-4 rounded-3xl border-2', colorClasses[color])}>
      <div className="text-xs font-semibold opacity-75 mb-1">{title}</div>
      <div className="text-xl font-bold">{value}</div>
      {subtitle && (
        <div className="text-xs font-medium opacity-75 mt-1">{subtitle}</div>
      )}
    </div>
  );
};

// Status Indicator Component
const StatusIndicator = ({
  status,
  count,
}: {
  status: string;
  count: number;
}) => {
  const statusConfig = {
    Lolos: { color: 'bg-green-500', textColor: 'text-green-700' },
    Nyaris: { color: 'bg-yellow-500', textColor: 'text-yellow-700' },
    'Tidak Lolos': { color: 'bg-red-500', textColor: 'text-red-700' },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] ||
    statusConfig['Tidak Lolos'];

  return (
    <div className="flex items-center gap-2">
      <div className={cn('w-3 h-3 rounded-full', config.color)} />
      <span className={cn('text-sm font-medium', config.textColor)}>
        {status}: {count}
      </span>
    </div>
  );
};

export default function UTBKSIMAKPredictor() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPrograms, setSelectedPrograms] = useState<SelectedProgram[]>(
    [],
  );
  const [programSearchOpen, setProgramSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [utbkScores, setUtbkScores] = useState<UTBKScores>({
    penalaran_umum: null,
    ppu: null,
    pbm: null,
    kuantitatif: null,
    lit_indonesia: null,
    lit_inggris: null,
    matematika: null,
  });

  const [simakScores, setSIMAKScores] = useState<SIMAKScores>({
    kemampuan_dasar: {
      matdas: { benar: 0, salah: 0, kosong: 0 },
      bindo: { benar: 0, salah: 0, kosong: 0 },
      bing: { benar: 0, salah: 0, kosong: 0 },
    },
    kemampuan_akademik: {
      verbal: { benar: 0, salah: 0, kosong: 0 },
      kuantitatif: { benar: 0, salah: 0, kosong: 0 },
      logika: { benar: 0, salah: 0, kosong: 0 },
    },
  });

  const [results, setResults] = useState({
    utbkAverage: 0,
    utbkPercentage: 0,
    simakAverage: 0,
    simakPercentage: 0,
    simakRawScore: 0,
    finalScore: 0,
    finalPercentage: 0,
    utbkScoresBySubject: [] as number[],
    simakScoresBySubject: [] as number[],
  });

  // Calculate UTBK average
  const calculateUTBKAverage = () => {
    const scores = Object.values(utbkScores).filter(
      (score) => score !== null,
    ) as number[];
    if (scores.length === 0) return 0;
    const total = scores.reduce((sum, score) => sum + score, 0);
    return total / scores.length;
  };

  // Calculate SIMAK subtest score
  const calculateSubtestScore = (subtest: SubtestResult) => {
    const rawScore =
      subtest.benar * 4 + subtest.salah * -1 + subtest.kosong * 0;
    return 500 + 100 + 125 + rawScore;
  };

  // Calculate SIMAK average
  const calculateSIMAKAverage = () => {
    const subtests = [
      simakScores.kemampuan_dasar.matdas,
      simakScores.kemampuan_dasar.bindo,
      simakScores.kemampuan_dasar.bing,
      simakScores.kemampuan_akademik.verbal,
      simakScores.kemampuan_akademik.kuantitatif,
      simakScores.kemampuan_akademik.logika,
    ];

    const totalScore = subtests.reduce(
      (sum, subtest) => sum + calculateSubtestScore(subtest),
      0,
    );
    return totalScore / 6;
  };

  // Calculate raw SIMAK score
  const calculateSIMAKRawScore = () => {
    const subtests = [
      simakScores.kemampuan_dasar.matdas,
      simakScores.kemampuan_dasar.bindo,
      simakScores.kemampuan_dasar.bing,
      simakScores.kemampuan_akademik.verbal,
      simakScores.kemampuan_akademik.kuantitatif,
      simakScores.kemampuan_akademik.logika,
    ];

    return subtests.reduce((sum, subtest) => {
      return sum + subtest.benar * 4 + subtest.salah * -1;
    }, 0);
  };

  // Update results when scores change
  useEffect(() => {
    const utbkAvg = calculateUTBKAverage();
    const simakAvg = calculateSIMAKAverage();
    const simakRaw = calculateSIMAKRawScore();

    const finalScore = (utbkAvg + simakAvg) / 2;
    const finalPercentage = ((utbkAvg / 1000 + simakRaw / 540) / 2) * 100;

    const utbkScoresBySubject = [
      utbkScores.penalaran_umum || 0,
      utbkScores.ppu || 0,
      utbkScores.pbm || 0,
      utbkScores.kuantitatif || 0,
      utbkScores.lit_indonesia || 0,
      utbkScores.lit_inggris || 0,
      utbkScores.matematika || 0,
    ];

    const simakScoresBySubject = [
      calculateSubtestScore(simakScores.kemampuan_dasar.matdas),
      calculateSubtestScore(simakScores.kemampuan_dasar.bindo),
      calculateSubtestScore(simakScores.kemampuan_dasar.bing),
      calculateSubtestScore(simakScores.kemampuan_akademik.verbal),
      calculateSubtestScore(simakScores.kemampuan_akademik.kuantitatif),
      calculateSubtestScore(simakScores.kemampuan_akademik.logika),
    ];

    setResults({
      utbkAverage: utbkAvg,
      utbkPercentage: (utbkAvg / 1000) * 100,
      simakAverage: simakAvg,
      simakPercentage: (simakRaw / 540) * 100,
      simakRawScore: simakRaw,
      finalScore,
      finalPercentage,
      utbkScoresBySubject,
      simakScoresBySubject,
    });
  }, [utbkScores, simakScores]);

  // Validate subtest totals
  const validateSubtest = (subtest: SubtestResult, maxQuestions: number) => {
    const total = subtest.benar + subtest.salah + subtest.kosong;
    return total === maxQuestions;
  };

  // Get status for passing grade comparison
  const getPassingGradeStatus = (pg: PassingGrade) => {
    const userValue =
      pg.tipe === 'skor' ? results.finalScore : results.finalPercentage;
    const threshold = pg.nilai;

    const diff = ((userValue - threshold) / threshold) * 100;

    if (diff >= 0)
      return { status: 'Lolos', icon: CheckCircle, color: 'text-green-600' };
    if (diff >= -2)
      return { status: 'Nyaris', icon: AlertCircle, color: 'text-yellow-600' };
    return { status: 'Tidak Lolos', icon: XCircle, color: 'text-red-600' };
  };

  const addProgram = (program: Program) => {
    if (
      selectedPrograms.length < 3 &&
      !selectedPrograms.find((sp) => sp.program.id === program.id)
    ) {
      setSelectedPrograms((prev) => [
        ...prev,
        {
          program,
          customPassingGrades: [...program.passing_grades],
        },
      ]);
    }
    setProgramSearchOpen(false);
  };

  const removeProgram = (programId: string) => {
    setSelectedPrograms((prev) =>
      prev.filter((sp) => sp.program.id !== programId),
    );
  };

  const addCustomPassingGrade = (programIndex: number) => {
    setSelectedPrograms((prev) =>
      prev.map((sp, index) =>
        index === programIndex
          ? {
              ...sp,
              customPassingGrades: [
                ...sp.customPassingGrades,
                {
                  sumber: 'Custom Source',
                  tipe: 'skor',
                  nilai: 700,
                },
              ],
            }
          : sp,
      ),
    );
  };

  const updateCustomPassingGrade = (
    programIndex: number,
    pgIndex: number,
    field: keyof PassingGrade,
    value: string | number,
  ) => {
    setSelectedPrograms((prev) =>
      prev.map((sp, index) =>
        index === programIndex
          ? {
              ...sp,
              customPassingGrades: sp.customPassingGrades.map((pg, i) =>
                i === pgIndex ? { ...pg, [field]: value } : pg,
              ),
            }
          : sp,
      ),
    );
  };

  const removeCustomPassingGrade = (programIndex: number, pgIndex: number) => {
    setSelectedPrograms((prev) =>
      prev.map((sp, index) =>
        index === programIndex
          ? {
              ...sp,
              customPassingGrades: sp.customPassingGrades.filter(
                (_, i) => i !== pgIndex,
              ),
            }
          : sp,
      ),
    );
  };

  const updateUTBKScore = (field: keyof UTBKScores, value: string) => {
    if (value === '') {
      setUtbkScores((prev) => ({ ...prev, [field]: null }));
      return;
    }

    const numValue = Number.parseFloat(value);
    if (isNaN(numValue)) return;

    if (numValue >= 0 && numValue <= 1000) {
      setUtbkScores((prev) => ({ ...prev, [field]: numValue }));
    }
  };

  const updateSIMAKScore = (
    category: 'kemampuan_dasar' | 'kemampuan_akademik',
    subtest: string,
    field: keyof SubtestResult,
    value: string,
  ) => {
    const numValue = Number.parseInt(value) || 0;
    if (numValue >= 0) {
      setSIMAKScores((prev: any) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [subtest]: {
            ...prev[category][subtest],
            [field]: numValue,
          },
        },
      }));
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return selectedPrograms.length > 0;
      case 2:
        const hasAtLeastOneScore = Object.values(utbkScores).some(
          (score) => score !== null,
        );
        return hasAtLeastOneScore;
      case 3:
        const kdValid = Object.entries(simakScores.kemampuan_dasar).every(
          ([subtest, scores]) =>
            validateSubtest(
              scores,
              SUBTEST_QUESTIONS[subtest as keyof typeof SUBTEST_QUESTIONS],
            ),
        );
        const akademikValid = Object.entries(
          simakScores.kemampuan_akademik,
        ).every(([subtest, scores]) =>
          validateSubtest(
            scores,
            SUBTEST_QUESTIONS[subtest as keyof typeof SUBTEST_QUESTIONS],
          ),
        );
        return kdValid && akademikValid;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length && canProceedToNextStep()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const filteredPrograms = searchQuery
    ? AVAILABLE_PROGRAMS.filter(
        (program) =>
          program.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          program.fakultas.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : AVAILABLE_PROGRAMS;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-3xl mb-6">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sistem Prediksi Kelulusan
            </h1>
            <h2 className="text-lg text-blue-600 font-semibold mb-4">
              UTBK + SIMAK UI
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hitung kemungkinan kelulusan seleksi masuk UI dengan menggabungkan
              nilai UTBK (50%) dan SIMAK UI (50%)
            </p>
          </div>

          {/* Progress Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                {STEPS.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;

                  return (
                    <div
                      key={step.id}
                      className="flex flex-col items-center relative flex-1"
                    >
                      <div
                        className={cn(
                          'w-10 h-10 rounded-3xl flex items-center justify-center font-medium transition-all duration-200 mb-3',
                          isActive
                            ? 'bg-blue-600 text-white'
                            : isCompleted
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 text-gray-500',
                        )}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <StepIcon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="text-center">
                        <p
                          className={cn(
                            'text-sm font-medium mb-1',
                            isActive ? 'text-blue-600' : 'text-gray-600',
                          )}
                        >
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-500 max-w-20">
                          {step.description}
                        </p>
                      </div>
                      {index < STEPS.length - 1 && (
                        <div className="absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 bg-gray-200">
                          <div
                            className="h-full bg-green-600 transition-all duration-500"
                            style={{ width: isCompleted ? '100%' : '0%' }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <Progress
                value={(currentStep / STEPS.length) * 100}
                className="h-2"
              />
            </CardContent>
          </Card>

          {/* Main Content */}
          <Card>
            <CardContent className="p-8">
              {/* Step 1: Program Selection */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Pilih Jurusan Target
                    </h2>
                    <p className="text-gray-600">
                      Pilih maksimal 3 jurusan yang ingin kamu masuki
                    </p>
                  </div>

                  {/* Search Section */}
                  <div className="max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-base font-medium">
                        Cari Jurusan
                      </Label>
                      <Badge
                        variant="outline"
                        className="font-medium"
                      >
                        {selectedPrograms.length}/3 dipilih
                      </Badge>
                    </div>
                    <Popover
                      open={programSearchOpen}
                      onOpenChange={setProgramSearchOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between h-12"
                          disabled={selectedPrograms.length >= 3}
                        >
                          {selectedPrograms.length >= 3
                            ? 'Maksimal 3 jurusan dipilih'
                            : 'Pilih jurusan...'}
                          <Search className="ml-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-full p-0"
                        align="start"
                      >
                        <Command>
                          <CommandInput
                            placeholder="Cari jurusan atau fakultas..."
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                          />
                          <CommandList>
                            <CommandEmpty>Tidak ditemukan</CommandEmpty>
                            <CommandGroup>
                              {filteredPrograms.map((program) => {
                                const isSelected = selectedPrograms.some(
                                  (sp) => sp.program.id === program.id,
                                );
                                return (
                                  <CommandItem
                                    key={program.id}
                                    onSelect={() =>
                                      !isSelected && addProgram(program)
                                    }
                                    disabled={isSelected}
                                    className={isSelected ? 'opacity-50' : ''}
                                  >
                                    <div className="flex flex-col flex-1">
                                      <span className="font-medium">
                                        {program.nama}
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        {program.fakultas}
                                      </span>
                                    </div>
                                    {isSelected && (
                                      <Check className="ml-2 h-4 w-4 text-green-600" />
                                    )}
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Selected Programs */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-center">
                      Jurusan Dipilih
                    </h3>
                    {selectedPrograms.length === 0 ? (
                      <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl">
                        <School className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">
                          Belum ada jurusan yang dipilih
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Pilih minimal 1 jurusan untuk melanjutkan
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-6">
                        {selectedPrograms.map((sp, index) => (
                          <Card
                            key={sp.program.id}
                            className="border-2"
                          >
                            <CardHeader className="pb-4">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <CardTitle className="text-lg">
                                    {sp.program.nama}
                                  </CardTitle>
                                  <CardDescription className="mt-1">
                                    {sp.program.fakultas}
                                  </CardDescription>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeProgram(sp.program.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <Tabs
                                defaultValue="view"
                                className="w-full"
                              >
                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                  <TabsTrigger value="view">
                                    Lihat PG
                                  </TabsTrigger>
                                  <TabsTrigger value="edit">
                                    Edit PG
                                  </TabsTrigger>
                                </TabsList>
                                <TabsContent
                                  value="view"
                                  className="space-y-3"
                                >
                                  {sp.customPassingGrades.map((pg, pgIndex) => (
                                    <div
                                      key={pgIndex}
                                      className="flex justify-between items-center p-3 bg-gray-50 rounded-3xl"
                                    >
                                      <div>
                                        <p className="text-sm font-medium">
                                          {pg.sumber}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {pg.nilai}
                                          {pg.tipe === 'persentase' ? '%' : ''}
                                        </p>
                                      </div>
                                      <Badge
                                        variant={
                                          pg.tipe === 'skor'
                                            ? 'default'
                                            : 'secondary'
                                        }
                                      >
                                        {pg.tipe === 'skor' ? 'Skor' : '%'}
                                      </Badge>
                                    </div>
                                  ))}
                                </TabsContent>
                                <TabsContent
                                  value="edit"
                                  className="space-y-4"
                                >
                                  {sp.customPassingGrades.map((pg, pgIndex) => (
                                    <div
                                      key={pgIndex}
                                      className="space-y-3 p-4 border rounded-3xl"
                                    >
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <Label className="text-xs font-medium">
                                            Sumber
                                          </Label>
                                          <Input
                                            value={pg.sumber}
                                            onChange={(e) =>
                                              updateCustomPassingGrade(
                                                index,
                                                pgIndex,
                                                'sumber',
                                                e.target.value,
                                              )
                                            }
                                            className="h-9 mt-1"
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-xs font-medium">
                                            Nilai
                                          </Label>
                                          <Input
                                            type="number"
                                            value={pg.nilai || ''}
                                            onChange={(e) =>
                                              updateCustomPassingGrade(
                                                index,
                                                pgIndex,
                                                'nilai',
                                                Number.parseFloat(
                                                  e.target.value,
                                                ) || 0,
                                              )
                                            }
                                            className="h-9 mt-1"
                                          />
                                        </div>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <Select
                                          value={pg.tipe}
                                          onValueChange={(value) =>
                                            updateCustomPassingGrade(
                                              index,
                                              pgIndex,
                                              'tipe',
                                              value as 'skor' | 'persentase',
                                            )
                                          }
                                        >
                                          <SelectTrigger className="w-28 h-9">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="skor">
                                              Skor
                                            </SelectItem>
                                            <SelectItem value="persentase">
                                              %
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            removeCustomPassingGrade(
                                              index,
                                              pgIndex,
                                            )
                                          }
                                          disabled={
                                            sp.customPassingGrades.length <= 1
                                          }
                                          className="h-9 text-red-600 hover:bg-red-50"
                                        >
                                          Hapus
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                  {sp.customPassingGrades.length < 5 && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        addCustomPassingGrade(index)
                                      }
                                      className="w-full h-9"
                                    >
                                      <Plus className="h-4 w-4 mr-2" /> Tambah
                                      PG
                                    </Button>
                                  )}
                                </TabsContent>
                              </Tabs>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: UTBK Input */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Input Nilai UTBK
                    </h2>
                    <p className="text-gray-600">
                      Masukkan nilai UTBK (100-1000). Kosongkan jika tidak ada
                      nilai.
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Input Section */}
                    <div className="lg:col-span-2">
                      <div className="grid gap-6">
                        {Object.entries(utbkScores).map(([key, value]) => (
                          <div
                            key={key}
                            className="space-y-2"
                          >
                            <Label className="text-sm font-medium flex items-center justify-between">
                              <span>
                                {UTBK_LABELS[key as keyof typeof UTBK_LABELS]}
                              </span>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Rentang nilai: 100.00 - 1000.00</p>
                                </TooltipContent>
                              </Tooltip>
                            </Label>
                            <Input
                              type="number"
                              max="1000"
                              step="0.01"
                              value={value === null ? '' : value}
                              onChange={(e) =>
                                updateUTBKScore(
                                  key as keyof UTBKScores,
                                  e.target.value,
                                )
                              }
                              placeholder="Masukkan nilai..."
                              className="h-11"
                            />
                            {value !== null &&
                              (value < 100 || value > 1000) && (
                                <p className="text-red-500 text-xs flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  Nilai harus antara 100.00 - 1000.00
                                </p>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Visualization Section */}
                    <div className="space-y-6">
                      <Card>
                        <CardHeader className="pb-4">
                          <CardTitle className="text-base">
                            Visualisasi UTBK
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {Object.values(utbkScores).some(
                            (score) => score !== null,
                          ) ? (
                            <SimpleBarChart
                              data={results.utbkScoresBySubject}
                              labels={[
                                'PU',
                                'PPU',
                                'PBM',
                                'Kuant',
                                'Lit ID',
                                'Lit EN',
                                'Mat',
                              ]}
                              title="Distribusi Nilai UTBK"
                            />
                          ) : (
                            <div className="text-center py-12 text-gray-500">
                              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                              <p className="text-sm">
                                Masukkan nilai untuk melihat grafik
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-2 gap-4">
                        <ScoreCard
                          title="Rata-rata"
                          value={results.utbkAverage.toFixed(1)}
                          color="blue"
                        />
                        <ScoreCard
                          title="Persentase"
                          value={`${results.utbkPercentage.toFixed(1)}%`}
                          color="green"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: SIMAK Input */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Input Hasil TO SIMAK UI
                    </h2>
                    <p className="text-gray-600">
                      Masukkan jumlah soal benar, salah, dan kosong. Total harus
                      sesuai jumlah soal.
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-4 gap-8">
                    {/* Input Section */}
                    <div className="lg:col-span-3 space-y-8">
                      {/* Kemampuan Dasar */}
                      <Card>
                        <CardHeader className="bg-blue-50">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            Kemampuan Dasar (45 Soal)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="space-y-6">
                            {Object.entries(simakScores.kemampuan_dasar).map(
                              ([subtest, scores]) => (
                                <div
                                  key={subtest}
                                  className="space-y-3"
                                >
                                  <div className="flex justify-between items-center">
                                    <Label className="font-medium">
                                      {subtest === 'matdas'
                                        ? 'Matematika Dasar'
                                        : subtest === 'bindo'
                                          ? 'Bahasa Indonesia'
                                          : 'Bahasa Inggris'}
                                    </Label>
                                    <Badge variant="outline">
                                      {
                                        SUBTEST_QUESTIONS[
                                          subtest as keyof typeof SUBTEST_QUESTIONS
                                        ]
                                      }{' '}
                                      soal
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <Label className="text-xs text-gray-500 mb-1 block">
                                        Benar
                                      </Label>
                                      <Input
                                        type="number"
                                        max={
                                          SUBTEST_QUESTIONS[
                                            subtest as keyof typeof SUBTEST_QUESTIONS
                                          ]
                                        }
                                        value={scores.benar}
                                        onChange={(e) =>
                                          updateSIMAKScore(
                                            'kemampuan_dasar',
                                            subtest,
                                            'benar',
                                            e.target.value,
                                          )
                                        }
                                        className="h-10"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs text-gray-500 mb-1 block">
                                        Salah
                                      </Label>
                                      <Input
                                        type="number"
                                        max={
                                          SUBTEST_QUESTIONS[
                                            subtest as keyof typeof SUBTEST_QUESTIONS
                                          ]
                                        }
                                        value={scores.salah}
                                        onChange={(e) =>
                                          updateSIMAKScore(
                                            'kemampuan_dasar',
                                            subtest,
                                            'salah',
                                            e.target.value,
                                          )
                                        }
                                        className="h-10"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs text-gray-500 mb-1 block">
                                        Kosong
                                      </Label>
                                      <Input
                                        type="number"
                                        max={
                                          SUBTEST_QUESTIONS[
                                            subtest as keyof typeof SUBTEST_QUESTIONS
                                          ]
                                        }
                                        value={scores.kosong}
                                        onChange={(e) =>
                                          updateSIMAKScore(
                                            'kemampuan_dasar',
                                            subtest,
                                            'kosong',
                                            e.target.value,
                                          )
                                        }
                                        className="h-10"
                                      />
                                    </div>
                                  </div>
                                  {!validateSubtest(
                                    scores,
                                    SUBTEST_QUESTIONS[
                                      subtest as keyof typeof SUBTEST_QUESTIONS
                                    ],
                                  ) && (
                                    <div className="flex items-center gap-2 text-amber-600 text-xs bg-amber-50 p-3 rounded-3xl">
                                      <AlertCircle className="h-4 w-4" />
                                      <span>
                                        Total:{' '}
                                        {scores.benar +
                                          scores.salah +
                                          scores.kosong}{' '}
                                        dari{' '}
                                        {
                                          SUBTEST_QUESTIONS[
                                            subtest as keyof typeof SUBTEST_QUESTIONS
                                          ]
                                        }{' '}
                                        soal
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ),
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Kemampuan Akademik */}
                      <Card>
                        <CardHeader className="bg-purple-50">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-600" />
                            Kemampuan Akademik (80 Soal)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="space-y-6">
                            {Object.entries(simakScores.kemampuan_akademik).map(
                              ([subtest, scores]) => (
                                <div
                                  key={subtest}
                                  className="space-y-3"
                                >
                                  <div className="flex justify-between items-center">
                                    <Label className="font-medium">
                                      {subtest.charAt(0).toUpperCase() +
                                        subtest.slice(1)}
                                    </Label>
                                    <Badge variant="outline">
                                      {
                                        SUBTEST_QUESTIONS[
                                          subtest as keyof typeof SUBTEST_QUESTIONS
                                        ]
                                      }{' '}
                                      soal
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <Label className="text-xs text-gray-500 mb-1 block">
                                        Benar
                                      </Label>
                                      <Input
                                        type="number"
                                        max={
                                          SUBTEST_QUESTIONS[
                                            subtest as keyof typeof SUBTEST_QUESTIONS
                                          ]
                                        }
                                        value={scores.benar}
                                        onChange={(e) =>
                                          updateSIMAKScore(
                                            'kemampuan_akademik',
                                            subtest,
                                            'benar',
                                            e.target.value,
                                          )
                                        }
                                        className="h-10"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs text-gray-500 mb-1 block">
                                        Salah
                                      </Label>
                                      <Input
                                        type="number"
                                        max={
                                          SUBTEST_QUESTIONS[
                                            subtest as keyof typeof SUBTEST_QUESTIONS
                                          ]
                                        }
                                        value={scores.salah}
                                        onChange={(e) =>
                                          updateSIMAKScore(
                                            'kemampuan_akademik',
                                            subtest,
                                            'salah',
                                            e.target.value,
                                          )
                                        }
                                        className="h-10"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs text-gray-500 mb-1 block">
                                        Kosong
                                      </Label>
                                      <Input
                                        type="number"
                                        max={
                                          SUBTEST_QUESTIONS[
                                            subtest as keyof typeof SUBTEST_QUESTIONS
                                          ]
                                        }
                                        value={scores.kosong}
                                        onChange={(e) =>
                                          updateSIMAKScore(
                                            'kemampuan_akademik',
                                            subtest,
                                            'kosong',
                                            e.target.value,
                                          )
                                        }
                                        className="h-10"
                                      />
                                    </div>
                                  </div>
                                  {!validateSubtest(
                                    scores,
                                    SUBTEST_QUESTIONS[
                                      subtest as keyof typeof SUBTEST_QUESTIONS
                                    ],
                                  ) && (
                                    <div className="flex items-center gap-2 text-amber-600 text-xs bg-amber-50 p-3 rounded-3xl">
                                      <AlertCircle className="h-4 w-4" />
                                      <span>
                                        Total:{' '}
                                        {scores.benar +
                                          scores.salah +
                                          scores.kosong}{' '}
                                        dari{' '}
                                        {
                                          SUBTEST_QUESTIONS[
                                            subtest as keyof typeof SUBTEST_QUESTIONS
                                          ]
                                        }{' '}
                                        soal
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ),
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Visualization Section */}
                    <div className="space-y-6">
                      <Card>
                        <CardHeader className="pb-4">
                          <CardTitle className="text-base">
                            Visualisasi SIMAK
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <SimpleBarChart
                            data={results.simakScoresBySubject}
                            labels={[
                              'MatDas',
                              'BI',
                              'BE',
                              'Verbal',
                              'Kuant',
                              'Logika',
                            ]}
                            title="Distribusi Nilai SIMAK"
                          />
                        </CardContent>
                      </Card>

                      <div className="space-y-4">
                        <ScoreCard
                          title="Skor Mentah"
                          value={results.simakRawScore.toString()}
                          color="blue"
                        />
                        <ScoreCard
                          title="Persentase"
                          value={`${results.simakPercentage.toFixed(1)}%`}
                          color="green"
                        />
                        <ScoreCard
                          title="Rata-rata IRT"
                          value={results.simakAverage.toFixed(1)}
                          color="purple"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Results */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Hasil Prediksi Kelulusan
                    </h2>
                    <p className="text-gray-600">
                      Analisis lengkap berdasarkan nilai UTBK dan SIMAK UI
                    </p>
                  </div>

                  {/* Score Summary */}
                  <Card>
                    <CardHeader className="bg-gray-50">
                      <CardTitle className="text-lg">Ringkasan Nilai</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <ScoreCard
                              title="UTBK"
                              value={results.utbkAverage.toFixed(1)}
                              subtitle={`${results.utbkPercentage.toFixed(1)}%`}
                              color="blue"
                            />
                            <ScoreCard
                              title="SIMAK"
                              value={results.simakAverage.toFixed(1)}
                              subtitle={`${results.simakPercentage.toFixed(1)}%`}
                              color="purple"
                            />
                          </div>

                          <Card className="border-2 border-orange-200 bg-orange-50">
                            <CardContent className="p-6 text-center">
                              <h3 className="font-semibold text-orange-900 mb-2">
                                Skor Final
                              </h3>
                              <p className="text-sm text-orange-700 mb-4">
                                UTBK (50%) + SIMAK (50%)
                              </p>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-2xl font-bold text-orange-900">
                                    {results.finalScore.toFixed(1)}
                                  </p>
                                  <p className="text-sm text-orange-700">
                                    Skor
                                  </p>
                                </div>
                                <div>
                                  <p className="text-2xl font-bold text-orange-900">
                                    {results.finalPercentage.toFixed(1)}%
                                  </p>
                                  <p className="text-sm text-orange-700">
                                    Persentase
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div>
                          <h3 className="font-medium mb-4">
                            Perbandingan Nilai
                          </h3>
                          <SimpleBarChart
                            data={[
                              results.utbkAverage,
                              results.simakAverage,
                              results.finalScore,
                            ]}
                            labels={['UTBK', 'SIMAK', 'Final']}
                            title="Distribusi Skor"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Program Results */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-center">
                      Prediksi Kelulusan per Jurusan
                    </h3>

                    {selectedPrograms.map((sp) => {
                      const statusCounts = sp.customPassingGrades.reduce(
                        (acc, pg) => {
                          const status = getPassingGradeStatus(pg).status;
                          acc[status] = (acc[status] || 0) + 1;
                          return acc;
                        },
                        {} as Record<string, number>,
                      );

                      const lolosCount = statusCounts['Lolos'] || 0;
                      const nyarisCount = statusCounts['Nyaris'] || 0;
                      const tidakLolosCount = statusCounts['Tidak Lolos'] || 0;

                      let overallStatus = 'Tidak Lolos';
                      let statusColor = 'border-l-red-500 bg-red-50';

                      if (lolosCount > tidakLolosCount) {
                        overallStatus = 'Berpeluang Lolos';
                        statusColor = 'border-l-green-500 bg-green-50';
                      } else if (lolosCount + nyarisCount >= tidakLolosCount) {
                        overallStatus = 'Peluang Tipis';
                        statusColor = 'border-l-yellow-500 bg-yellow-50';
                      }

                      return (
                        <Card
                          key={sp.program.id}
                          className={cn('border-l-4', statusColor)}
                        >
                          <CardHeader className="pb-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <CardTitle className="text-xl">
                                  {sp.program.nama}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                  {sp.program.fakultas}
                                </CardDescription>
                              </div>
                              <Badge
                                variant="outline"
                                className={cn(
                                  'font-medium',
                                  overallStatus === 'Berpeluang Lolos'
                                    ? 'border-green-600 text-green-700'
                                    : overallStatus === 'Peluang Tipis'
                                      ? 'border-yellow-600 text-yellow-700'
                                      : 'border-red-600 text-red-700',
                                )}
                              >
                                {overallStatus}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <Tabs
                              defaultValue="table"
                              className="w-full"
                            >
                              <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="table">Tabel</TabsTrigger>
                                <TabsTrigger value="chart">Grafik</TabsTrigger>
                              </TabsList>

                              <TabsContent value="table">
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="border-b">
                                        <th className="text-left py-3 font-medium">
                                          Sumber
                                        </th>
                                        <th className="text-left py-3 font-medium">
                                          Tipe
                                        </th>
                                        <th className="text-left py-3 font-medium">
                                          PG
                                        </th>
                                        <th className="text-left py-3 font-medium">
                                          Nilai User
                                        </th>
                                        <th className="text-left py-3 font-medium">
                                          Status
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {sp.customPassingGrades.map(
                                        (pg, pgIndex) => {
                                          const status =
                                            getPassingGradeStatus(pg);
                                          const userValue =
                                            pg.tipe === 'skor'
                                              ? results.finalScore
                                              : results.finalPercentage;
                                          const StatusIcon = status.icon;

                                          return (
                                            <tr
                                              key={pgIndex}
                                              className="border-b"
                                            >
                                              <td className="py-3">
                                                {pg.sumber}
                                              </td>
                                              <td className="py-3">
                                                {pg.tipe === 'skor'
                                                  ? 'Skor'
                                                  : 'Persentase'}
                                              </td>
                                              <td className="py-3 font-medium">
                                                {pg.nilai}
                                                {pg.tipe === 'persentase'
                                                  ? '%'
                                                  : ''}
                                              </td>
                                              <td className="py-3 font-medium">
                                                {userValue.toFixed(1)}
                                                {pg.tipe === 'persentase'
                                                  ? '%'
                                                  : ''}
                                              </td>
                                              <td className="py-3">
                                                <div className="flex items-center gap-2">
                                                  <StatusIcon
                                                    className={`w-4 h-4 ${status.color}`}
                                                  />
                                                  <span
                                                    className={`text-sm ${status.color}`}
                                                  >
                                                    {status.status}
                                                  </span>
                                                </div>
                                              </td>
                                            </tr>
                                          );
                                        },
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </TabsContent>

                              <TabsContent value="chart">
                                <SimpleBarChart
                                  data={sp.customPassingGrades.map((pg) =>
                                    pg.tipe === 'skor'
                                      ? results.finalScore
                                      : results.finalPercentage,
                                  )}
                                  labels={sp.customPassingGrades.map(
                                    (pg) => pg.sumber,
                                  )}
                                  title={`Perbandingan dengan Passing Grade`}
                                />
                              </TabsContent>
                            </Tabs>

                            <Separator className="my-6" />

                            <div className="flex justify-between items-center">
                              <h4 className="font-medium">Ringkasan Status</h4>
                              <div className="flex gap-6">
                                <StatusIndicator
                                  status="Lolos"
                                  count={lolosCount}
                                />
                                <StatusIndicator
                                  status="Nyaris"
                                  count={nyarisCount}
                                />
                                <StatusIndicator
                                  status="Tidak Lolos"
                                  count={tidakLolosCount}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-12 pt-8 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="h-11 px-6"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Sebelumnya
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-500 font-medium">
                    Langkah {currentStep} dari {STEPS.length}
                  </p>
                </div>

                {currentStep < STEPS.length ? (
                  <Button
                    onClick={nextStep}
                    disabled={!canProceedToNextStep()}
                    className="h-11 px-6 bg-blue-600 hover:bg-blue-700"
                  >
                    Selanjutnya <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="h-11 px-6"
                  >
                    Mulai Baru
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
