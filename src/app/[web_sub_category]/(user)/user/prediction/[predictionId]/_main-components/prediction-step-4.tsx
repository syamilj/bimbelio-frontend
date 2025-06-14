import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, LucideProps, XCircle } from 'lucide-react';
import {
  ForwardRefExoticComponent,
  Fragment,
  RefAttributes,
  useEffect,
  useState,
} from 'react';
import { NonUndefined } from 'react-hook-form';
import { UniversityType, useProvider } from '../../_provider/provider';
import ScoreCard from '../_components/score-card';
import SimpleBarChart from '../_components/simple-bar-chart';
import { StatusIndicator } from '../_components/status-indicator';

export default function PredictionStep4() {
  const {
    useScoreUtbk: { utbkAvg, utbkScore, utbkPercentage },
    useScoreSimak: { simakAvgSNBT, simakPercentageRAW, simakScoreRAW },
    useScoreFinal: { finalPercentage, finalScore },
  } = useProvider();
  return (
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

            <div>
              <h3 className="font-medium mb-4">Perbandingan Nilai</h3>
              <SimpleBarChart
                data={[utbkAvg, simakAvgSNBT, finalScore]}
                labels={['UTBK', 'SIMAK', 'Final']}
                title="Distribusi Skor"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Program Results */}
      {/* <ByFinalScore /> */}
      <BySimakScore />
    </div>
  );
}

const BySimakScore = () => {
  const {
    selectedPrograms,
    useScoreSimak: { simakPercentageRAW, simakAvgSNBT },
    useScoreFinal: { finalPercentage, finalScore },
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
                          {pg.value}
                          {pg.tipe === 'PERCENTAGE' ? '%' : ''}
                        </td>
                        <td
                          className={cn(
                            'py-3 font-medium',
                            getStatusColor(statusFinal.status),
                          )}
                        >
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
                        </td>
                        <td
                          className={cn(
                            'py-3',
                            getStatusColor(statusFinal.status),
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <statusFinal.icon
                              className={`w-4 h-4 ${statusFinal.color}`}
                            />
                            <span className={`text-sm ${statusFinal.color}`}>
                              {statusFinal.status}
                            </span>
                          </div>
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
                          {pg.value}
                          {pg.tipe === 'PERCENTAGE' ? '%' : ''}
                        </td>
                        <td
                          className={cn(
                            'py-3 font-medium',
                            getStatusColor(statusSimak.status),
                          )}
                        >
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
                        </td>
                        <td
                          className={cn(
                            'py-3',
                            getStatusColor(statusSimak.status),
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <statusSimak.icon
                              className={`w-4 h-4 ${statusSimak.color}`}
                            />
                            <span className={`text-sm ${statusSimak.color}`}>
                              {statusSimak.status}
                            </span>
                          </div>
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
