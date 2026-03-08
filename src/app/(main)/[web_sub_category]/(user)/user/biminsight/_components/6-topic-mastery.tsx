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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronRight,
  Layers3,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Label,
  Line,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { SectionTitle } from './section-title';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChapterData {
  chapterId: string;
  chapterTitle: string;
  benar: number;
  salah: number;
  kosong: number;
  total: number;
  accuracy: number;
  mastery: 'strong' | 'moderate' | 'weak';
  trend: 'improving' | 'declining' | 'stable';
}

interface CategoryData {
  categoryId: string;
  categoryName: string;
  benar: number;
  salah: number;
  kosong: number;
  total: number;
  accuracy: number;
  mastery: 'strong' | 'moderate' | 'weak';
  chapters: ChapterData[];
}

interface TopicMasteryResponse {
  summary: {
    totalQuestions: number;
    totalBenar: number;
    totalSalah: number;
    totalKosong: number;
    overallAccuracy: number;
    totalCategories: number;
    totalChapters: number;
    strongCount: number;
    weakCount: number;
  };
  weakestChapters: (ChapterData & { categoryName: string })[];
  strongestChapters: (ChapterData & { categoryName: string })[];
  categories: CategoryData[];
}

interface WebSubGroup extends TopicMasteryResponse {
  webSubId: string;
  webSubName: string;
}

// ─── Colors ───────────────────────────────────────────────────────────────────

const MASTERY_CONFIG = {
  strong: {
    label: 'Kuat',
    badge: 'border-emerald-200 text-emerald-700 bg-emerald-50',
    bar: '#22c55e',
    text: 'text-emerald-700',
  },
  moderate: {
    label: 'Sedang',
    badge: 'border-amber-200 text-amber-700 bg-amber-50',
    bar: '#eab308',
    text: 'text-amber-700',
  },
  weak: {
    label: 'Lemah',
    badge: 'border-red-200 text-red-600 bg-red-50',
    bar: '#ef4444',
    text: 'text-red-600',
  },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const TopicMastery = () => {
  const { id } = useParams<{ id: string | undefined }>();

  const { data, isLoading } = useGet<WebSubGroup[]>(
    '/learningAnalytics/getTopicMastery',
    {
      params: { userId: id ? id : undefined },
      useEffectDependencies: [id],
    },
  );

  if (isLoading) return <LoadingState />;
  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-6">
      <SectionTitle icon={Layers3} title="Penguasaan Topik" />
      {data.map((group) => (
        <TopicMasteryCard key={group.webSubId} group={group} showLabel={data.length > 1} />
      ))}
    </div>
  );
};

