'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { getSubtestLabel } from '@/lib/utils/subtest';
import { ChevronDown, ChevronUp, HelpCircle, Target } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { SectionTitle } from './section-title';

const ColorList = [
  '#0091FF',
  '#22c55e',
  '#eab308',
  '#ef4444',
  '#6366f1',
  '#a855f7',
  '#f97316',
];

export const QuizAnalyticsTable = () => {
  return (
    <div>
      <SectionTitle
        icon={Target}
        title="BimArena - Quiz"
      />
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="quiz">Per Volume</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ByAllTab />
        </TabsContent>

        <TabsContent value="quiz">
          <ByVolumeTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ByAllTab = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const { mainColor } = useWebsiteSubCategory();
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_ROWS = 5;

  const {
    data: QuizData,
    isLoading: QuizDataIsLoading,
    error: QuizDataError,
  } = useGet<DataTypeAll>('/learningAnalytics/getUserAnalyticsQuiz', {
    params: {
      userId: id ? id : undefined,
    },
    useEffectDependencies: [id],
  });

  const SubCategory = useMemo(
    () =>
      QuizData?.subCategories.map((sub, index) => ({
        ...sub,
        color: ColorList[index % ColorList.length],
      })),
    [QuizData?.subCategories],
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
        label: getSubtestLabel(sub.name, sub.website_sub_category_id),
        color: ColorList[index % ColorList.length],
      };
    });

    return config;
  }, [SubCategory]);

  if (QuizDataIsLoading)
    return <Skeleton className="w-full h-[400px] rounded-3xl" />;
  if (!QuizData || !SubCategory) return null;

  if (QuizDataError) {
    return <div>Error: {QuizDataError.message}</div>;
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
    if (score >= 60) return { bg: 'bg-blue-100', text: 'text-blue-700' };
    if (score >= 40) return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
    return { bg: 'bg-red-100', text: 'text-red-700' };
  };
  const lineChartData = QuizData.chartData;

  const displayedData = isExpanded
    ? QuizData.data
    : QuizData.data.slice(0, INITIAL_ROWS);
  const hasMoreData = QuizData.data.length > INITIAL_ROWS;

  return (
    <Card className="w-full border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-3xl flex items-center justify-center"
            style={{ backgroundColor: mainColor }}
          >
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-black text-slate-800">Performa Quiz per Subkategori</CardTitle>
            <CardDescription>Skor berdasarkan masing-masing quiz dan subkategorinya</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: 'none' }}>
          <div className="flex gap-1.5 min-w-max flex-wrap">
            {SubCategory.map((sub, index) => (
              <button
                key={index}
                onClick={() => setSelectedSubtests(prev => prev.includes(sub.id) ? prev.filter(c => c !== sub.id) : [...prev, sub.id])}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all border flex-shrink-0 ${selectedSubtests.includes(sub.id) ? 'text-white border-transparent' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}
                style={selectedSubtests.includes(sub.id) ? { backgroundColor: sub.color } : {}}
              >
                {getSubtestLabel(sub.name, sub.website_sub_category_id)}
              </button>
            ))}
          </div>
        </div>
        <ChartContainer
          config={chartConfigBySub}
          className="h-[240px] md:h-[280px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={lineChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
              />
              <XAxis
                interval={0}
                angle={-20}
                textAnchor="end"
                height={50}
                dataKey="volume"
                tick={{ fontSize: 10, fill: '#6B7280' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />

              {SubCategory.filter((sub) => selectedSubtests.includes(sub.id)).map((sub, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={sub.id}
                  stroke={sub.color}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: sub.color, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: sub.color, stroke: '#fff', strokeWidth: 2 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 mb-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
          <p className="text-xs font-bold text-slate-700 mb-2">Keterangan Inisial:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
            {QuizData.subCategories.map((subCat) => (
              <div
                key={subCat.id}
                className="text-xs"
              >
                <span className="font-semibold">{getSubtestLabel(subCat.name, subCat.website_sub_category_id)}</span> ={' '}
                {subCat.name}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-bold text-slate-700 py-3">
                  Quiz
                </TableHead>
                {QuizData.subCategories.map((subCat) => (
                  <TableHead
                    key={subCat.id}
                    className="font-bold text-slate-700 text-center py-3 hover:underline cursor-help"
                    title={subCat.name}
                  >
                    {getSubtestLabel(subCat.name, subCat.website_sub_category_id)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={QuizData.subCategories.length + 1}
                    className="text-center py-8 text-gray-500"
                  >
                    <p className="text-sm">Data belum ada</p>
                  </TableCell>
                </TableRow>
              ) : (
                displayedData.map((quiz) => (
                  <TableRow
                    key={quiz.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <TableCell className="font-semibold text-slate-800 py-4 whitespace-nowrap">
                      {quiz.title}
                    </TableCell>
                    {QuizData.subCategories.map((subCat) => {
                      const subCatData = quiz.subCategories.find(
                        (s) => s.id === subCat.id,
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

                      const score = subCatData?.averageScore || 0;
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
                  Lihat Semua ({QuizData.data.length})
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ByVolumeTab = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const { mainColor } = useWebsiteSubCategory();
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_ROWS = 5;

  const {
    data: QuizData,
    isLoading: QuizDataIsLoading,
    error: QuizDataError,
  } = useGet<DataTypeQuiz>('/learningAnalytics/getUserAnalyticsQuizPerVolume', {
    params: {
      userId: id ? id : undefined,
    },
    useEffectDependencies: [id],
  });
  const Volumes = useMemo(
    () =>
      QuizData?.quizVolumes.map((vol, index) => ({
        ...vol,
        color: ColorList[index % ColorList.length],
      })),
    [QuizData?.quizVolumes],
  );
  const [selectedSubtests, setSelectedSubtests] = useState<string[]>([]);

  useEffect(() => {
    if (Volumes) {
      setSelectedSubtests(Volumes.map((vol) => vol.volId));
    }
  }, [Volumes]);

  const chartConfigBySub: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};

    Volumes?.forEach((vol, index) => {
      config[vol.volId] = {
        label: vol.initial,
        color: ColorList[index % ColorList.length],
      };
    });

    return config;
  }, [Volumes]);

  if (QuizDataIsLoading)
    return <Skeleton className="w-full h-[400px] rounded-3xl" />;
  if (!QuizData || !Volumes) return null;

  if (QuizDataError) {
    return <div>Error: {QuizDataError.message}</div>;
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
    if (score >= 60) return { bg: 'bg-blue-100', text: 'text-blue-700' };
    if (score >= 40) return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
    return { bg: 'bg-red-100', text: 'text-red-700' };
  };
  const lineChartData = QuizData.chartData;

  const displayedData = isExpanded
    ? QuizData.data
    : QuizData.data.slice(0, INITIAL_ROWS);
  const hasMoreData = QuizData.data.length > INITIAL_ROWS;

  return (
    <Card className="w-full border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-3xl flex items-center justify-center"
            style={{ backgroundColor: mainColor }}
          >
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-black text-slate-800">Performa Quiz per Volume</CardTitle>
            <CardDescription>Skor berdasarkan masing-masing quiz dan volume-nya</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: 'none' }}>
          <div className="flex gap-1.5 min-w-max flex-wrap">
            {Volumes.map((vol, index) => (
              <button
                key={index}
                onClick={() => setSelectedSubtests(prev => prev.includes(vol.volId) ? prev.filter(c => c !== vol.volId) : [...prev, vol.volId])}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all border flex-shrink-0 ${selectedSubtests.includes(vol.volId) ? 'text-white border-transparent' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}
                style={selectedSubtests.includes(vol.volId) ? { backgroundColor: vol.color } : {}}
              >
                {vol.initial}
              </button>
            ))}
          </div>
        </div>
        <ChartContainer
          config={chartConfigBySub}
          className="h-[240px] md:h-[280px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={lineChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
              />
              <XAxis
                interval={0}
                angle={-20}
                textAnchor="end"
                height={50}
                dataKey="volume"
                tick={{ fontSize: 10, fill: '#6B7280' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />

              {Volumes.filter((vol) => selectedSubtests.includes(vol.volId)).map((vol, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={vol.volId}
                  stroke={vol.color}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: vol.color, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: vol.color, stroke: '#fff', strokeWidth: 2 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 mb-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
          <p className="text-xs font-bold text-slate-700 mb-2">Keterangan Inisial:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
            {QuizData.quizVolumes.map((vol) => (
              <div
                key={vol.volId}
                className="text-xs"
              >
                <span className="font-semibold">{vol.initial}</span> ={' '}
                {vol.volName}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-bold text-slate-700 py-3">
                  Quiz
                </TableHead>
                {QuizData.quizVolumes.map((vol) => (
                  <TableHead
                    key={vol.volId}
                    className="font-bold text-slate-700 text-center py-3 hover:underline cursor-help"
                    title={vol.volName || ''}
                  >
                    {vol.initial}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={QuizData.quizVolumes.length + 1}
                    className="text-center py-8 text-gray-500"
                  >
                    <p className="text-sm">Data belum ada</p>
                  </TableCell>
                </TableRow>
              ) : (
                displayedData.map((quiz) => (
                  <TableRow
                    key={quiz.title}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <TableCell className="font-semibold text-slate-800 py-4 whitespace-nowrap">
                      {quiz.title}
                    </TableCell>
                    {QuizData.quizVolumes.map((vol) => {
                      const volData = quiz.quizVolume.find(
                        (s) => s.volId === vol.volId,
                      );

                      if (!volData) {
                        return (
                          <TableCell
                            key={`${quiz.title}-${vol.volId}`}
                            className="text-center py-4"
                          >
                            -
                          </TableCell>
                        );
                      }

                      const score = volData?.totalScore || 0;
                      const badgeColor = getScoreBadgeColor(score);

                      return (
                        <TableCell
                          key={`${quiz.title}-${vol.volId}`}
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
                  Lihat Semua ({QuizData.data.length})
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

type DataTypeAll = {
  subCategories: {
    name: string;
    initial: string;
    website_sub_category_id: string;
    id: string;
    categoryId: string;
  }[];
  data: {
    id: string;
    title: string;
    subCategories: {
      id: string;
      name: string;
      initial: string;
      totalScore: number;
      averageScore: number;
    }[];
  }[];
  chartData: Record<string, string | number>[];
};

type DataTypeQuiz = {
  quizVolumes: {
    volId: string;
    volName: string | null;
    volNumber: number;
    initial: string;
  }[];
  data: {
    title: string;
    quizVolume: {
      isActive: undefined;
      volId: string;
      volName: string | null;
      volNumber: number;
      totalScore: number;
    }[];
  }[];
  chartData: Record<string, string | number>[];
};
