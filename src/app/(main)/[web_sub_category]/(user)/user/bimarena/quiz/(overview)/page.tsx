'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { BarChart3, BookOpen, GraduationCap, Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';

// Components
import { QuizCardList } from '../_components/quiz-card-list';
import { QuizLeaderboard } from '../_components/quiz-leaderboard';
import { QuizPrediction } from '../_components/quiz-prediction';
import { QuizProgress } from '../_components/quiz-progress';
import { QuizRewards } from '../_components/quiz-rewards';
import { QuizStats } from '../_components/quiz-stats';

// Types and mock data
import { QuizSummary } from '../_components/quiz-summary';
import {
  ACHIEVEMENTS,
  REWARDS,
  TARGET_UNIVERSITIES,
  calculateUserStats,
  generateLeaderboard,
  generatePerformanceHistory,
  generateQuizzes,
  generateSubjectPerformance,
} from '../_components/quiz-types';
import { QuizProvider, useQuizProvider } from '../_provider/_provider';

function BimArenaQuizPageMain() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const {
    useVolume: { selectedVolumeId },
  } = useQuizProvider();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

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
  const totalQuizzes = quizzes.reduce(
    (acc, cat) => acc + cat.quizzes.length,
    0,
  );
  const completedQuizzes = quizzes.reduce(
    (acc, cat) => acc + cat.quizzes.filter((q) => q.isDone).length,
    0,
  );

  const tabItems = [
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'leaderboard', label: 'Peringkat', icon: Trophy },
    // { id: 'prediction', label: 'Prediksi', icon: Target },
    // { id: 'rewards', label: 'Hadiah', icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Hero Section */}
      <div className="p-4 md:p-6">
        <QuizSummary />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
        {/* Target University Banner */}
        {selectedVolumeId && (
          <div
            className="relative overflow-hidden rounded-3xl md:rounded-3xl p-3 md:p-4 border-2 cursor-pointer hover:shadow-lg transition-all"
            style={{
              background: `linear-gradient(135deg, ${mainColor}08 0%, ${secondaryColor}05 100%)`,
              borderColor: `${mainColor}20`,
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
              {/* Left: University Info */}
              <div className="flex items-center gap-3 md:gap-4">
                <div
                  className="w-11 h-11 md:w-14 md:h-14 rounded-3xl md:rounded-3xl flex items-center justify-center text-white shadow-lg flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  <GraduationCap className="w-5 h-5 md:w-7 md:h-7" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Target Kamu
                  </p>
                  <h3 className="font-black text-slate-800 text-sm md:text-base truncate">
                    {userTargetUniversity.name}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 font-medium truncate">
                    {userTargetUniversity.major}
                  </p>
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
                      <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">
                        Passing
                      </p>
                      <p
                        className="text-lg md:text-xl font-black"
                        style={{ color: mainColor }}
                      >
                        {userTargetUniversity.passingScore}
                      </p>
                    </div>
                    <div className="w-px h-8 bg-slate-200 flex-shrink-0" />
                    <div className="text-center flex-shrink-0">
                      <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">
                        Peluang
                      </p>
                      <p className="text-lg md:text-xl font-black text-emerald-600">
                        {userTargetUniversity.passingProbability}%
                      </p>
                    </div>
                    <div className="w-px h-8 bg-slate-200 flex-shrink-0" />
                    <div className="text-center flex-shrink-0">
                      <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">
                        Rasio
                      </p>
                      <p className="text-lg md:text-xl font-black text-slate-700">
                        1:{userTargetUniversity.competitionRatio}
                      </p>
                    </div>
                    <button className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-bold rounded-3xl md:rounded-3xl border border-slate-200 hover:bg-slate-50 transition-all flex-shrink-0 whitespace-nowrap">
                      Ubah Target
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedVolumeId && <QuizStats />}

        {selectedVolumeId && (
          <div className="bg-white rounded-3xl border border-slate-200 p-1.5 md:p-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList
                className="w-full h-auto flex justify-start gap-1 bg-transparent p-0 overflow-x-auto"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
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
                          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50',
                      )}
                      style={
                        isActive
                          ? {
                              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                            }
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
        )}

        {selectedVolumeId && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {activeTab === 'library' && <QuizCardList />}

            {activeTab === 'progress' && <QuizProgress />}

            {activeTab === 'leaderboard' && <QuizLeaderboard />}

            {activeTab === 'prediction' && false && (
              <QuizPrediction
                userStats={userStats}
                targetUniversities={TARGET_UNIVERSITIES}
                subjectPerformance={subjectPerformance}
              />
            )}

            {activeTab === 'rewards' && false && (
              <QuizRewards
                userStats={userStats}
                rewards={REWARDS}
                achievements={ACHIEVEMENTS}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BimArenaQuizPage() {
  return (
    <QuizProvider>
      <BimArenaQuizPageMain />
    </QuizProvider>
  );
}