function TopicMasteryCard({ group, showLabel }: { group: WebSubGroup; showLabel: boolean }) {
  const { mainColor } = useWebsiteSubCategory();

  const s = group.summary;

  return (
    <Card className="w-full border-2">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-3xl"
            style={{ backgroundColor: mainColor }}
          >
            <Layers3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-black text-slate-800">
              {showLabel ? group.webSubName : 'Penguasaan Topik'}
            </CardTitle>
            <CardDescription>
              Analisis {s.totalQuestions} soal dari {s.totalCategories} kategori
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <Tabs defaultValue="overview">
            <div className="overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <TabsList className="inline-flex h-auto w-max min-w-max justify-start gap-1.5 rounded-full bg-slate-100 p-1">
                <TabsTrigger
                  value="overview"
                  className="shrink-0 rounded-full px-3 py-2 text-xs font-bold sm:px-4"
                >
                  Ringkasan
                </TabsTrigger>
                <TabsTrigger
                  value="categories"
                  className="shrink-0 rounded-full px-3 py-2 text-xs font-bold sm:px-4"
                >
                  Per Kategori
                </TabsTrigger>
                <TabsTrigger
                  value="weakstrong"
                  className="shrink-0 rounded-full px-3 py-2 text-xs font-bold sm:px-4"
                >
                  Kuat &amp; Lemah
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <OverviewTab summary={s} categories={group.categories} />
            </TabsContent>
            <TabsContent value="categories" className="mt-4 space-y-4">
              <CategoriesTab categories={group.categories} />
            </TabsContent>
            <TabsContent value="weakstrong" className="mt-4 space-y-4">
              <WeakStrongTab
                weakest={group.weakestChapters}
                strongest={group.strongestChapters}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 1: OVERVIEW — Donut + Combined Bar/Line Chart
// ═══════════════════════════════════════════════════════════════════════════════

function OverviewTab({
  summary: s,
  categories,
}: {
  summary: TopicMasteryResponse['summary'];
  categories: CategoryData[];
}) {
  const { mainColor } = useWebsiteSubCategory();

  // Donut: BSK + mastery ring combined in one visual
  const donutData = useMemo(
    () =>
      [
        { name: 'Benar', value: s.totalBenar, fill: '#22c55e' },
        { name: 'Salah', value: s.totalSalah, fill: '#ef4444' },
        ...(s.totalKosong > 0 ? [{ name: 'Kosong', value: s.totalKosong, fill: '#cbd5e1' }] : []),
      ],
    [s],
  );

  // Outer ring: mastery distribution
  const masteryRing = useMemo(() => {
    const strong = categories.filter((c) => c.mastery === 'strong').length;
    const moderate = categories.filter((c) => c.mastery === 'moderate').length;
    const weak = categories.filter((c) => c.mastery === 'weak').length;
    return [
      { name: 'Kuat', value: strong, fill: '#22c55e' },
      { name: 'Sedang', value: moderate, fill: '#eab308' },
      { name: 'Lemah', value: weak, fill: '#ef4444' },
    ].filter((d) => d.value > 0);
  }, [categories]);

  // Combined chart: stacked BSK bars + accuracy line overlay
  const combinedData = useMemo(() => {
    return categories.map((cat) => ({
      name:
        cat.categoryName.length > 14
          ? cat.categoryName.slice(0, 12) + '…'
          : cat.categoryName,
      fullName: cat.categoryName,
      benar: cat.benar,
      salah: cat.salah,
      kosong: cat.kosong,
      total: cat.total,
      accuracy: cat.accuracy,
      mastery: cat.mastery,
    }));
  }, [categories]);

  const combinedConfig: ChartConfig = {
    benar: { label: 'Benar', color: '#22c55e' },
    salah: { label: 'Salah', color: '#ef4444' },
    kosong: { label: 'Kosong', color: '#cbd5e1' },
    accuracy: { label: 'Akurasi', color: mainColor },
  };

  const donutConfig: ChartConfig = {
    Benar: { label: 'Benar', color: '#22c55e' },
    Salah: { label: 'Salah', color: '#ef4444' },
    Kosong: { label: 'Kosong', color: '#cbd5e1' },
  };

  return (
    <>
      {/* Row: Donut (double-ring) + Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-white p-4">
          <ChartContainer config={donutConfig} className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {/* Outer ring: mastery distribution */}
                <Pie
                  data={masteryRing}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={88}
                  outerRadius={100}
                  paddingAngle={3}
                  stroke="none"
                >
                  {masteryRing.map((entry, i) => (
                    <Cell key={`outer-${i}`} fill={entry.fill} opacity={0.5} />
                  ))}
                </Pie>
                {/* Inner ring: BSK breakdown */}
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={82}
                  paddingAngle={3}
                  stroke="white"
                  strokeWidth={2}
                >
                  {donutData.map((entry, i) => (
                    <Cell key={`inner-${i}`} fill={entry.fill} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 6} className="fill-slate-800 text-2xl font-black">
                              {s.overallAccuracy}%
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 14} className="fill-slate-500 text-[10px]">
                              Akurasi
                            </tspan>
                          </text>
                        );
                      }
                      return null;
                    }}
                  />
                </Pie>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => (
                        <>
                          <div
                            className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                            style={{
                              backgroundColor:
                                name === 'Benar' ? '#22c55e'
                                  : name === 'Salah' ? '#ef4444'
                                    : name === 'Kuat' ? '#22c55e'
                                      : name === 'Sedang' ? '#eab308'
                                        : name === 'Lemah' ? '#ef4444'
                                          : '#cbd5e1',
                            }}
                          />
                          <span className="text-muted-foreground">{name as string}</span>
                          <span className="ml-auto font-mono font-medium">{value as number}</span>
                        </>
                      )}
                    />
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          {/* Combined legend */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase w-full text-center">Jawaban</span>
            <LegendDot color="#22c55e" label={`Benar ${s.totalBenar}`} />
            <LegendDot color="#ef4444" label={`Salah ${s.totalSalah}`} />
            {s.totalKosong > 0 && <LegendDot color="#cbd5e1" label={`Kosong ${s.totalKosong}`} />}
            <span className="text-[9px] font-bold text-slate-400 uppercase w-full text-center mt-1">Penguasaan (ring luar)</span>
            {masteryRing.map((d) => (
              <LegendDot key={d.name} color={d.fill} label={`${d.name} ${d.value}`} />
            ))}
          </div>
        </div>

        {/* Summary stats */}
        <div className="md:col-span-3 grid grid-cols-2 gap-3 content-start">
          <SummaryCard label="Total Soal">
            <span className="text-2xl font-black text-slate-800">{s.totalQuestions}</span>
            <span className="text-xs text-slate-500">
              {s.totalCategories} kategori · {s.totalChapters} chapter
            </span>
          </SummaryCard>
          <SummaryCard label="Akurasi">
            <span className="text-2xl font-black" style={{ color: mainColor }}>
              {s.overallAccuracy}%
            </span>
            <span className="text-xs text-slate-500">
              {s.totalBenar}/{s.totalQuestions} benar
            </span>
          </SummaryCard>
          <SummaryCard label="Topik Kuat">
            <span className="text-2xl font-black text-emerald-600">{s.strongCount}</span>
            <span className="text-xs text-slate-500">Akurasi ≥ 80%</span>
          </SummaryCard>
          <SummaryCard label="Perlu Ditingkatkan">
            <span className="text-2xl font-black text-red-500">{s.weakCount}</span>
            <span className="text-xs text-slate-500">Akurasi &lt; 50%</span>
          </SummaryCard>
        </div>
      </div>

      {/* Combined chart: Stacked BSK bars + Accuracy line overlay */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4">
        <div className="mb-3">
          <h3 className="text-sm font-black text-slate-800">
            Akurasi &amp; Distribusi Jawaban Per Kategori
          </h3>
          <p className="text-xs text-slate-500">
            Bar = jumlah soal (B/S/K), garis = akurasi (%)
          </p>
        </div>
        <ChartContainer config={combinedConfig} className="h-[260px] md:h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={combinedData}
              margin={{ top: 15, right: 30, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: '#374151', fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={categories.length > 6 ? -25 : 0}
                textAnchor={categories.length > 6 ? 'end' : 'middle'}
                height={categories.length > 6 ? 50 : 30}
              />
              {/* Left Y: soal count */}
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
              />
              {/* Right Y: accuracy % */}
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      const d = payload?.[0]?.payload as { fullName?: string };
                      return d?.fullName || '';
                    }}
                  />
                }
              />
              <Bar yAxisId="left" dataKey="benar" stackId="bsk" fill="#22c55e" barSize={28} radius={[0, 0, 0, 0]} />
              <Bar yAxisId="left" dataKey="salah" stackId="bsk" fill="#ef4444" barSize={28} radius={[0, 0, 0, 0]} />
              <Bar yAxisId="left" dataKey="kosong" stackId="bsk" fill="#cbd5e1" barSize={28} radius={[4, 4, 0, 0]} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="accuracy"
                stroke={mainColor}
                strokeWidth={2.5}
                dot={{
                  r: 5,
                  fill: mainColor,
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 7,
                  fill: mainColor,
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
              />
              <ReferenceLine
                yAxisId="right"
                y={s.overallAccuracy}
                stroke={mainColor}
                strokeDasharray="6 4"
                strokeOpacity={0.4}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <LegendDot color="#22c55e" label="Benar" />
          <LegendDot color="#ef4444" label="Salah" />
          <LegendDot color="#cbd5e1" label="Kosong" />
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-0.5 rounded-full" style={{ backgroundColor: mainColor }} />
            <span className="text-[10px] text-slate-500">Akurasi (%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 border-t border-dashed" style={{ borderColor: mainColor, opacity: 0.5 }} />
            <span className="text-[10px] text-slate-500">Rata-rata ({s.overallAccuracy}%)</span>
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 2: PER KATEGORI — Radar + Accordions
// ═══════════════════════════════════════════════════════════════════════════════

function CategoriesTab({ categories }: { categories: CategoryData[] }) {
  const { mainColor } = useWebsiteSubCategory();

  const radarData = useMemo(() => {
    return categories.map((cat) => ({
      subject:
        cat.categoryName.length > 12
          ? cat.categoryName.slice(0, 10) + '…'
          : cat.categoryName,
      fullName: cat.categoryName,
      accuracy: cat.accuracy,
    }));
  }, [categories]);

  const radarConfig: ChartConfig = {
    accuracy: { label: 'Akurasi', color: mainColor },
  };

  return (
    <div className="space-y-4">
      {categories.length >= 3 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-4">
          <div className="mb-2">
            <h3 className="text-sm font-black text-slate-800">Radar Penguasaan</h3>
            <p className="text-xs text-slate-500">Peta kemampuan di seluruh kategori</p>
          </div>
          <ChartContainer config={radarConfig} className="h-[260px] md:h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 11, fill: '#374151', fontWeight: 700 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 9, fill: '#9CA3AF' }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Radar
                  name="Akurasi"
                  dataKey="accuracy"
                  stroke={mainColor}
                  fill={mainColor}
                  fillOpacity={0.2}
                  strokeWidth={2}
                  dot={{ r: 4, fill: mainColor, stroke: '#fff', strokeWidth: 2 }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, payload) => {
                        const d = payload?.[0]?.payload as { fullName?: string };
                        return d?.fullName || '';
                      }}
                      formatter={(value) => (
                        <>
                          <div className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: mainColor }} />
                          <span className="text-muted-foreground">Akurasi</span>
                          <span className="ml-auto font-mono font-medium">{value}%</span>
                        </>
                      )}
                    />
                  }
                />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      )}

      {/* Accordions */}
      <div className="space-y-3">
        {categories.map((cat) => (
          <CategoryAccordion key={cat.categoryId} category={cat} />
        ))}
      </div>
    </div>
  );
}

