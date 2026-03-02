'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { env } from '@/env.mjs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { Badge } from '@/components/ui/badge';
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

  const { data: courseCategoryCards } = useGet<
    {
      id: string;
      name: string;
      image: string | null;
    }[]
  >('/course/getCategoryForCard');

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

  const getImageUrl = (image: string | null | undefined) => {
    if (!image) return null;
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    const base = env.NEXT_PUBLIC_SUPABASE_IMG_URL || '';
    if (!base) return null;
    if (image.startsWith('/')) {
      return `${base}${image}`;
    }
    return `${base}/${image}`;
  };

  const normalizeName = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const getBimCourseSubCategoryImage = (subCategoryName: string) => {
    const normalizedSubCategory = normalizeName(subCategoryName);
    const match = (courseCategoryCards || []).find((category) => {
      const normalizedCategory = normalizeName(category.name);
      return (
        normalizedCategory === normalizedSubCategory ||
        normalizedCategory.includes(normalizedSubCategory) ||
        normalizedSubCategory.includes(normalizedCategory)
      );
    });
    return match?.image || null;
  };

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
                    const isFreeQuiz =
                      quiz.isFreePreview === true || quiz.quizOrder === 1;

                    return (
                      <div
                        key={quiz.id}
                        className={cn(
                          'group relative overflow-hidden rounded-3xl border-2 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01] flex-shrink-0 w-[230px] md:w-auto',
                          quiz.isDone
                            ? 'border-emerald-100 bg-gradient-to-br from-emerald-50/40 to-white'
                            : 'border-slate-100 bg-white',
                        )}
                      >
                        <div className="absolute top-3 left-3 z-10">
                          {quiz.isDone ? (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-[10px]">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Selesai
                            </Badge>
                          ) : (
                            <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-bold text-[10px]">
                              Aktif
                            </Badge>
                          )}
                        </div>

                        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                          {!quiz.isDone && isQuizHot(quiz.id) && (
                            <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-[8px] font-bold flex items-center gap-0.5 shadow-lg animate-pulse">
                              <Flame className="w-2.5 h-2.5" /> HOT
                            </div>
                          )}
                          <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-bold text-[10px]">
                            <Users className="w-3 h-3 mr-1" />
                            {quiz.totalParticipant || 0}
                          </Badge>
                        </div>

                        <div className="p-3 md:p-4 space-y-4">
                          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50">
                            {getImageUrl(
                              getBimCourseSubCategoryImage(
                                quiz.TryoutSubCategory?.name || sub.name,
                              ) || quiz.TryoutCategory?.image,
                            ) ? (
                              <img
                                src={
                                  getImageUrl(
                                    getBimCourseSubCategoryImage(
                                      quiz.TryoutSubCategory?.name || sub.name,
                                    ) || quiz.TryoutCategory?.image,
                                  ) || ''
                                }
                                alt={quiz.TryoutSubCategory?.name || 'Subcategory'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[11px] font-semibold text-slate-500">
                                {quiz.TryoutSubCategory?.name || sub.name}
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
                          </div>

                          <div>
                            <h4 className="font-bold text-base text-slate-800 group-hover:text-slate-900 transition-colors line-clamp-2">
                              {quiz.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 font-medium">
                              {quiz.TryoutSubCategory?.name || sub.name}
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col items-center justify-center py-2 rounded-3xl border bg-blue-50/60 border-blue-100">
                              <HelpCircle className="w-3.5 h-3.5 text-blue-600 mb-1" />
                              <p className="text-xs font-bold text-blue-700 leading-none">
                                {quiz.TryoutQuestionCount || 0}
                              </p>
                              <p className="text-[10px] text-blue-600 mt-0.5">Soal</p>
                            </div>
                            <div className="flex flex-col items-center justify-center py-2 rounded-3xl border bg-purple-50/60 border-purple-100">
                              <Clock className="w-3.5 h-3.5 text-purple-600 mb-1" />
                              <p className="text-xs font-bold text-purple-700 leading-none">
                                {quiz.TryoutSession.duration}
                              </p>
                              <p className="text-[10px] text-purple-600 mt-0.5">Menit</p>
                            </div>
                            <div className="flex flex-col items-center justify-center py-2 rounded-3xl border bg-emerald-50/60 border-emerald-100">
                              <Swords className="w-3.5 h-3.5 text-emerald-600 mb-1" />
                              <p className="text-xs font-bold text-emerald-700 leading-none">
                                #{quiz.quizOrder || '-'}
                              </p>
                              <p className="text-[10px] text-emerald-600 mt-0.5">Urutan</p>
                            </div>
                          </div>

                          {/* Score or Start Button */}
                          {quiz.isDone ? (
                            <div className="pt-1 space-y-2.5">
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
                                  className="w-full rounded-3xl text-sm font-bold h-11 gap-2 shadow-sm transition-all hover:opacity-95 bg-[#10b981] hover:bg-[#10b981]"
                                >
                                  <Swords className="w-4 h-4" />
                                  Lihat Hasil
                                </Button>
                              </Link>
                            </div>
                          ) : (
                            <div className="space-y-2.5">
                              {isVolumeEnded ? (
                                <Button
                                  size="sm"
                                  className="w-full rounded-3xl text-sm font-bold h-11 gap-2 shadow-sm transition-all hover:opacity-95"
                                  style={{
                                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                  }}
                                  disabled
                                >
                                  <LockIcon className="w-4 h-4" />
                                  Telah Berakhir
                                </Button>
                              ) : isVolumeStarted ? (
                                <>
                                  {isLocked && !isFreeQuiz ? (
                                    <Button
                                      size="sm"
                                      className="w-full rounded-3xl text-sm font-bold h-11 gap-2 shadow-sm transition-all bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                                      onClick={() => setTransactionPopUp(true)}
                                    >
                                      <LockIcon className="w-4 h-4" />
                                      Terkunci
                                    </Button>
                                  ) : (
                                    <Link
                                      href={`./quiz/${selectedVolumeId}/${quiz.id}`}
                                    >
                                      <Button
                                        size="sm"
                                        className="w-full rounded-3xl text-sm font-bold h-11 gap-2 shadow-sm transition-all hover:opacity-95"
                                        style={{
                                          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                        }}
                                      >
                                        <Swords className="w-4 h-4" />
                                        Battle
                                      </Button>
                                    </Link>
                                  )}
                                </>
                              ) : !isVolumeStarted ? (
                                <Button
                                  size="sm"
                                  className="w-full rounded-3xl text-sm font-bold h-11 gap-2 shadow-sm transition-all hover:opacity-95"
                                  style={{
                                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                  }}
                                  disabled
                                >
                                  <LockIcon className="w-4 h-4" />
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
