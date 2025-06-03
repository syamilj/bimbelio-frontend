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
import { useProvider } from '../_provider';
import ScoreCard from './_components/score-card';
import SimpleBarChart from './_components/simple-bar-chart';

export default function PredictionStep4() {
  const {
    useScoreUtbk: { utbkAvg, utbkScore, utbkPercentage },
    useScoreSimak: { simakAvg, simakPercentage, simakScore },
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
                  value={simakAvg.toFixed(1)}
                  subtitle={`${simakPercentage.toFixed(1)}%`}
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
                data={[utbkAvg, simakAvg, finalScore]}
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

        <Program />
      </div>
    </div>
  );
}

const Program = () => {
  const {
    selectedPrograms,
    useScoreFinal: { finalScore },
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

  return (
    <Card
      key={selectedPrograms?.study}
      className={cn('border-l-4', statusColor)}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">{selectedPrograms?.study}</CardTitle>
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
              {/* {sp.customPassingGrades.map((pg, pgIndex) => {
                const status = getPassingGradeStatus(pg);
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
                    <td className="py-3">{pg.sumber}</td>
                    <td className="py-3">
                      {pg.tipe === 'skor' ? 'Skor' : 'Persentase'}
                    </td>
                    <td className="py-3 font-medium">
                      {pg.nilai}
                      {pg.tipe === 'persentase' ? '%' : ''}
                    </td>
                    <td className="py-3 font-medium">
                      {userValue.toFixed(1)}
                      {pg.tipe === 'persentase' ? '%' : ''}
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
              })} */}
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
  );
};
