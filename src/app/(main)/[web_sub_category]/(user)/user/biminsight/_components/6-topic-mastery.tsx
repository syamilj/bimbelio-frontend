'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { useGet } from '@/lib/fetch-helper/useGet';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Flame,
  Layers3,
  ShieldAlert,
  Sparkles,
  Target,
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
  Label,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from 'recharts';
import { SectionLabel, StatPill } from './_primitives';
import { SectionTitle } from './section-title';

// --- Types -------------------------------------------------------------------

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

// --- Mastery palette ---------------------------------------------------------

const MASTERY = {
  strong: {
    label: 'Kuat',
    color: '#22c55e',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    badge: 'border-emerald-200 text-emerald-700 bg-emerald-50',
  },
  moderate: {
    label: 'Sedang',
    color: '#f59e0b',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    badge: 'border-amber-200 text-amber-700 bg-amber-50',
  },
  weak: {
    label: 'Lemah',
    color: '#ef4444',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-600',
    badge: 'border-red-200 text-red-600 bg-red-50',
  },
} as const;

// --- Main export -------------------------------------------------------------

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
        <TopicMasteryCard
          key={group.webSubId}
          group={group}
          showLabel={data.length > 1}
        />
      ))}
    </div>
  );
};

// =============================================================================
// TopicMasteryCard --- single scrollable flow (no tabs)
// =============================================================================

