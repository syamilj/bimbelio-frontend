'use client';

import { SectionTitle } from '@/app/(main)/[web_sub_category]/(user)/user/biminsight/_components/section-title';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGet } from '@/lib/fetch-helper/useGet';
import { getDateString, getHours } from '@/lib/utils';
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Target,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

const ColorList = [
  '#0091FF',
  '#22c55e',
  '#eab308',
  '#ef4444',
  '#6366f1',
  '#a855f7',
  '#f97316',
];
export function SectionDetail({ id }: { id: string | null }) {
  //   const { id } = useParams<{ id: string | undefined }>();
  const { mainColor, secondaryColor } = useWebsiteSubCategory();
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_ROWS = 5;

  const {
    data: TryoutData,
    isLoading: TryoutDataIsLoading,
    error: TryoutDataError,
  } = useGet<DataType>('/learningAnalytics/getAnalyticsQuizById', {
    params: {
      id: id ? id : undefined,
    },
    enabled: !!id,
    useEffectDependencies: [id],
  });

  const SubCategory = useMemo(
    () =>
      TryoutData?.subCategories.map((sub, index) => ({
        ...sub,
        color: ColorList[index % ColorList.length],
      })),
    [TryoutData?.subCategories],
  );
  const [selectedSubtests, setSelectedSubtests] = useState<string[]>([]);

  useEffect(() => {
    if (SubCategory) {
      setSelectedSubtests(SubCategory.map((sub) => sub.id));
    }
  }, [SubCategory]);

  const chartConfigBySub: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};

    SubCategory?.forEach((sub, index) => {
      config[sub.id] = {
        label: sub.initial,
        color: ColorList[index % ColorList.length],
      };
    });

    // config['userAvg'] = {
    //   label: 'Kamu',
    //   color: '#000000',
    // };

    // config['allStudentsAvg'] = {
    //   label: 'Semua Siswa',
    //   color: '#94a3b8',
    // };

    return config;
  }, [SubCategory]);

  if (!id) return <NotSelectedPage />;
  if (TryoutDataIsLoading) return <LoadingPage />;
  if (!TryoutData || !SubCategory) return null;

  const lineChartData = TryoutData.chartData;

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
    if (score >= 60) return { bg: 'bg-blue-100', text: 'text-blue-700' };
    if (score >= 40) return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
    return { bg: 'bg-red-100', text: 'text-red-700' };
  };

  const displayedData = isExpanded
    ? TryoutData.data
    : TryoutData.data.slice(0, INITIAL_ROWS);
  const hasMoreData = TryoutData.data.length > INITIAL_ROWS;

  return (
    <div>
      <SectionTitle
        icon={Target}
        title="BimArena - Tryout"
      />

      {/* Tryout Information Card */}
      <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden mb-6">
        <CardHeader
          className="pb-4 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
          }}
        >
          <div className="relative z-10">
            <CardTitle
              className="text-2xl font-bold"
              style={{ color: mainColor }}
            >
              {TryoutData.quizVolume.title || 'Kuis Tanpa Judul'}
            </CardTitle>
            {TryoutData.quizVolume.description && (
              <p className="text-gray-600 mt-2 text-sm">
                {TryoutData.quizVolume.description}
              </p>
            )}
          </div>
          <div
            className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
            style={{ backgroundColor: mainColor }}
          />
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Start Date */}
            <div className="border border-slate-200 rounded-3xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar
                  className="w-4 h-4"
                  style={{ color: mainColor }}
                />
                <p className="text-xs font-semibold text-gray-500">
                  Waktu Mulai
                </p>
              </div>
              <p className="font-medium text-gray-900">
                {getDateString(TryoutData.quizVolume.startDate)}
              </p>
              <p className="text-sm text-gray-600">
                {getHours(TryoutData.quizVolume.startDate)}
              </p>
            </div>

            {/* End Date */}
            <div className="border border-slate-200 rounded-3xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar
                  className="w-4 h-4"
                  style={{ color: mainColor }}
                />
                <p className="text-xs font-semibold text-gray-500">
                  Waktu Selesai
                </p>
              </div>
              <p className="font-medium text-gray-900">
                {getDateString(TryoutData.quizVolume.endDate)}
              </p>
              <p className="text-sm text-gray-600">
                {getHours(TryoutData.quizVolume.endDate)}
              </p>
            </div>

            {/* Total Subscribers */}
            <div className="border border-slate-200 rounded-3xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users
                  className="w-4 h-4"
                  style={{ color: mainColor }}
                />
                <p className="text-xs font-semibold text-gray-500">
                  Total Pendaftar
                </p>
              </div>
              <p className="font-medium text-gray-900">
                {TryoutData.quizVolume.totalUserSubscribed || 0}
              </p>
              <p className="text-sm text-gray-600">Peserta</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-700">
              Grafik Skor & Trend
            </h3>
            <ChartContainer
              config={chartConfigBySub}
              className="h-[280px] md:h-[350px] w-full"
            >
              <LineChart
                data={lineChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="volume"
                  tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />

                {SubCategory.filter((sub) => {
                  return selectedSubtests.includes(sub.id);
                  // return true;
                }).map((sub, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={sub.id}
                    stroke={sub.color}
                    strokeWidth={2}
                    dot={{ r: 4, fill: sub.color }}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ChartContainer>
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow style={{ backgroundColor: `${mainColor}08` }}>
                    <TableHead className="font-bold text-gray-800 py-3">
                      Quiz
                    </TableHead>
                    {SubCategory.map((subCat) => (
                      <TableHead
                        key={subCat.id}
                        className="font-bold text-gray-800 text-center py-3 hover:underline cursor-help"
                        title={subCat.name}
                      >
                        {subCat.initial}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={TryoutData.data.length + 1}
                        className="text-center py-8 text-gray-500"
                      >
                        <p className="text-sm">Data belum ada</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedData.map((quiz) => (
                      <TableRow
                        key={quiz.title}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="font-semibold text-gray-900 py-4 whitespace-nowrap">
                          {quiz.title}
                        </TableCell>
                        {SubCategory.map((subCat) => {
                          const subCatData = quiz.subCategories.find(
                            (s) => s.subId === subCat.id,
                          );

                          if (!subCatData) {
                            return (
                              <TableCell
                                key={`${quiz.id}-${subCat.id}`}
                                className="text-center py-4"
                              >
                                -
                              </TableCell>
                            );
                          }
                          const score = subCatData?.totalScore || 0;
                          const badgeColor = getScoreBadgeColor(score);

                          return (
                            <TableCell
                              key={`${quiz.id}-${subCat.id}`}
                              className="text-center py-4"
                            >
                              <Badge
                                className={`${badgeColor.bg} ${badgeColor.text} border-0 font-semibold`}
                              >
                                {score.toFixed(2)}
                              </Badge>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          {hasMoreData && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                variant="outline"
                className="gap-2"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Tampilkan Lebih Sedikit
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Lihat Semua ({TryoutData.data.length})
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const NotSelectedPage = () => {
  const { mainColor, secondaryColor } = useWebsiteSubCategory();
  return (
    <div>
      <SectionTitle
        icon={Target}
        title="BimArena - Tryout"
      />
      <div className="space-y-6">
        <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center gap-6 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${mainColor}15` }}
              >
                <Target
                  className="w-10 h-10"
                  style={{ color: mainColor }}
                />
              </div>
              <div className="space-y-2">
                <h3
                  className="text-2xl font-bold"
                  style={{ color: mainColor }}
                >
                  Pilih Tryout untuk Dianalisis
                </h3>
                <p className="text-gray-600 text-lg">
                  Klik tombol "Lihat Detail" di daftar tryout untuk melihat
                  analitik dan statistik tryout.
                </p>
              </div>
              <div className="pt-6">
                <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-3xl">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    Scroll ke atas untuk memilih tryout dari daftar yang
                    tersedia.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const LoadingPage = () => {
  return (
    <div>
      <SectionTitle
        icon={Target}
        title="BimArena - Tryout"
      />
      <Skeleton className="w-full h-[400px] rounded-3xl mb-6" />
      <Skeleton className="w-full h-[500px] rounded-3xl" />
    </div>
  );
};

type DataType = {
  quizVolume: {
    id: string;
    title: string | null;
    description: string | null;
    startDate: Date;
    endDate: Date;
    totalUserSubscribed: number;
  };
  subCategories: {
    initial: string;
    id: string;
    name: string;
    categoryId: string;
    website_sub_category_id: string;
  }[];
  data: {
    id: string;
    title: string | null;
    subCategories: {
      isActive: undefined;
      subId: string;
      subName: string;
      subNumber: string;
      totalScore: number;
    }[];
  }[];
  chartData: Record<string, string | number>[];
};
