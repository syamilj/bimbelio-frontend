'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { useGet } from '@/lib/fetch-helper/useGet';
import {
  BookOpen,
  Brain,
  CalendarDays,
  Clock3,
  Layers3,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';
import { CourseReportStats } from '../../bimcourse/[categoryId]/_component/z_other/report/course-report-stats';
import {
  EmptyState,
  FilterChip,
  HeroBanner,
  InsightBanner,
  InsightCard,
  ScrollRow,
  ScrollWrapper,
  SectionLabel,
  StatPill,
} from './_primitives';

type CourseCategory = {
  id: number;
  name: string;
  image: string | null;
  resumeSubChapterId?: string | null;
  totalChapters: number;
  completedChapters: number;
  percentageProgress: number;
  totalSpendTime: number;
  totalTryout: number;
};

type CourseReportData = Parameters<typeof CourseReportStats>[0]['report'];

type ReportMap = Record<string, CourseReportData>;

const formatMinutes = (minutes: number) => {
  const safeMinutes = Math.max(0, Math.round(minutes || 0));
  const hours = Math.floor(safeMinutes / 60);
  const restMinutes = safeMinutes % 60;

  if (hours === 0) return `${restMinutes} mnt`;
  if (restMinutes === 0) return `${hours} jam`;
  return `${hours}j ${restMinutes}m`;
};

const getShortCategoryLabel = (name: string) => {
  if (name.length <= 16) return name;

  const words = name.split(' ').filter(Boolean);
  if (words.length >= 2) {
    const initials = words.map((word) => word[0]).join('');
    if (initials.length >= 2 && initials.length <= 8) return initials;
  }

  return `${name.slice(0, 14)}...`;
};

const pickFeaturedCategoryId = (
  categories: CourseCategory[],
  reports: ReportMap,
): string => {
  const ranked = categories
    .map((category) => {
      const report = reports[String(category.id)];
      return {
        id: String(category.id),
        score:
          (report?.learningOverview?.activeLearningDays ?? 0) * 1000 +
          (report?.tryoutResult.length ?? 0) * 100 +
          category.completedChapters,
      };
    })
    .sort((left, right) => right.score - left.score);

  return ranked[0]?.id ?? String(categories[0]?.id ?? '');
};

export const CourseAnalytics = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const { mainColor } = useWebsiteSubCategory();
  const [reportsByCategory, setReportsByCategory] = useState<ReportMap>({});
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGet<CourseCategory[]>('/course/getCategoryForCard', {
    params: {
      userId: id ? id : undefined,
    },
    useEffectDependencies: [id],
  });

  useEffect(() => {
    let isCancelled = false;

    const loadReports = async () => {
      if (!categories?.length) {
        setReportsByCategory({});
        setReportsLoading(false);
        setReportsError(null);
        return;
      }

      setReportsLoading(true);
      setReportsError(null);

      const settled = await Promise.all(
        categories.map(async (category) => {
          const result = await getGeneral('/course/getReportByCategory', {
            hideToast: true,
            params: {
              categoryId: category.id,
              userId: id ? id : undefined,
            },
          });

          return {
            categoryId: String(category.id),
            report: (result?.data as CourseReportData | undefined) ?? null,
          };
        }),
      );

      if (isCancelled) return;

      const nextReports = settled.reduce<ReportMap>((accumulator, item) => {
        if (item.report) {
          accumulator[item.categoryId] = item.report;
        }
        return accumulator;
      }, {});

      setReportsByCategory(nextReports);
      setReportsLoading(false);

      if (Object.keys(nextReports).length === 0) {
        setReportsError('Belum ada report category yang bisa ditampilkan.');
      }
    };

    void loadReports();

    return () => {
      isCancelled = true;
    };
  }, [categories, id]);

  const overviewCards = useMemo(() => {
    return (categories ?? []).map((category) => {
      const report = reportsByCategory[String(category.id)];
      const learningOverview = report?.learningOverview;
      const avgQuiz =
        report && report.tryoutResult.length > 0
          ? report.tryoutResult.reduce((sum, item) => sum + item.score, 0) /
            report.tryoutResult.length
          : 0;

      return {
        ...category,
        report,
        activeDays: learningOverview?.activeLearningDays ?? 0,
        recentDays: learningOverview?.recentActivityDays7 ?? 0,
        avgQuiz,
        completionRate:
          learningOverview?.completionRate ?? category.percentageProgress,
        completedMinutes: learningOverview?.completedEstimatedMinutes ?? 0,
      };
    });
  }, [categories, reportsByCategory]);

  const featuredCategory = useMemo(() => {
    if (activeCategory) {
      return (
        overviewCards.find((item) => String(item.id) === activeCategory) ?? null
      );
    }
    const featuredId = pickFeaturedCategoryId(
      categories ?? [],
      reportsByCategory,
    );
    return (
      overviewCards.find((item) => String(item.id) === featuredId) ??
      overviewCards[0] ??
      null
    );
  }, [activeCategory, categories, overviewCards, reportsByCategory]);

  const totalCategory = overviewCards.length;
  const completedCategory = overviewCards.filter(
    (item) => item.percentageProgress >= 100,
  ).length;
  const totalMaterial = overviewCards.reduce(
    (sum, item) => sum + item.totalChapters,
    0,
  );
  const totalCompletedMaterial = overviewCards.reduce(
    (sum, item) => sum + item.completedChapters,
    0,
  );

  const averageQuizAcrossCategories =
    overviewCards.length > 0
      ? overviewCards.reduce((sum, item) => sum + item.avgQuiz, 0) /
        overviewCards.length
      : 0;

  const totalRecentActiveDays = overviewCards.reduce(
    (sum, item) => sum + item.recentDays,
    0,
  );

  const bestProgressCategory =
    overviewCards.length > 0
      ? [...overviewCards].sort(
          (left, right) => right.percentageProgress - left.percentageProgress,
        )[0]
      : null;

  const needsAttentionCategory =
    overviewCards.length > 0
      ? [...overviewCards].sort(
          (left, right) => left.percentageProgress - right.percentageProgress,
        )[0]
      : null;

  const overviewChartData = useMemo(
    () =>
      overviewCards.map((item) => ({
        id: String(item.id),
        name: getShortCategoryLabel(item.name),
        fullName: item.name,
        progress: item.percentageProgress,
        avgQuiz: Number(item.avgQuiz.toFixed(1)),
        totalTryout: item.totalTryout,
      })),
    [overviewCards],
  );

  if (categoriesLoading) return <LoadingState />;

  if (categoriesError) {
    return <div>Error: {categoriesError.message}</div>;
  }

  if (!categories || categories.length === 0) {
    return (
      <div>
        <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden p-6">
          <EmptyState
            icon={BookOpen}
            title="Belum Ada Modul Course"
            description="Analytics course akan muncul setelah user memiliki kategori belajar."
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        {/* Hero */}
        <HeroBanner>
          <SectionLabel
            title="Analitik Course"
            sub="Ringkasan lintas kategori dan detail per kategori"
          />
          <ScrollRow noGrid>
            <StatPill
              label="Kategori"
              value={`${completedCategory}/${totalCategory}`}
              sub="selesai"
              icon={<Layers3 className="h-3.5 w-3.5" />}
              color={mainColor}
            />
            <StatPill
              label="Materi"
              value={`${totalCompletedMaterial}/${totalMaterial}`}
              sub="diselesaikan"
              icon={<Target className="h-3.5 w-3.5" />}
              color="#6366f1"
            />
            <StatPill
              label="Avg Quiz"
              value={averageQuizAcrossCategories.toFixed(1)}
              sub="lintas kategori"
              icon={<Brain className="h-3.5 w-3.5" />}
              color="#22c55e"
            />
          </ScrollRow>
        </HeroBanner>

        {/* Insights */}
        <ScrollWrapper className="-mx-5 px-5 pt-5 pb-2">
          <div className="flex gap-3 min-w-max md:min-w-0 md:grid xl:grid-cols-3">
            <div className="w-[180px] flex-shrink-0 md:w-auto">
              <InsightCard
                title="Kategori Terdepan"
                value={bestProgressCategory?.name ?? '-'}
                sub={
                  bestProgressCategory
                    ? `${bestProgressCategory.percentageProgress}% selesai`
                    : 'Belum ada data'
                }
                tone="emerald"
              />
            </div>
            <div className="w-[180px] flex-shrink-0 md:w-auto">
              <InsightCard
                title="Butuh Perhatian"
                value={needsAttentionCategory?.name ?? '-'}
                sub={
                  needsAttentionCategory
                    ? `${needsAttentionCategory.percentageProgress}% progress`
                    : 'Belum ada data'
                }
                tone="amber"
              />
            </div>
            <div className="w-[180px] flex-shrink-0 md:w-auto">
              <InsightCard
                title="Aktivitas 7 Hari"
                value={`${totalRecentActiveDays}`}
                sub="akumulasi hari aktif lintas kategori"
                tone="blue"
              />
            </div>
          </div>
        </ScrollWrapper>

        {/* Overview charts */}
        <div className="px-5 pt-4 grid gap-4 xl:grid-cols-2">
          {/* Progress chart */}
          <div className="rounded-3xl border border-slate-100 bg-white p-4">
            <SectionLabel
              title="Progress Kategori"
              sub="Perbandingan progress penyelesaian per kategori"
            />
            <ChartContainer
              config={{
                progress: { label: 'Progress', color: mainColor },
              }}
              className="aspect-auto h-[220px] md:h-[260px] w-full mt-2"
            >
              <BarChart
                data={overviewChartData}
                margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                  tickMargin={10}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  width={36}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, payload) =>
                        String(
                          (
                            payload?.[0]?.payload as {
                              fullName?: string;
                            }
                          )?.fullName ?? '',
                        )
                      }
                      formatter={(value) => (
                        <>
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span className="ml-auto font-mono font-medium tabular-nums">
                            {value}%
                          </span>
                        </>
                      )}
                    />
                  }
                />
                <Bar
                  dataKey="progress"
                  radius={[8, 8, 0, 0]}
                  fill={mainColor}
                >
                  <LabelList
                    position="top"
                    offset={6}
                    className="fill-slate-600 font-bold text-[10px]"
                    formatter={(v: unknown) => `${v}%`}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>

          {/* Quiz chart */}
          <div className="rounded-3xl border border-slate-100 bg-white p-4">
            <SectionLabel
              title="Rata-rata Quiz per Kategori"
              sub="Ringkasan performa nilai quiz untuk tiap kategori"
            />
            <ChartContainer
              config={{
                avgQuiz: { label: 'Avg Quiz', color: '#10B981' },
              }}
              className="aspect-auto h-[220px] md:h-[260px] w-full mt-2"
            >
              <LineChart
                data={overviewChartData}
                margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                  tickMargin={10}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  width={36}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, payload) =>
                        String(
                          (
                            payload?.[0]?.payload as {
                              fullName?: string;
                            }
                          )?.fullName ?? '',
                        )
                      }
                      formatter={(value, _name, item) => {
                        const row = item.payload as {
                          totalTryout?: number;
                        };
                        return (
                          <>
                            <span className="text-muted-foreground">
                              Avg Quiz
                            </span>
                            <span className="ml-auto font-mono font-medium tabular-nums">
                              {Number(value).toFixed(1)} ·{' '}
                              {row.totalTryout ?? 0} quiz
                            </span>
                          </>
                        );
                      }}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="avgQuiz"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: '#10B981',
                    stroke: '#fff',
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: '#10B981',
                    stroke: '#fff',
                    strokeWidth: 2,
                  }}
                >
                  <LabelList
                    position="top"
                    offset={8}
                    className="fill-emerald-700 font-bold text-[10px]"
                  />
                </Line>
              </LineChart>
            </ChartContainer>
          </div>
        </div>

        {/* Category selector + detail */}
        <div className="px-5 py-5 space-y-4">
          {reportsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[180px] w-full rounded-3xl" />
              <Skeleton className="h-[460px] w-full rounded-3xl" />
            </div>
          ) : reportsError ? (
            <EmptyState
              icon={Brain}
              title="Belum Ada Aktivitas Course"
              description={reportsError}
            />
          ) : (
            <>
              <SectionLabel
                title="Detail Per Kategori"
                sub="Pilih kategori untuk melihat analisis mendalam"
              />

              {/* Category chips */}
              <ScrollWrapper className="-mx-5 px-5 pb-2">
                <div className="flex min-w-max gap-1.5 md:min-w-0 md:flex-wrap">
                  {overviewCards.map((item) => (
                    <FilterChip
                      key={item.id}
                      label={getShortCategoryLabel(item.name)}
                      active={activeCategory === String(item.id)}
                      color={mainColor}
                      onClick={() =>
                        setActiveCategory(
                          activeCategory === String(item.id)
                            ? null
                            : String(item.id),
                        )
                      }
                    />
                  ))}
                </div>
              </ScrollWrapper>

              {/* Category detail */}
              {featuredCategory && (
                <div className="space-y-4">
                  {/* Summary stat pills */}
                  <ScrollRow noGrid>
                    <StatPill
                      label="Progress"
                      value={`${featuredCategory.percentageProgress}%`}
                      sub={`${featuredCategory.completedChapters}/${featuredCategory.totalChapters} materi selesai`}
                      icon={<TrendingUp className="h-3.5 w-3.5" />}
                      color="emerald"
                    />
                    <StatPill
                      label="Quiz"
                      value={`${featuredCategory.totalTryout}`}
                      sub="total tryout course"
                      icon={<BookOpen className="h-3.5 w-3.5" />}
                      color="blue"
                    />
                    <StatPill
                      label="Hari Aktif"
                      value={`${featuredCategory.activeDays}`}
                      sub={`7 hari terakhir: ${featuredCategory.recentDays}`}
                      icon={<CalendarDays className="h-3.5 w-3.5" />}
                      color="purple"
                    />
                    <StatPill
                      label="Durasi"
                      value={formatMinutes(featuredCategory.completedMinutes)}
                      sub={
                        featuredCategory.report
                          ? `avg quiz ${featuredCategory.avgQuiz.toFixed(1)}`
                          : 'report belum tersedia'
                      }
                      icon={<Clock3 className="h-3.5 w-3.5" />}
                      color="amber"
                    />
                  </ScrollRow>

                  {/* Insight */}
                  <InsightBanner
                    tone={
                      featuredCategory.percentageProgress >= 70
                        ? 'success'
                        : featuredCategory.percentageProgress >= 40
                          ? 'info'
                          : 'warning'
                    }
                  >
                    {featuredCategory.percentageProgress >= 70
                      ? `Progres ${featuredCategory.name} sudah ${featuredCategory.percentageProgress}% — pertahankan momentum belajarmu!`
                      : featuredCategory.percentageProgress >= 40
                        ? `${featuredCategory.name} sudah ${featuredCategory.percentageProgress}%, tingkatkan konsistensi belajar harianmu.`
                        : `${featuredCategory.name} baru ${featuredCategory.percentageProgress}% — mulai kejar materi yang tertinggal.`}
                  </InsightBanner>

                  {/* CourseReportStats */}
                  <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-4 md:p-5">
                    <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-black text-slate-800">
                          Analisis Mendalam Kategori
                        </h3>
                        <p className="text-sm text-slate-500">
                          Detail lengkap untuk {featuredCategory.name}.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-700">
                          {featuredCategory.name}
                        </Badge>
                        <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700">
                          {featuredCategory.completedChapters}/
                          {featuredCategory.totalChapters} selesai
                        </Badge>
                      </div>
                    </div>

                    {featuredCategory.report ? (
                      <div className="rounded-3xl border border-white bg-white p-4 shadow-sm md:p-5">
                        <CourseReportStats report={featuredCategory.report} />
                      </div>
                    ) : (
                      <div className="py-12 text-center text-sm text-slate-500">
                        Belum ada report category yang bisa ditampilkan.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// Sub-components
// =============================================================================

const LoadingState = () => (
  <div>
    <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-48" />
        <ScrollRow>
          <Skeleton className="h-16 rounded-3xl" />
          <Skeleton className="h-16 rounded-3xl" />
          <Skeleton className="h-16 rounded-3xl" />
        </ScrollRow>
        <Skeleton className="h-[260px] w-full rounded-3xl" />
        <Skeleton className="h-[260px] w-full rounded-3xl" />
      </div>
    </div>
  </div>
);
