'use client';

import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Download,
  Search,
  Trophy,
} from 'lucide-react';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// import AbsoluteLoader from '@/components/ui/loading/absolute-loader';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { FetchReturnType, useGet } from '@/lib/fetch-helper/useGet';
import { getDate, getDateStringShort } from '@/lib/utils';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import ExcelJS from 'exceljs';
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from 'recharts';

export const SectionPerformance = () => {
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [endDate, setEndDate] = useState<Date>(new Date());

  const fetchingData = useGet<DataType>(
    '/learningAnalytics/getAnalyticsTryout',
    {
      debounceTime: 300,
      params: {
        from: startDate,
        to: endDate,
      },
      useEffectDependencies: [startDate, endDate],
    },
  );

  const { error: TryoutDataError } = fetchingData;

  if (TryoutDataError) {
    return <div>Error: {TryoutDataError.message}</div>;
  }

  return (
    <div>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="subcategory">Per Subtest</TabsTrigger>
        </TabsList>
        <TabsContent value="subcategory">
          <BySubCategoryTab
            fetchingData={fetchingData}
            endDate={endDate}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            startDate={startDate}
          />
        </TabsContent>

        <TabsContent value="all">
          <ByAllTab
            fetchingData={fetchingData}
            endDate={endDate}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            startDate={startDate}
          />
        </TabsContent>
      </Tabs>
      <Detail
        fetchingData={fetchingData}
        endDate={endDate}
        startDate={startDate}
      />
    </div>
  );
};