function CategoryAccordion({ category: cat }: { category: CategoryData }) {
  const [open, setOpen] = useState(false);
  const mc = MASTERY_CONFIG[cat.mastery];
  const benarPct = cat.total > 0 ? (cat.benar / cat.total) * 100 : 0;
  const salahPct = cat.total > 0 ? (cat.salah / cat.total) * 100 : 0;
  const chapterChartConfig: ChartConfig = {
    accuracy: { label: 'Akurasi', color: mc.bar },
  };
  const chapterChartData = cat.chapters
    .slice()
    .sort((a, b) => b.total - a.total)
    .slice(0, 8)
    .map((chapter) => ({
      name:
        chapter.chapterTitle.length > 22
          ? chapter.chapterTitle.slice(0, 20) + '…'
          : chapter.chapterTitle,
      fullName: chapter.chapterTitle,
      accuracy: chapter.accuracy,
      total: chapter.total,
      fill: MASTERY_CONFIG[chapter.mastery].bar,
    }));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-800 truncate">{cat.categoryName}</h4>
            <Badge variant="outline" className={cn('text-[10px] font-bold flex-shrink-0', mc.badge)}>
              {mc.label}
            </Badge>
          </div>
          {/* Inline bar under title */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden max-w-[160px]">
              {benarPct > 0 && <div className="h-full bg-emerald-500 float-left" style={{ width: `${benarPct}%` }} />}
              {salahPct > 0 && <div className="h-full bg-red-400 float-left" style={{ width: `${salahPct}%` }} />}
            </div>
            <span className="text-xs font-bold flex-shrink-0" style={{ color: mc.bar }}>
              {cat.accuracy}%
            </span>
            <span className="text-[10px] text-slate-400 flex-shrink-0">
              {cat.total} soal · {cat.chapters.length} ch
            </span>
          </div>
        </div>
        {open ? (
          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-2 border-t border-slate-100 pt-3">
          {chapterChartData.length > 1 && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <h5 className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                    Grafik Chapter
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Akurasi chapter dengan volume soal terbanyak
                  </p>
                </div>
                <span className="text-[10px] text-slate-400">
                  Top {chapterChartData.length}
                </span>
              </div>
              <ChartContainer config={chapterChartConfig} className="h-[220px] w-full">
                <BarChart
                  data={chapterChartData}
                  layout="vertical"
                  margin={{ top: 4, right: 8, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: '#94A3B8' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fontSize: 10, fill: '#334155', fontWeight: 700 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(_, payload) => {
                          const datum = payload?.[0]?.payload as { fullName?: string };
                          return datum?.fullName || '';
                        }}
                        formatter={(value, _, item) => {
                          const datum = item.payload as { total: number; fill: string };
                          return (
                            <>
                              <div
                                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                                style={{ backgroundColor: datum.fill }}
                              />
                              <span className="text-muted-foreground">Akurasi</span>
                              <span className="ml-auto font-mono font-medium">
                                {value}% · {datum.total} soal
                              </span>
                            </>
                          );
                        }}
                      />
                    }
                  />
                  <Bar dataKey="accuracy" radius={[0, 999, 999, 0]}>
                    {chapterChartData.map((item) => (
                      <Cell key={item.fullName} fill={item.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          )}
          {cat.chapters.map((ch) => (
            <ChapterRow key={ch.chapterId} chapter={ch} />
          ))}
        </div>
      )}
    </div>
  );
}

function ChapterRow({ chapter: ch }: { chapter: ChapterData }) {
  const mc = MASTERY_CONFIG[ch.mastery];
  const benarPct = ch.total > 0 ? (ch.benar / ch.total) * 100 : 0;
  const salahPct = ch.total > 0 ? (ch.salah / ch.total) * 100 : 0;

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold text-slate-700 truncate">{ch.chapterTitle}</p>
          <Badge variant="outline" className={cn('text-[9px] font-bold', mc.badge)}>
            {mc.label}
          </Badge>
          {ch.trend !== 'stable' && (
            ch.trend === 'improving' ? (
              <TrendingUp className="w-3 h-3 text-emerald-500 flex-shrink-0" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-500 flex-shrink-0" />
            )
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden max-w-[120px]">
            {benarPct > 0 && <div className="h-full bg-emerald-500 float-left" style={{ width: `${benarPct}%` }} />}
            {salahPct > 0 && <div className="h-full bg-red-400 float-left" style={{ width: `${salahPct}%` }} />}
          </div>
          <span className="text-[10px] text-slate-500">{ch.benar}B · {ch.salah}S{ch.kosong > 0 ? ` · ${ch.kosong}K` : ''}</span>
        </div>
      </div>
      <span className={cn('text-sm font-black flex-shrink-0', mc.text)}>{ch.accuracy}%</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 3: KUAT & LEMAH — Single comparison chart + compact list
// ═══════════════════════════════════════════════════════════════════════════════

function WeakStrongTab({
  weakest,
  strongest,
}: {
  weakest: (ChapterData & { categoryName: string })[];
  strongest: (ChapterData & { categoryName: string })[];
}) {
  const { mainColor } = useWebsiteSubCategory();

  // Combine into one dataset: strongest first (sorted desc), then weakest (sorted asc)
  const comparisonData = useMemo(() => {
    const items: {
      name: string;
      fullName: string;
      category: string;
      accuracy: number;
      benar: number;
      total: number;
      type: 'strong' | 'weak';
      trend: string;
    }[] = [];

    [...strongest].reverse().forEach((ch) =>
      items.push({
        name: ch.chapterTitle.length > 20 ? ch.chapterTitle.slice(0, 18) + '…' : ch.chapterTitle,
        fullName: ch.chapterTitle,
        category: ch.categoryName,
        accuracy: ch.accuracy,
        benar: ch.benar,
        total: ch.total,
        type: 'strong',
        trend: ch.trend,
      }),
    );
    weakest.forEach((ch) =>
      items.push({
        name: ch.chapterTitle.length > 20 ? ch.chapterTitle.slice(0, 18) + '…' : ch.chapterTitle,
        fullName: ch.chapterTitle,
        category: ch.categoryName,
        accuracy: ch.accuracy,
        benar: ch.benar,
        total: ch.total,
        type: 'weak',
        trend: ch.trend,
      }),
    );
    return items;
  }, [weakest, strongest]);

  const config: ChartConfig = {
    accuracy: { label: 'Akurasi', color: '#64748b' },
  };

  if (comparisonData.length === 0) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="mb-3">
        <h3 className="text-sm font-black text-slate-800">Topik Terkuat vs Terlemah</h3>
        <p className="text-xs text-slate-500">
          Perbandingan chapter dengan akurasi tertinggi dan terendah
        </p>
      </div>
      <ChartContainer config={config} className="h-[280px] md:h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={comparisonData}
            layout="vertical"
            margin={{ top: 5, right: 35, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 10, fill: '#374151', fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              width={160}
            />
            <ReferenceLine x={50} stroke="#eab308" strokeDasharray="4 4" strokeOpacity={0.5} />
            <ReferenceLine x={80} stroke="#22c55e" strokeDasharray="4 4" strokeOpacity={0.3} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const d = payload?.[0]?.payload as { fullName?: string; category?: string; benar?: number; total?: number };
                    return `${d?.fullName || ''} — ${d?.category || ''} (${d?.benar ?? 0}/${d?.total ?? 0} benar)`;
                  }}
                  formatter={(value, _name, item) => {
                    const d = item?.payload as { type?: string };
                    const color = d?.type === 'strong' ? '#22c55e' : '#ef4444';
                    return (
                      <>
                        <div className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: color }} />
                        <span className="text-muted-foreground">Akurasi</span>
                        <span className="ml-auto font-mono font-medium">{value}%</span>
                      </>
                    );
                  }}
                />
              }
            />
            <Bar dataKey="accuracy" radius={[0, 6, 6, 0]} barSize={18}>
              {comparisonData.map((entry, index) => (
                <Cell key={`cmp-${index}`} fill={entry.type === 'strong' ? '#22c55e' : '#ef4444'} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>
      <div className="flex flex-wrap items-center gap-4 mt-2">
        <LegendDot color="#22c55e" label="Topik Kuat" />
        <LegendDot color="#ef4444" label="Topik Lemah" />
        <div className="flex items-center gap-1.5">
          <div className="w-4 border-t border-dashed border-amber-400" />
          <span className="text-[10px] text-slate-500">Batas 50%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 border-t border-dashed border-emerald-300" />
          <span className="text-[10px] text-slate-500">Batas 80%</span>
        </div>
      </div>

      {/* Compact detail below chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {strongest.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">Terkuat</p>
            {strongest.map((ch, i) => (
              <CompactChapterItem key={ch.chapterId} chapter={ch} rank={i + 1} type="strong" />
            ))}
          </div>
        )}
        {weakest.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-red-500">Terlemah</p>
            {weakest.map((ch, i) => (
              <CompactChapterItem key={ch.chapterId} chapter={ch} rank={i + 1} type="weak" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CompactChapterItem({
  chapter: ch,
  rank,
  type,
}: {
  chapter: ChapterData & { categoryName: string };
  rank: number;
  type: 'weak' | 'strong';
}) {
  const isWeak = type === 'weak';
  return (
    <div className="flex items-center gap-2 py-1.5 px-2 rounded-xl bg-slate-50/80">
      <span className={cn('text-[10px] font-black w-4 text-center', isWeak ? 'text-red-500' : 'text-emerald-600')}>
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-700 truncate">{ch.chapterTitle}</p>
        <span className="text-[10px] text-slate-400">{ch.categoryName}</span>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {ch.trend === 'improving' && <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />}
        {ch.trend === 'declining' && <TrendingDown className="w-2.5 h-2.5 text-red-500" />}
        <span className={cn('text-xs font-black', isWeak ? 'text-red-500' : 'text-emerald-600')}>
          {ch.accuracy}%
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED
// ═══════════════════════════════════════════════════════════════════════════════

function SummaryCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="mt-1 flex flex-col">{children}</div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
      <span className="text-[10px] text-slate-500">{label}</span>
    </div>
  );
}

function LoadingState() {
  return (
    <div>
      <SectionTitle icon={Layers3} title="Penguasaan Topik" />
      <Skeleton className="h-[640px] w-full rounded-3xl" />
    </div>
  );
}
