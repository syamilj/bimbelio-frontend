import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  CheckCircle,
  LockOpen,
  LucideProps,
  XCircle,
} from 'lucide-react';
import {
  ForwardRefExoticComponent,
  Fragment,
  RefAttributes,
  useEffect,
  useState,
} from 'react';
import { NonUndefined } from 'react-hook-form';
import { UniversityType } from '../../_provider/provider';
import PaymentPrediction from './payment-prediction';
import ScoreCard from './score-card';
import SimpleBarChart from './simple-bar-chart';
import { StatusIndicator } from './status-indicator';

export default function ExampleResult() {
  // const {
  //   useScoreUtbk: { utbkAvg, utbkScore, utbkPercentage },
  //   useScoreSimak: {
  //     simakAvgSNBT,
  //     simakPercentageRAW,
  //     simakScoreRAW,
  //     simakMaxScoreRAW,
  //   },
  //   useScoreFinal: { finalPercentage, finalScore },
  //   selectedPrograms,
  //   simakScores,
  //   utbkScores,
  //   TryoutData,
  // } = useProvider();

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
  // const simakScoreSNBT = simakScores.reduce(
  //   (acc, item) => acc + calculateSubtestScore(item.value),
  //   0,
  // );

  const { maxScore, minScore } = calculateSIMAKBounds();
  const simakAvgSNBT = convertSIMAKToSNBT(simakScoreRAW, minScore, maxScore);
  // const simakAvgSNBT = simakScoreSNBT / 6;

  // FINAL
  const finalScore = (utbkAvg + simakAvgSNBT) / 2;
  const finalPercentage = ((utbkAvg / 1000 + simakScoreRAW / 540) / 2) * 100;

  const useScoreUtbk = { utbkAvg, utbkScore, utbkPercentage };
  const useScoreSimak = {
    simakAvgSNBT,
    simakPercentageRAW,
    simakScoreRAW,
    simakMaxScoreRAW,
  };
  const useScoreFinal = { finalPercentage, finalScore };

  const sendState = {
    useScoreUtbk,
    useScoreSimak,
    useScoreFinal,
    selectedPrograms,
    simakScores,
    utbkScores,
    TryoutData: null,
  };

  const [open, setOpen] = useState<string>('');
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Universitas Indonesia
        </h2>
        <p className="text-gray-600">{selectedPrograms?.study}</p>
      </div>

      {/* Score Summary */}
      <Card>
        <CardHeader className="px-0 py-0">
          <CardTitle className="text-lg">Ringkasan Nilai</CardTitle>
        </CardHeader>
        <CardContent className="py-6 px-0 flex flex-col gap-4">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <ScoreCard
                  title="UTBK"
                  value={utbkAvg.toFixed(1)}
                  subtitle={`${utbkPercentage.toFixed(1)}%`}
                  color="blue"
                />
                <ScoreCard
                  title="SIMAK"
                  value={simakAvgSNBT.toFixed(1)}
                  subtitle={`${simakPercentageRAW.toFixed(1)}%`}
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
                        {finalScore.toFixed(1)}
                      </p>
                      <p className="text-sm text-orange-700">Skor</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-900">
                        {finalPercentage.toFixed(1)}%
                      </p>
                      <p className="text-sm text-orange-700">Persentase</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Perbandingan Nilai</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleBarChart
                  data={[utbkAvg, simakAvgSNBT, finalScore]}
                  labels={['UTBK', 'SIMAK', 'Final']}
                  title="Distribusi Skor"
                />
              </CardContent>
            </Card>
          </div>

          <Accordion
            type="single"
            collapsible
            className=""
            value={open}
            onValueChange={setOpen}
          >
            <AccordionItem
              value="item-1"
              className="border-none"
            >
              <AccordionTrigger
                className={cn(
                  'border-l-4 border-main px-4 bg-main/10 text-base font-semibold',
                  open === '' && 'rounded-xl',
                  open === 'item-1' && ' rounded-t-xl',
                )}
              >
                Lihat detail nilai
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-2 gap-4 pt-4 border-l-4 border-main border-t-0 p-2 rounded-b-xl bg-main/10">
                <Card className="bg-transparent">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">
                      Visualisasi UTBK
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimpleBarChart
                      data={utbkScores.map((item) => {
                        return item.score;
                      })}
                      labels={utbkScores.map((usItem) => usItem.name)}
                      title="Distribusi Nilai UTBK"
                      max={1000}
                    />
                  </CardContent>
                </Card>
                <Card className="bg-transparent">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center">
                      <span>Visualisasi SIMAK</span>
                      {/* {TryoutData && (
                        <Link
                          href={`/${website_sub_category_id_params}/user/bimarena/try-out/${TryoutData.id}`}
                          className="ml-2 text-xs bg-main hover:scale-105 cursor-pointer duration-300 py-1 px-2 rounded-2xl text-white font-normal"
                        >
                          {TryoutData.title}
                        </Link>
                      )} */}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimpleBarChart
                      data={simakScores.map(
                        (item) => item.value.benar * 4 + item.value.salah * -1,
                      )}
                      labels={simakScores.map((ssItem) => ssItem.name)}
                      title="Distribusi Nilai SIMAK"
                      max={simakMaxScoreRAW}
                    />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Program Results */}
      {/* <ByFinalScore /> */}
      <BySimakScore state={sendState as any} />
    </div>
  );
}

const BySimakScore = ({
  state,
}: {
  state: {
    useScoreUtbk: {
      utbkAvg: number;
      utbkScore: number;
      utbkPercentage: number;
    };
    useScoreSimak: {
      simakAvgSNBT: number;
      simakPercentageRAW: number;
      simakScoreRAW: number;
      simakMaxScoreRAW: number;
    };
    useScoreFinal: {
      finalPercentage: number;
      finalScore: number;
    };
    selectedPrograms: {
      averageScore: number;
      study: string;
      fakultas: string;
      fakultasInitials: string;
      passingGrade: {
        sumber: {
          name: string;
          url: string;
        };
        tipe: 'SCORE' | 'PERCENTAGE';
        value: number;
      }[];
    };
    simakScores: {
      name: string;
      value: {
        benar: number;
        salah: number;
        kosong: number;
      };
      total_question: number;
      type: {
        name: string;
      };
    }[];
    utbkScores: {
      label: string;
      name: string;
      score: number;
    }[];
    TryoutData: null;
  };
}) => {
  const {
    selectedPrograms,
    useScoreSimak: { simakPercentageRAW, simakAvgSNBT },
    useScoreFinal: { finalPercentage, finalScore },
  } = state;

  const isLock = false;

  function getPassingGradeStatus(
    pg: NonUndefined<UniversityType['studyProgramList'][0]['passingGrade']>[0],
    score: number,
    scorePercentage: number,
  ): {
    status: 'Lolos' | 'Nyaris' | 'Tidak Lolos';
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >;
    color: string;
  } {
    const userValue = pg.tipe === 'SCORE' ? score : scorePercentage;
    const threshold = pg.value;

    const diff = ((userValue - threshold) / threshold) * 100;

    if (diff >= 0)
      return { status: 'Lolos', icon: CheckCircle, color: 'text-green-600' };
    if (diff >= -2)
      return {
        status: 'Nyaris',
        icon: AlertCircle,
        color: 'text-yellow-600',
      };
    return { status: 'Tidak Lolos', icon: XCircle, color: 'text-red-600' };
  }

  const [statusSummary, setStatusSummary] = useState<
    | {
        title: string;
        lolos: number;
        nyaris: number;
        tidak_lolos: number;
      }[]
    | null
  >(null);

  useEffect(() => {
    setStatusSummary(null);
    selectedPrograms?.passingGrade?.forEach((pg) => {
      const statusFinal = getPassingGradeStatus(
        pg,
        finalScore,
        finalPercentage,
      );
      // const userValueFinal =
      //   pg.tipe === 'PERCENTAGE' ? finalPercentage : finalScore;

      const statusSimak = getPassingGradeStatus(
        pg,
        simakAvgSNBT,
        simakPercentageRAW,
      );
      // const userValueSimak =
      //   pg.tipe === 'PERCENTAGE' ? simakPercentageRAW : simakAvgSNBT;

      const titleFinalScore = 'UTBK + SIMAK UI';
      const titleSimakScore = 'SIMAK UI';

      setStatusSummary((prev) => {
        if (!prev) {
          return [
            {
              title: titleFinalScore,
              lolos: statusFinal.status === 'Lolos' ? 1 : 0,
              nyaris: statusFinal.status === 'Nyaris' ? 1 : 0,
              tidak_lolos: statusFinal.status === 'Tidak Lolos' ? 1 : 0,
            },
            {
              title: titleSimakScore,
              lolos: statusSimak.status === 'Lolos' ? 1 : 0,
              nyaris: statusSimak.status === 'Nyaris' ? 1 : 0,
              tidak_lolos: statusSimak.status === 'Tidak Lolos' ? 1 : 0,
            },
          ];
        }
        return prev.map((st) => {
          if (st.title === titleFinalScore) {
            return {
              ...st,
              lolos: statusFinal.status === 'Lolos' ? st.lolos + 1 : st.lolos,
              nyaris:
                statusFinal.status === 'Nyaris' ? st.nyaris + 1 : st.nyaris,
              tidak_lolos:
                statusFinal.status === 'Tidak Lolos'
                  ? st.tidak_lolos + 1
                  : st.tidak_lolos,
            };
          }
          if (st.title === titleSimakScore) {
            return {
              ...st,
              lolos: statusSimak.status === 'Lolos' ? st.lolos + 1 : st.lolos,
              nyaris:
                statusSimak.status === 'Nyaris' ? st.nyaris + 1 : st.nyaris,
              tidak_lolos:
                statusSimak.status === 'Tidak Lolos'
                  ? st.tidak_lolos + 1
                  : st.tidak_lolos,
            };
          }
          return st;
        });
      });
    });
  }, [selectedPrograms]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-center">Prediksi Kelulusan</h3>
      <Card
        key={selectedPrograms?.study}
        className={cn('border-l-4', 'bg-main/10 border-main')}
      >
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">
                {selectedPrograms?.study}
              </CardTitle>
              <CardDescription className="mt-1">
                {/* {sp.program.fakultas} */}
              </CardDescription>
            </div>
            {/* <Badge
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
            </Badge> */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">Sumber</th>
                  <th className="text-center py-3 px-6 font-medium">Tipe</th>
                  <th className="text-left py-3 font-medium">PG</th>
                  <th className="text-left py-3 font-medium">Nilai User</th>
                  <th className="text-left py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedPrograms?.passingGrade?.map((pg, pgIndex) => {
                  const statusFinal = getPassingGradeStatus(
                    pg,
                    finalScore,
                    finalPercentage,
                  );
                  const userValueFinal =
                    pg.tipe === 'PERCENTAGE' ? finalPercentage : finalScore;

                  const statusSimak = getPassingGradeStatus(
                    pg,
                    simakAvgSNBT,
                    simakPercentageRAW,
                  );
                  const userValueSimak =
                    pg.tipe === 'PERCENTAGE'
                      ? simakPercentageRAW
                      : simakAvgSNBT;

                  const getStatusColor = (status: string) => {
                    if (isLock) return 'bg-white';
                    return status === 'Tidak Lolos'
                      ? 'bg-red-100'
                      : status === 'Nyaris'
                        ? 'bg-yellow-100'
                        : status === 'Lolos'
                          ? 'bg-green-100'
                          : '';
                  };
                  return (
                    <Fragment key={pgIndex}>
                      <tr className={cn()}>
                        <td className="py-3 pl-4">{pg.sumber?.name}</td>
                        <td
                          className={cn(
                            'py-3 text-center',
                            getStatusColor(statusFinal.status),
                          )}
                        >
                          {pg.tipe === 'SCORE' ? 'Skor' : 'Persentase'}
                        </td>
                        <td
                          className={cn(
                            'py-3 font-medium',
                            getStatusColor(statusFinal.status),
                          )}
                        >
                          {isLock ? (
                            <Locked />
                          ) : (
                            <span>
                              {pg.value}
                              {pg.tipe === 'PERCENTAGE' ? '%' : ''}
                            </span>
                          )}
                        </td>
                        <td
                          className={cn(
                            'py-3 font-medium',
                            getStatusColor(statusFinal.status),
                          )}
                        >
                          {isLock ? (
                            <Locked />
                          ) : (
                            <span>
                              {userValueFinal.toFixed(1)}
                              {pg.tipe === 'PERCENTAGE' ? '%' : ''}{' '}
                              <span
                                className={cn(
                                  'text-xs',
                                  statusFinal.status === 'Lolos' &&
                                    'text-green-600',
                                  statusFinal.status === 'Nyaris' &&
                                    'text-yellow-600',
                                  statusFinal.status === 'Tidak Lolos' &&
                                    'text-red-600',
                                )}
                              >
                                ( {'UTBK + SIMAK UI'} )
                              </span>
                            </span>
                          )}
                        </td>
                        <td
                          className={cn(
                            'py-3',
                            getStatusColor(statusFinal.status),
                          )}
                        >
                          {isLock ? (
                            <Locked />
                          ) : (
                            <div className="flex items-center gap-2">
                              <statusFinal.icon
                                className={`w-4 h-4 ${statusFinal.color}`}
                              />
                              <span className={`text-sm ${statusFinal.color}`}>
                                {statusFinal.status}
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                      <tr className={cn('border-b border-black/10')}>
                        <td className="py-3 pl-4"></td>
                        <td
                          className={cn(
                            'py-3 text-center',
                            getStatusColor(statusSimak.status),
                          )}
                        >
                          {pg.tipe === 'SCORE' ? 'Skor' : 'Persentase'}
                        </td>
                        <td
                          className={cn(
                            'py-3 font-medium',
                            getStatusColor(statusSimak.status),
                          )}
                        >
                          {isLock ? (
                            <Locked />
                          ) : (
                            <span>
                              {pg.value}
                              {pg.tipe === 'PERCENTAGE' ? '%' : ''}
                            </span>
                          )}
                        </td>
                        <td
                          className={cn(
                            'py-3 font-medium',
                            getStatusColor(statusSimak.status),
                          )}
                        >
                          {isLock ? (
                            <Locked />
                          ) : (
                            <span>
                              {userValueSimak.toFixed(1)}
                              {pg.tipe === 'PERCENTAGE' ? '%' : ''}{' '}
                              <span
                                className={cn(
                                  'text-xs',
                                  statusSimak.status === 'Lolos' &&
                                    'text-green-600',
                                  statusSimak.status === 'Nyaris' &&
                                    'text-yellow-600',
                                  statusSimak.status === 'Tidak Lolos' &&
                                    'text-red-600',
                                )}
                              >
                                ( {'SIMAK UI'} )
                              </span>
                            </span>
                          )}
                        </td>
                        <td
                          className={cn(
                            'py-3',
                            getStatusColor(statusSimak.status),
                          )}
                        >
                          {isLock ? (
                            <Locked />
                          ) : (
                            <div className="flex items-center gap-2">
                              <statusSimak.icon
                                className={`w-4 h-4 ${statusSimak.color}`}
                              />
                              <span className={`text-sm ${statusSimak.color}`}>
                                {statusSimak.status}
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 py-4">
            <h4 className="text-base font-semibold text-gray-800">
              Ringkasan Status
            </h4>

            <div className="space-y-2">
              {statusSummary !== null &&
                statusSummary.map((st, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 items-center gap-4 px-4 py-2 bg-main/10 border border-main rounded-3xl shadow-sm"
                  >
                    <div className="text-sm font-semibold text-main">
                      {st.title}
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2 text-sm">
                      <StatusIndicator
                        status="Lolos"
                        count={st.lolos}
                        isLocked={false}
                      />
                      <StatusIndicator
                        status="Nyaris"
                        count={st.nyaris}
                        isLocked={false}
                      />
                      <StatusIndicator
                        status="Tidak Lolos"
                        count={st.tidak_lolos}
                        isLocked={false}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Locked = () => {
  return (
    <PaymentPrediction>
      <span className="flex items-center justify-center gap-2 bg-yellow-100 w-fit px-3 rounded-full ml-1 hover:scale-110 duration-300 cursor-pointer text-yellow-600">
        Lihat{' '}
        <span className="">
          <LockOpen className="w-4 h-4" />
        </span>
      </span>
    </PaymentPrediction>
  );
};

const selectedPrograms = {
  averageScore: 236,
  study: 'Ilmu Komunikasi',
  fakultas: 'Fakultas Ilmu Sosial dan Ilmu Politik',
  fakultasInitials: 'FISIP',
  passingGrade: [
    {
      sumber: {
        name: 'Quipper 2025',
        url: 'https://www.quipper.com/id/blog/passing-grade/universitas-indonesia/',
      },
      tipe: 'SCORE',
      value: 672.74,
    },
    {
      sumber: {
        name: 'Okezone 2025',
        url: 'https://edukasi.okezone.com/read/2025/03/22/65/3124848/berapa-skor-utbk-unpad-dan-ui-untuk-lolos-snbt-2025?page=all',
      },
      tipe: 'SCORE',
      value: 719.88,
    },
    {
      sumber: {
        name: 'Bocah Kampus 2024',
        url: 'https://bocahkampus.com/passing-grade/ui',
      },
      tipe: 'SCORE',
      value: 696,
    },
    {
      sumber: {
        name: 'Kampus Impian 2025',
        url: 'https://kampusimpian.com/nilai-utbk-untuk-masuk-ui-universitas-indonesia/',
      },
      tipe: 'SCORE',
      value: 683.89,
    },
    {
      sumber: {
        name: 'Scribd SNBT 2023',
        url: 'https://id.scribd.com/document/691505886/PASSING-GRADE-SNBT',
      },
      tipe: 'SCORE',
      value: 672.74,
    },
  ],
};

const utbkScores = [
  { label: 'Penalaran Umum', name: 'Penalaran Umum', score: 800 },
  {
    label: 'Pengetahuan & Pemahaman Umum',
    name: 'Pengetahuan & Pemahaman Umum',
    score: 634,
  },
  {
    label: 'Pemahaman Bacaan & Menulis',
    name: 'Pemahaman Bacaan & Menulis',
    score: 655,
  },
  { label: 'Penalaran Kuantitatif', name: 'Penalaran Kuantitatif', score: 812 },
  {
    label: 'Literasi Bahasa Indonesia',
    name: 'Literasi Bahasa Indonesia',
    score: 689,
  },
  {
    label: 'Literasi Bahasa Inggris',
    name: 'Literasi Bahasa Inggris',
    score: 899,
  },
  { label: 'Matematika', name: 'Matematika', score: 675 },
];

const simakScores = [
  {
    name: 'Matematika Dasar',
    value: { benar: 1, salah: 1, kosong: 13 },
    total_question: 15,
    type: { name: 'Kemampuan Dasar\t' },
  },
  {
    name: 'Bahasa Indonesia',
    value: { benar: 10, salah: 2, kosong: 3 },
    total_question: 15,
    type: { name: 'Kemampuan Dasar\t' },
  },
  {
    name: 'Bahasa Inggris',
    value: { benar: 10, salah: 0, kosong: 5 },
    total_question: 15,
    type: { name: 'Kemampuan Dasar\t' },
  },
  {
    name: 'Verbal',
    value: { benar: 20, salah: 1, kosong: 4 },
    total_question: 25,
    type: { name: 'Pengukuran Kemampuan Akademik\t' },
  },
  {
    name: 'Kuantitatif',
    value: { benar: 25, salah: 2, kosong: 8 },
    total_question: 35,
    type: { name: 'Pengukuran Kemampuan Akademik\t' },
  },
  {
    name: 'Logika',
    value: { benar: 20, salah: 1, kosong: 4 },
    total_question: 25,
    type: { name: 'Pengukuran Kemampuan Akademik\t' },
  },
];

const SCORING_RULES = {
  BENAR: 4,
  SALAH: -1,
  KOSONG: 0,
  UTBK_MIN: 100,
  UTBK_MAX: 1000,
  SNBT_MIN: 200,
  SNBT_MAX: 800,
} as const;
// Konstanta untuk perhitungan yang akurat
const SUBTEST_QUESTIONS = {
  matdas: 15,
  bindo: 15,
  bing: 15,
  verbal: 20,
  kuantitatif: 35,
  logika: 25,
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
