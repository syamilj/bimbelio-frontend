'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CheckCircle2,
  Clock,
  FileQuestion,
  HelpCircle,
  Play,
  RotateCcw,
  Search,
  Swords,
  Users,
  Trophy,
  Flame,
  Zap,
  TrendingUp,
  Star,
  Sparkles,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { QuizCategory, SUB_CATEGORIES } from './quiz-types';
import {
  POINTS_PER_QUIZ,
  getDeterministicValue,
  isQuizHot,
} from './quiz-dummy';

interface QuizLibraryProps {
  quizzes: QuizCategory[];
  volumeName: string;
}

export function QuizLibrary({ quizzes, volumeName }: QuizLibraryProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  // Filter quizzes
  const filteredQuizzes = quizzes
    .filter((cat) => !selectedSubCategory || cat.id === selectedSubCategory)
    .map((cat) => ({
      ...cat,
      quizzes: cat.quizzes.filter((q) =>
        q.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.quizzes.length > 0);

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
              onClick={() => setSelectedSubCategory(null)}
              className={cn(
                'px-3 md:px-4 py-2 md:py-2.5 rounded-3xl md:rounded-3xl text-xs font-bold whitespace-nowrap transition-all border shadow-sm flex-shrink-0',
                !selectedSubCategory
                  ? 'text-white border-transparent'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              )}
              style={!selectedSubCategory ? { background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})` } : {}}
            >
              Semua
            </button>
            {SUB_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedSubCategory(cat.id)}
                className={cn(
                  'px-3 md:px-4 py-2 md:py-2.5 rounded-3xl md:rounded-3xl text-xs font-bold whitespace-nowrap transition-all border shadow-sm flex-shrink-0',
                  selectedSubCategory === cat.id
                    ? 'text-white border-transparent'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                )}
                style={selectedSubCategory === cat.id ? { backgroundColor: cat.color } : {}}
              >
                {cat.code}
              </button>
            ))}
            </div>
          </div>
          {/* Scroll fade indicator */}
          <div className="absolute right-0 top-0 bottom-1 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden" />
        </div>
      </div>

      {/* Quiz Grid by Category */}
      <div className="space-y-8">
        {filteredQuizzes.map((category) => (
          <div key={category.id} className="space-y-5">
            {/* Category Header */}
            <div
              className="flex items-center gap-4 p-4 rounded-3xl border shadow-sm"
              style={{ backgroundColor: `${category.color}08`, borderColor: `${category.color}20` }}
            >
              <div
                className="w-12 h-12 rounded-3xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: category.color }}
              >
                <Swords className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black text-slate-800">{category.code}</h3>
                <p className="text-sm text-slate-500 font-medium truncate">{category.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs text-emerald-700 font-bold">{getDeterministicValue(category.id, 10, 50)} online</span>
                </div>
                <Badge variant="secondary" className="font-bold text-sm bg-white border border-slate-200 px-3 py-1.5">
                  {category.quizzes.filter((q) => q.isDone).length}/{category.quizzes.length}
                </Badge>
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
                {category.quizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className={cn(
                      'group relative overflow-hidden rounded-3xl md:rounded-3xl border transition-all duration-200 cursor-pointer shadow-sm flex-shrink-0 w-[200px] md:w-auto',
                      quiz.isDone
                        ? 'border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white hover:border-emerald-300 hover:shadow-lg'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg'
                    )}
                  >
                    {/* Top Accent Bar */}
                    <div
                      className="h-1 md:h-1.5 w-full"
                      style={{ backgroundColor: quiz.isDone ? '#10b981' : category.color }}
                    />

                    {/* Hot/Trending Badge */}
                    {!quiz.isDone && isQuizHot(quiz.id) && (
                      <div className="absolute top-3 right-2 md:top-4 md:right-3 z-10">
                        <div className="px-2 py-0.5 md:px-2.5 md:py-1 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-[8px] md:text-[9px] font-bold flex items-center gap-0.5 md:gap-1 shadow-lg animate-pulse">
                          <Flame className="w-2.5 h-2.5 md:w-3 md:h-3" /> HOT
                        </div>
                      </div>
                    )}

                    <div className="p-3 md:p-5 space-y-2 md:space-y-3">
                      {/* Header with Battle Stats */}
                      <div className="flex justify-between items-center">
                        <span
                          className="text-[9px] md:text-[10px] font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-3xl md:rounded-3xl"
                          style={{ backgroundColor: `${category.color}15`, color: category.color }}
                        >
                          {category.code}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {!quiz.isDone && (
                            <div className="flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded-3xl md:rounded-3xl bg-amber-50 border border-amber-200">
                              <Users className="w-2.5 h-2.5 md:w-3 md:h-3 text-amber-600" />
                              <span className="text-[9px] md:text-[10px] font-bold text-amber-700">{getDeterministicValue(quiz.id, 5, 25)}</span>
                            </div>
                          )}
                          {quiz.isDone && (
                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                              <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quiz Name */}
                      <div>
                        <h4 className="font-bold text-sm md:text-base text-slate-800 group-hover:text-slate-900 transition-colors line-clamp-2">
                          {quiz.name}
                        </h4>
                        <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-slate-400 mt-1.5 md:mt-2 font-semibold">
                          <span className="flex items-center gap-0.5 md:gap-1">
                            <HelpCircle className="w-3 h-3 md:w-3.5 md:h-3.5" /> {quiz.questions} Soal
                          </span>
                          <span className="flex items-center gap-0.5 md:gap-1">
                            <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" /> {quiz.time} Menit
                          </span>
                        </div>
                      </div>

                      {/* Score or Start Button */}
                      {quiz.isDone ? (
                        <div className="pt-2 md:pt-3 border-t border-slate-100 space-y-2 md:space-y-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider">Skor</p>
                              <div className="flex items-baseline gap-1">
                                <p className="text-xl md:text-2xl font-black text-slate-800">{quiz.score}</p>
                                <div className="flex items-center gap-0.5 text-amber-600">
                                  <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                  <span className="text-[10px] md:text-xs font-bold">#{getDeterministicValue(quiz.id, 1, 50)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider">B/S</p>
                              <p className="text-sm md:text-base font-bold">
                                <span className="text-emerald-600">{quiz.correct}</span>
                                <span className="text-slate-300 mx-0.5">/</span>
                                <span className="text-red-500">{quiz.wrong}</span>
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full rounded-3xl md:rounded-3xl text-[10px] md:text-xs font-bold h-8 md:h-10 gap-1 md:gap-1.5 hover:bg-slate-50 border-slate-200"
                          >
                            <RotateCcw className="w-3 h-3 md:w-4 md:h-4" /> Ulangi
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2 md:space-y-3">
                          <Button
                            size="sm"
                            className="w-full rounded-3xl md:rounded-3xl text-xs md:text-sm font-bold h-9 md:h-11 gap-1.5 md:gap-2 shadow-md transition-all hover:opacity-90"
                            style={{ background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})` }}
                          >
                            <Swords className="w-3.5 h-3.5 md:w-4 md:h-4" /> Battle
                          </Button>
                          <div className="flex items-center justify-center gap-2 text-[10px] md:text-xs text-slate-400">
                            <span className="flex items-center gap-0.5 md:gap-1">
                              <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-400" /> +{POINTS_PER_QUIZ} Poin
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                </div>
              </div>
              {/* Scroll fade indicator */}
              <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
