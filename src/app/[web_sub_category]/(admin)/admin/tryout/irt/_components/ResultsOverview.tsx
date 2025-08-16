import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OverallStatsProps } from '../[tryoutId]/page';

// interface StatisticalSummary {
//   min: number;
//   q1: number;
//   median: number;
//   q3: number;
//   max: number;
//   mean: number;
//   stdDev: number;
//   skewness: number;
//   kurtosis: number;
// }

// function calculateStatistics(scores: number[]): StatisticalSummary {
//   const sortedScores = [...scores].sort((a, b) => a - b);
//   const n = sortedScores.length;

//   // Calculate quartiles
//   const min = sortedScores[0];
//   const q1 = sortedScores[Math.floor(n * 0.25)];
//   const median =
//     n % 2 === 0
//       ? (sortedScores[n / 2 - 1] + sortedScores[n / 2]) / 2
//       : sortedScores[Math.floor(n / 2)];
//   const q3 = sortedScores[Math.floor(n * 0.75)];
//   const max = sortedScores[n - 1];

//   // Calculate mean
//   const mean = scores.reduce((a, b) => a + b, 0) / n;

//   // Calculate standard deviation
//   const variance =
//     scores.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
//   const stdDev = Math.sqrt(variance);

//   // Calculate skewness
//   const skewness =
//     scores.reduce((acc, val) => acc + Math.pow(val - mean, 3), 0) /
//     (n * Math.pow(stdDev, 3));

//   // Calculate kurtosis
//   const kurtosis =
//     scores.reduce((acc, val) => acc + Math.pow(val - mean, 4), 0) /
//       (n * Math.pow(stdDev, 4)) -
//     3;

//   return {
//     min,
//     q1,
//     median,
//     q3,
//     max,
//     mean,
//     stdDev,
//     skewness,
//     kurtosis,
//   };
// }

export default function ResultsOverview({
  overallStats,
}: {
  overallStats: OverallStatsProps | null;
}) {
  if (!overallStats) {
    return <div>No results available. Please process the data first.</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Statistik Keseluruhan</CardTitle>
          <CardDescription>
            Ringkasan statistik untuk seluruh peserta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-2xl font-bold">
                  {overallStats.totalParticipants}
                </CardTitle>
                <CardDescription>Total Peserta</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-2xl font-bold">
                  {overallStats.maxScores.toFixed(2)}
                </CardTitle>
                <CardDescription>Skor Tertinggi</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-2xl font-bold">
                  {overallStats.medianScores.toFixed(2)}
                </CardTitle>
                <CardDescription>Skor Median</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-2xl font-bold">
                  {overallStats.minScores.toFixed(2)}
                </CardTitle>
                <CardDescription>Skor Terendah</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-2xl font-bold">
                  {overallStats.averageScores.toFixed(2)}
                </CardTitle>
                <CardDescription>Rata-rata Skor</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-2xl font-bold">
                  {overallStats.minTheta.toFixed(2)}
                </CardTitle>
                <CardDescription>Theta Terendah</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-2xl font-bold">
                  {overallStats.maxTheta.toFixed(2)}
                </CardTitle>
                <CardDescription>Theta Tertinggi</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-2xl font-bold">
                  {overallStats.averageTheta.toFixed(2)}
                </CardTitle>
                <CardDescription>Rata Rata Theta</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
