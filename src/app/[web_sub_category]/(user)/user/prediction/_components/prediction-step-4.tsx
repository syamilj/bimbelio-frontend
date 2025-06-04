import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { NonUndefined } from 'react-hook-form';
import { UniversityType, useProvider } from '../_provider/provider';
import ScoreCard from './_components/score-card';
import SimpleBarChart from './_components/simple-bar-chart';

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
      <ByFinalScore />
      <BySimakScore />
    </div>
  );
}

const ByFinalScore = () => {
  const {
    selectedPrograms,
    useScoreFinal: { finalScore, finalPercentage },
  } = useProvider();
  const averageScore = selectedPrograms?.averageScore;

  const statusCounts = () => {
    if (!averageScore) return '-';

    if (finalScore >= averageScore) {
      return 'Lolos';
    } else if (finalScore < averageScore && finalScore - averageScore < 10) {
      return 'Nyaris';
    } else {
      return 'Tidak Lolos';
    }
  };

  let overallStatus = 'Tidak Lolos';
  let statusColor = 'border-l-red-500 bg-red-50';

  if (statusCounts() === 'Lolos') {
    overallStatus = 'Berpeluang Lolos';
    statusColor = 'border-l-green-500 bg-green-50';
  } else if (statusCounts() === 'Nyaris') {
    overallStatus = 'Peluang Tipis';
    statusColor = 'border-l-yellow-500 bg-yellow-50';
  }

  const getPassingGradeStatus = (
    pg: NonUndefined<UniversityType['studyProgramList'][0]['passingGrade']>[0],
  ) => {
    const userValue = pg.tipe === 'SCORE' ? finalScore : finalPercentage;
    const threshold = pg.value;

    const diff = ((userValue - threshold) / threshold) * 100;

    if (diff >= 0)
      return { status: 'Lolos', icon: CheckCircle, color: 'text-green-600' };
    if (diff >= -2)
      return { status: 'Nyaris', icon: AlertCircle, color: 'text-yellow-600' };
    return { status: 'Tidak Lolos', icon: XCircle, color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-center">
        Prediksi Kelulusan berdasarkan Score Final
      </h3>
      <Card
        key={selectedPrograms?.study}
        className={cn('border-l-4', statusColor)}
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">Sumber</th>
                  <th className="text-left py-3 font-medium">Tipe</th>
                  <th className="text-left py-3 font-medium">PG</th>
                  <th className="text-left py-3 font-medium">Nilai User</th>
                  <th className="text-left py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedPrograms?.passingGrade?.map((pg, pgIndex) => {
                  const status = getPassingGradeStatus(pg);
                  const userValue =
                    pg.tipe === 'PERCENTAGE' ? finalPercentage : finalScore;
                  const StatusIcon = status.icon;

                  return (
                    <tr
                      key={pgIndex}
                      className="border-b"
                    >
                      <td className="py-3">{pg.sumber?.name}</td>
                      <td className="py-3">
                        {pg.tipe === 'SCORE' ? 'Skor' : 'Persentase'}
                      </td>
                      <td className="py-3 font-medium">
                        {pg.value}
                        {pg.tipe === 'PERCENTAGE' ? '%' : ''}
                      </td>
                      <td className="py-3 font-medium">
                        {userValue.toFixed(1)}
                        {pg.tipe === 'PERCENTAGE' ? '%' : ''}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-4 h-4 ${status.color}`} />
                          <span className={`text-sm ${status.color}`}>
                            {status.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Separator className="my-6" />

          <div className="flex justify-between items-center">
            <h4 className="font-medium">Ringkasan Status</h4>
            <div className="flex gap-6">
              {/* <StatusIndicator
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
            /> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const BySimakScore = () => {
  const {
    selectedPrograms,
    useScoreSimak: { simakAvgSNBT, simakPercentageRAW },
  } = useProvider();
  const finalScore = simakAvgSNBT;
  const finalPercentage = simakPercentageRAW;

  const averageScore = selectedPrograms?.averageScore;

  const statusCounts = () => {
    if (!averageScore) return '-';

    if (finalScore >= averageScore) {
      return 'Lolos';
    } else if (finalScore < averageScore && finalScore - averageScore < 10) {
      return 'Nyaris';
    } else {
      return 'Tidak Lolos';
    }
  };

  let overallStatus = 'Tidak Lolos';
  let statusColor = 'border-l-red-500 bg-red-50';

  if (statusCounts() === 'Lolos') {
    overallStatus = 'Berpeluang Lolos';
    statusColor = 'border-l-green-500 bg-green-50';
  } else if (statusCounts() === 'Nyaris') {
    overallStatus = 'Peluang Tipis';
    statusColor = 'border-l-yellow-500 bg-yellow-50';
  }

  const getPassingGradeStatus = (
    pg: NonUndefined<UniversityType['studyProgramList'][0]['passingGrade']>[0],
  ) => {
    const userValue = pg.tipe === 'SCORE' ? finalScore : finalPercentage;
    const threshold = pg.value;

    const diff = ((userValue - threshold) / threshold) * 100;

    if (diff >= 0)
      return { status: 'Lolos', icon: CheckCircle, color: 'text-green-600' };
    if (diff >= -2)
      return { status: 'Nyaris', icon: AlertCircle, color: 'text-yellow-600' };
    return { status: 'Tidak Lolos', icon: XCircle, color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-center">
        Prediksi Kelulusan berdasarkan SIMAK score
      </h3>
      <Card
        key={selectedPrograms?.study}
        className={cn('border-l-4', statusColor)}
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">Sumber</th>
                  <th className="text-left py-3 font-medium">Tipe</th>
                  <th className="text-left py-3 font-medium">PG</th>
                  <th className="text-left py-3 font-medium">Nilai User</th>
                  <th className="text-left py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedPrograms?.passingGrade?.map((pg, pgIndex) => {
                  const status = getPassingGradeStatus(pg);
                  const userValue =
                    pg.tipe === 'PERCENTAGE' ? finalPercentage : finalScore;
                  const StatusIcon = status.icon;

                  return (
                    <tr
                      key={pgIndex}
                      className="border-b"
                    >
                      <td className="py-3">{pg.sumber?.name}</td>
                      <td className="py-3">
                        {pg.tipe === 'SCORE' ? 'Skor' : 'Persentase'}
                      </td>
                      <td className="py-3 font-medium">
                        {pg.value}
                        {pg.tipe === 'PERCENTAGE' ? '%' : ''}
                      </td>
                      <td className="py-3 font-medium">
                        {userValue.toFixed(1)}
                        {pg.tipe === 'PERCENTAGE' ? '%' : ''}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-4 h-4 ${status.color}`} />
                          <span className={`text-sm ${status.color}`}>
                            {status.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Separator className="my-6" />

          <div className="flex justify-between items-center">
            <h4 className="font-medium">Ringkasan Status</h4>
            <div className="flex gap-6">
              {/* <StatusIndicator
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
            /> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