function TopicMasteryCard({
  group,
  showLabel,
}: {
  group: WebSubGroup;
  showLabel: boolean;
}) {
  const { mainColor } = useWebsiteSubCategory();
  const s = group.summary;

  return (
    <Card className="w-full overflow-hidden border-0 shadow-lg shadow-slate-200/60">
      {/* -- 1. Hero banner -- */}
      <div
        className="px-5 pt-6 pb-5"
        style={{
          background: `linear-gradient(135deg, ${mainColor}08 0%, ${mainColor}18 100%)`,
        }}
      >
        {showLabel && (
          <p
            className="text-[11px] font-bold uppercase tracking-widest mb-3"
            style={{ color: mainColor }}
          >
            {group.webSubName}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Accuracy gauge */}
          <AccuracyGauge accuracy={s.overallAccuracy} mainColor={mainColor} />

          {/* Stat pills */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2.5 w-full">
            <StatPill
              label="Total Soal"
              value={`${s.totalQuestions}`}
              sub={`${s.totalCategories} kategori`}
              icon={<BookOpen className="w-3.5 h-3.5" />}
              color="#64748b"
            />
            <StatPill
              label="Akurasi"
              value={`${s.overallAccuracy}%`}
              sub={`${s.totalBenar}/${s.totalQuestions}`}
              icon={<Target className="w-3.5 h-3.5" />}
              color={mainColor}
            />
            <StatPill
              label="Topik Kuat"
              value={`${s.strongCount}`}
              sub={'\u2265 80%'}
              icon={<Sparkles className="w-3.5 h-3.5" />}
              color="#22c55e"
            />
            <StatPill
              label="Perlu Fokus"
              value={`${s.weakCount}`}
              sub="< 50%"
              icon={<ShieldAlert className="w-3.5 h-3.5" />}
              color="#ef4444"
            />
          </div>
        </div>
      </div>

      <CardContent className="space-y-5 px-5 py-5">
        {/* -- 2. Category overview bar chart -- */}
        <CategoryBarChart categories={group.categories} mainColor={mainColor} />

        {/* -- 3. Category deep-dive cards -- */}
        <div>
          <SectionLabel title="Detail Per Kategori" />
          <div className="space-y-3 mt-3">
            {group.categories.map((cat) => (
              <CategoryCard key={cat.categoryId} category={cat} />
            ))}
          </div>
        </div>

        {/* -- 4. Focus areas: strongest + weakest -- */}
        {(group.strongestChapters.length > 0 ||
          group.weakestChapters.length > 0) && (
          <FocusAreas
            strongest={group.strongestChapters}
            weakest={group.weakestChapters}
          />
        )}

      </CardContent>
    </Card>
  );
}

// =============================================================================
// 1. Accuracy Gauge --- radial progress ring
// =============================================================================

function AccuracyGauge({
  accuracy,
  mainColor,
}: {
  accuracy: number;
  mainColor: string;
}) {
  const gaugeData = useMemo(
    () => [
      { name: 'filled', value: accuracy, fill: mainColor },
      { name: 'empty', value: 100 - accuracy, fill: '#e2e8f0' },
    ],
    [accuracy, mainColor],
  );

  const gaugeConfig: ChartConfig = {
    filled: { label: 'Akurasi', color: mainColor },
    empty: { label: '', color: '#e2e8f0' },
  };

  return (
    <div className="flex-shrink-0">
      <ChartContainer config={gaugeConfig} className="h-[120px] w-[120px]">
        <PieChart>
          <Pie
            data={gaugeData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={54}
            startAngle={90}
            endAngle={-270}
            paddingAngle={0}
            stroke="none"
          >
            {gaugeData.map((d, i) => (
              <Cell key={i} fill={d.fill} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 4}
                        className="fill-slate-800 text-xl font-black"
                      >
                        {accuracy}%
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 14}
                        className="fill-slate-400 text-[9px] font-semibold uppercase tracking-wider"
                      >
                        Akurasi
                      </tspan>
                    </text>
                  );
                }
                return null;
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}

// =============================================================================
// 2. Category horizontal bar chart --- accuracy per category
// =============================================================================

function CategoryBarChart({
  categories,
  mainColor,
}: {
  categories: CategoryData[];
  mainColor: string;
}) {
  const data = useMemo(
    () =>
      [...categories]
        .sort((a, b) => b.accuracy - a.accuracy)
        .map((cat) => ({
          name:
            cat.categoryName.length > 25
              ? cat.categoryName.slice(0, 23) + '\u2026'
              : cat.categoryName,
          fullName: cat.categoryName,
          accuracy: cat.accuracy,
          total: cat.total,
          mastery: cat.mastery,
          fill: MASTERY[cat.mastery].color,
        })),
    [categories],
  );

  const barConfig: ChartConfig = {
    accuracy: { label: 'Akurasi', color: mainColor },
  };

  if (data.length === 0) return null;

  const chartHeight = Math.max(180, data.length * 44);

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4">
      <SectionLabel
        title="Akurasi Per Kategori"
        sub={`${categories.length} kategori \u00b7 diurutkan dari tertinggi`}
      />
      <ChartContainer
        config={barConfig}
        className="w-full mt-3"
        style={{ height: chartHeight }}
      >
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 48, left: 8, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            horizontal={false}
          />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fontSize: 11, fill: '#334155', fontWeight: 700 }}
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => {
                  const d = payload?.[0]?.payload as {
                    fullName?: string;
                    total?: number;
                  };
                  return `${d?.fullName} \u2014 ${d?.total} soal`;
                }}
                formatter={(value, _, item) => {
                  const d = item.payload as { fill: string };
                  return (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                        style={{ backgroundColor: d.fill }}
                      />
                      <span className="text-muted-foreground">Akurasi</span>
                      <span className="ml-auto font-mono font-medium">
                        {value}%
                      </span>
                    </>
                  );
                }}
              />
            }
          />
          <Bar dataKey="accuracy" radius={[0, 8, 8, 0]} barSize={22}>
            {data.map((entry) => (
              <Cell key={entry.fullName} fill={entry.fill} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}

// =============================================================================
// 3. Category card --- detailed category view with chapters
// =============================================================================

function CategoryCard({ category: cat }: { category: CategoryData }) {
  const [expanded, setExpanded] = useState(false);
  const m = MASTERY[cat.mastery];

  // Stacked progress ratios
  const benarPct = cat.total > 0 ? (cat.benar / cat.total) * 100 : 0;
  const salahPct = cat.total > 0 ? (cat.salah / cat.total) * 100 : 0;
  const kosongPct = cat.total > 0 ? (cat.kosong / cat.total) * 100 : 0;

  // Chapter chart data (top 8 by question count)
  const chapterChartData = useMemo(
    () =>
      cat.chapters
        .slice()
        .sort((a, b) => b.total - a.total)
        .slice(0, 8)
        .map((ch) => ({
          name:
            ch.chapterTitle.length > 20
              ? ch.chapterTitle.slice(0, 18) + '\u2026'
              : ch.chapterTitle,
          fullName: ch.chapterTitle,
          accuracy: ch.accuracy,
          total: ch.total,
          fill: MASTERY[ch.mastery].color,
        })),
    [cat.chapters],
  );

  const chapterConfig: ChartConfig = {
    accuracy: { label: 'Akurasi', color: m.color },
  };

  const showChart = chapterChartData.length > 1;
  const showChapters = cat.chapters.length > 0;

  return (
    <div
      className={cn(
        'rounded-3xl border bg-white overflow-hidden transition-all',
        m.border,
      )}
    >
      {/* Header --- always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50/60 transition-colors"
      >
        {/* Left: mastery indicator dot */}
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: m.color }}
        />

        {/* Middle: name + stacked bar */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-800 truncate">
              {cat.categoryName}
            </h4>
            <Badge
              variant="outline"
              className={cn('text-[10px] font-bold flex-shrink-0', m.badge)}
            >
              {m.label}
            </Badge>
          </div>

          {/* Stacked progress bar */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden max-w-[200px] flex">
              {benarPct > 0 && (
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${benarPct}%` }}
                />
              )}
              {salahPct > 0 && (
                <div
                  className="h-full bg-red-400"
                  style={{ width: `${salahPct}%` }}
                />
              )}
              {kosongPct > 0 && (
                <div
                  className="h-full bg-slate-300"
                  style={{ width: `${kosongPct}%` }}
                />
              )}
            </div>
            <span className="text-[10px] text-slate-400 flex-shrink-0 tabular-nums">
              {cat.benar}B {'\u00b7'} {cat.salah}S
              {cat.kosong > 0 ? ` \u00b7 ${cat.kosong}K` : ''}
            </span>
          </div>
        </div>

        {/* Right: accuracy + chevron */}
        <span
          className={cn(
            'text-lg font-black tabular-nums flex-shrink-0',
            m.text,
          )}
        >
          {cat.accuracy}%
        </span>
        {showChapters &&
          (expanded ? (
            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
          ))}
      </button>

      {/* Expanded content */}
      {expanded && showChapters && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3">
          {/* Mini chapter bar chart */}
          {showChart && (
            <div className="rounded-xl bg-slate-50/80 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Akurasi Chapter (top {chapterChartData.length})
              </p>
              <ChartContainer
                config={chapterConfig}
                className="w-full"
                style={{
                  height: Math.max(140, chapterChartData.length * 30),
                }}
              >
                <BarChart
                  data={chapterChartData}
                  layout="vertical"
                  margin={{ top: 0, right: 40, left: 4, bottom: 0 }}
                >
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 9, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(_, payload) => {
                          const d = payload?.[0]?.payload as {
                            fullName?: string;
                          };
                          return d?.fullName || '';
                        }}
                        formatter={(value, _, item) => {
                          const d = item.payload as {
                            total: number;
                            fill: string;
                          };
                          return (
                            <>
                              <div
                                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                                style={{ backgroundColor: d.fill }}
                              />
                              <span className="text-muted-foreground">
                                Akurasi
                              </span>
                              <span className="ml-auto font-mono font-medium">
                                {value}% {'\u00b7'} {d.total} soal
                              </span>
                            </>
                          );
                        }}
                      />
                    }
                  />
                  <Bar
                    dataKey="accuracy"
                    radius={[0, 6, 6, 0]}
                    barSize={16}
                  >
                    {chapterChartData.map((item) => (
                      <Cell
                        key={item.fullName}
                        fill={item.fill}
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          )}

          {/* Chapter rows */}
          <div className="space-y-1.5">
            {cat.chapters.map((ch) => (
              <ChapterRow key={ch.chapterId} chapter={ch} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ChapterRow({ chapter: ch }: { chapter: ChapterData }) {
  const m = MASTERY[ch.mastery];
  const pct = ch.total > 0 ? (ch.benar / ch.total) * 100 : 0;

  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50/80 transition-colors">
      {/* Tiny mastery dot */}
      <div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: m.color }}
      />

      {/* Chapter name + trend */}
      <div className="flex-1 min-w-0 flex items-center gap-1.5">
        <p className="text-xs font-semibold text-slate-700 truncate">
          {ch.chapterTitle}
        </p>
        {ch.trend === 'improving' && (
          <TrendingUp className="w-3 h-3 text-emerald-500 flex-shrink-0" />
        )}
        {ch.trend === 'declining' && (
          <TrendingDown className="w-3 h-3 text-red-500 flex-shrink-0" />
        )}
      </div>

      {/* Inline micro-bar */}
      <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden flex-shrink-0">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: m.color }}
        />
      </div>

      {/* Stats */}
      <span className="text-[10px] text-slate-400 tabular-nums flex-shrink-0 w-[72px] text-right">
        {ch.benar}B {'\u00b7'} {ch.salah}S
        {ch.kosong > 0 ? ` \u00b7 ${ch.kosong}K` : ''}
      </span>
      <span
        className={cn(
          'text-xs font-black tabular-nums flex-shrink-0 w-[38px] text-right',
          m.text,
        )}
      >
        {ch.accuracy}%
      </span>
    </div>
  );
}

// =============================================================================
// 4. Focus Areas --- strongest & weakest chapters
// =============================================================================

function FocusAreas({
  strongest,
  weakest,
}: {
  strongest: (ChapterData & { categoryName: string })[];
  weakest: (ChapterData & { categoryName: string })[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {strongest.length > 0 && (
        <FocusColumn
          title="Topik Terkuat"
          icon={<Sparkles className="w-3.5 h-3.5" />}
          chapters={strongest}
          type="strong"
          accentColor="#22c55e"
          gradientFrom="from-emerald-50"
        />
      )}
      {weakest.length > 0 && (
        <FocusColumn
          title="Perlu Diperkuat"
          icon={<Flame className="w-3.5 h-3.5" />}
          chapters={weakest}
          type="weak"
          accentColor="#ef4444"
          gradientFrom="from-red-50"
        />
      )}
    </div>
  );
}

function FocusColumn({
  title,
  icon,
  chapters,
  type,
  accentColor,
  gradientFrom,
}: {
  title: string;
  icon: React.ReactNode;
  chapters: (ChapterData & { categoryName: string })[];
  type: 'strong' | 'weak';
  accentColor: string;
  gradientFrom: string;
}) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-slate-100 overflow-hidden bg-gradient-to-b to-white',
        gradientFrom,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        <div
          className="flex h-6 w-6 items-center justify-center rounded-lg text-white"
          style={{ backgroundColor: accentColor }}
        >
          {icon}
        </div>
        <span className="text-xs font-bold text-slate-700">{title}</span>
      </div>

      {/* Items */}
      <div className="px-3 pb-3 space-y-1">
        {chapters.map((ch, i) => (
          <FocusItem key={ch.chapterId} chapter={ch} rank={i + 1} type={type} />
        ))}
      </div>
    </div>
  );
}

function FocusItem({
  chapter: ch,
  rank,
  type,
}: {
  chapter: ChapterData & { categoryName: string };
  rank: number;
  type: 'strong' | 'weak';
}) {
  const m = MASTERY[type === 'strong' ? 'strong' : 'weak'];
  const pct = ch.total > 0 ? (ch.benar / ch.total) * 100 : 0;

  return (
    <div className="flex items-center gap-2 px-2 py-2 rounded-xl bg-white/70 hover:bg-white transition-colors">
      <span
        className={cn(
          'text-[10px] font-black w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0',
          type === 'strong'
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-red-100 text-red-600',
        )}
      >
        {rank}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-700 truncate leading-tight">
          {ch.chapterTitle}
        </p>
        <span className="text-[10px] text-slate-400 leading-tight">
          {ch.categoryName}
        </span>
      </div>

      {/* Trend */}
      {ch.trend !== 'stable' &&
        (ch.trend === 'improving' ? (
          <TrendingUp className="w-3 h-3 text-emerald-500 flex-shrink-0" />
        ) : (
          <TrendingDown className="w-3 h-3 text-red-500 flex-shrink-0" />
        ))}

      {/* Mini bar + accuracy */}
      <div className="w-12 h-1.5 rounded-full bg-slate-100 overflow-hidden flex-shrink-0">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: m.color }}
        />
      </div>
      <span
        className={cn('text-xs font-black tabular-nums flex-shrink-0', m.text)}
      >
        {ch.accuracy}%
      </span>
    </div>
  );
}

function LoadingState() {
  return (
    <div>
      <SectionTitle icon={Layers3} title="Penguasaan Topik" />
      <div className="space-y-4">
        <Skeleton className="h-[180px] w-full rounded-3xl" />
        <Skeleton className="h-[300px] w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[200px] rounded-3xl" />
          <Skeleton className="h-[200px] rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
