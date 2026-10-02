'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useGet } from '@/lib/fetch-helper/useGet';
import { hexToRgba } from '@/lib/theme/track-theme';
import { cn } from '@/lib/utils';
import { IconCrown } from '@/styles/icon';
import {
  Prediction,
  PredictionScore,
  PredictionScoreDetail,
  Tryout,
} from '@/types/database';
import { Calculator, Target } from 'lucide-react';
import Link from 'next/link';
import ExampleResult from './[predictionId]/_components/example-result';
import { useProvider } from './_provider/provider';

export default function UTBKSIMAKPredictor() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { setCurrentStep } = useProvider();

  const { data: history, isLoading: historyIsLoading } = useGet<
    (Prediction & {
      Tryout: Tryout;
      PredictionScore: (PredictionScore & {
        PredictionScoreDetail: PredictionScoreDetail[];
      })[];
    })[]
  >('/prediction/getPredictionHistroty');

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto flex flex-col gap-4 px-4 py-8">
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-main">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Sistem Prediksi Kelulusan
            </h1>
            <h2 className="mb-4 text-lg font-semibold text-main">
              UTBK + SIMAK UI
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Hitung kemungkinan kelulusan seleksi masuk UI dengan menggabungkan
              nilai UTBK (50%) dan SIMAK UI (50%)
            </p>
          </div>

          <Card
            className="mt-0 rounded-3xl border border-r-0 border-l-4 border-main"
            // style={{
            //   boxShadow: `0px 0px 10px ${websiteSubCategory?.main_color}`,
            // }}
          >
            <CardHeader className="p-3">
              <Card
                className="animate-fade-in-up relative overflow-hidden rounded-3xl border-none py-8 text-white"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${websiteSubCategory?.main_color}, ${hexToRgba(websiteSubCategory?.main_color, 0.3)}, ${websiteSubCategory?.secondary_color})`,
                }}
              >
                {/* Background Icon Dekoratif */}
                <div className="absolute -top-10 -right-10 scale-150 rotate-12 opacity-20">
                  <Calculator className="h-48 w-48" />
                </div>

                {/* Sparkles Animated Background */}
                <div className="animate-pulse-slow absolute inset-0 bg-[url('/sparkle.svg')] bg-cover opacity-10" />

                <CardHeader className="relative z-10 text-center">
                  <CardTitle className="text-3xl font-extrabold drop-shadow-lg">
                    🚀 Mulai Prediksi Kelulusanmu!
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative z-10">
                  <p className="mx-auto mb-6 max-w-md text-center text-base font-medium drop-shadow-lg">
                    Gabungkan nilai UTBK & SIMAK UI, dan lihat seberapa besar
                    peluangmu masuk UI!
                  </p>
                  <div className="flex justify-center">
                    <Link href={'prediction/step?step=new'}>
                      <Button
                        className="animate-pulse-fast relative rounded-full bg-white px-8 py-3 font-extrabold text-main shadow-xl transition-transform hover:scale-105 hover:text-white"
                        onClick={() => setCurrentStep(1)}
                      >
                        🎯 Mulai Sekarang
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </CardHeader>
          </Card>

          <div
            className={cn(
              'flex flex-col gap-4',
              historyIsLoading === false && history?.length === 0 && 'hidden',
            )}
          >
            <h1 className="text-[1.4rem] font-semibold">Riwayat</h1>
            <div className="grid grid-cols-1 gap-4 md2:grid-cols-3 xxxl:grid-cols-4">
              {history?.map((hItem, hIndex) => (
                <Card
                  key={hIndex}
                  className="relative overflow-hidden shadow-lg"
                >
                  <div className="absolute -right-8 bottom-8 z-1 text-main/20">
                    <IconCrown
                      w={180}
                      className="rotate-[-20deg]"
                    />
                  </div>
                  {hItem.Tryout && (
                    <Badge
                      className={cn(
                        'absolute top-4 right-4 bg-main text-white',
                      )}
                    >
                      {hItem.Tryout.title}
                    </Badge>
                  )}
                  <CardHeader className="relative z-2">
                    <CardTitle className="text-[1.3rem] font-bold text-main">
                      {hItem.study}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-2">
                    <div className="grid gap-2">
                      {hItem.PredictionScore.map((psItem, psIndex) => (
                        <div
                          key={psIndex}
                          className="mb-2"
                        >
                          <div className="mb-2 flex w-full items-center justify-between">
                            <h3 className="text-lg font-semibold">
                              {psItem.type.replace('_', ' ')}
                            </h3>
                            <h3 className="text-lg font-semibold text-green-600">
                              {psItem.finalScore.toFixed(2)}
                            </h3>
                          </div>

                          {psItem.PredictionScoreDetail.map((psdItem) => (
                            <div
                              key={psdItem.id}
                              className="mb-2 flex items-center justify-between"
                            >
                              <div className="ml-2 flex items-center">
                                <span className="text-sm">
                                  {psdItem.subCategory}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {psdItem.score}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="relative z-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={`prediction/${hItem.id}`}
                            className="w-full"
                          >
                            <Button
                              className={cn(
                                'bg-gradient w-full text-white md:hover:opacity-90',
                              )}
                            >
                              Lihat hasil
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          Lanjutkan tryout PTN dan Kedinasan yang sedang
                          berlangsung.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {historyIsLoading && (
              <div className="grid grid-cols-1 gap-4 md2:grid-cols-3 xxxl:grid-cols-4">
                {Array.from({ length: 6 }).map((_: any, i: number) => (
                  <Skeleton
                    key={i}
                    className={
                      'h-[360px] mb:h-[400px] md2:h-[380px] xxxl:h-[500px] md:h-[400px] xl:h-[450px]'
                    }
                  />
                ))}
              </div>
            )}
          </div>
          <Card
            className="mt-4 rounded-3xl border border-r-0 border-l-4 border-main"
            // style={{
            //   boxShadow: `0px 0px 10px ${websiteSubCategory?.main_color}`,
            // }}
          >
            <CardHeader className="p-3">
              <Card
                className="animate-fade-in-up relative overflow-hidden rounded-3xl border-none py-8 text-white"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${websiteSubCategory?.main_color}, ${hexToRgba(websiteSubCategory?.main_color, 0.3)}, ${websiteSubCategory?.secondary_color})`,
                }}
              >
                {/* Background Icon Dekoratif */}
                <div className="absolute -top-10 -right-10 scale-150 rotate-12 opacity-20">
                  <Target className="h-48 w-48" />
                </div>

                {/* Sparkles Animated Background */}
                <div className="animate-pulse-slow absolute inset-0 bg-[url('/sparkle.svg')] bg-cover opacity-10" />

                <CardHeader className="relative z-10 text-center">
                  <CardTitle className="text-3xl font-extrabold drop-shadow-lg">
                    🎓 Contoh Hasil Prediksi Kelulusan
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative z-10">
                  <p className="mx-auto mb-6 max-w-md text-center text-base font-medium drop-shadow-lg">
                    Begini gambaran hasil akhir yang akan kamu dapatkan setelah
                    mengisi data prediksi. Yuk lihat seperti apa skornya!
                  </p>
                </CardContent>
              </Card>
            </CardHeader>

            <CardContent className="pt-4 shadow-lg">
              <ExampleResult />
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}

