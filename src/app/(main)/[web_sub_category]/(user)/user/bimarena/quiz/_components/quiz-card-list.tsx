'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  Clock,
  Flame,
  HelpCircle,
  LockIcon,
  Search,
  Swords,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useQuizProvider } from '../_provider/_provider';
import { isQuizHot } from './quiz-dummy';

export function QuizCardList() {
  const { setTransactionPopUp } = useAppContext();
  const { websiteSubCategory } = useWebsiteSubCategory();

  const {
    useSubCategory: {
      SubCategory,
      selectedSubCategoryId,
      setSelectedSubCategoryId,
    },
    useVolume: {
      SingleQuizVolume,
      selectedVolumeId,
      isVolumeStarted,
      isVolumeEnded,
    },
    isLocked,
  } = useQuizProvider();

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuizzes = (SubCategory || [])
    .map((sub) => {
      return {
        ...sub,
        code:
          sub.name
            .split(' ')
            .map((word) => word[0]?.toUpperCase())
            .join('') || sub.name,
        quizzes: (SingleQuizVolume?.Tryout || []).filter(
          (t) => t.TryoutSubCategory.id === sub.id,
        ),
      };
    })
    .filter((sub) => {
      return sub.quizzes.length > 0;
    })
    .filter((sub) => {
      if (searchQuery.trim() === '') return true;
      const lowerQuery = searchQuery.toLowerCase();
      const matchingQuizzes = sub.quizzes.filter((quiz) =>
        quiz.title.toLowerCase().includes(lowerQuery),
      );
      return matchingQuizzes.length > 0;
    })
    .filter((sub) => {
      if (!selectedSubCategoryId) return true;
      return sub.id === selectedSubCategoryId;
    });

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Search & Filter */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Cari quiz..."
            className="pl-11 h-12 rounded-3xl border-slate-200 bg-white focus:border-slate-300 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Filter Tabs - Horizontal scroll on mobile */}
        <div className="relative">
          <div
            className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`.filter-tabs::-webkit-scrollbar { display: none; }`}</style>
            <div className="filter-tabs flex gap-2 min-w-max">
              <button
                onClick={() => setSelectedSubCategoryId(null)}
                className={cn(
                  'px-3 md:px-4 py-2 md:py-2.5 rounded-3xl md:rounded-3xl text-xs font-bold whitespace-nowrap transition-all border shadow-sm flex-shrink-0',
                  !selectedSubCategoryId
                    ? 'text-white border-transparent'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                )}
                style={
                  !selectedSubCategoryId
                    ? {
                        background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                      }
                    : {}
                }
              >
                Semua
              </button>
              {SubCategory?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedSubCategoryId(cat.id)}
                  className={cn(
                    'px-3 md:px-4 py-2 md:py-2.5 rounded-3xl md:rounded-3xl text-xs font-bold whitespace-nowrap transition-all border shadow-sm flex-shrink-0',
                    selectedSubCategoryId === cat.id
                      ? 'text-white border-transparent'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                  )}
                  style={
                    selectedSubCategoryId === cat.id
                      ? { backgroundColor: mainColor }
                      : {}
                  }
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          {/* Scroll fade indicator */}
        </div>
      </div>

      {/* Quiz Grid by Category */}
      <div className="space-y-8">
        {filteredQuizzes.map((sub) => (
          <div
            key={sub.id}
            className="space-y-5"
          >
            {/* Category Header */}
            <div
              className="flex items-center gap-4 p-4 rounded-3xl border-2 shadow-sm"
              style={{
                backgroundColor: `${mainColor}08`,
                borderColor: `${mainColor}20`,
              }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0"
                style={{ backgroundColor: mainColor }}
              >
                <Swords className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-black text-slate-800">
                  {sub.code}
                </h3>
                <p className="text-xs text-slate-500 font-medium truncate">
                  {sub.name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border-2 shadow-sm"
                  style={{ borderColor: `${mainColor}30`, color: mainColor }}
                >
                  {sub.quizzes.filter((q) => q.isDone).length}/{sub.quizzes.length}
                </div>
              </div>
            </div>

            {/* Quiz Cards - Horizontal scroll on mobile, grid on desktop */}
            <div className="relative">
              <div
                className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <style>{`.quiz-cards::-webkit-scrollbar { display: none; }`}</style>
                <div className="quiz-cards flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4 min-w-max md:min-w-0">
                  {sub.quizzes.map((quiz) => {
                    return (
                      <div
                        key={quiz.id}
                        className={cn(
                          'group relative overflow-hidden rounded-3xl border-2 transition-all duration-200 cursor-pointer flex-shrink-0 w-[210px] md:w-auto',
                          quiz.isDone
                            ? 'border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-white hover:border-emerald-200 hover:shadow-lg'
                            : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg shadow-sm',
                        )}
                      >
                        {/* Hot/Trending Badge */}
                        {!quiz.isDone && isQuizHot(quiz.id) && (
                          <div className="absolute top-3 right-2 md:top-4 md:right-3 z-10">
                            <div className="px-2 py-0.5 md:px-2.5 md:py-1 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-[8px] md:text-[9px] font-bold flex items-center gap-0.5 md:gap-1 shadow-lg animate-pulse">
                              <Flame className="w-2.5 h-2.5 md:w-3 md:h-3" />{' '}
                              HOT
                            </div>
                          </div>
                        )}

                        <div className="p-4 md:p-5 space-y-3 md:space-y-3.5">
                          {/* Header with Battle Stats */}
                          <div className="flex justify-between items-center">
                            <span
                              className="text-[9px] md:text-[10px] font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-3xl md:rounded-3xl"
                              style={{
                                backgroundColor: `${mainColor}15`,
                                color: mainColor,
                              }}
                            >
                              {sub.code}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded-3xl md:rounded-3xl bg-amber-50 border border-amber-200">
                                <Users className="w-2.5 h-2.5 md:w-3 md:h-3 text-amber-600" />
                                <span className="text-[9px] md:text-[10px] font-bold text-amber-700">
                                  {quiz.totalParticipant || 0}
                                </span>
                              </div>
                              {quiz.isDone && (
                                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm ring-2 ring-emerald-100">
                                  <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quiz Name */}
                          <div>
                            <h4 className="font-bold text-sm md:text-[15px] text-slate-800 group-hover:text-slate-900 transition-colors line-clamp-2 leading-snug">
                              {quiz.title}
                            </h4>
                            <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-slate-400 mt-1.5 md:mt-2 font-semibold">
                              <span className="flex items-center gap-0.5 md:gap-1">
                                <HelpCircle className="w-3 h-3 md:w-3.5 md:h-3.5" />{' '}
                                {quiz.TryoutQuestionCount || '-'} Soal
                              </span>
                              <span className="flex items-center gap-0.5 md:gap-1">
                                <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />{' '}
                                {quiz.TryoutSession.duration}m
                              </span>
                            </div>
                          </div>

                          {/* Score or Start Button */}
                          {quiz.isDone ? (
                            <div className="pt-2.5 md:pt-3 border-t border-emerald-100 space-y-2.5 md:space-y-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                    Skor
                                  </p>
                                  <div className="flex items-baseline gap-1">
                                    <p className="text-xl md:text-2xl font-black text-emerald-600">
                                      {quiz.TryoutResult?.totalScore || '-'}
                                    </p>
                                    {/* <div className="flex items-center gap-0.5 text-amber-600">
                                      <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                      <span className="text-[10px] md:text-xs font-bold">
                                        #{getDeterministicValue(quiz.id, 1, 50)}
                                      </span>
                                    </div> */}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                    B/S/K
                                  </p>
                                  <p className="text-sm md:text-base font-bold">
                                    <span className="text-emerald-600">
                                      {quiz.TryoutSession.CorrectAnswersCount ||
                                        0}
                                    </span>
                                    <span className="text-slate-300 mx-0.5">
                                      /
                                    </span>
                                    <span className="text-red-500">
                                      {quiz.TryoutSession.WrongAnswersCount ||
                                        0}
                                    </span>
                                    <span className="text-slate-300 mx-0.5">
                                      /
                                    </span>
                                    <span className="text-gray-500">
                                      {quiz.TryoutSession.NotAnswersCount || 0}
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <Link
                                href={`./quiz/${selectedVolumeId}/${quiz.id}`}
                              >
                                <Button
                                  size="sm"
                                  className="w-full rounded-3xl md:rounded-3xl text-xs md:text-sm font-bold h-9 md:h-11 gap-1.5 md:gap-2 shadow-md transition-all hover:opacity-90 bg-[#10b981] hover:bg-[#10b981]"
                                >
                                  <Swords className="w-3.5 h-3.5 md:w-4 md:h-4" />{' '}
                                  Lihat Hasil
                                </Button>
                              </Link>
                            </div>
                          ) : (
                            <div className="space-y-2 md:space-y-3">
                              {isVolumeEnded ? (
                                <Button
                                  size="sm"
                                  className="w-full rounded-3xl md:rounded-3xl text-xs md:text-sm font-bold h-9 md:h-11 gap-1.5 md:gap-2 shadow-md transition-all hover:opacity-90"
                                  style={{
                                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                  }}
                                  disabled
                                >
                                  <LockIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />{' '}
                                  Telah Berakhir
                                </Button>
                              ) : isVolumeStarted ? (
                                <>
                                  {isLocked && quiz.quizOrder !== 1 ? (
                                    <Button
                                      size="sm"
                                      className="w-full rounded-3xl md:rounded-3xl text-xs md:text-sm font-bold h-9 md:h-11 gap-1.5 md:gap-2 shadow-md transition-all bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                                      onClick={() => setTransactionPopUp(true)}
                                    >
                                      <LockIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />{' '}
                                      Terkunci
                                    </Button>
                                  ) : (
                                    <Link
                                      href={`./quiz/${selectedVolumeId}/${quiz.id}`}
                                    >
                                      <Button
                                        size="sm"
                                        className="w-full rounded-3xl md:rounded-3xl text-xs md:text-sm font-bold h-9 md:h-11 gap-1.5 md:gap-2 shadow-md transition-all hover:opacity-90"
                                        style={{
                                          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                        }}
                                      >
                                        <Swords className="w-3.5 h-3.5 md:w-4 md:h-4" />{' '}
                                        Battle
                                      </Button>
                                    </Link>
                                  )}
                                </>
                              ) : !isVolumeStarted ? (
                                <Button
                                  size="sm"
                                  className="w-full rounded-3xl md:rounded-3xl text-xs md:text-sm font-bold h-9 md:h-11 gap-1.5 md:gap-2 shadow-md transition-all hover:opacity-90"
                                  style={{
                                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                  }}
                                  disabled
                                >
                                  <LockIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />{' '}
                                  Belum Dimulai
                                </Button>
                              ) : null}

                              {/* <div className="flex items-center justify-center gap-2 text-[10px] md:text-xs text-slate-400">
                                <span className="flex items-center gap-0.5 md:gap-1">
                                  <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-400" />{' '}
                                  +{POINTS_PER_QUIZ} Poin
                                </span>
                              </div> */}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredQuizzes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 md:py-16 px-4">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse"
                style={{
                  background: `radial-gradient(circle, ${mainColor}40, transparent)`,
                  animationDuration: '4s',
                }}
              />
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center max-w-md">
              {/* Icon with Glow */}
              <div className="relative inline-flex items-center justify-center mb-6 md:mb-8">
                <div
                  className="absolute inset-0 rounded-full blur-2xl opacity-20 animate-pulse"
                  style={{ backgroundColor: mainColor }}
                />
                <div
                  className="relative bg-gradient-to-br from-white via-white to-gray-50 rounded-full p-8 md:p-10 shadow-lg border-2"
                  style={{
                    borderColor: `${mainColor}30`,
                    boxShadow: `0 15px 40px -10px ${mainColor}30`,
                  }}
                >
                  <HelpCircle
                    className="h-16 w-16 md:h-20 md:w-20"
                    style={{ color: mainColor }}
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              {/* Text Content */}
              <h3 className="text-lg md:text-xl font-black text-slate-800 mb-2 md:mb-3">
                Quiz Tidak Ditemukan
              </h3>
              <p className="text-sm md:text-base text-slate-500 font-medium mb-6 md:mb-8">
                {searchQuery
                  ? `Tidak ada quiz yang cocok dengan "${searchQuery}". Coba cari dengan kata kunci lain.`
                  : 'Belum ada quiz tersedia untuk kategori ini. Nantikan konten terbaru dari kami!'}
              </p>

              {/* Action Button */}
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery('')}
                  className="rounded-full px-6 md:px-8 font-bold text-sm md:text-base h-10 md:h-12 gap-2 shadow-md transition-all hover:opacity-90"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    color: 'white',
                  }}
                >
                  <Search className="w-4 h-4 md:w-5 md:h-5" />
                  Hapus Pencarian
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
