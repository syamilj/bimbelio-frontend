'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LoadingRetro } from '@/components/ui/loading-retro';
import html2canvas from 'html2canvas';
import { DownloadIcon, ShareIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

// Untuk contoh, pakai library react-device-detect:

import { useSession } from '@/components/provider/provider-session-auth';
import { useGet } from '@/lib/fetch-helper/useGet';
import useMedia from 'use-media';
import Certificate from './Certificate';

export default function CourseReport() {
  const isMobile = useMedia({ maxWidth: '768px' });
  const { data: session } = useSession();

  const params = useParams();
  const categoryId = Array.isArray(params?.categoryId)
    ? params.categoryId[0]
    : params?.categoryId || '';

  // const { data: courseReport, isLoading } =
  //   api.course.getReportByCategory.useQuery(
  //     { categoryId },
  //     { refetchOnWindowFocus: false },
  //   );

  const { data: courseReport, isLoading } = useGet(
    '/course/getCourseChapters',
    {
      params: { categoryId },
      useEffectDependencies: [categoryId],
    },
  );

  // State & ref
  const [isDownloading, setIsDownloading] = useState(false);

  // Refs untuk 2 versi
  const certRefPortrait = useRef<HTMLDivElement>(null);
  const certRefLandscape = useRef<HTMLDivElement>(null);

  // Di-mount, cek device
  const [usePortrait, setUsePortrait] = useState(false);

  useEffect(() => {
    setUsePortrait(isMobile);
    // atau pakai logic window.innerWidth < 768
  }, []);

  // Fungsi untuk handle download
  const handleDownload = async (mode: 'portrait' | 'landscape') => {
    setIsDownloading(true);
    try {
      let targetRef =
        mode === 'portrait'
          ? certRefPortrait.current
          : certRefLandscape.current;
      if (!targetRef) return;
      const canvas = await html2canvas(targetRef, {
        scale: 2,
        logging: false,
        useCORS: true,
      });
      const imageData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `sertifikat-${mode}.png`;
      link.click();
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Terjadi kesalahan saat mengunduh sertifikat. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Jika loading
  if (isLoading || !courseReport) {
    return <LoadingRetro />;
  }

  const { percentageProgress, tryoutResult, categoryName } = courseReport;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Judul */}
      <h1 className="text-3xl font-bold mb-6">
        Course Report: {session?.user?.name}
      </h1>

      {/* Card Overall Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="bg-gray-200 h-4 rounded-full">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: `${percentageProgress?.toFixed(2)}%` }}
            />
          </div>
          <p className="mt-2">{percentageProgress?.toFixed(2)}% Complete</p>
        </CardContent>
      </Card>

      {/* Chart Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quiz Progress</CardTitle>
          <CardDescription>
            Menampilkan total skor dari seluruh Tryout
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <ChartContainer
            config={{
              score: {
                label: 'Score',
                color: 'oklch(0.696 0.17 162.48)',
              },
            }}
            className="h-[300px] w-full min-w-[500px]"
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={tryoutResult}>
                <XAxis
                  dataKey="title"
                  stroke="#888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `Tryout: ${value}`}
                />
                <YAxis
                  stroke="#888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="oklch(0.696 0.17 162.48)"
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    fill: 'oklch(0.696 0.17 162.48)',
                    strokeWidth: 2,
                    stroke: 'oklch(0.696 0.17 162.48)',
                  }}
                  label={{
                    position: 'top',
                    fill: 'oklch(0.696 0.17 162.48)',
                    fontSize: 12,
                  }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>

        {/* Rekomendasi & Tombol Unduh Sertifikat */}
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-medium text-lg">
              Rekomendasi Pembelajaran Selanjutnya
            </h3>
            <p className="text-sm text-muted-foreground">
              Coba selesaikan Tryout lanjutan untuk meningkatkan skor.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline">
              <ShareIcon className="w-4 h-4 mr-2" />
              Bagikan
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Lihat Sertifikat
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] sm:w-[600px] md:w-[900px] max-w-[90vw] max-h-[90vh] overflow-auto">
                <DialogHeader className="justify-center flex items-center">
                  <DialogTitle>Sertifikat</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 p-4">
                  {/* 1) Versi 9:16 */}
                  <div className="border rounded p-4 flex flex-col items-center">
                    <p className="text-sm mb-2">
                      Versi Portrait (9:16)
                      {usePortrait && <span className="ml-2">(Mobile)</span>}
                    </p>
                    <div
                      ref={certRefPortrait}
                      className="w-[300px]"
                    >
                      <Certificate
                        name={session?.user?.name || 'Pengguna'}
                        courseName={categoryName}
                        aspectRatio="9-16"
                      />
                    </div>
                    <Button
                      className="mt-2"
                      onClick={() => handleDownload('portrait')}
                      disabled={isDownloading}
                    >
                      {isDownloading
                        ? 'Mengunduh...'
                        : 'Unduh Sertifikat Portrait'}
                    </Button>
                  </div>

                  {/* 2) Versi 16:9 */}
                  <div className="border rounded p-4 flex flex-col items-center">
                    <p className="text-sm mb-2">
                      Versi Landscape (16:9)
                      {!usePortrait && <span className="ml-2">(Desktop)</span>}
                    </p>
                    <div
                      ref={certRefLandscape}
                      className="w-[400px]"
                    >
                      <Certificate
                        name={session?.user?.name || 'Pengguna'}
                        courseName={categoryName}
                        aspectRatio="16-9"
                      />
                    </div>
                    <Button
                      className="mt-2"
                      onClick={() => handleDownload('landscape')}
                      disabled={isDownloading}
                    >
                      {isDownloading
                        ? 'Mengunduh...'
                        : 'Unduh Sertifikat Landscape'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// interface ChartResult {
//   id: string;
//   title: string;
//   score: number;
// }

// interface TryoutChartProps {
//   results: ChartResult[];
// }

// function TryoutChart({ results }: TryoutChartProps) {
//   // Calculate trend percentage

//   return (
//     <Card className="mb-8">
//       <CardHeader>
//         <CardTitle>Quiz Progress</CardTitle>
//         <CardDescription>Showing total scores for all quiz</CardDescription>
//       </CardHeader>
//       <CardContent className="overflow-x-auto">
//         <ChartContainer
//           config={{
//             score: {
//               label: 'Score',
//               color: 'hsl(165 60% 38%)',
//             },
//           }}
//           className="h-[300px] w-full min-w-[500px]"
//         >
//           <ResponsiveContainer
//             width="100%"
//             height="100%"
//           >
//             <LineChart data={results}>
//               <XAxis
//                 dataKey="title"
//                 stroke="#888888"
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//                 tickFormatter={(value) => `Tryout ${value}`}
//               />
//               <YAxis
//                 stroke="#888888"
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//                 tickFormatter={(value) => `${value}`}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="score"
//                 stroke="hsl(165 60% 38%)"
//                 strokeWidth={2}
//                 dot={{
//                   r: 4,
//                   fill: 'hsl(165 60% 38%)',
//                   strokeWidth: 2,
//                   stroke: 'hsl(165 60% 38%)',
//                 }}
//                 label={{
//                   position: 'top',
//                   fill: 'hsl(165 60% 38%)',
//                   fontSize: 12,
//                 }}
//               />
//               <ChartTooltip content={<ChartTooltipContent />} />
//             </LineChart>
//           </ResponsiveContainer>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }
