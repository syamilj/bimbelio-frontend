import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

      <Tabs defaultValue="summary">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="summary">Ringkasan Statistik</TabsTrigger>
          <TabsTrigger value="detailed">Statistik Detail</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Statistik Deskriptif per Bagian</CardTitle>
              <CardDescription>
                Ringkasan statistik untuk setiap bagian tes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bagian</TableHead>
                    <TableHead>Minimum</TableHead>
                    <TableHead>Q1</TableHead>
                    <TableHead>Median</TableHead>
                    <TableHead>Q3</TableHead>
                    <TableHead>Maximum</TableHead>
                    <TableHead>Mean</TableHead>
                    <TableHead>Std Dev</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sectionNames.map((section) => (
                    <TableRow key={section}>
                      <TableCell>{section}</TableCell>
                      <TableCell>
                        {sectionStats[section].min.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {sectionStats[section].q1.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {sectionStats[section].median.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {sectionStats[section].q3.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {sectionStats[section].max.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {sectionStats[section].mean.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {sectionStats[section].stdDev.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table> */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed">
          <Card>
            <CardHeader>
              <CardTitle>Analisis Statistik Lanjutan</CardTitle>
              <CardDescription>
                Statistik detail termasuk skewness dan kurtosis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bagian</TableHead>
                    <TableHead>IQR</TableHead>
                    <TableHead>Range</TableHead>
                    <TableHead>Skewness</TableHead>
                    <TableHead>Kurtosis</TableHead>
                    <TableHead>Coef. Variation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sectionNames.map((section) => {
                    const stats = sectionStats[section];
                    const iqr = stats.q3 - stats.q1;
                    const range = stats.max - stats.min;
                    const cv = (stats.stdDev / stats.mean) * 100;

                    return (
                      <TableRow key={section}>
                        <TableCell>{section}</TableCell>
                        <TableCell>{iqr.toFixed(2)}</TableCell>
                        <TableCell>{range.toFixed(2)}</TableCell>
                        <TableCell>{stats.skewness.toFixed(3)}</TableCell>
                        <TableCell>{stats.kurtosis.toFixed(3)}</TableCell>
                        <TableCell>{cv.toFixed(2)}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table> */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Skor PTN dan Kedinasan per Bagian</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="mean" fill="#8884d8" name="Rata-rata" />
                <Bar dataKey="median" fill="#82ca9d" name="Median" />
                <Bar dataKey="stdDev" fill="#ffc658" name="Std Dev" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Skor per Bagian</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="min" fill="#8884d8" name="Minimum" />
                <Bar dataKey="max" fill="#82ca9d" name="Maximum" />
                <Line
                  type="monotone"
                  dataKey="median"
                  stroke="#ff7300"
                  name="Median"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
