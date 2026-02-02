'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowDown,
  ArrowUp,
  Minus,
  Target,
  TrendingUp,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Users,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TargetUniversity, UserStats, SubjectPerformance } from './quiz-types';
import {
  TOTAL_PARTICIPANTS,
  SCORE_CHANGE_LAST_WEEK,
  formatNumber,
  calculateNationalPercentile,
} from './quiz-dummy';

interface QuizPredictionProps {
  userStats: UserStats;
  targetUniversities: TargetUniversity[];
  subjectPerformance: SubjectPerformance[];
}

export function QuizPrediction({
  userStats,
  targetUniversities,
  subjectPerformance,
}: QuizPredictionProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-emerald-500" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-emerald-600';
    if (probability >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const getProbabilityBg = (probability: number) => {
    if (probability >= 70) return 'from-emerald-500 to-emerald-600';
    if (probability >= 40) return 'from-amber-500 to-amber-600';
    return 'from-red-500 to-red-600';
  };

  const getProbabilityLabel = (probability: number) => {
    if (probability >= 70) return 'Aman';
    if (probability >= 40) return 'Cukup';
    return 'Perlu Usaha';
  };

  // Find weakest subjects for recommendation
  const weakSubjects = [...subjectPerformance]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const strongSubjects = [...subjectPerformance]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      {/* ML Prediction Summary */}
      <div
        className="relative overflow-hidden p-4 md:p-6 rounded-3xl md:rounded-3xl shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${mainColor}08 0%, ${secondaryColor}05 100%)`,
          border: `1px solid ${mainColor}15`,
        }}
      >
        {/* Decorative */}
        <div
          className="absolute top-0 right-0 w-24 md:w-48 h-24 md:h-48 opacity-15 blur-3xl rounded-full"
          style={{ backgroundColor: mainColor }}
        />

        <div className="relative">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5">
            <div
              className="w-10 h-10 md:w-14 md:h-14 rounded-3xl md:rounded-3xl flex items-center justify-center text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})` }}
            >
              <BarChart3 className="w-5 h-5 md:w-7 md:h-7" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm md:text-lg">Prediksi Skor UTBK</h3>
              <p className="text-xs md:text-sm text-slate-500 hidden sm:block">Berdasarkan performa dan kemampuan</p>
            </div>
          </div>

          {/* Horizontal scroll on mobile */}
          <div className="relative">
            <div
              className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style>{`.pred-cards::-webkit-scrollbar { display: none; }`}</style>
              <div className="pred-cards flex md:grid md:grid-cols-3 gap-3 md:gap-4 min-w-max md:min-w-0">
              <div className="bg-white rounded-3xl md:rounded-3xl p-3 md:p-5 shadow-sm border border-slate-100 flex-shrink-0 w-[150px] md:w-auto">
                <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 md:mb-2">
                  Rata-rata Skor Quiz
                </p>
                <div className="flex items-end gap-1 md:gap-2">
                  <span className="text-2xl md:text-4xl font-black" style={{ color: mainColor }}>
                    {userStats.avgScore}
                  </span>
                  <span className="text-xs md:text-sm text-slate-400 mb-0.5 md:mb-1">/ 100</span>
                </div>
                <p className="text-[10px] md:text-xs text-slate-500 mt-1 md:mt-2">
                  Dari {userStats.quizzesDone} quiz
                </p>
              </div>

              <div className="bg-white rounded-3xl md:rounded-3xl p-3 md:p-5 shadow-sm border border-slate-100 flex-shrink-0 w-[150px] md:w-auto">
                <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 md:mb-2">
                  Prediksi Skor UTBK
                </p>
                <div className="flex items-end gap-1 md:gap-2">
                  <span className="text-2xl md:text-4xl font-black text-slate-900">
                    {userStats.estimatedUtbkScore}
                  </span>
                  <span className="text-xs md:text-sm text-slate-400 mb-0.5 md:mb-1">/ 800</span>
                </div>
                <p className="text-[10px] md:text-xs text-emerald-600 mt-1 md:mt-2 flex items-center gap-0.5 md:gap-1">
                  <TrendingUp className="w-3 h-3 md:w-3.5 md:h-3.5" /> +{SCORE_CHANGE_LAST_WEEK}
                </p>
              </div>

              <div className="bg-white rounded-3xl md:rounded-3xl p-3 md:p-5 shadow-sm border border-slate-100 flex-shrink-0 w-[150px] md:w-auto">
                <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 md:mb-2">
                  Persentil Nasional
                </p>
                <div className="flex items-end gap-1 md:gap-2">
                  <span className="text-2xl md:text-4xl font-black text-slate-900">
                    Top {calculateNationalPercentile(userStats.accuracy)}%
                  </span>
                </div>
                <p className="text-[10px] md:text-xs text-slate-500 mt-1 md:mt-2">
                  vs {formatNumber(TOTAL_PARTICIPANTS)}
                </p>
              </div>
              </div>
            </div>
            {/* Scroll fade indicator */}
            <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden" />
          </div>
        </div>
      </div>

      {/* Target Universities */}
      <div className="bg-white rounded-3xl md:rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 md:p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-3xl md:rounded-3xl bg-indigo-100 flex items-center justify-center shadow-sm">
                <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm md:text-lg">Target Universitas</h3>
                <p className="text-[10px] md:text-sm text-slate-500 hidden sm:block">Prediksi kelulusan berdasarkan ML</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="font-bold text-[10px] md:text-xs rounded-3xl md:rounded-3xl h-8 md:h-9 px-2 md:px-3"
              style={{ borderColor: mainColor, color: mainColor }}
            >
              + Tambah
            </Button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {targetUniversities.map((uni, idx) => (
            <div
              key={idx}
              className="p-4 md:p-6 hover:bg-slate-50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-11 h-11 md:w-14 md:h-14 rounded-3xl md:rounded-3xl bg-slate-100 flex items-center justify-center font-black text-sm md:text-lg text-slate-600 shadow-sm flex-shrink-0">
                    {uni.name.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm md:text-base truncate">{uni.name}</h4>
                    <p className="text-xs md:text-sm text-slate-500 truncate">{uni.major}</p>
                    <div className="flex items-center gap-2 md:gap-3 mt-1 md:mt-1.5 text-[10px] md:text-xs text-slate-400">
                      <span className="flex items-center gap-0.5 md:gap-1">
                        <Target className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        {uni.passingScore}
                      </span>
                      <span className="flex items-center gap-0.5 md:gap-1">
                        <Users className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        1:{uni.competitionRatio}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-0.5 md:gap-1 justify-center mb-0.5 md:mb-1">
                      {getTrendIcon(uni.trend)}
                      <span className={cn('text-xl md:text-2xl font-black', getProbabilityColor(uni.passingProbability))}>
                        {uni.passingProbability}%
                      </span>
                    </div>
                    <Badge
                      className={cn(
                        'text-[8px] md:text-[10px] font-bold bg-gradient-to-r text-white px-2 md:px-2.5 py-0.5 md:py-1',
                        getProbabilityBg(uni.passingProbability)
                      )}
                    >
                      {getProbabilityLabel(uni.passingProbability)}
                    </Badge>
                  </div>

                  {/* Progress bar to passing score */}
                  <div className="w-20 md:w-28 hidden sm:block">
                    <div className="flex justify-between text-[8px] md:text-[10px] text-slate-400 mb-0.5 md:mb-1">
                      <span>Skor</span>
                      <span>{uni.passingScore}</span>
                    </div>
                    <div className="h-2 md:h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full bg-gradient-to-r', getProbabilityBg(uni.passingProbability))}
                        style={{
                          width: `${Math.min(100, (userStats.averageScore / uni.passingScore) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strength & Weakness Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
        {/* Strengths */}
        <div className="bg-white rounded-3xl md:rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-3 md:p-5 border-b border-slate-100 flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-3xl md:rounded-3xl bg-emerald-100 flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm md:text-base">Kekuatan</h3>
              <p className="text-[10px] md:text-xs text-slate-500">Subtes terbaikmu</p>
            </div>
          </div>
          <div className="p-3 md:p-5 space-y-2 md:space-y-4">
            {strongSubjects.map((subject, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <div
                    className="w-7 h-7 md:w-9 md:h-9 rounded-3xl md:rounded-3xl flex items-center justify-center text-[10px] md:text-xs font-bold shadow-sm"
                    style={{
                      backgroundColor: `${mainColor}15`,
                      color: mainColor,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <span className="font-medium text-slate-700 text-xs md:text-sm">{subject.subject}</span>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 font-bold text-[10px] md:text-xs">
                  {subject.score}%
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-3xl md:rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-3 md:p-5 border-b border-slate-100 flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-3xl md:rounded-3xl bg-amber-100 flex items-center justify-center shadow-sm">
              <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm md:text-base">Perlu Ditingkatkan</h3>
              <p className="text-[10px] md:text-xs text-slate-500">Fokus latihan</p>
            </div>
          </div>
          <div className="p-3 md:p-5 space-y-2 md:space-y-4">
            {weakSubjects.map((subject, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-7 h-7 md:w-9 md:h-9 rounded-3xl md:rounded-3xl bg-amber-100 flex items-center justify-center text-[10px] md:text-xs font-bold text-amber-600 shadow-sm">
                    !
                  </div>
                  <span className="font-medium text-slate-700 text-xs md:text-sm">{subject.subject}</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Badge className="bg-amber-100 text-amber-700 font-bold text-[10px] md:text-xs">
                    {subject.score}%
                  </Badge>
                  <Button
                    size="sm"
                    className="h-6 md:h-8 text-[10px] md:text-xs font-bold text-white rounded-3xl md:rounded-3xl hover:opacity-90 px-2 md:px-3"
                    style={{ backgroundColor: mainColor }}
                  >
                    Latih
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div
        className="relative overflow-hidden p-4 md:p-6 rounded-3xl md:rounded-3xl shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
        }}
      >
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-24 md:w-48 h-24 md:h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-16 md:w-32 h-16 md:h-32 bg-white/5 rounded-full blur-2xl" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-3xl md:rounded-3xl bg-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
              <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div className="text-white">
              <h3 className="font-black text-base md:text-xl">Rekomendasi Minggu Ini</h3>
              <p className="text-xs md:text-sm text-white/80 mt-0.5 md:mt-1">
                Fokus pada {weakSubjects[0]?.subject}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            className="font-bold bg-white hover:bg-white/90 rounded-3xl md:rounded-3xl shadow-md text-xs md:text-sm h-9 md:h-10"
            style={{ color: mainColor }}
          >
            Mulai
            <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 ml-0.5 md:ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
