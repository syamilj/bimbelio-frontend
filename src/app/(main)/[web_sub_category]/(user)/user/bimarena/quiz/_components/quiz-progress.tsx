'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Clock,
  Crown,
  FileQuestion,
  Filter,
  Medal,
  SkipForward,
  Target,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from 'recharts';
import { ColorList } from '../_provider/_color-list';
import { useQuizProvider } from '../_provider/_provider';

export function QuizProgress() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const {
    useUserProgress: { UserProgress },
    useUserStatistic: { UserStatistic },
  } = useQuizProvider();

  const userStats = UserStatistic?.userStatistic;

  const chart = UserProgress?.chart;
  const progress = UserProgress?.progress;
  const answerAnalysis = UserProgress?.answerAnalysis;
  const SubCategory = UserProgress?.chart.subCategories || [];
  const compareToTop = UserStatistic?.compareToTop;

  const progressPercentage = progress?.percentage || 0;

  // Filter state for chart
  const [selectedSubtests, setSelectedSubtests] = useState<string[]>(
    SubCategory.map((s) => s.code),
  );
  const [showUserAvg, setShowUserAvg] = useState(true);
  const [showAllStudentsAvg, setShowAllStudentsAvg] = useState(true);

  // Toggle subtest filter
  const toggleSubtest = (code: string) => {
    setSelectedSubtests((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  // Accuracy breakdown data
  const accuracyData = [
    {
      name: 'Benar',
      value: answerAnalysis?.correctAnswers || 0,
      color: '#22c55e',
    },
    {
      name: 'Salah',
      value: answerAnalysis?.wrongAnswers || 0,
      color: '#ef4444',
    },
    {
      name: 'Dilewati',
      value: answerAnalysis?.notAnswered || 0,
      color: '#94a3b8',
    },
  ];

  // Generate line chart data using helper function from quiz-dummy.ts
  const lineChartData = chart?.lineChartData || [];

  // Chart config for shadcn chart
  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};

    SubCategory.forEach((sub, index) => {
      config[sub.id] = {
        label: sub.code,
        color: sub.color,
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

  // Bar chart config for accuracy breakdown
  const barChartConfig: ChartConfig = useMemo(
    () => ({
      benar: {
        label: 'Benar',
        color: '#22c55e',
      },
      salah: {
        label: 'Salah',
        color: '#ef4444',
      },
      dilewati: {
        label: 'Dilewati',
        color: '#94a3b8',
      },
    }),
    [],
  );

  // Radar chart config for subject performance - with comparison
  const radarChartConfig: ChartConfig = useMemo(
    () => ({
      userScore: {
        label: 'Kamu',
        color: mainColor,
      },
      avgScore: {
        label: 'Semua Siswa',
        color: '#94a3b8',
      },
    }),
    [mainColor],
  );

  // Enhanced radar data with comparison to all students average (0-100 scale)
  const enhancedRadarData = chart.radarChartData || [];

  console.log({ radarChartConfig, enhancedRadarData, lineChartData });

  // Top 10 comparison data (0-100 scale) - from quiz-dummy.ts
  // const top10Comparison = useMemo(() => {
  //   return buildTop10Comparison(
  //     subjectPerformance,
  //     userStats.avgScore,
  //     SubCategory,
  //   );
  // }, [subjectPerformance, userStats.avgScore]);

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Overall Progress */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Progress Overview */}
          <div
            className="relative overflow-hidden rounded-3xl md:rounded-3xl p-4 md:p-6 border shadow-sm"
            style={{
              backgroundColor: `${mainColor}05`,
              borderColor: `${mainColor}15`,
            }}
          >
            {/* Decorative gradient */}
            <div
              className="absolute top-0 right-0 w-24 md:w-48 h-24 md:h-48 opacity-20 blur-3xl rounded-full"
              style={{ backgroundColor: mainColor }}
            />
            <div className="relative">
              <h3 className="text-sm md:text-base font-black text-slate-800 mb-3 md:mb-4 flex items-center gap-1.5 md:gap-2">
                <Target
                  className="w-4 h-4 md:w-5 md:h-5"
                  style={{ color: mainColor }}
                />
                Progress Volume
              </h3>
              <div className="flex items-end justify-between mb-3 md:mb-4">
                <div>
                  <p className="text-3xl md:text-5xl font-black text-slate-900">
                    {progress?.totalQuizFinished || '-'}{' '}
                    <span className="text-base md:text-xl text-slate-400 font-bold">
                      / {progress?.totalQuiz || '-'}
                    </span>
                  </p>
                  <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5 md:mt-1">
                    Quiz Diselesaikan
                  </p>
                </div>
                <div
                  className="px-3 md:px-5 py-2 md:py-3 rounded-3xl md:rounded-3xl text-base md:text-xl font-black text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${mainColor}cc)`,
                  }}
                >
                  {progressPercentage.toFixed(0)}%
                </div>
              </div>
              <Progress
                value={progressPercentage}
                className="h-2 md:h-3 rounded-full bg-slate-200"
              />
            </div>
          </div>

          {/* Score Trend Chart - Per Subtest */}
          <div className="bg-white rounded-3xl md:rounded-3xl p-4 md:p-6 border border-slate-100 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 mb-3 md:mb-4">
              <h3 className="text-sm md:text-lg font-black text-slate-800 flex items-center gap-1.5 md:gap-2">
                <TrendingUp
                  className="w-4 h-4 md:w-5 md:h-5"
                  style={{ color: mainColor }}
                />
                Trend Skor (Quiz 1-5)
              </h3>
              <div className="hidden md:flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-500 font-medium">
                  Filter:
                </span>
              </div>
            </div>

            {/* Filter Chips - Horizontal scroll on mobile */}
            <div className="relative">
              <div
                className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <style>{`.filter-chips::-webkit-scrollbar { display: none; }`}</style>
                <div className="filter-chips flex gap-1.5 md:gap-2 mb-3 md:mb-4 min-w-max md:min-w-0 md:flex-wrap">
                  {SubCategory.map((sub, index) => (
                    <button
                      key={index}
                      onClick={() => toggleSubtest(sub.code)}
                      className={cn(
                        'px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all border flex-shrink-0',
                        selectedSubtests.includes(sub.code)
                          ? 'text-white border-transparent'
                          : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300',
                      )}
                      style={
                        selectedSubtests.includes(sub.code)
                          ? { backgroundColor: sub.color }
                          : {}
                      }
                    >
                      {sub.code}
                    </button>
                  ))}
                  <div className="w-px h-5 md:h-6 bg-slate-200 mx-0.5 md:mx-1 flex-shrink-0" />
                  <button
                    onClick={() => setShowUserAvg(!showUserAvg)}
                    className={cn(
                      'px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all border flex-shrink-0',
                      showUserAvg
                        ? 'bg-black text-white border-transparent'
                        : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300',
                    )}
                  >
                    Kamu
                  </button>
                  <button
                    onClick={() => setShowAllStudentsAvg(!showAllStudentsAvg)}
                    className={cn(
                      'px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all border flex-shrink-0',
                      showAllStudentsAvg
                        ? 'bg-slate-400 text-white border-transparent'
                        : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300',
                    )}
                  >
                    Semua
                  </button>
                </div>
              </div>
            </div>

            <ChartContainer
              config={chartConfig}
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
                  dataKey="quiz"
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

                {SubCategory.filter((sub) =>
                  selectedSubtests.includes(sub.code),
                ).map((sub, index) => (
                  <Line
                    key={sub.code}
                    type="monotone"
                    dataKey={sub.id}
                    stroke={sub.color}
                    strokeWidth={2}
                    dot={{ r: 4, fill: sub.color }}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                ))}

                {showUserAvg && (
                  <Line
                    type="monotone"
                    dataKey="userAvg"
                    stroke="#000000"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#000000' }}
                    activeDot={{ r: 7 }}
                    name="Kamu"
                  />
                )}

                {showAllStudentsAvg && (
                  <Line
                    type="monotone"
                    dataKey="allStudentsAvg"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="8 4"
                    dot={{ r: 4, fill: '#94a3b8' }}
                    name="Semua Siswa"
                  />
                )}
              </LineChart>
            </ChartContainer>
          </div>

          {/* Accuracy Breakdown */}
          <div className="bg-white rounded-3xl md:rounded-3xl p-4 md:p-6 border border-slate-100 shadow-sm">
            <h3 className="text-sm md:text-lg font-black text-slate-800 mb-3 md:mb-4 flex items-center gap-1.5 md:gap-2">
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
              Analisis Jawaban
            </h3>
            {/* Stats Grid - 3 columns on all screens */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
              <div className="text-center p-2.5 md:p-5 bg-emerald-50 rounded-3xl md:rounded-3xl border border-emerald-100">
                <CheckCircle2 className="w-6 h-6 md:w-10 md:h-10 text-emerald-500 mx-auto mb-1 md:mb-2" />
                <p className="text-lg md:text-3xl font-black text-emerald-700">
                  {answerAnalysis?.correctAnswers || '-'}
                </p>
                <p className="text-[9px] md:text-xs font-bold text-emerald-600 uppercase">
                  Benar
                </p>
              </div>
              <div className="text-center p-2.5 md:p-5 bg-red-50 rounded-3xl md:rounded-3xl border border-red-100">
                <XCircle className="w-6 h-6 md:w-10 md:h-10 text-red-500 mx-auto mb-1 md:mb-2" />
                <p className="text-lg md:text-3xl font-black text-red-700">
                  {answerAnalysis?.wrongAnswers || '-'}
                </p>
                <p className="text-[9px] md:text-xs font-bold text-red-600 uppercase">
                  Salah
                </p>
              </div>
              <div className="text-center p-2.5 md:p-5 bg-slate-100 rounded-3xl md:rounded-3xl border border-slate-200">
                <SkipForward className="w-6 h-6 md:w-10 md:h-10 text-slate-500 mx-auto mb-1 md:mb-2" />
                <p className="text-lg md:text-3xl font-black text-slate-700">
                  {answerAnalysis?.notAnswered || '-'}
                </p>
                <p className="text-[9px] md:text-xs font-bold text-slate-600 uppercase">
                  Skip
                </p>
              </div>
            </div>
            <ChartContainer
              config={barChartConfig}
              className="h-[140px] md:h-[180px] w-full"
            >
              <BarChart
                data={accuracyData}
                layout="vertical"
                margin={{ left: 10, right: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }}
                  width={70}
                  axisLine={false}
                  tickLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="value"
                  radius={[0, 8, 8, 0]}
                >
                  {accuracyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 md:space-y-6">
          {/* Score Summary Card */}
          <div
            className="relative overflow-hidden rounded-3xl md:rounded-3xl p-4 md:p-6 text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${mainColor}dd)`,
            }}
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-20 md:w-32 h-20 md:h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-16 md:w-24 h-16 md:h-24 bg-white/5 rounded-full blur-xl" />

            <div className="relative">
              <h3 className="text-sm md:text-lg font-black mb-4 md:mb-6 flex items-center gap-1.5 md:gap-2">
                <Medal className="w-4 h-4 md:w-5 md:h-5 text-amber-300" />
                Rata-Rata Nilai
              </h3>
              <div className="text-center mb-4 md:mb-6">
                <div className="text-4xl md:text-6xl font-black tracking-tight mb-1 md:mb-2">
                  {userStats?.averageScore.toFixed(1) || '-'}
                </div>
                <div className="text-white/80 font-bold text-xs md:text-sm bg-white/20 px-3 md:px-4 py-1 md:py-1.5 rounded-full inline-flex items-center gap-1 md:gap-1.5">
                  <TrendingUp className="w-3 h-3 md:w-3.5 md:h-3.5" /> Akurasi{' '}
                  {userStats?.accuracy.toFixed(0) || '-'}%
                </div>
              </div>
              <p className="text-white/70 text-xs md:text-sm text-center leading-relaxed mb-4 md:mb-6">
                Kamu berada di{' '}
                <span className="text-white font-bold">
                  Top {userStats?.topPercentage.toFixed(1) || 0}%
                </span>{' '}
                peserta Volume
              </p>
              <div className="pt-4 md:pt-6 border-t border-white/20 grid grid-cols-2 gap-3 md:gap-4">
                <div className="text-center">
                  <p className="text-white/60 text-[9px] md:text-[10px] uppercase tracking-wider font-bold mb-0.5 md:mb-1">
                    Tertinggi
                  </p>
                  <p className="text-base md:text-xl font-bold">
                    {
                      enhancedRadarData.reduce(
                        (prev, next) => {
                          if (prev.score < next.userScore) {
                            return {
                              subject: next.subject,
                              score: next.userScore,
                            };
                          }
                          return prev;
                        },
                        { subject: '', score: 0 },
                      ).subject
                    }
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-white/60 text-[9px] md:text-[10px] uppercase tracking-wider font-bold mb-0.5 md:mb-1">
                    Terendah
                  </p>
                  <p className="text-base md:text-xl font-bold">
                    {
                      enhancedRadarData.reduce(
                        (prev, next) => {
                          if (prev.score > next.userScore) {
                            return {
                              subject: next.subject,
                              score: next.userScore,
                            };
                          }
                          return prev;
                        },
                        { subject: '', score: 100 },
                      ).subject
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Radar Chart - Subject Performance with Comparison */}
          <div className="bg-white rounded-3xl md:rounded-3xl p-4 md:p-6 border border-slate-100 shadow-sm">
            <h3 className="text-xs md:text-sm font-black text-slate-800 mb-1.5 md:mb-2 flex items-center gap-1.5 md:gap-2">
              <FileQuestion
                className="w-3.5 h-3.5 md:w-4 md:h-4"
                style={{ color: mainColor }}
              />
              Performa per Subtes
            </h3>
            <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <div className="flex items-center gap-1.5 md:gap-2">
                <div
                  className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full"
                  style={{ backgroundColor: mainColor }}
                />
                <span className="text-[10px] md:text-xs font-bold text-slate-600">
                  Kamu
                </span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-slate-400" />
                <span className="text-[10px] md:text-xs font-bold text-slate-600">
                  Semua
                </span>
              </div>
            </div>
            <ChartContainer
              config={radarChartConfig}
              className="h-[220px] md:h-[300px] w-full"
            >
              <RadarChart
                data={enhancedRadarData}
                outerRadius="75%"
              >
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 9, fill: '#94a3b8' }}
                />
                <Radar
                  name="Semua Siswa"
                  dataKey="avgScore"
                  stroke="#94a3b8"
                  fill="#94a3b8"
                  fillOpacity={0.15}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
                <Radar
                  name="Kamu"
                  dataKey="userScore"
                  stroke={mainColor}
                  fill={mainColor}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadarChart>
            </ChartContainer>
          </div>

          {/* Time Stats */}
          <div
            className="relative overflow-hidden rounded-3xl md:rounded-3xl p-4 md:p-6 border shadow-sm"
            style={{
              backgroundColor: `${mainColor}08`,
              borderColor: `${mainColor}15`,
            }}
          >
            <h3 className="text-xs md:text-sm font-black text-slate-800 mb-2 md:mb-4 flex items-center gap-1.5 md:gap-2">
              <Clock
                className="w-3.5 h-3.5 md:w-4 md:h-4"
                style={{ color: mainColor }}
              />
              Waktu Pengerjaan
            </h3>
            <div className="text-center">
              <p
                className="text-2xl md:text-4xl font-black"
                style={{ color: mainColor }}
              >
                {userStats?.averageTime.toFixed(1) || '-'} menit
              </p>
              <p className="text-[10px] md:text-xs font-medium text-slate-500 mt-0.5 md:mt-1">
                Rata-rata per quiz
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top 10 Comparison */}
      {compareToTop && (
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl md:rounded-3xl p-4 md:p-6 border border-amber-200 shadow-sm">
          <div className="absolute top-0 right-0 w-24 md:w-40 h-24 md:h-40 bg-amber-300/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex items-center justify-between gap-2 mb-4 md:mb-5">
              <h3 className="text-sm md:text-lg font-black text-slate-800 flex items-center gap-1.5 md:gap-2">
                <Crown className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                vs Top {compareToTop.topNumber}
              </h3>
            </div>

            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0">
              <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-5 min-w-max md:min-w-0">
                <div className="bg-white rounded-3xl md:rounded-3xl p-3 md:p-5 border border-amber-100 shadow-sm flex-shrink-0 w-[140px] md:w-auto">
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-2 md:mb-3">
                    Rata-rata
                  </p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] md:text-xs text-slate-500">
                        Kamu
                      </p>
                      <p className="text-lg md:text-2xl font-black text-slate-800">
                        {compareToTop.averageScore.user.toFixed(1)}
                      </p>
                    </div>
                    <div className="text-center px-1 md:px-3">
                      {compareToTop.averageScore.user >=
                      compareToTop.averageScore.top ? (
                        <ArrowUp className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 mx-auto" />
                      ) : (
                        <ArrowDown className="w-4 h-4 md:w-5 md:h-5 text-red-500 mx-auto" />
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] md:text-xs text-amber-600">
                        Top {compareToTop.topNumber}
                      </p>
                      <p className="text-lg md:text-2xl font-black text-amber-600">
                        {compareToTop.averageScore.top.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-3xl md:rounded-3xl p-3 md:p-5 border border-amber-100 shadow-sm flex-shrink-0 w-[140px] md:w-auto">
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-2 md:mb-3">
                    Total Skor
                  </p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] md:text-xs text-slate-500">
                        Kamu
                      </p>
                      <p className="text-lg md:text-2xl font-black text-slate-800">
                        {compareToTop.totalScore.user}
                      </p>
                    </div>
                    <div className="text-center px-1 md:px-3">
                      {compareToTop.totalScore.user >=
                      compareToTop.totalScore.top ? (
                        <ArrowUp className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 mx-auto" />
                      ) : (
                        <ArrowDown className="w-4 h-4 md:w-5 md:h-5 text-red-500 mx-auto" />
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] md:text-xs text-amber-600">
                        Top {compareToTop.topNumber}
                      </p>
                      <p className="text-lg md:text-2xl font-black text-amber-600">
                        {compareToTop.totalScore.top}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl md:rounded-3xl p-3 md:p-5 border border-amber-100 shadow-sm flex-shrink-0 w-[140px] md:w-auto">
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-2 md:mb-3">
                    Akurasi
                  </p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] md:text-xs text-slate-500">
                        Kamu
                      </p>
                      <p className="text-lg md:text-2xl font-black text-slate-800">
                        {compareToTop.accuracy.user.toFixed(0)}%
                      </p>
                    </div>
                    <div className="text-center px-1 md:px-3">
                      {compareToTop.accuracy.user >=
                      compareToTop.accuracy.top ? (
                        <ArrowUp className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 mx-auto" />
                      ) : (
                        <ArrowDown className="w-4 h-4 md:w-5 md:h-5 text-red-500 mx-auto" />
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] md:text-xs text-amber-600">
                        Top {compareToTop.topNumber}
                      </p>
                      <p className="text-lg md:text-2xl font-black text-amber-600">
                        {compareToTop.accuracy.top.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl md:rounded-3xl p-3 md:p-5 border border-amber-100 shadow-sm flex-shrink-0 w-[140px] md:w-auto">
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-2 md:mb-3">
                    Jarak Top {compareToTop.topNumber}
                  </p>
                  <div className="text-center">
                    <p
                      className="text-xl md:text-3xl font-black"
                      style={{ color: mainColor }}
                    >
                      {compareToTop.differenceRank}
                    </p>
                    <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 md:mt-1">
                      Peringkat
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl md:rounded-3xl p-3 md:p-5 border border-amber-100 shadow-sm">
              <p className="text-[10px] md:text-xs font-bold text-slate-600 mb-3 md:mb-4">
                Gap per Subtes
              </p>

              <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0 pb-2 md:pb-0">
                <div className="space-y-4 md:space-y-6 min-w-max md:min-w-0">
                  {compareToTop.subTesGap.map((item) => {
                    const accuracyGap =
                      item.gap.accuracy.user - item.gap.accuracy.top;
                    const avgGap =
                      item.gap.averageScore.user - item.gap.averageScore.top;
                    const totalGap =
                      item.gap.totalScore.user - item.gap.totalScore.top;

                    return (
                      <div key={item.code}>
                        {/* Subtest Header */}
                        <p className="text-[10px] md:text-xs font-bold text-slate-700 mb-2 md:mb-3">
                          {item.code} - {item.name}
                        </p>

                        {/* Three Cards Row - Flex Layout */}
                        <div className="flex md:grid md:grid-cols-3 gap-2 md:gap-3">
                          {/* Total Score Card */}
                          <div className="bg-white rounded-3xl p-3 md:p-5 border border-blue-100 shadow-sm flex-shrink-0 w-[140px] md:w-auto">
                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-2 md:mb-3">
                              Total Skor
                            </p>
                            <div className="flex items-end justify-between">
                              <div>
                                <p className="text-[10px] md:text-xs text-slate-500">
                                  Kamu
                                </p>
                                <p className="text-lg md:text-2xl font-black text-slate-800">
                                  {item.gap.totalScore.user.toFixed(0)}
                                </p>
                              </div>
                              <div className="text-center px-1 md:px-3">
                                {item.gap.totalScore.user >=
                                item.gap.totalScore.top ? (
                                  <ArrowUp className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 mx-auto" />
                                ) : (
                                  <ArrowDown className="w-4 h-4 md:w-5 md:h-5 text-red-500 mx-auto" />
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] md:text-xs text-blue-600">
                                  Top {compareToTop.topNumber}
                                </p>
                                <p className="text-lg md:text-2xl font-black text-blue-600">
                                  {item.gap.totalScore.top.toFixed(0)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Average Score Card */}
                          <div className="bg-white rounded-3xl p-3 md:p-5 border border-purple-100 shadow-sm flex-shrink-0 w-[140px] md:w-auto">
                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-2 md:mb-3">
                              Rata-rata
                            </p>
                            <div className="flex items-end justify-between">
                              <div>
                                <p className="text-[10px] md:text-xs text-slate-500">
                                  Kamu
                                </p>
                                <p className="text-lg md:text-2xl font-black text-slate-800">
                                  {item.gap.averageScore.user.toFixed(1)}
                                </p>
                              </div>
                              <div className="text-center px-1 md:px-3">
                                {item.gap.averageScore.user >=
                                item.gap.averageScore.top ? (
                                  <ArrowUp className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 mx-auto" />
                                ) : (
                                  <ArrowDown className="w-4 h-4 md:w-5 md:h-5 text-red-500 mx-auto" />
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] md:text-xs text-purple-600">
                                  Top {compareToTop.topNumber}
                                </p>
                                <p className="text-lg md:text-2xl font-black text-purple-600">
                                  {item.gap.averageScore.top.toFixed(1)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Accuracy Card */}
                          <div className="bg-white rounded-3xl p-3 md:p-5 border border-amber-100 shadow-sm flex-shrink-0 w-[140px] md:w-auto">
                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-2 md:mb-3">
                              Akurasi
                            </p>
                            <div className="flex items-end justify-between">
                              <div>
                                <p className="text-[10px] md:text-xs text-slate-500">
                                  Kamu
                                </p>
                                <p className="text-lg md:text-2xl font-black text-slate-800">
                                  {item.gap.accuracy.user.toFixed(0)}%
                                </p>
                              </div>
                              <div className="text-center px-1 md:px-3">
                                {item.gap.accuracy.user >=
                                item.gap.accuracy.top ? (
                                  <ArrowUp className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 mx-auto" />
                                ) : (
                                  <ArrowDown className="w-4 h-4 md:w-5 md:h-5 text-red-500 mx-auto" />
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] md:text-xs text-amber-600">
                                  Top {compareToTop.topNumber}
                                </p>
                                <p className="text-lg md:text-2xl font-black text-amber-600">
                                  {item.gap.accuracy.top.toFixed(0)}%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Per Category Progress */}
      <div
        className="relative overflow-hidden rounded-3xl md:rounded-3xl p-4 md:p-6 border shadow-sm"
        style={{
          backgroundColor: `${mainColor}05`,
          borderColor: `${mainColor}15`,
        }}
      >
        <h3 className="text-sm md:text-lg font-black text-slate-800 mb-3 md:mb-5">
          Progress per Subtes
        </h3>
        {/* Horizontal scroll on mobile */}
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0">
          <div className="flex md:grid md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4 min-w-max md:min-w-0">
            {progress?.subCategories.map((sub, index) => {
              return (
                <div
                  key={index}
                  className="rounded-3xl md:rounded-3xl p-3 md:p-5 bg-white border border-slate-100 hover:shadow-lg transition-all shadow-sm flex-shrink-0 w-[100px] md:w-auto"
                >
                  <div
                    className="w-8 h-8 md:w-11 md:h-11 rounded-3xl md:rounded-3xl flex items-center justify-center mb-2 md:mb-3 shadow-sm"
                    style={{
                      backgroundColor: ColorList[index % ColorList.length],
                    }}
                  >
                    <FileQuestion className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <p className="font-bold text-slate-700 text-xs md:text-sm">
                    {sub.name}
                  </p>
                  <p className="text-lg md:text-2xl font-black text-slate-900 mt-0.5 md:mt-1">
                    {sub.totalFinished}
                    <span className="text-[10px] md:text-sm text-slate-400 font-bold">
                      /{sub.total}
                    </span>
                  </p>
                  <div className="mt-2 md:mt-3 h-1.5 md:h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${sub.percentage}%`,
                        backgroundColor: ColorList[index % ColorList.length],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
