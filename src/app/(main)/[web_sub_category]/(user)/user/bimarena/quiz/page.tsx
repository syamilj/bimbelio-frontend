'use client';

import { useState, useMemo } from 'react';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  BarChart3,
  Trophy,
  Gift,
  Target,
  Flame,
  Zap,
  Swords,
  Crown,
  Star,
  Clock,
  ChevronRight,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Components
import { QuizHero } from './_components/QuizHero';
import { QuizStats } from './_components/QuizStats';
import { QuizLibrary } from './_components/QuizLibrary';
import { QuizProgress } from './_components/QuizProgress';
import { QuizLeaderboard } from './_components/QuizLeaderboard';
import { QuizPrediction } from './_components/QuizPrediction';
import { QuizRewards } from './_components/QuizRewards';

// Types and mock data
import {
  VOLUMES,
  REWARDS,
  ACHIEVEMENTS,
  TARGET_UNIVERSITIES,
  generateQuizzes,
  generatePerformanceHistory,
  generateSubjectPerformance,
  generateLeaderboard,
  calculateUserStats,
} from './_components/quiz-types';

export default function BimArenaQuizPage() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [selectedVolume, setSelectedVolume] = useState(VOLUMES[0]);
  const [activeTab, setActiveTab] = useState('library');

  // User's target university (would come from user profile in real implementation)
  const userTargetUniversity = TARGET_UNIVERSITIES[1]; // ITB Teknik Informatika

  // Generate mock data
  const quizzes = useMemo(() => generateQuizzes(), []);
  const performanceHistory = useMemo(() => generatePerformanceHistory(), []);
  const subjectPerformance = useMemo(() => generateSubjectPerformance(), []);
  const leaderboard = useMemo(() => generateLeaderboard(50), []);
  const userStats = useMemo(() => calculateUserStats(quizzes), [quizzes]);

  // Calculate totals
  const totalQuizzes = quizzes.reduce((acc, cat) => acc + cat.quizzes.length, 0);
  const completedQuizzes = quizzes.reduce((acc, cat) => acc + cat.quizzes.filter(q => q.isDone).length, 0);

  // Filter quizzes based on selection - no filtering by volume/subcategory for now
  const filteredQuizzes = quizzes;

  const tabItems = [
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'leaderboard', label: 'Peringkat', icon: Trophy },
    { id: 'prediction', label: 'Prediksi', icon: Target },
    { id: 'rewards', label: 'Hadiah', icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Hero Section */}
      <div className="p-4 md:p-6">
        <QuizHero
          selectedVolume={selectedVolume}
          volumes={VOLUMES}
          userStats={userStats}
          onVolumeChange={setSelectedVolume}
          targetUniversity={userTargetUniversity}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
        {/* Target University Banner */}
        <div
          className="relative overflow-hidden rounded-3xl md:rounded-3xl p-3 md:p-4 border-2 cursor-pointer hover:shadow-lg transition-all"
          style={{
            background: `linear-gradient(135deg, ${mainColor}08 0%, ${secondaryColor}05 100%)`,
            borderColor: `${mainColor}20`
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
            {/* Left: University Info */}
            <div className="flex items-center gap-3 md:gap-4">
              <div
                className="w-11 h-11 md:w-14 md:h-14 rounded-3xl md:rounded-3xl flex items-center justify-center text-white shadow-lg flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})` }}
              >
                <GraduationCap className="w-5 h-5 md:w-7 md:h-7" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Kamu</p>
                <h3 className="font-black text-slate-800 text-sm md:text-base truncate">{userTargetUniversity.name}</h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium truncate">{userTargetUniversity.major}</p>
              </div>
            </div>
            {/* Right: Stats - Horizontal scroll on mobile */}
            <div className="relative">
              <div
                className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex items-center gap-3 md:gap-5 min-w-max">
                  <div className="text-center flex-shrink-0">
                    <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">Passing</p>
                    <p className="text-lg md:text-xl font-black" style={{ color: mainColor }}>{userTargetUniversity.passingScore}</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200 flex-shrink-0" />
                  <div className="text-center flex-shrink-0">
                    <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">Peluang</p>
                    <p className="text-lg md:text-xl font-black text-emerald-600">{userTargetUniversity.passingProbability}%</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200 flex-shrink-0" />
                  <div className="text-center flex-shrink-0">
                    <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">Rasio</p>
                    <p className="text-lg md:text-xl font-black text-slate-700">1:{userTargetUniversity.competitionRatio}</p>
                  </div>
                  <button className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-bold rounded-3xl md:rounded-3xl border border-slate-200 hover:bg-slate-50 transition-all flex-shrink-0 whitespace-nowrap">
                    Ubah Target
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Challenge & Rival Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Daily Challenge */}
          <div
            className="relative overflow-hidden rounded-3xl p-4 border-2 cursor-pointer hover:shadow-lg transition-all"
            style={{
              background: `linear-gradient(135deg, ${mainColor}10 0%, ${secondaryColor}05 100%)`,
              borderColor: `${mainColor}30`
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 blur-2xl" style={{ backgroundColor: mainColor }} />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-3xl flex items-center justify-center text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})` }}
                >
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-800">Daily Challenge</h3>
                    <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold animate-pulse">HOT</span>
                  </div>
                  <p className="text-xs text-slate-500">Selesaikan 5 quiz hari ini untuk bonus poin!</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden max-w-[120px]">
                      <div className="h-full rounded-full" style={{ width: '60%', background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})` }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: mainColor }}>3/5</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1" style={{ color: mainColor }}>
                  <Trophy className="w-4 h-4" />
                  <span className="text-lg font-black">+500</span>
                </div>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 6h 32m left
                </p>
              </div>
            </div>
          </div>

          {/* Your Rival / Next Opponent - 1 Rank Above */}
          <div className="relative overflow-hidden rounded-3xl p-4 bg-gradient-to-br from-slate-900 to-slate-800 cursor-pointer hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg">
                    <Swords className="w-6 h-6" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-[9px] font-black text-white">VS</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Target Berikutnya</p>
                  <h3 className="font-black text-white">{leaderboard[userStats.currentRank - 2]?.name || 'Top Player'}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> #{userStats.currentRank - 1}
                    </span>
                    <span className="text-xs text-white/50">•</span>
                    <span className="text-xs text-white/60">Score: {leaderboard[userStats.currentRank - 2]?.totalScore?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
                  <span className="text-xs font-bold text-amber-400">+{((leaderboard[userStats.currentRank - 2]?.totalScore || 0) - userStats.totalScore)} poin untuk kalahkan</span>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs rounded-3xl flex items-center gap-1.5 hover:opacity-90 transition-all shadow-lg">
                  <Swords className="w-3.5 h-3.5" /> Kejar!
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Unlocked Banner - Conditionally shown */}
        <div className="relative overflow-hidden rounded-3xl p-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 animate-pulse-slow">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-xl">
                <Crown className="w-7 h-7 text-yellow-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Achievement Unlocked!</p>
                </div>
                <h3 className="font-black text-white text-lg">First Blood! 🩸</h3>
                <p className="text-xs text-white/70">Kalahkan rival pertamamu dalam battle</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-white/50">Reward</p>
                <p className="text-lg font-black text-yellow-300 flex items-center gap-1">
                  <Star className="w-4 h-4" /> +500 Poin
                </p>
              </div>
              <button className="px-4 py-2.5 bg-white text-slate-900 font-bold text-sm rounded-3xl flex items-center gap-1.5 hover:bg-white/90 transition-all shadow-lg">
                Klaim <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        {/* Quick Stats */}
        <QuizStats
          userStats={userStats}
          totalQuizzes={totalQuizzes}
          completedQuizzes={completedQuizzes}
        />

        {/* Tabs Navigation */}
        <div className="bg-white rounded-3xl border border-slate-200 p-1.5 md:p-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full h-auto flex justify-start gap-1 bg-transparent p-0 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {tabItems.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={cn(
                      'flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-3xl font-bold text-[11px] md:text-sm transition-all whitespace-nowrap',
                      isActive
                        ? 'text-white shadow-md'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    )}
                    style={
                      isActive
                        ? { background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})` }
                        : {}
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {activeTab === 'library' && (
            <QuizLibrary
              quizzes={filteredQuizzes}
              volumeName={selectedVolume.name}
            />
          )}

          {activeTab === 'progress' && (
            <QuizProgress
              userStats={userStats}
              quizzes={quizzes}
              performanceHistory={performanceHistory}
              subjectPerformance={subjectPerformance}
              totalQuizzes={totalQuizzes}
              completedQuizzes={completedQuizzes}
            />
          )}

          {activeTab === 'leaderboard' && (
            <QuizLeaderboard
              userStats={userStats}
              leaderboard={leaderboard}
              targetUniversity={userTargetUniversity}
            />
          )}

          {activeTab === 'prediction' && (
            <QuizPrediction
              userStats={userStats}
              targetUniversities={TARGET_UNIVERSITIES}
              subjectPerformance={subjectPerformance}
            />
          )}

          {activeTab === 'rewards' && (
            <QuizRewards
              userStats={userStats}
              rewards={REWARDS}
              achievements={ACHIEVEMENTS}
            />
          )}
        </div>
      </div>
    </div>
  );
}
