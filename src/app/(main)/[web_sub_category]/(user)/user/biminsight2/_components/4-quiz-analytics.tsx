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
import { QuizVolume } from '@/types/database';
import { ChevronDown, ChevronUp, HelpCircle, Target } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
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
  const { mainColor, secondaryColor } = useWebsiteSubCategory();
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
        label: sub.initial,
        color: ColorList[index % ColorList.length],
      };
    });

    return config;
  }, [SubCategory]);

  if (QuizDataIsLoading)
    return <Skeleton className="w-full h-[1200px] md:h-[670px]" />;
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

  console.log({
    lineChartData,
  });

  const displayedData = isExpanded
    ? QuizData.data
    : QuizData.data.slice(0, INITIAL_ROWS);
  const hasMoreData = QuizData.data.length > INITIAL_ROWS;

  return (
    <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
      <CardHeader
        className="pb-4 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
        }}
      >
        <div className="relative z-10">
          <CardTitle
            className="text-xl font-bold flex items-center gap-3"
            style={{ color: mainColor }}
          >
            <div
              className="w-10 h-10 rounded-3xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <HelpCircle
                className="w-5 h-5"
                style={{ color: mainColor }}
              />
            </div>
            Performa Quiz per Subkategori
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Skor total berdasarkan masing-masing quiz dan subkategorinya
          </CardDescription>
        </div>
        <div
          className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
          style={{ backgroundColor: mainColor }}
        />
      </CardHeader>

      <CardContent className="p-6">
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
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 mb-2">
            <span className="font-semibold">Keterangan Inisial:</span>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {QuizData.subCategories.map((subCat) => (
              <div
                key={subCat.id}
                className="text-xs"
              >
                <span className="font-semibold">{subCat.initial}</span> ={' '}
                {subCat.name}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: `${mainColor}08` }}>
                <TableHead className="font-bold text-gray-800 py-3">
                  Quiz
                </TableHead>
                {QuizData.subCategories.map((subCat) => (
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
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-semibold text-gray-900 py-4 whitespace-nowrap">
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
  const { mainColor, secondaryColor } = useWebsiteSubCategory();
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_ROWS = 5;

  const [selectedVolume, setSelectedVolume] = useState<QuizVolume | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

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
    return <Skeleton className="w-full h-[1200px] md:h-[670px]" />;
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

  console.log({
    lineChartData,
  });

  const displayedData = isExpanded
    ? QuizData.data
    : QuizData.data.slice(0, INITIAL_ROWS);
  const hasMoreData = QuizData.data.length > INITIAL_ROWS;

  return (
    <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
      <CardHeader
        className="pb-4 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
        }}
      >
        <div className="relative z-10">
          <CardTitle
            className="text-xl font-bold flex items-center gap-3"
            style={{ color: mainColor }}
          >
            <div
              className="w-10 h-10 rounded-3xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <HelpCircle
                className="w-5 h-5"
                style={{ color: mainColor }}
              />
            </div>
            Performa Quiz per Subkategori
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Skor total berdasarkan masing-masing quiz dan subkategorinya
          </CardDescription>
        </div>
        <div
          className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
          style={{ backgroundColor: mainColor }}
        />
      </CardHeader>

      <CardContent className="p-6">
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

            {Volumes.filter((vol) => {
              return selectedSubtests.includes(vol.volId);
              // return true;
            }).map((vol, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={vol.volId}
                stroke={vol.color}
                strokeWidth={2}
                dot={{ r: 4, fill: vol.color }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ChartContainer>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 mb-2">
            <span className="font-semibold">Keterangan Inisial:</span>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
              <TableRow style={{ backgroundColor: `${mainColor}08` }}>
                <TableHead className="font-bold text-gray-800 py-3">
                  Quiz
                </TableHead>
                {QuizData.quizVolumes.map((vol) => (
                  <TableHead
                    key={vol.volId}
                    className="font-bold text-gray-800 text-center py-3 hover:underline cursor-help"
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
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-semibold text-gray-900 py-4 whitespace-nowrap">
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