/*

    <Card key={i} className="relative overflow-hidden">
            <div className="absolute bottom-8 -right-8 z-1 text-main/20">
              <IconCrown w={180} className="rotate-[-20deg]" />
            </div>
            <Badge
              className={cn(
                "absolute right-4 top-4 bg-main text-white",
                getBadgeValue(item)?.className
              )}
            >
              {getBadgeValue(item)?.title}
            </Badge>
            <CardHeader className="relative z-2">
              <CardTitle className="text-[1.3rem] font-bold text-main">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-2">
              <div className="grid gap-2">
                {(() => {
                  // Mengelompokkan sesi berdasarkan kategori
                  const groupedSessions = item.TryoutSession.reduce(
                    (groups, session) => {
                      const categoryName = session.TryoutCategory.name;
                      if (!groups[categoryName]) {
                        groups[categoryName] = [];
                      }
                      groups[categoryName].push(session);
                      return groups;
                    },
                    {} as { [key: string]: (typeof item.TryoutSession)[0][] }
                  );

                  // Mengurutkan kategori sesuai dengan urutan yang diinginkan
                  const orderedCategories = [
                    "Tes Potensi Skolastik (TPS)",
                    "Tes Literasi",
                    "Tes Penalaran Matematika",
                  ];

                  return orderedCategories
                    .filter((category) => groupedSessions[category]) // Hanya kategori yang ada
                    .map((categoryName) => (
                      <div key={categoryName} className="mb-2">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold">
                            {categoryName}:
                          </h3>
                        </div>

                        {groupedSessions[categoryName].map((session, index) => (
                          <div
                            key={session.id || index} // Pastikan setiap sesi memiliki id unik
                            className="flex justify-between items-center mb-2"
                          >
                            <div className="flex items-center ml-2">
                              <span className="text-sm">
                                - {session.TryoutSubCategory.name}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {session.duration} menit
                            </span>
                          </div>
                        ))}
                      </div>
                    ));
                })()}
                <div className="flex items-center gap-2">
                  <IconQuiz w={16} className="text-black/80" />
                  <span className="text-sm font-semibold">
                    {item.TryoutSession.reduce(
                      (acc, session) => acc + session._count.TryoutQuestion,
                      0
                    )}{" "}
                    Soal
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <IconUserAdmin w={16} className="text-black/80" />
                  <span className="text-sm font-semibold">
                    {item._count.TryoutRegistration} Pendaftar
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-main-gray-text" />
                  <span className="text-sm font-semibold">
                    {`${getHours(item.startDate)}, ${getDateStringShort(
                      item.startDate
                    )}`}{" "}
                    -{" "}
                    {`${getHours(item.endDate)}, ${getDateStringShort(
                      item.endDate
                    )}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <IconTimer2 w={16} className="text-black/80" />
                  <span className="text-sm font-semibold">
                    {getTimer(item.startDate, item)?.value}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="relative z-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className={cn(
                        "w-full bg-gradientGreen text-white md:hover:bg-gradientGreenHover",
                        getButtonValue(item)?.className
                      )}
                      onClick={() => {
                        setShowDetail(item);
                      }}
                    >
                      {getButtonValue(item)?.title}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {item.status === "ongoing"
                      ? "Lanjutkan tryout PTN dan Kedinasan yang sedang berlangsung."
                      : "Daftar untuk mengikuti tryout PTN dan Kedinasan ini."}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardFooter>
          </Card>
*/
