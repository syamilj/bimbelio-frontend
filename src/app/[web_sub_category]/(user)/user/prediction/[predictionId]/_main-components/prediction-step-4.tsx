import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  CheckCircle,
  LockOpen,
  LucideProps,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import {
  ForwardRefExoticComponent,
  Fragment,
  RefAttributes,
  useEffect,
  useState,
} from 'react';
import { NonUndefined } from 'react-hook-form';
import { UniversityType, useProvider } from '../../_provider/provider';
import DeletePrediction from '../_components/delete-prediction';
import PaymentPrediction from '../_components/payment-prediction';
import ScoreCard from '../_components/score-card';
import SimpleBarChart from '../_components/simple-bar-chart';
import { StatusIndicator } from '../_components/status-indicator';

export default function PredictionStep4() {
  const {
    useScoreUtbk: { utbkAvg, utbkScore, utbkPercentage },
    useScoreSimak: {
      simakAvgSNBT,
      simakPercentageRAW,
      simakScoreRAW,
      simakMaxScoreRAW,
    },
    useScoreFinal: { finalPercentage, finalScore },
    selectedPrograms,
    simakScores,
    utbkScores,
    TryoutData,
    setCurrentStep,
  } = useProvider();
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
        <CardHeader className="px-0">
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
                      {TryoutData && (
                        <Link
                          href={`/${website_sub_category_id_params}/user/try-out/${TryoutData.id}`}
                          className="ml-2 text-xs bg-main hover:scale-105 cursor-pointer duration-300 py-1 px-2 rounded-2xl text-white font-normal"
                        >
                          {TryoutData.title}
                        </Link>
                      )}
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
      <BySimakScore />
      <div className="flex w-full justify-end gap-2">
        <DeletePrediction>
          <Button
            variant="outline"
            className="h-11 px-6 bg-red-600 text-white hover:text-white hover:bg-red-500"
          >
            Delete riwayat
          </Button>
        </DeletePrediction>
        <Link href={'step?step=1'}>
          <Button
            variant={'outline'}
            className="h-11 px-6 border-gray-300"
          >
            🎯 Buat baru
          </Button>
        </Link>
      </div>
    </div>
  );
}

const BySimakScore = () => {
  const {
    selectedPrograms,
    useScoreSimak: { simakPercentageRAW, simakAvgSNBT },
    useScoreFinal: { finalPercentage, finalScore },
    isLock,
  } = useProvider();

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
      const userValueFinal =
        pg.tipe === 'PERCENTAGE' ? finalPercentage : finalScore;

      const statusSimak = getPassingGradeStatus(
        pg,
        simakAvgSNBT,
        simakPercentageRAW,
      );
      const userValueSimak =
        pg.tipe === 'PERCENTAGE' ? simakPercentageRAW : simakAvgSNBT;

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
                      />
                      <StatusIndicator
                        status="Nyaris"
                        count={st.nyaris}
                      />
                      <StatusIndicator
                        status="Tidak Lolos"
                        count={st.tidak_lolos}
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