const ByAllTab = ({
  fetchingData,
  endDate,
  startDate,
  setEndDate,
  setStartDate,
}: {
  fetchingData: FetchReturnType<DataType, any>;
  startDate: Date;
  endDate: Date;
  setStartDate: Dispatch<SetStateAction<Date>>;
  setEndDate: Dispatch<SetStateAction<Date>>;
}) => {
  const { mainColor, secondaryColor } = useWebsiteSubCategory();
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    data: TryoutData,
    isLoading: TryoutDataIsLoading,
    error: TryoutDataError,
  } = fetchingData;

  const performanceAll = TryoutData?.overall.summary.list;

  const chartData = useMemo(() => {
    return performanceAll?.map((item, index) => ({
      index: index + 1,
      name: `TO ${index + 1}`,
      score: item.score,
      title: item.tryoutTitle,
      date: item.date,
      // Calculate trend line (simple linear regression)
      trend:
        performanceAll.length > 1
          ? ((performanceAll[performanceAll.length - 1].score -
              performanceAll[0].score) /
              (performanceAll.length - 1)) *
              index +
            performanceAll[0].score
          : item.score,
    }));
  }, [performanceAll]);

  if (TryoutDataIsLoading)
    return <Skeleton className="w-full h-[1200px] md:h-[670px]" />;

  if (!TryoutData || !performanceAll) return null;

  if (TryoutDataError) {
    return <div>Error: {TryoutDataError.message}</div>;
  }

  const INITIAL_ROWS = 5;
  const performanceAllStats = TryoutData.overall.summary.stats;

  const chartConfig = {
    score: {
      label: 'Skor',
      color: mainColor,
    },
    trend: {
      label: 'Trend',
      color: '#94a3b8',
    },
  };

  const displayedData = isExpanded
    ? performanceAll
    : performanceAll.slice(-INITIAL_ROWS);

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
              <BookOpen
                className="w-5 h-5"
                style={{ color: mainColor }}
              />
            </div>
            Performa Tryout
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Skor total berdasarkan masing-masing tryout
          </CardDescription>
        </div>
        <div className="flex w-full justify-end">
          <DateRangePicker
            align="end"
            initialDateFrom={startDate}
            initialDateTo={endDate}
            onUpdate={(value) => {
              console.log({ value });
              if (value.range.from) {
                setStartDate(value.range.from);
              }
              if (value.range.to) {
                setEndDate(value.range.to);
              }
            }}
            className="w-fit border-2"
            style={{
              borderColor: `${mainColor}30`,
              backgroundColor: `${mainColor}05`,
            }}
          />
        </div>
        <div
          className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
          style={{ backgroundColor: mainColor }}
        />
      </CardHeader>

      <CardContent className="p-6">
        {performanceAll.length > 0 ? (
          <div className="space-y-6">
            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-3xl border-2 border-emerald-100 bg-emerald-50">
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">
                  Rata-rata
                </div>
                <div className="text-2xl font-black text-emerald-700">
                  {performanceAllStats.avg}
                </div>
              </div>
              <div className="p-4 rounded-3xl border-2 border-blue-100 bg-blue-50">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">
                  Tertinggi
                </div>
                <div className="text-2xl font-black text-blue-700 flex items-center gap-1">
                  <Trophy className="w-5 h-5" />
                  {performanceAllStats.highest}
                </div>
              </div>
              <div className="p-4 rounded-3xl border-2 border-slate-100 bg-slate-50">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                  Terendah
                </div>
                <div className="text-2xl font-black text-slate-700">
                  {performanceAllStats.lowest}
                </div>
              </div>
            </div>

            {/* Score Line Chart with Trend */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-700">
                Grafik Skor & Trend
              </h3>
              <ChartContainer
                config={chartConfig}
                className="h-[250px] w-full"
              >
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="scoreGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={mainColor}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={mainColor}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-slate-200"
                  />
                  <XAxis
                    dataKey="name"
                    className="text-xs"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    domain={[
                      performanceAllStats.lowest - 50,
                      performanceAllStats.highest + 50,
                    ]}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />

                  {/* Trend Line (dashed) */}
                  <Line
                    type="monotone"
                    dataKey="trend"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Trend"
                  />

                  {/* Score Area */}
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke={mainColor}
                    strokeWidth={3}
                    fill="url(#scoreGradient)"
                    name="Skor"
                  />
                </AreaChart>
              </ChartContainer>
            </div>

            {/* Combined Score & Ranking History */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-700">
                Riwayat Skor & Peringkat
              </h3>
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow style={{ backgroundColor: `${mainColor}08` }}>
                      <TableHead className="font-bold text-gray-800 py-3">
                        TO
                      </TableHead>
                      <TableHead className="font-bold text-gray-800 py-3">
                        Nama Tryout
                      </TableHead>
                      <TableHead className="font-bold text-gray-800 text-center py-3">
                        Tanggal
                      </TableHead>
                      <TableHead className="font-bold text-gray-800 text-center py-3">
                        Skor
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...displayedData].reverse().map((item, index) => {
                      return (
                        <TableRow
                          key={index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <TableCell className="font-semibold text-gray-900 py-4">
                            TO {performanceAll.length - index}
                          </TableCell>
                          <TableCell className="font-semibold text-gray-900 py-4">
                            {item.tryoutTitle}
                          </TableCell>
                          <TableCell className="text-center py-4 text-sm text-gray-600">
                            {format(new Date(item.date), 'dd MMM yyyy', {
                              locale: localeId,
                            })}
                          </TableCell>
                          <TableCell className="text-center py-4">
                            <div
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold"
                              style={{
                                backgroundColor: `${mainColor}15`,
                                color: mainColor,
                              }}
                            >
                              {Math.round(item.score)}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {performanceAll.length > INITIAL_ROWS && (
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
                        Lihat Semua ({performanceAll.length})
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            {/* <div className="w-32 h-32 mx-auto mb-3">
                    <EmptyStateIllustrations.NoPerformance />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-2">
                    {searchQuery ? "Tidak ada hasil" : "Belum Ada Data Performa"}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    {searchQuery ? "Coba kata kunci lain" : <>Selesaikan <BimArena /> untuk melihat grafik performa</>}
                  </p> */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const BySubCategoryTab = ({
  fetchingData,
  endDate,
  startDate,
  setEndDate,
  setStartDate,
}: {
  fetchingData: FetchReturnType<DataType, any>;
  startDate: Date;
  endDate: Date;
  setStartDate: Dispatch<SetStateAction<Date>>;
  setEndDate: Dispatch<SetStateAction<Date>>;
}) => {
  const { mainColor, secondaryColor } = useWebsiteSubCategory();
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    data: TryoutData,
    isLoading: TryoutDataIsLoading,
    error: TryoutDataError,
  } = fetchingData;

  if (TryoutDataIsLoading)
    return <Skeleton className="w-full h-[1200px] md:h-[670px]" />;

  if (!TryoutData) return null;

  if (TryoutDataError) {
    return <div>Error: {TryoutDataError.message}</div>;
  }

  const INITIAL_ROWS = 5;

  const performanceBySubCategory = TryoutData.bySubCategory;

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
    if (score >= 60) return { bg: 'bg-blue-100', text: 'text-blue-700' };
    if (score >= 40) return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
    return { bg: 'bg-red-100', text: 'text-red-700' };
  };

  const displayedData = isExpanded
    ? performanceBySubCategory.data
    : performanceBySubCategory.data.slice(0, INITIAL_ROWS);
  const hasMoreData = performanceBySubCategory.data.length > INITIAL_ROWS;
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
              <BookOpen
                className="w-5 h-5"
                style={{ color: mainColor }}
              />
            </div>
            Performa Tryout per Subkategori
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Skor total berdasarkan masing-masing tryout dan subkategorinya
          </CardDescription>
        </div>
        <div className="flex w-full justify-end">
          <DateRangePicker
            align="end"
            initialDateFrom={startDate}
            initialDateTo={endDate}
            onUpdate={(value) => {
              console.log({ value });
              if (value.range.from) {
                setStartDate(value.range.from);
              }
              if (value.range.to) {
                setEndDate(value.range.to);
              }
            }}
            className="w-fit border-2"
            style={{
              borderColor: `${mainColor}30`,
              backgroundColor: `${mainColor}05`,
            }}
          />
        </div>
        <div
          className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
          style={{ backgroundColor: mainColor }}
        />
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-3xl">
          <p className="text-sm text-blue-700 mb-2">
            <span className="font-semibold">Keterangan Inisial:</span>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {performanceBySubCategory.subCategories.map((subCat) => (
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
                  Tryout
                </TableHead>
                <TableHead className="font-bold text-gray-800 py-3 text-center">
                  Final Score
                </TableHead>
                {performanceBySubCategory.subCategories.map((subCat) => (
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
                    colSpan={performanceBySubCategory.subCategories.length + 2}
                    className="text-center py-8 text-gray-500"
                  >
                    <p className="text-sm">Data belum ada</p>
                  </TableCell>
                </TableRow>
              ) : (
                displayedData.map((tryout) => (
                  <TableRow
                    key={tryout.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-semibold text-gray-900 py-4 whitespace-nowrap">
                      {tryout.title}
                    </TableCell>
                    <TableCell className="text-center py-4">
                      {tryout.totalScore.toFixed(2)}
                    </TableCell>
                    {performanceBySubCategory.subCategories.map((subCat) => {
                      const subCatData = tryout.subCategories.find(
                        (s) => s.id === subCat.id,
                      );
                      const score = subCatData?.totalScore || 0;
                      const badgeColor = getScoreBadgeColor(score);

                      return (
                        <TableCell
                          key={`${tryout.id}-${subCat.id}`}
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
                  Lihat Semua ({performanceBySubCategory.data.length})
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Detail = ({
  fetchingData,
  endDate,
  startDate,
}: {
  fetchingData: FetchReturnType<DataType, any>;
  startDate: Date;
  endDate: Date;
}) => {
  const { mainColor, secondaryColor } = useWebsiteSubCategory();
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nama');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedTryout, setSelectedTryout] = useState<string>('all');

  const {
    data: TryoutData,
    isLoading: TryoutDataIsLoading,
    error: TryoutDataError,
  } = fetchingData;

  if (TryoutDataIsLoading)
    return <Skeleton className="w-full h-[800px] mt-6" />;

  if (!TryoutData) return null;

  if (TryoutDataError) {
    return <div>Error: {TryoutDataError.message}</div>;
  }

  const listTryout = TryoutData.overall.detail.listTryout;
  const listUsers = TryoutData.overall.detail.listUser;

  const filteredListTryout = listTryout.filter((tryout) => {
    if (selectedTryout === 'all') return true;
    return tryout.id === selectedTryout;
  });

  const filteredListUsers = listUsers
    .filter((user) => {
      if (selectedTryout !== 'all') {
        const hasTryout = user.Tryout.some((to) => to.id === selectedTryout);
        if (!hasTryout) return false;
      }

      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();
      return (
        user.User.name.toLowerCase().includes(searchLower) ||
        user.User.email.toLowerCase().includes(searchLower) ||
        user.User.phone?.includes(searchTerm) ||
        false
      );
    })
    .sort((a, b) => {
      if (sortBy === 'nama') {
        const comparison = a.User.name.localeCompare(b.User.name);
        return sortDirection === 'asc' ? comparison : -comparison;
      } else if (sortBy === 'email') {
        const comparison = a.User.email.localeCompare(b.User.email);
        return sortDirection === 'asc' ? comparison : -comparison;
      } else if (sortBy === 'ratarata') {
        const aAvg =
          a.Tryout.length > 0
            ? a.Tryout.reduce((sum, t) => sum + t.totalScore, 0) /
              a.Tryout.length
            : 0;
        const bAvg =
          b.Tryout.length > 0
            ? b.Tryout.reduce((sum, t) => sum + t.totalScore, 0) /
              b.Tryout.length
            : 0;
        const comparison = aAvg - bAvg;
        return sortDirection === 'asc' ? comparison : -comparison;
      } else if (sortBy === 'jumlahTryout') {
        const aCount = a.Tryout.length;
        const bCount = b.Tryout.length;
        const comparison = aCount - bCount;
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      return 0;
    });

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Daftar Kehadiran');

      // Create header columns
      const headers = [
        'No',
        'Nama',
        'Email',
        'Telp',
        'Subscription',
        ...filteredListTryout.map(
          (lc) => `${getDate(lc.startDate)} - ${lc.title}`,
        ),
      ];
      worksheet.columns = headers.map((header) => ({
        header,
        key: header,
      }));

      // Add data rows
      filteredListUsers.forEach((user, index) => {
        const row: Record<string, any> = {
          No: index + 1,
          Nama: user.User.name,
          Email: user.User.email,
          Telp: user.User.phone || '-',
          Subscription: user.User.Subscription.map((sub) => sub.planName).join(
            ', ',
          ),
        };

        // Add presence status for each live class
        filteredListTryout.forEach((tryout) => {
          const userData = user.Tryout.find((lc) => lc.id === tryout.id);
          const score = !userData
            ? '-'
            : website_sub_category_id === 'snbt'
              ? userData.averageScore.toFixed(2)
              : userData.totalScore.toFixed(2);

          row[`${getDate(tryout.startDate)} - ${tryout.title}`] = score;
        });

        worksheet.addRow(row);
      });

      // Generate file
      const buffer = await workbook.csv.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'text/csv;charset=utf-8;',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Tryout-Analytics-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      setIsExporting(false);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  return (
    <div className="mt-6">
      <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
        <CardHeader
          className="pb-4 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
          }}
        >
          <div className="relative z-10">
            <CardTitle
              className="text-lg font-bold"
              style={{ color: mainColor }}
            >
              Detail Tryout ({getDateStringShort(startDate)} -{' '}
              {getDateStringShort(endDate)})
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1 text-xs">
              Rincian data tryout peserta berdasarkan rentang tanggal
            </CardDescription>
          </div>
          <div
            className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
            style={{ backgroundColor: mainColor }}
          />
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex items-center w-full mb-4 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari berdasarkan nama, email, atau telp..."
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.startsWith('08')) {
                    setSearchTerm(value.replace('08', '+628'));
                  } else {
                    setSearchTerm(value);
                  }
                }}
                className="pl-10 rounded-3xl border-gray-200 focus:border-blue-500"
              />
            </div>
            <Button
              onClick={handleExportData}
              disabled={isExporting}
              className="gap-2"
              style={{ backgroundColor: mainColor }}
            >
              {isExporting ? (
                <>
                  <div className="animate-spin inline-block">
                    <Download className="w-4 h-4" />
                  </div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export CSV
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center w-full mb-6 gap-6">
            {/* Urutkan Section */}
            <div className="flex items-center gap-3">
              <p className="font-semibold text-sm text-gray-700 whitespace-nowrap">
                Urutkan:
              </p>
              <Select
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger className="w-[150px] rounded-3xl border-gray-200 focus:border-blue-500">
                  <SelectValue placeholder="Pilih" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nama">Nama</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="ratarata">
                    Rata-rata Nilai Tryout
                  </SelectItem>
                  <SelectItem value="jumlahTryout">
                    Jumlah Tryout Dikerjakan
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortDirection}
                onValueChange={(value) =>
                  setSortDirection(value as 'asc' | 'desc')
                }
              >
                <SelectTrigger className="w-[110px] rounded-3xl border-gray-200 focus:border-blue-500">
                  <SelectValue placeholder="Urutan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">↑ A-Z</SelectItem>
                  <SelectItem value="desc">↓ Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-300" />

            {/* Filter Section */}
            <div className="flex items-center gap-3">
              <p className="font-semibold text-sm text-gray-700 whitespace-nowrap">
                Filter:
              </p>
              <Select
                value={selectedTryout}
                onValueChange={setSelectedTryout}
              >
                <SelectTrigger className="w-[150px] rounded-3xl border-gray-200 focus:border-blue-500">
                  <SelectValue placeholder="Pilih Tryout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tryout</SelectItem>
                  {listTryout.map((tryout) => (
                    <SelectItem
                      key={tryout.id}
                      value={tryout.id}
                    >
                      {tryout.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="sticky top-0 z-20">
                  <th className="sticky top-0 left-0 z-30 text-left p-3 text-sm font-bold text-gray-700 w-12 bg-white">
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200" />
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gray-200" />
                    No
                  </th>
                  <th className="sticky top-0 left-10 z-30 text-left p-3 text-sm font-bold text-gray-700 min-w-[200px] bg-white">
                    <div className="absolute top-0 right-0 w-[1px] bottom-0 bg-gray-200" />
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200" />
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gray-200" />
                    Nama (Email)
                  </th>
                  <th className="sticky top-0 z-20 text-center text-sm font-bold text-gray-700 min-w-[150px] border-r bg-white p-0">
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200" />
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gray-200" />
                    Subscription
                  </th>
                  {filteredListTryout.map((liveClass) => (
                    <th
                      key={liveClass.id}
                      className="sticky top-0 z-20 text-center text-sm font-bold text-gray-700 min-w-[150px] border-r bg-white p-0"
                    >
                      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200" />
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gray-200" />
                      <div className="flex flex-col">
                        <div className="text-xs text-gray-500 border-b p-1">
                          {getDate(liveClass.startDate)}
                        </div>
                        <div className="text-xs mb-1 p-1">
                          {liveClass.title}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredListUsers.map((userItem, index) => {
                  return (
                    <tr
                      key={userItem.User.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                      style={{ borderColor: `${mainColor}10` }}
                    >
                      <td className="sticky left-0 z-10 p-3 text-sm text-gray-600 font-medium bg-white border-b">
                        {index + 1}
                      </td>
                      <td className="sticky left-10 z-10 p-3 text-sm bg-white border-b">
                        <div className="absolute top-0 right-0 w-[1px] bottom-0 bg-gray-200" />
                        <div className="font-semibold text-gray-900">
                          {userItem.User.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {userItem.User.email}
                        </div>
                        {userItem.User.phone && (
                          <div className="text-xs text-gray-500">
                            {userItem.User.phone}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-start border-r border-b text-[10px]">
                        {userItem.User.Subscription.map((sub) => (
                          <p>{sub.planName}</p>
                        ))}
                      </td>
                      {filteredListTryout.map((tryout) => {
                        const userData = userItem.Tryout.find(
                          (to) => to.id === tryout.id,
                        );
                        if (userItem.User.email === 'farizmp2008@gmail.com') {
                          console.log({
                            id: tryout.id,
                            data: userItem.Tryout,
                          });
                        }

                        if (!userData) {
                          return (
                            <td
                              key={tryout.id}
                              className="p-3 text-center border-r border-b"
                            >
                              -
                            </td>
                          );
                        }
                        const score =
                          website_sub_category_id === 'snbt'
                            ? userData.averageScore
                            : userData.totalScore;

                        return (
                          <td
                            key={tryout.id}
                            className="p-3 text-center border-r border-b"
                          >
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white">
                              {score.toFixed(2)}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {(!listUsers ||
            listUsers.length === 0 ||
            filteredListUsers.length === 0) && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">
                {filteredListUsers.length === 0 && searchTerm
                  ? 'Tidak ada hasil pencarian'
                  : 'Belum ada data siswa'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

type DataType = {
  overall: {
    detail: {
      listTryout: {
        id: string;
        title: string;
        startDate: Date;
        endDate: Date;
      }[];
      listUser: {
        User: {
          id: string;
          email: string;
          name: string;
          phone: string | null;
          Subscription: {
            id: string;
            planName: string;
          }[];
        };
        Tryout: {
          id: string;
          title: string;
          totalScore: number;
          averageScore: number;
          startDate: Date;
        }[];
      }[];
    };
    summary: {
      stats: {
        avg: number;
        highest: number;
        lowest: number;
        trend: number;
      };
      list: {
        date: Date;
        score: number;
        tryoutTitle: string;
        totalParticipants: number;
      }[];
    };
  };
  bySubCategory: {
    subCategories: {
      initial: string;
      id: string;
      name: string;
      website_sub_category_id: string;
      categoryId: string;
    }[];
    data: {
      id: string;
      title: string;
      totalScore: number;
      subCategories: {
        id: string;
        name: string;
        initial: string;
        totalScore: number;
        averageScore: number;
      }[];
    }[];
  };
};
