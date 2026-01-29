'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { type ChartConfig } from '@/components/ui/chart';
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
import { ColorList } from '../_provider/_color-list';
import { useQuizProvider } from './dummy-data/useQuizProvider';

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

  console.log({ UserProgress2: UserProgress });

  // Top 10 comparison data (0-100 scale) - from quiz-dummy.ts
  // const top10Comparison = useMemo(() => {
  //   return buildTop10Comparison(
  //     subjectPerformance,
  //     userStats.avgScore,
  //     SubCategory,
  //   );
  // }, [subjectPerformance, userStats.avgScore]);

  return (
    <div
      id="quiz-progress"
      className="p-3 md:p-6 space-y-4 md:space-y-6"
    >
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
                  {SubCategory.map((sub) => (
                    <button
                      key={sub.code}
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

            {/* <ChartContainer
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
            </ChartContainer> */}
            <Chart1 />
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
            {/* <ChartContainer
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
            </ChartContainer> */}
            <Chart3 />
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
            {/* <ChartContainer
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
            </ChartContainer> */}
            <Chart2 />
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

const Chart1 = () => {
  const html = `<div data-chart="chart-_r_1n_" class="flex aspect-video justify-center text-xs [&amp;_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&amp;_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&amp;_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&amp;_.recharts-dot[stroke='#fff']]:stroke-transparent [&amp;_.recharts-layer]:outline-none [&amp;_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&amp;_.recharts-radial-bar-background-sector]:fill-muted [&amp;_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&amp;_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&amp;_.recharts-sector[stroke='#fff']]:stroke-transparent [&amp;_.recharts-sector]:outline-none [&amp;_.recharts-surface]:outline-none h-[280px] md:h-[350px] w-full"><style>
 [data-chart=chart-_r_1n_] {
  --color-subcat_001: #0091FF;
  --color-subcat_002: #22c55e;
  --color-subcat_003: #eab308;
  --color-subcat_004: #ef4444;
  --color-subcat_005: #6366f1;
  --color-subcat_006: #a855f7;
}
</style><div class="recharts-responsive-container" style="width: 100%; height: 100%; min-width: 0px;"><div style="width: 0px; height: 0px; overflow: visible;"><div width="215" height="280" class="recharts-wrapper" style="position: relative; cursor: default; width: 215px; height: 280px;"><div xmlns="http://www.w3.org/1999/xhtml" tabindex="-1" class="recharts-tooltip-wrapper" style="visibility: hidden; pointer-events: none; position: absolute; top: 0px; left: 0px;"></div><div class="recharts-legend-wrapper" style="position: absolute; width: 165px; height: auto; left: 20px; bottom: 5px;"><div class="flex items-center justify-center gap-4 pt-3"><div class="flex items-center gap-1.5 [&amp;&gt;svg]:h-3 [&amp;&gt;svg]:w-3 [&amp;&gt;svg]:text-muted-foreground"><div class="h-2 w-2 shrink-0 rounded-[2px]" style="background-color: rgb(0, 0, 0);"></div></div><div class="flex items-center gap-1.5 [&amp;&gt;svg]:h-3 [&amp;&gt;svg]:w-3 [&amp;&gt;svg]:text-muted-foreground"><div class="h-2 w-2 shrink-0 rounded-[2px]" style="background-color: rgb(148, 163, 184);"></div></div><div class="flex items-center gap-1.5 [&amp;&gt;svg]:h-3 [&amp;&gt;svg]:w-3 [&amp;&gt;svg]:text-muted-foreground"><div class="h-2 w-2 shrink-0 rounded-[2px]" style="background-color: rgb(0, 145, 255);"></div>ARITH</div><div class="flex items-center gap-1.5 [&amp;&gt;svg]:h-3 [&amp;&gt;svg]:w-3 [&amp;&gt;svg]:text-muted-foreground"><div class="h-2 w-2 shrink-0 rounded-[2px]" style="background-color: rgb(34, 197, 94);"></div>ALG</div><div class="flex items-center gap-1.5 [&amp;&gt;svg]:h-3 [&amp;&gt;svg]:w-3 [&amp;&gt;svg]:text-muted-foreground"><div class="h-2 w-2 shrink-0 rounded-[2px]" style="background-color: rgb(234, 179, 8);"></div>GEOM</div><div class="flex items-center gap-1.5 [&amp;&gt;svg]:h-3 [&amp;&gt;svg]:w-3 [&amp;&gt;svg]:text-muted-foreground"><div class="h-2 w-2 shrink-0 rounded-[2px]" style="background-color: rgb(239, 68, 68);"></div>TRIG</div><div class="flex items-center gap-1.5 [&amp;&gt;svg]:h-3 [&amp;&gt;svg]:w-3 [&amp;&gt;svg]:text-muted-foreground"><div class="h-2 w-2 shrink-0 rounded-[2px]" style="background-color: rgb(99, 102, 241);"></div>STAT</div><div class="flex items-center gap-1.5 [&amp;&gt;svg]:h-3 [&amp;&gt;svg]:w-3 [&amp;&gt;svg]:text-muted-foreground"><div class="h-2 w-2 shrink-0 rounded-[2px]" style="background-color: rgb(168, 85, 247);"></div>PROB</div></div></div><svg role="application" tabindex="0" class="recharts-surface" width="215" height="280" viewBox="0 0 215 280" style="width: 100%; height: 100%; display: block;"><title></title><desc></desc><g tabindex="-1" id="recharts-zindex--100-_r_1q_"><g class="recharts-cartesian-grid"><g class="recharts-cartesian-grid-horizontal"><line stroke-dasharray="3 3" stroke="#e2e8f0" fill="none" x="80" y="5" width="105" height="212" x1="80" y1="217" x2="185" y2="217"></line><line stroke-dasharray="3 3" stroke="#e2e8f0" fill="none" x="80" y="5" width="105" height="212" x1="80" y1="164" x2="185" y2="164"></line><line stroke-dasharray="3 3" stroke="#e2e8f0" fill="none" x="80" y="5" width="105" height="212" x1="80" y1="111" x2="185" y2="111"></line><line stroke-dasharray="3 3" stroke="#e2e8f0" fill="none" x="80" y="5" width="105" height="212" x1="80" y1="58" x2="185" y2="58"></line><line stroke-dasharray="3 3" stroke="#e2e8f0" fill="none" x="80" y="5" width="105" height="212" x1="80" y1="5" x2="185" y2="5"></line></g><g class="recharts-cartesian-grid-vertical"><line stroke-dasharray="3 3" stroke="#e2e8f0" fill="none" x="80" y="5" width="105" height="212" x1="122" y1="5" x2="122" y2="217"></line><line stroke-dasharray="3 3" stroke="#e2e8f0" fill="none" x="80" y="5" width="105" height="212" x1="185" y1="5" x2="185" y2="217"></line><line stroke-dasharray="3 3" stroke="#e2e8f0" fill="none" x="80" y="5" width="105" height="212" x1="80" y1="5" x2="80" y2="217"></line></g></g></g><g tabindex="-1" id="recharts-zindex--50-_r_1r_"></g><defs><clipPath id="recharts1-clip"><rect x="80" y="5" height="212" width="105"></rect></clipPath></defs><g tabindex="-1" id="recharts-zindex-100-_r_24_"></g><g tabindex="-1" id="recharts-zindex-200-_r_25_"></g><g tabindex="-1" id="recharts-zindex-300-_r_26_"></g><g tabindex="-1" id="recharts-zindex-400-_r_27_"><g class="recharts-layer recharts-line"><path stroke="#0091FF" stroke-width="2" fill="none" id="recharts-line-_r_1s_" height="212" width="105" class="recharts-curve recharts-line-curve" stroke-dasharray="119.95932006835938px 0px" d="M80,36.8C87,33.62,94,30.44,101,30.44C108,30.44,115,43.16,122,43.16C129,43.16,136,26.2,143,26.2C150,26.2,157,34.68,164,34.68C171,34.68,178,31.5,185,28.32"></path></g><g class="recharts-layer recharts-line"><path stroke="#22c55e" stroke-width="2" fill="none" id="recharts-line-_r_1t_" height="212" width="105" class="recharts-curve recharts-line-curve" stroke-dasharray="126.32887268066406px 0px" d="M80,47.4C87,42.1,94,36.8,101,36.8C108,36.8,115,51.64,122,51.64C129,51.64,136,32.56,143,32.56C150,32.56,157,43.16,164,43.16C171,43.16,178,38.92,185,34.68"></path></g><g class="recharts-layer recharts-line"><path stroke="#eab308" stroke-width="2" fill="none" id="recharts-line-_r_1u_" height="212" width="105" class="recharts-curve recharts-line-curve" stroke-dasharray="115.82528686523438px 0px" d="M80,26.2C87,24.08,94,21.96,101,21.96C108,21.96,115,30.44,122,30.44C129,30.44,136,15.6,143,15.6C150,15.6,157,24.08,164,24.08C171,24.08,178,20.9,185,17.72"></path></g><g class="recharts-layer recharts-line"><path stroke="#ef4444" stroke-width="2" fill="none" id="recharts-line-_r_1v_" height="212" width="105" class="recharts-curve recharts-line-curve" stroke-dasharray="120.62261199951172px 0px" d="M80,58C87,52.7,94,47.4,101,47.4C108,47.4,115,55.88,122,55.88C129,55.88,136,38.92,143,38.92C150,38.92,157,49.52,164,49.52C171,49.52,178,46.34,185,43.16"></path></g><g class="recharts-layer recharts-line"><path stroke="#6366f1" stroke-width="2" fill="none" id="recharts-line-_r_20_" height="212" width="105" class="recharts-curve recharts-line-curve" stroke-dasharray="116.15350341796875px 0px" d="M80,68.6C87,63.3,94,58,101,58C108,58,115,64.36,122,64.36C129,64.36,136,51.64,143,51.64C150,51.64,157,60.12,164,60.12C171,60.12,178,56.94,185,53.76"></path></g><g class="recharts-layer recharts-line"><path stroke="#a855f7" stroke-width="2" fill="none" id="recharts-line-_r_21_" height="212" width="105" class="recharts-curve recharts-line-curve" stroke-dasharray="113.40232849121094px 0px" d="M80,51.64C87,47.4,94,43.16,101,43.16C108,43.16,115,47.4,122,47.4C129,47.4,136,36.8,143,36.8C150,36.8,157,45.28,164,45.28C171,45.28,178,42.1,185,38.92"></path></g><g class="recharts-layer recharts-line"><path stroke="#000000" stroke-width="3" name="Kamu" fill="none" id="recharts-line-_r_22_" height="212" width="105" class="recharts-curve recharts-line-curve" stroke-dasharray="0px 0px"></path></g><g class="recharts-layer recharts-line"><path stroke="#94a3b8" stroke-width="2" stroke-dasharray="0px, 0px" name="Semua Siswa" fill="none" id="recharts-line-_r_23_" height="212" width="105" class="recharts-curve recharts-line-curve"></path></g></g><g tabindex="-1" id="recharts-zindex-500-_r_28_"><g class="recharts-layer recharts-cartesian-axis recharts-xAxis xAxis"><line angle="0" height="30" orientation="bottom" x="80" y="217" width="105" class="recharts-cartesian-axis-line" stroke="#e2e8f0" fill="none" x1="80" y1="217" x2="185" y2="217"></line><g class="recharts-cartesian-axis-ticks recharts-xAxis-ticks"><g class="recharts-cartesian-axis-tick-lines recharts-xAxis-tick-lines"><g class="recharts-layer recharts-cartesian-axis-tick"></g><g class="recharts-layer recharts-cartesian-axis-tick"></g><g class="recharts-layer recharts-cartesian-axis-tick"></g></g></g></g><g class="recharts-layer recharts-cartesian-axis recharts-yAxis yAxis"><line angle="0" orientation="left" width="60" x="20" y="5" height="212" class="recharts-cartesian-axis-line" stroke="#e2e8f0" fill="none" x1="80" y1="5" x2="80" y2="217"></line><g class="recharts-cartesian-axis-ticks recharts-yAxis-ticks"><g class="recharts-cartesian-axis-tick-lines recharts-yAxis-tick-lines"><g class="recharts-layer recharts-cartesian-axis-tick"></g><g class="recharts-layer recharts-cartesian-axis-tick"></g><g class="recharts-layer recharts-cartesian-axis-tick"></g><g class="recharts-layer recharts-cartesian-axis-tick"></g><g class="recharts-layer recharts-cartesian-axis-tick"></g></g></g></g></g><g tabindex="-1" id="recharts-zindex-600-_r_29_"><g class="recharts-layer recharts-line-dots"><circle r="4" stroke="#0091FF" stroke-width="2" fill="#0091FF" height="212" width="105" cx="80" cy="36.800000000000004" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#0091FF" stroke-width="2" fill="#0091FF" height="212" width="105" cx="101" cy="30.439999999999998" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#0091FF" stroke-width="2" fill="#0091FF" height="212" width="105" cx="122" cy="43.16000000000001" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#0091FF" stroke-width="2" fill="#0091FF" height="212" width="105" cx="143" cy="26.199999999999996" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#0091FF" stroke-width="2" fill="#0091FF" height="212" width="105" cx="164" cy="34.68" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#0091FF" stroke-width="2" fill="#0091FF" height="212" width="105" cx="185" cy="28.319999999999997" class="recharts-dot recharts-line-dot"></circle></g><g class="recharts-layer recharts-line-dots"><circle r="4" stroke="#22c55e" stroke-width="2" fill="#22c55e" height="212" width="105" cx="80" cy="47.39999999999999" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#22c55e" stroke-width="2" fill="#22c55e" height="212" width="105" cx="101" cy="36.800000000000004" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#22c55e" stroke-width="2" fill="#22c55e" height="212" width="105" cx="122" cy="51.63999999999999" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#22c55e" stroke-width="2" fill="#22c55e" height="212" width="105" cx="143" cy="32.56" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#22c55e" stroke-width="2" fill="#22c55e" height="212" width="105" cx="164" cy="43.16000000000001" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#22c55e" stroke-width="2" fill="#22c55e" height="212" width="105" cx="185" cy="34.68" class="recharts-dot recharts-line-dot"></circle></g><g class="recharts-layer recharts-line-dots"><circle r="4" stroke="#eab308" stroke-width="2" fill="#eab308" height="212" width="105" cx="80" cy="26.199999999999996" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#eab308" stroke-width="2" fill="#eab308" height="212" width="105" cx="101" cy="21.959999999999994" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#eab308" stroke-width="2" fill="#eab308" height="212" width="105" cx="122" cy="30.439999999999998" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#eab308" stroke-width="2" fill="#eab308" height="212" width="105" cx="143" cy="15.60000000000001" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#eab308" stroke-width="2" fill="#eab308" height="212" width="105" cx="164" cy="24.079999999999995" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#eab308" stroke-width="2" fill="#eab308" height="212" width="105" cx="185" cy="17.720000000000013" class="recharts-dot recharts-line-dot"></circle></g><g class="recharts-layer recharts-line-dots"><circle r="4" stroke="#ef4444" stroke-width="2" fill="#ef4444" height="212" width="105" cx="80" cy="58" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#ef4444" stroke-width="2" fill="#ef4444" height="212" width="105" cx="101" cy="47.39999999999999" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#ef4444" stroke-width="2" fill="#ef4444" height="212" width="105" cx="122" cy="55.879999999999995" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#ef4444" stroke-width="2" fill="#ef4444" height="212" width="105" cx="143" cy="38.92000000000001" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#ef4444" stroke-width="2" fill="#ef4444" height="212" width="105" cx="164" cy="49.519999999999996" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#ef4444" stroke-width="2" fill="#ef4444" height="212" width="105" cx="185" cy="43.16000000000001" class="recharts-dot recharts-line-dot"></circle></g><g class="recharts-layer recharts-line-dots"><circle r="4" stroke="#6366f1" stroke-width="2" fill="#6366f1" height="212" width="105" cx="80" cy="68.60000000000001" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#6366f1" stroke-width="2" fill="#6366f1" height="212" width="105" cx="101" cy="58" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#6366f1" stroke-width="2" fill="#6366f1" height="212" width="105" cx="122" cy="64.36" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#6366f1" stroke-width="2" fill="#6366f1" height="212" width="105" cx="143" cy="51.63999999999999" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#6366f1" stroke-width="2" fill="#6366f1" height="212" width="105" cx="164" cy="60.120000000000005" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#6366f1" stroke-width="2" fill="#6366f1" height="212" width="105" cx="185" cy="53.76" class="recharts-dot recharts-line-dot"></circle></g><g class="recharts-layer recharts-line-dots"><circle r="4" stroke="#a855f7" stroke-width="2" fill="#a855f7" height="212" width="105" cx="80" cy="51.63999999999999" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#a855f7" stroke-width="2" fill="#a855f7" height="212" width="105" cx="101" cy="43.16000000000001" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#a855f7" stroke-width="2" fill="#a855f7" height="212" width="105" cx="122" cy="47.39999999999999" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#a855f7" stroke-width="2" fill="#a855f7" height="212" width="105" cx="143" cy="36.800000000000004" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#a855f7" stroke-width="2" fill="#a855f7" height="212" width="105" cx="164" cy="45.27999999999999" class="recharts-dot recharts-line-dot"></circle><circle r="4" stroke="#a855f7" stroke-width="2" fill="#a855f7" height="212" width="105" cx="185" cy="38.92000000000001" class="recharts-dot recharts-line-dot"></circle></g><g class="recharts-layer recharts-line-dots"></g><g class="recharts-layer recharts-line-dots"></g></g><g tabindex="-1" id="recharts-zindex-1000-_r_2a_"></g><g tabindex="-1" id="recharts-zindex-1100-_r_2b_"></g><g tabindex="-1" id="recharts-zindex-1200-_r_2c_"></g><g tabindex="-1" id="recharts-zindex-2000-_r_2d_"><g class="recharts-cartesian-axis-tick-labels recharts-xAxis-tick-labels"><g class="recharts-layer recharts-cartesian-axis-tick-label"><text height="30" orientation="bottom" width="105" stroke="none" font-size="12" font-weight="600" x="101" y="225" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#64748b"><tspan x="101" dy="0.71em">Quiz-2</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick-label"><text height="30" orientation="bottom" width="105" stroke="none" font-size="12" font-weight="600" x="143" y="225" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#64748b"><tspan x="143" dy="0.71em">Quiz-4</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick-label"><text height="30" orientation="bottom" width="105" stroke="none" font-size="12" font-weight="600" x="185" y="225" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#64748b"><tspan x="185" dy="0.71em">Quiz-6</tspan></text></g></g><g class="recharts-cartesian-axis-tick-labels recharts-yAxis-tick-labels"><g class="recharts-layer recharts-cartesian-axis-tick-label"><text orientation="left" width="60" height="212" stroke="none" font-size="11" x="72" y="217" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="end" fill="#64748b"><tspan x="72" dy="0.355em">0</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick-label"><text orientation="left" width="60" height="212" stroke="none" font-size="11" x="72" y="164" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="end" fill="#64748b"><tspan x="72" dy="0.355em">25</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick-label"><text orientation="left" width="60" height="212" stroke="none" font-size="11" x="72" y="111" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="end" fill="#64748b"><tspan x="72" dy="0.355em">50</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick-label"><text orientation="left" width="60" height="212" stroke="none" font-size="11" x="72" y="58" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="end" fill="#64748b"><tspan x="72" dy="0.355em">75</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick-label"><text orientation="left" width="60" height="212" stroke="none" font-size="11" x="72" y="8.25" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="end" fill="#64748b"><tspan x="72" dy="0.355em">100</tspan></text></g></g></g></svg></div></div></div></div>`;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

const Chart2 = () => {
  const html = `<div data-chart="chart-_r_1n_" class="flex aspect-video justify-center text-xs [&amp;_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&amp;_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&amp;_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&amp;_.recharts-dot[stroke='#fff']]:stroke-transparent [&amp;_.recharts-layer]:outline-none [&amp;_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&amp;_.recharts-radial-bar-background-sector]:fill-muted [&amp;_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&amp;_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&amp;_.recharts-sector[stroke='#fff']]:stroke-transparent [&amp;_.recharts-sector]:outline-none [&amp;_.recharts-surface]:outline-none h-[220px] md:h-[300px] w-full"><style>
 [data-chart=chart-_r_1n_] {
  --color-userScore: #006CFA;
  --color-avgScore: #94a3b8;
}
</style><div class="recharts-responsive-container" style="width: 100%; height: 100%; min-width: 0px;"><div style="width: 0px; height: 0px; overflow: visible;"><div width="215" height="220" class="recharts-wrapper" style="position: relative; cursor: default; width: 215px; height: 220px;"><div xmlns="http://www.w3.org/1999/xhtml" tabindex="-1" class="recharts-tooltip-wrapper" style="visibility: hidden; pointer-events: none; position: absolute; top: 0px; left: 0px;"></div><svg cx="50%" cy="50%" role="application" tabindex="0" class="recharts-surface" width="215" height="220" viewBox="0 0 215 220" style="width: 100%; height: 100%; display: block;"><title></title><desc></desc><g tabindex="-1" id="recharts-zindex--100-_r_1o_"><g class="recharts-polar-grid"><g class="recharts-polar-grid-concentric"><path stroke="#e2e8f0" fill="none" cx="107.5" cy="110" radius="0" class="recharts-polar-grid-concentric-polygon" d="M 107.5,110L 107.5,110L 107.5,110L 107.5,110L 107.5,110L 107.5,110Z"></path><path stroke="#e2e8f0" fill="none" cx="107.5" cy="110" radius="19.21875" class="recharts-polar-grid-concentric-polygon" d="M 107.5,90.78125L 124.14392572898218,100.390625L 124.14392572898218,119.609375L 107.5,129.21875L 90.85607427101782,119.609375L 90.85607427101782,100.390625Z"></path><path stroke="#e2e8f0" fill="none" cx="107.5" cy="110" radius="38.4375" class="recharts-polar-grid-concentric-polygon" d="M 107.5,71.5625L 140.78785145796436,90.78125L 140.78785145796436,129.21875L 107.5,148.4375L 74.21214854203564,129.21875L 74.21214854203564,90.78125Z"></path><path stroke="#e2e8f0" fill="none" cx="107.5" cy="110" radius="57.65625" class="recharts-polar-grid-concentric-polygon" d="M 107.5,52.34375L 157.43177718694653,81.171875L 157.43177718694653,138.828125L 107.5,167.65625L 57.56822281305345,138.828125L 57.56822281305346,81.171875Z"></path><path stroke="#e2e8f0" fill="none" cx="107.5" cy="110" radius="76.875" class="recharts-polar-grid-concentric-polygon" d="M 107.5,33.125L 174.07570291592873,71.5625L 174.07570291592873,148.4375L 107.5,186.875L 40.92429708407127,148.4375L 40.924297084071284,71.5625Z"></path></g><g class="recharts-polar-grid-angle"><line stroke="#e2e8f0" cx="107.5" cy="110" x1="107.5" y1="110" x2="107.5" y2="33.125"></line><line stroke="#e2e8f0" cx="107.5" cy="110" x1="107.5" y1="110" x2="174.07570291592873" y2="71.5625"></line><line stroke="#e2e8f0" cx="107.5" cy="110" x1="107.5" y1="110" x2="174.07570291592873" y2="148.4375"></line><line stroke="#e2e8f0" cx="107.5" cy="110" x1="107.5" y1="110" x2="107.5" y2="186.875"></line><line stroke="#e2e8f0" cx="107.5" cy="110" x1="107.5" y1="110" x2="40.92429708407127" y2="148.4375"></line><line stroke="#e2e8f0" cx="107.5" cy="110" x1="107.5" y1="110" x2="40.924297084071284" y2="71.5625"></line></g></g></g><g tabindex="-1" id="recharts-zindex--50-_r_1p_"></g><defs><clipPath id="recharts1-clip"><rect x="5" y="5" height="210" width="205"></rect></clipPath></defs><g tabindex="-1" id="recharts-zindex-100-_r_1s_"><g class="recharts-layer recharts-radar"><g class="recharts-layer recharts-radar-polygon"><path name="Semua Siswa" stroke="#94a3b8" fill="#94a3b8" fill-opacity="0.15" stroke-width="2" stroke-dasharray="4 4" id="recharts-radar-_r_1q_" class="recharts-polygon" d="M107.5,52.34375L155.43450609946868,82.325L159.42904827442442,139.98125L107.5,163.8125L62.22852201716846,136.1375L64.22579310464633,85.015625L107.5,52.34375Z"></path></g></g><g class="recharts-layer recharts-radar"><g class="recharts-layer recharts-radar-polygon"><path name="Kamu" stroke="#006CFA" fill="#006CFA" fill-opacity="0.3" stroke-width="2" id="recharts-radar-_r_1r_" class="recharts-polygon" d="M107.5,44.65625L160.76056233274298,79.25L166.08661856601728,143.825L107.5,173.0375L57.56822281305345,138.828125L55.570951725575604,80.01875L107.5,44.65625Z"></path></g></g></g><g tabindex="-1" id="recharts-zindex-200-_r_1t_"></g><g tabindex="-1" id="recharts-zindex-300-_r_1u_"></g><g tabindex="-1" id="recharts-zindex-400-_r_1v_"></g><g tabindex="-1" id="recharts-zindex-500-_r_20_"><g class="recharts-layer recharts-polar-angle-axis angleAxis"><path cx="107.5" cy="110" orientation="outer" radius="76.875" fill="none" class="recharts-polygon recharts-polar-angle-axis-line" d="M107.5,33.125L174.07570291592873,71.5625L174.07570291592873,148.4375L107.5,186.875L40.92429708407127,148.4375L40.924297084071284,71.5625L107.5,33.125Z"></path><g class="recharts-layer recharts-polar-angle-axis-ticks"><g class="recharts-layer recharts-polar-angle-axis-tick"><line class="recharts-polar-angle-axis-tick-line" cx="107.5" cy="110" orientation="outer" radius="76.875" fill="none" x1="107.5" y1="33.125" x2="107.5" y2="25.125"></line><text cx="107.5" cy="110" orientation="outer" radius="76.875" stroke="none" font-size="11" font-weight="600" x="107.5" y="25.125" class="recharts-text recharts-polar-angle-axis-tick-value" text-anchor="middle" fill="#334155"><tspan x="107.5" dy="0em">ARITH</tspan></text></g><g class="recharts-layer recharts-polar-angle-axis-tick"><line class="recharts-polar-angle-axis-tick-line" cx="107.5" cy="110" orientation="outer" radius="76.875" fill="none" x1="174.07570291592873" y1="71.5625" x2="181.00390614620423" y2="67.5625"></line><text cx="107.5" cy="110" orientation="outer" radius="76.875" stroke="none" font-size="11" font-weight="600" x="181.00390614620423" y="67.5625" class="recharts-text recharts-polar-angle-axis-tick-value" text-anchor="start" fill="#334155"><tspan x="181.00390614620423" dy="0.355em">ALG</tspan></text></g><g class="recharts-layer recharts-polar-angle-axis-tick"><line class="recharts-polar-angle-axis-tick-line" cx="107.5" cy="110" orientation="outer" radius="76.875" fill="none" x1="174.07570291592873" y1="148.4375" x2="181.00390614620423" y2="152.4375"></line><text cx="107.5" cy="110" orientation="outer" radius="76.875" stroke="none" font-size="11" font-weight="600" x="181.00390614620423" y="152.4375" class="recharts-text recharts-polar-angle-axis-tick-value" text-anchor="start" fill="#334155"><tspan x="181.00390614620423" dy="0.355em">GEOM</tspan></text></g><g class="recharts-layer recharts-polar-angle-axis-tick"><line class="recharts-polar-angle-axis-tick-line" cx="107.5" cy="110" orientation="outer" radius="76.875" fill="none" x1="107.5" y1="186.875" x2="107.5" y2="194.875"></line><text cx="107.5" cy="110" orientation="outer" radius="76.875" stroke="none" font-size="11" font-weight="600" x="107.5" y="194.875" class="recharts-text recharts-polar-angle-axis-tick-value" text-anchor="middle" fill="#334155"><tspan x="107.5" dy="0.71em">TRIG</tspan></text></g><g class="recharts-layer recharts-polar-angle-axis-tick"><line class="recharts-polar-angle-axis-tick-line" cx="107.5" cy="110" orientation="outer" radius="76.875" fill="none" x1="40.92429708407127" y1="148.4375" x2="33.99609385379577" y2="152.4375"></line><text cx="107.5" cy="110" orientation="outer" radius="76.875" stroke="none" font-size="11" font-weight="600" x="33.99609385379577" y="152.4375" class="recharts-text recharts-polar-angle-axis-tick-value" text-anchor="end" fill="#334155"><tspan x="33.99609385379577" dy="0.355em">STAT</tspan></text></g><g class="recharts-layer recharts-polar-angle-axis-tick"><line class="recharts-polar-angle-axis-tick-line" cx="107.5" cy="110" orientation="outer" radius="76.875" fill="none" x1="40.924297084071284" y1="71.5625" x2="33.99609385379577" y2="67.5625"></line><text cx="107.5" cy="110" orientation="outer" radius="76.875" stroke="none" font-size="11" font-weight="600" x="33.99609385379577" y="67.5625" class="recharts-text recharts-polar-angle-axis-tick-value" text-anchor="end" fill="#334155"><tspan x="33.99609385379577" dy="0.355em">PROB</tspan></text></g></g></g><g class="recharts-layer recharts-polar-radius-axis radiusAxis"><line class="recharts-polar-radius-axis-line" orientation="right" stroke="#ccc" fill="none" x1="107.5" y1="110" x2="107.5" y2="33.125"></line><g class="recharts-layer recharts-polar-radius-axis-ticks"><g class="recharts-layer recharts-polar-radius-axis-tick"><text transform="rotate(0, 107.5, 110)" orientation="right" cx="107.5" cy="110" stroke="none" font-size="9" x="107.5" y="110" class="recharts-text recharts-polar-radius-axis-tick-value" text-anchor="start" fill="#94a3b8"><tspan x="107.5" dy="0em">0</tspan></text></g><g class="recharts-layer recharts-polar-radius-axis-tick"><text transform="rotate(0, 107.5, 90.78125)" orientation="right" cx="107.5" cy="110" stroke="none" font-size="9" x="107.5" y="90.78125" class="recharts-text recharts-polar-radius-axis-tick-value" text-anchor="start" fill="#94a3b8"><tspan x="107.5" dy="0em">25</tspan></text></g><g class="recharts-layer recharts-polar-radius-axis-tick"><text transform="rotate(0, 107.5, 71.5625)" orientation="right" cx="107.5" cy="110" stroke="none" font-size="9" x="107.5" y="71.5625" class="recharts-text recharts-polar-radius-axis-tick-value" text-anchor="start" fill="#94a3b8"><tspan x="107.5" dy="0em">50</tspan></text></g><g class="recharts-layer recharts-polar-radius-axis-tick"><text transform="rotate(0, 107.5, 52.34375)" orientation="right" cx="107.5" cy="110" stroke="none" font-size="9" x="107.5" y="52.34375" class="recharts-text recharts-polar-radius-axis-tick-value" text-anchor="start" fill="#94a3b8"><tspan x="107.5" dy="0em">75</tspan></text></g><g class="recharts-layer recharts-polar-radius-axis-tick"><text transform="rotate(0, 107.5, 33.125)" orientation="right" cx="107.5" cy="110" stroke="none" font-size="9" x="107.5" y="33.125" class="recharts-text recharts-polar-radius-axis-tick-value" text-anchor="start" fill="#94a3b8"><tspan x="107.5" dy="0em">100</tspan></text></g></g></g></g><g tabindex="-1" id="recharts-zindex-600-_r_21_"></g><g tabindex="-1" id="recharts-zindex-1000-_r_22_"></g><g tabindex="-1" id="recharts-zindex-1100-_r_23_"></g><g tabindex="-1" id="recharts-zindex-1200-_r_24_"></g><g tabindex="-1" id="recharts-zindex-2000-_r_25_"></g></svg></div></div></div></div>`;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

const Chart3 = () => {
  const html = `<div data-chart="chart-_r_1o_" class="flex aspect-video justify-center text-xs [&amp;_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&amp;_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&amp;_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&amp;_.recharts-dot[stroke='#fff']]:stroke-transparent [&amp;_.recharts-layer]:outline-none [&amp;_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&amp;_.recharts-radial-bar-background-sector]:fill-muted [&amp;_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&amp;_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&amp;_.recharts-sector[stroke='#fff']]:stroke-transparent [&amp;_.recharts-sector]:outline-none [&amp;_.recharts-surface]:outline-none h-[140px] md:h-[180px] w-full"><style>
 [data-chart=chart-_r_1o_] {
  --color-benar: #22c55e;
  --color-salah: #ef4444;
  --color-dilewati: #94a3b8;
}
</style><div class="recharts-responsive-container" style="width: 100%; height: 100%; min-width: 0px;"><div style="width: 0px; height: 0px; overflow: visible;"><div width="215" height="140" class="recharts-wrapper" style="position: relative; cursor: default; width: 215px; height: 140px;"><div xmlns="http://www.w3.org/1999/xhtml" tabindex="-1" class="recharts-tooltip-wrapper" style="visibility: hidden; pointer-events: none; position: absolute; top: 0px; left: 0px;"></div><svg role="application" tabindex="0" class="recharts-surface" width="215" height="140" viewBox="0 0 215 140" style="width: 100%; height: 100%; display: block;"><title></title><desc></desc><g tabindex="-1" id="recharts-zindex--100-_r_2e_"><g class="recharts-cartesian-grid"><g class="recharts-cartesian-grid-vertical"><line stroke-dasharray="3 3" stroke="#e2e8f0" fill="none" x="80" y="0" width="115" height="110" x1="80" y1="0" x2="80" y2="110"></line><line stroke-dasharray="3 3" stroke="#e2e8f0" fill="none" x="80" y="0" width="115" height="110" x1="108.75" y1="0" x2="108.75" y2="110"></line><line stroke-dasharray="3 3" stroke="#e2e8f0" fill="none" x="80" y="0" width="115" height="110" x1="137.5" y1="0" x2="137.5" y2="110"></line><line stroke-dasharray="3 3" stroke="#e2e8f0" fill="none" x="80" y="0" width="115" height="110" x1="195" y1="0" x2="195" y2="110"></line></g></g></g><g tabindex="-1" id="recharts-zindex--50-_r_2f_"></g><defs><clipPath id="recharts3-clip"><rect x="80" y="0" height="110" width="115"></rect></clipPath></defs><g tabindex="-1" id="recharts-zindex-100-_r_2h_"></g><g tabindex="-1" id="recharts-zindex-200-_r_2i_"></g><g tabindex="-1" id="recharts-zindex-300-_r_2j_"><g class="recharts-layer recharts-bar" id="recharts-bar-_r_2g_"><g class="recharts-layer recharts-bar-rectangles"><g class="recharts-layer"><g class="recharts-layer recharts-bar-rectangle"><path name="Benar" color="#22c55e" x="80" y="3.666666666666666" width="106.63636363636363" height="29" fill="#22c55e" class="recharts-rectangle" d="M80,3.666666666666666L 178.63636363636363,3.666666666666666A 8,8,0,0,1,
        186.63636363636363,11.666666666666666L 186.63636363636363,24.666666666666664A 8,8,0,0,1,
        178.63636363636363,32.666666666666664L 80,32.666666666666664Z"></path></g><g class="recharts-layer recharts-bar-rectangle"><path name="Salah" color="#ef4444" x="80" y="40.33333333333333" width="14.63636363636364" height="29" fill="#ef4444" class="recharts-rectangle" d="M80,40.33333333333333L 87.31818181818181,40.33333333333333A 7.31818181818182,7.31818181818182,0,0,1,
        94.63636363636364,47.65151515151515L 94.63636363636364,62.01515151515151A 7.31818181818182,7.31818181818182,0,0,1,
        87.31818181818181,69.33333333333333L 80,69.33333333333333Z"></path></g><g class="recharts-layer recharts-bar-rectangle"><path name="Dilewati" color="#94a3b8" x="80" y="77" width="4.181818181818187" height="29" fill="#94a3b8" class="recharts-rectangle" d="M80,77L 82.0909090909091,77A 2.0909090909090935,2.0909090909090935,0,0,1,
        84.18181818181819,79.0909090909091L 84.18181818181819,103.9090909090909A 2.0909090909090935,2.0909090909090935,0,0,1,
        82.0909090909091,106L 80,106Z"></path></g></g></g></g></g><g tabindex="-1" id="recharts-zindex-400-_r_2k_"></g><g tabindex="-1" id="recharts-zindex-500-_r_2l_"><g class="recharts-layer recharts-cartesian-axis recharts-xAxis xAxis"><line angle="0" height="30" orientation="bottom" x="80" y="110" width="115" class="recharts-cartesian-axis-line" stroke="#666" fill="none" x1="80" y1="110" x2="195" y2="110"></line><g class="recharts-cartesian-axis-ticks recharts-xAxis-ticks"><g class="recharts-cartesian-axis-tick-lines recharts-xAxis-tick-lines"><g class="recharts-layer recharts-cartesian-axis-tick"><line angle="0" height="30" orientation="bottom" x="80" y="110" width="115" class="recharts-cartesian-axis-tick-line" stroke="#666" fill="none" x1="80" y1="116" x2="80" y2="110"></line></g><g class="recharts-layer recharts-cartesian-axis-tick"><line angle="0" height="30" orientation="bottom" x="80" y="110" width="115" class="recharts-cartesian-axis-tick-line" stroke="#666" fill="none" x1="108.75" y1="116" x2="108.75" y2="110"></line></g><g class="recharts-layer recharts-cartesian-axis-tick"><line angle="0" height="30" orientation="bottom" x="80" y="110" width="115" class="recharts-cartesian-axis-tick-line" stroke="#666" fill="none" x1="137.5" y1="116" x2="137.5" y2="110"></line></g><g class="recharts-layer recharts-cartesian-axis-tick"><line angle="0" height="30" orientation="bottom" x="80" y="110" width="115" class="recharts-cartesian-axis-tick-line" stroke="#666" fill="none" x1="166.25" y1="116" x2="166.25" y2="110"></line></g><g class="recharts-layer recharts-cartesian-axis-tick"><line angle="0" height="30" orientation="bottom" x="80" y="110" width="115" class="recharts-cartesian-axis-tick-line" stroke="#666" fill="none" x1="195" y1="116" x2="195" y2="110"></line></g></g></g></g><g class="recharts-layer recharts-cartesian-axis recharts-yAxis yAxis"><g class="recharts-cartesian-axis-ticks recharts-yAxis-ticks"><g class="recharts-cartesian-axis-tick-lines recharts-yAxis-tick-lines"><g class="recharts-layer recharts-cartesian-axis-tick"></g><g class="recharts-layer recharts-cartesian-axis-tick"></g><g class="recharts-layer recharts-cartesian-axis-tick"></g></g></g></g></g><g tabindex="-1" id="recharts-zindex-600-_r_2m_"></g><g tabindex="-1" id="recharts-zindex-1000-_r_2n_"></g><g tabindex="-1" id="recharts-zindex-1100-_r_2o_"></g><g tabindex="-1" id="recharts-zindex-1200-_r_2p_"></g><g tabindex="-1" id="recharts-zindex-2000-_r_2q_"><g class="recharts-cartesian-axis-tick-labels recharts-xAxis-tick-labels"><g class="recharts-layer recharts-cartesian-axis-tick-label"><text height="30" orientation="bottom" width="115" stroke="none" font-size="11" x="80" y="118" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#64748b"><tspan x="80" dy="0.71em">0</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick-label"><text height="30" orientation="bottom" width="115" stroke="none" font-size="11" x="108.75" y="118" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#64748b"><tspan x="108.75" dy="0.71em">55</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick-label"><text height="30" orientation="bottom" width="115" stroke="none" font-size="11" x="137.5" y="118" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#64748b"><tspan x="137.5" dy="0.71em">110</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick-label"><text height="30" orientation="bottom" width="115" stroke="none" font-size="11" x="166.25" y="118" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#64748b"><tspan x="166.25" dy="0.71em">165</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick-label"><text height="30" orientation="bottom" width="115" stroke="none" font-size="11" x="195" y="118" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#64748b"><tspan x="195" dy="0.71em">220</tspan></text></g></g><g class="recharts-cartesian-axis-tick-labels recharts-yAxis-tick-labels"><g class="recharts-layer recharts-cartesian-axis-tick-label"><text width="70" orientation="left" height="110" stroke="none" font-size="12" font-weight="600" x="72" y="18.333333333333332" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="end" fill="#334155"><tspan x="72" dy="0.355em">Benar</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick-label"><text width="70" orientation="left" height="110" stroke="none" font-size="12" font-weight="600" x="72" y="55" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="end" fill="#334155"><tspan x="72" dy="0.355em">Salah</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick-label"><text width="70" orientation="left" height="110" stroke="none" font-size="12" font-weight="600" x="72" y="91.66666666666666" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="end" fill="#334155"><tspan x="72" dy="0.355em">Dilewati</tspan></text></g></g></g></svg></div></div></div></div>`;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
