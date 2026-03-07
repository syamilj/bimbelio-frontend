'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { useGet } from '@/lib/fetch-helper/useGet';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Brain,
  Clock3,
  GraduationCap,
  Layers3,
  Target,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { CourseReportStats } from '../../bimcourse/[categoryId]/_component/z_other/report/CourseReportStats';
import { SectionTitle } from './section-title';

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
  const [activeTab, setActiveTab] = useState<string>('overview');

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
        return;
      }

      setActiveTab((previous) => {
        if (previous === 'overview') return previous;
        if (previous && nextReports[previous]) return previous;
        return 'overview';
      });
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
    if (activeTab !== 'overview') {
      return overviewCards.find((item) => String(item.id) === activeTab) ?? null;
    }
    const featuredId = pickFeaturedCategoryId(categories ?? [], reportsByCategory);
    return overviewCards.find((item) => String(item.id) === featuredId) ?? overviewCards[0] ?? null;
  }, [activeTab, categories, overviewCards, reportsByCategory]);

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
        <SectionTitle
          icon={GraduationCap}
          title="BimCourse"
          description="Ringkasan progres dan pola belajar materi course"
        />
        <Card className="border-2">
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <BookOpen className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-lg font-black text-slate-800">Belum Ada Modul Course</p>
            <p className="mt-1 text-sm text-slate-500">
              Analytics course akan muncul setelah user memiliki kategori belajar.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle
        icon={GraduationCap}
        title="BimCourse"
        description="Ringkasan progres dan pola belajar materi course"
      />

      <Card className="w-full border-2">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-3xl"
                style={{ backgroundColor: mainColor }}
              >
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-slate-800">
                  Analitik Course
                </CardTitle>
                <CardDescription>
                  Ringkasan lintas kategori dan detail per kategori dalam tab sederhana.
                </CardDescription>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[420px]">
              <SummaryBadge
                icon={Layers3}
                label="Kategori"
                value={`${totalCategory}`}
                tone="slate"
              />
              <SummaryBadge
                icon={Target}
                label="Selesai"
                value={`${completedCategory}/${totalCategory}`}
                tone="blue"
              />
              <SummaryBadge
                icon={Clock3}
                label="Materi"
                value={`${totalCompletedMaterial}/${totalMaterial}`}
                tone="emerald"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-800">
                Kategori Course
              </h3>
              <div className="overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <TabsList className="inline-flex h-auto w-max min-w-max justify-start gap-1.5 rounded-full bg-slate-100 p-1">
                  <TabsTrigger
                    value="overview"
                    className="shrink-0 rounded-full px-3 py-2 text-xs font-bold sm:px-4"
                  >
                    Overview
                  </TabsTrigger>
                  {overviewCards.map((item) => (
                    <TabsTrigger
                      key={item.id}
                      value={String(item.id)}
                      className="shrink-0 rounded-full px-3 py-2 text-xs font-bold data-[state=active]:shadow-none sm:px-4"
                      title={item.name}
                    >
                      {getShortCategoryLabel(item.name)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            {reportsLoading ? (
              <div className="mt-4 space-y-4">
                <Skeleton className="h-[180px] w-full rounded-3xl" />
                <Skeleton className="h-[460px] w-full rounded-3xl" />
              </div>
            ) : reportsError ? (
              <div className="mt-4 py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <Brain className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-lg font-black text-slate-800">
                  Belum Ada Aktivitas Course
                </p>
                <p className="mt-1 text-sm text-slate-500">{reportsError}</p>
              </div>
            ) : (
              <>
                <TabsContent value="overview" className="mt-4 space-y-4">
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <CategorySummaryCard
                      label="Kategori"
                      value={`${totalCategory}`}
                      subtitle={`${completedCategory} kategori selesai`}
                    />
                    <CategorySummaryCard
                      label="Materi"
                      value={`${totalCompletedMaterial}/${totalMaterial}`}
                      subtitle="materi selesai"
                    />
                    <CategorySummaryCard
                      label="Kategori Aktif"
                      value={featuredCategory?.name ?? '-'}
                      subtitle="dipilih otomatis sebagai fokus utama"
                    />
                    <CategorySummaryCard
                      label="Rata-rata Quiz"
                      value={`${averageQuizAcrossCategories.toFixed(1)}`}
                      subtitle="rerata lintas kategori"
                    />
                  </div>

                  <div className="grid gap-3 xl:grid-cols-3">
                    <InsightCard
                      title="Kategori Terdepan"
                      value={bestProgressCategory?.name ?? '-'}
                      subtitle={bestProgressCategory ? `${bestProgressCategory.percentageProgress}% selesai` : 'Belum ada data'}
                      tone="emerald"
                    />
                    <InsightCard
                      title="Butuh Perhatian"
                      value={needsAttentionCategory?.name ?? '-'}
                      subtitle={needsAttentionCategory ? `${needsAttentionCategory.percentageProgress}% progress` : 'Belum ada data'}
                      tone="amber"
                    />
                    <InsightCard
                      title="Aktivitas 7 Hari"
                      value={`${totalRecentActiveDays}`}
                      subtitle="akumulasi hari aktif lintas kategori"
                      tone="blue"
                    />
                  </div>

                  <div className="grid gap-4 xl:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                      <div className="mb-3">
                        <h3 className="text-sm font-black text-slate-800">Progress Kategori</h3>
                        <p className="text-xs text-slate-500">Perbandingan progress penyelesaian per kategori.</p>
                      </div>
                      <ChartContainer
                        config={{ progress: { label: 'Progress', color: mainColor } }}
                        className="h-[260px] w-full"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={overviewChartData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280' }} tickLine={false} axisLine={false} interval={0} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} width={32} />
                            <ChartTooltip
                              content={
                                <ChartTooltipContent
                                  labelFormatter={(_, payload) => String((payload?.[0]?.payload as { fullName?: string })?.fullName ?? '')}
                                  formatter={(value) => (
                                    <>
                                      <span className="text-muted-foreground">Progress</span>
                                      <span className="ml-auto font-mono font-medium tabular-nums">{value}%</span>
                                    </>
                                  )}
                                />
                              }
                            />
                            <Bar dataKey="progress" radius={[8, 8, 0, 0]} fill={mainColor} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                      <div className="mb-3">
                        <h3 className="text-sm font-black text-slate-800">Rata-rata Quiz per Kategori</h3>
                        <p className="text-xs text-slate-500">Ringkasan performa nilai quiz untuk tiap kategori.</p>
                      </div>
                      <ChartContainer
                        config={{ avgQuiz: { label: 'Avg Quiz', color: '#10B981' } }}
                        className="h-[260px] w-full"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={overviewChartData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280' }} tickLine={false} axisLine={false} interval={0} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} width={32} />
                            <ChartTooltip
                              content={
                                <ChartTooltipContent
                                  labelFormatter={(_, payload) => String((payload?.[0]?.payload as { fullName?: string })?.fullName ?? '')}
                                  formatter={(value, _name, item) => {
                                    const row = item.payload as { totalTryout?: number };
                                    return (
                                      <>
                                        <span className="text-muted-foreground">Avg Quiz</span>
                                        <span className="ml-auto font-mono font-medium tabular-nums">{Number(value).toFixed(1)} · {row.totalTryout ?? 0} quiz</span>
                                      </>
                                    );
                                  }}
                                />
                              }
                            />
                            <Line type="monotone" dataKey="avgQuiz" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </div>
                </TabsContent>

                {overviewCards.map((item) => {
                  const report = reportsByCategory[String(item.id)];
                  return (
                    <TabsContent key={item.id} value={String(item.id)} className="mt-4 space-y-4">
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <CategorySummaryCard
                          label="Progress"
                          value={`${item.percentageProgress}%`}
                          subtitle={`${item.completedChapters}/${item.totalChapters} materi selesai`}
                        />
                        <CategorySummaryCard
                          label="Quiz"
                          value={`${item.totalTryout}`}
                          subtitle="total tryout course"
                        />
                        <CategorySummaryCard
                          label="Hari Aktif"
                          value={`${item.activeDays}`}
                          subtitle={`7 hari terakhir: ${item.recentDays}`}
                        />
                        <CategorySummaryCard
                          label="Durasi"
                          value={formatMinutes(item.completedMinutes)}
                          subtitle={report ? `avg quiz ${item.avgQuiz.toFixed(1)}` : 'report belum tersedia'}
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge className="rounded-full border border-slate-200 bg-white text-[10px] font-bold text-slate-600">
                          7 hari aktif: {item.recentDays}
                        </Badge>
                        <Badge className="rounded-full border border-blue-200 bg-blue-50 text-[10px] font-bold text-blue-700">
                          total quiz: {item.totalTryout}
                        </Badge>
                        <Badge className="rounded-full border border-amber-200 bg-amber-50 text-[10px] font-bold text-amber-700">
                          avg quiz: {item.avgQuiz.toFixed(1)}
                        </Badge>
                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 md:p-5">
                        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="text-lg font-black text-slate-800">
                              Analisis Mendalam Kategori
                            </h3>
                            <p className="text-sm text-slate-500">
                              Detail lengkap untuk {item.name}.
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-700">
                              {item.name}
                            </Badge>
                            <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700">
                              {item.completedChapters}/{item.totalChapters} selesai
                            </Badge>
                          </div>
                        </div>

                        {report ? (
                          <div className="rounded-3xl border border-white bg-white p-4 shadow-sm md:p-5">
                            <CourseReportStats report={report} />
                          </div>
                        ) : (
                          <div className="py-12 text-center text-sm text-slate-500">
                            Belum ada report category yang bisa ditampilkan.
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  );
                })}
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const SummaryBadge = ({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Layers3;
  label: string;
  value: string;
  tone: 'slate' | 'blue' | 'emerald';
}) => {
  const toneClass =
    tone === 'blue'
      ? 'border-blue-200 bg-blue-50 text-blue-700'
      : tone === 'emerald'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border-slate-200 bg-slate-50 text-slate-700';

  return (
    <div className={cn('rounded-3xl border px-3 py-2.5', toneClass)}>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span className="text-[10px] font-bold uppercase tracking-wide opacity-80">
          {label}
        </span>
      </div>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
};

const CategorySummaryCard = ({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string;
  subtitle: string;
}) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-4">
    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="mt-1 text-2xl font-black text-slate-800">{value}</p>
    <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
  </div>
);

const InsightCard = ({
  title,
  value,
  subtitle,
  tone,
}: {
  title: string;
  value: string;
  subtitle: string;
  tone: 'emerald' | 'amber' | 'blue';
}) => {
  const toneClass =
    tone === 'emerald'
      ? 'border-emerald-200 bg-emerald-50/60 text-emerald-900'
      : tone === 'amber'
        ? 'border-amber-200 bg-amber-50/60 text-amber-900'
        : 'border-blue-200 bg-blue-50/60 text-blue-900';

  return (
    <div className={cn('rounded-3xl border p-4', toneClass)}>
      <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">
        {title}
      </p>
      <p className="mt-1 text-xl font-black">{value}</p>
      <p className="mt-1 text-xs opacity-80">{subtitle}</p>
    </div>
  );
};

const LoadingState = () => (
  <div>
    <SectionTitle
      icon={GraduationCap}
      title="BimCourse"
      description="Ringkasan progres dan pola belajar materi course"
    />
    <Skeleton className="h-[640px] w-full rounded-3xl" />
  </div>
);
