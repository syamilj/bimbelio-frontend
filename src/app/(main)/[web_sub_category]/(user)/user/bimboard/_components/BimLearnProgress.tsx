'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import {
  BimArena,
  BimCourse,
  BimLearn,
  BimLive,
} from '@/components/ui/bim-brand';
import { Input } from '@/components/ui/input';
import { ScrollWrapper } from '@/components/ui/scroll-wrapper';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  MonitorPlay,
  Search,
  Swords,
  Target,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { EmptyStateIllustrations } from './EmptyStateIllustrations';

interface BimLearnProgressProps {
  courses: Array<{
    id: string;
    name: string;
    category: string;
    progress: number;
    totalChapters: number;
    completedChapters: number;
    thumbnail: string | null;
  }>;
  tryouts: Array<{
    id: string;
    title: string;
    score: number | null;
    totalQuestions: number;
    answeredQuestions: number;
    status: 'completed' | 'in-progress' | 'not-started';
    thumbnail: string | null;
    deadline: string | null;
  }>;
  liveClasses: Array<{
    id: string;
    title: string;
    scheduleTime: string;
    duration: number;
    thumbnail: string | null;
    instructorName: string;
    instructorAvatar: string | null;
    isPremium: boolean;
    isRegistered: boolean;
    websiteSubCategoryId: string;
  }>;
  quizVolumes: Array<{
    id: string;
    title: string;
    image: string | null;
    startDate: string;
    endDate: string;
    status: 'PUBLIC' | 'PRIVATE' | 'DRAFT';
    number: number;
  }>;
}

export default function BimLearnProgress({
  courses,
  tryouts,
  liveClasses,
  quizVolumes,
}: BimLearnProgressProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  // Fixed order: Live → Try Out → Quiz → Courses; empty tabs go to the end
  const sortedOtherTabs = useMemo(() => {
    const others: {
      key: 'live' | 'tryouts' | 'quiz' | 'courses';
      hasData: boolean;
    }[] = [
      { key: 'live', hasData: liveClasses.length > 0 },
      { key: 'courses', hasData: courses.length > 0 },
      { key: 'tryouts', hasData: tryouts.length > 0 },
      { key: 'quiz', hasData: quizVolumes.length > 0 },
    ];
    // Stable sort: preserve relative order, just move empty tabs to end
    return [...others].sort((a, b) => Number(b.hasData) - Number(a.hasData));
  }, [liveClasses.length, tryouts.length, quizVolumes.length, courses.length]);

  const [activeTab, setActiveTab] = useState<
    'learning' | 'live' | 'courses' | 'tryouts' | 'quiz'
  >('learning');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'completed' | 'in-progress'
  >('all');

  // Reset search + filter when switching tabs
  useEffect(() => {
    setSearchQuery('');
    setFilterStatus('all');
  }, [activeTab]);

  // Helper: get live class schedule status
  const getLiveClassStatus = (scheduleTime: string, duration: number) => {
    const start = new Date(scheduleTime);
    const end = new Date(start.getTime() + duration * 60 * 1000);
    const now = new Date();
    if (now >= start && now <= end) return 'live';
    if (now > end) return 'past';
    return 'upcoming';
  };

  // Filter live classes
  const filteredLiveClasses = liveClasses
    .filter((lc) => lc.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((lc) => {
      if (filterStatus === 'all') return true;
      const status = getLiveClassStatus(lc.scheduleTime, lc.duration);
      if (filterStatus === 'completed') return status === 'past';
      if (filterStatus === 'in-progress') return status === 'live';
      return true;
    });

  // Filter quiz volumes
  const filteredQuizVolumes = quizVolumes
    .filter((qv) => qv.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((qv) => {
      if (filterStatus === 'all') return true;
      const now = new Date();
      const end = new Date(qv.endDate);
      const start = new Date(qv.startDate);
      if (filterStatus === 'completed') return now > end;
      if (filterStatus === 'in-progress') return now >= start && now <= end;
      return true;
    });

  // Filter courses
  const filteredCourses = courses
    .filter(
      (course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((course) => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'completed') return course.progress === 100;
      if (filterStatus === 'in-progress')
        return course.progress > 0 && course.progress < 100;
      return true;
    });

  // Filter tryouts
  const filteredTryouts = tryouts
    .filter((tryout) =>
      tryout.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((tryout) => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'completed') return tryout.status === 'completed';
      if (filterStatus === 'in-progress')
        return tryout.status === 'in-progress';
      return true;
    });

  return (
    <div className="w-full bg-white rounded-3xl border-2 border-slate-100 p-6 shadow-sm">
      {/* Header with Tabs */}
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-lg font-black text-slate-800">Progress Belajar</h2>

        <ScrollWrapper className="w-full overflow-x-auto scrollbar-hide pb-0.5">
          <div className="flex gap-1 w-max bg-slate-100 p-1 rounded-3xl">
            {/* BimLearn — always first */}
            <button
              onClick={() => setActiveTab('learning')}
              className={`px-3 py-2 rounded-3xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'learning'
                  ? 'text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
              }`}
              style={
                activeTab === 'learning'
                  ? { backgroundColor: mainColor }
                  : undefined
              }
            >
              <BookOpen className="w-3.5 h-3.5" />
              <BimLearn />
              <span
                className={`text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${activeTab === 'learning' ? 'bg-white/30 text-white' : 'bg-slate-300/70 text-slate-600'}`}
              >
                {liveClasses.length +
                  courses.length +
                  tryouts.length +
                  quizVolumes.length}
              </span>
            </button>

            {/* Other tabs sorted: data first, empty last */}
            {sortedOtherTabs.map(({ key }) => {
              if (key === 'live')
                return (
                  <button
                    key="live"
                    onClick={() => setActiveTab('live')}
                    className={`px-3 py-2 rounded-3xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      activeTab === 'live'
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
                    }`}
                  >
                    <MonitorPlay className="w-3.5 h-3.5" />
                    <BimLive />
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${activeTab === 'live' ? 'bg-white/30 text-white' : 'bg-slate-300/70 text-slate-600'}`}
                    >
                      {liveClasses.length}
                    </span>
                  </button>
                );
              if (key === 'tryouts')
                return (
                  <button
                    key="tryouts"
                    onClick={() => setActiveTab('tryouts')}
                    className={`px-3 py-2 rounded-3xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      activeTab === 'tryouts'
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
                    }`}
                  >
                    <Target className="w-3.5 h-3.5" />
                    <BimArena />
                    <span>Try Out</span>
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${activeTab === 'tryouts' ? 'bg-white/30 text-white' : 'bg-slate-300/70 text-slate-600'}`}
                    >
                      {tryouts.length}
                    </span>
                  </button>
                );
              if (key === 'quiz')
                return (
                  <button
                    key="quiz"
                    onClick={() => setActiveTab('quiz')}
                    className={`px-3 py-2 rounded-3xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      activeTab === 'quiz'
                        ? 'bg-violet-500 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
                    }`}
                  >
                    <Swords className="w-3.5 h-3.5" />
                    <BimArena />
                    <span>Quiz</span>
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${activeTab === 'quiz' ? 'bg-white/30 text-white' : 'bg-slate-300/70 text-slate-600'}`}
                    >
                      {quizVolumes.length}
                    </span>
                  </button>
                );
              return (
                <button
                  key="courses"
                  onClick={() => setActiveTab('courses')}
                  className={`px-3 py-2 rounded-3xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'courses'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <BimCourse />
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${activeTab === 'courses' ? 'bg-white/30 text-white' : 'bg-slate-300/70 text-slate-600'}`}
                  >
                    {courses.length}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollWrapper>
      </div>

      {/* Search & Filter Bar — hidden on BimLearn summary tab */}
      <div
        className={`flex flex-col md:flex-row gap-3 mb-4 ${activeTab === 'learning' ? 'hidden' : ''}`}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder={`Cari ${
              activeTab === 'live'
                ? 'BimLive'
                : activeTab === 'courses'
                  ? 'BimCourse'
                  : activeTab === 'quiz'
                    ? 'BimArena Quiz'
                    : 'BimArena'
            }...`}
            className="pl-10 h-10 rounded-full border-slate-200 bg-slate-50 focus:bg-white transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <ScrollWrapper className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterStatus === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterStatus === 'completed'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Selesai
          </button>
          <button
            onClick={() => setFilterStatus('in-progress')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterStatus === 'in-progress'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Berlangsung
          </button>
        </ScrollWrapper>
      </div>

      {/* Content - Horizontal Scroll for Mobile, Grid for Desktop */}
      <div className="max-h-[500px] overflow-y-auto scrollbar-hide">
        {activeTab === 'learning' ? (
          <div className="space-y-5">
            {/* BimLive section */}
            {liveClasses.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <MonitorPlay className="w-3.5 h-3.5 text-sky-500" />
                    <BimLive />
                  </span>
                  <button
                    onClick={() => setActiveTab('live')}
                    className="text-[11px] font-bold text-sky-500 hover:underline"
                  >
                    Lihat Semua →
                  </button>
                </div>
                <div className="space-y-2">
                  {liveClasses.slice(0, 3).map((lc) => {
                    const lcStatus = getLiveClassStatus(
                      lc.scheduleTime,
                      lc.duration,
                    );
                    return (
                      <Link
                        key={lc.id}
                        href={`/${lc.websiteSubCategoryId}/user/bimlive/detail/${lc.id}`}
                        className="flex items-center gap-3 p-2.5 rounded-3xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-3xl bg-slate-800 overflow-hidden shrink-0 relative">
                          {lc.thumbnail ? (
                            <Image
                              src={lc.thumbnail}
                              alt={lc.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center"
                              style={{ backgroundColor: mainColor }}
                            >
                              <MonitorPlay className="w-4 h-4 text-white/60" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate group-hover:text-sky-600 transition-colors">
                            {lc.title}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {lc.instructorName}
                          </p>
                        </div>
                        {lcStatus === 'live' ? (
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-500 text-white animate-pulse shrink-0">
                            LIVE
                          </span>
                        ) : lcStatus === 'past' ? (
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-200 text-slate-600 shrink-0">
                            Selesai
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-sky-100 text-sky-600 shrink-0">
                            Upcoming
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* BimArena Try Out section */}
            {tryouts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Target className="w-3.5 h-3.5 text-orange-500" />
                    <BimArena /> <span className="font-bold">Try Out</span>
                  </span>
                  <button
                    onClick={() => setActiveTab('tryouts')}
                    className="text-[11px] font-bold text-orange-500 hover:underline"
                  >
                    Lihat Semua →
                  </button>
                </div>
                <div className="space-y-2">
                  {tryouts.slice(0, 3).map((to) => (
                    <Link
                      key={to.id}
                      href={`/${website_sub_category_id}/user/bimarena/try-out/${to.id}`}
                      className="flex items-center gap-3 p-2.5 rounded-3xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-3xl bg-slate-800 overflow-hidden shrink-0 relative">
                        {to.thumbnail ? (
                          <Image
                            src={to.thumbnail}
                            alt={to.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{
                              background:
                                'linear-gradient(135deg,#ea580c,#dc2626)',
                            }}
                          >
                            <Target className="w-4 h-4 text-white/60" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate group-hover:text-orange-600 transition-colors">
                          {to.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {to.totalQuestions} soal
                        </p>
                      </div>
                      {to.score && to.score > 0 ? (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-orange-100 text-orange-600 shrink-0">
                          {to.score}
                        </span>
                      ) : (
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${to.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : to.status === 'in-progress' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}
                        >
                          {to.status === 'completed'
                            ? 'Selesai'
                            : to.status === 'in-progress'
                              ? 'Berlangsung'
                              : 'Belum'}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* BimArena Quiz section */}
            {quizVolumes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Swords className="w-3.5 h-3.5 text-violet-500" />
                    <BimArena /> <span className="font-bold">Quiz</span>
                  </span>
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className="text-[11px] font-bold text-violet-500 hover:underline"
                  >
                    Lihat Semua →
                  </button>
                </div>
                <div className="space-y-2">
                  {quizVolumes.slice(0, 3).map((qv) => {
                    const now = new Date();
                    const isActive =
                      now >= new Date(qv.startDate) &&
                      now <= new Date(qv.endDate);
                    const isPast = now > new Date(qv.endDate);
                    return (
                      <Link
                        key={qv.id}
                        href={`/${website_sub_category_id}/user/bimarena/quiz`}
                        className="flex items-center gap-3 p-2.5 rounded-3xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                      >
                        <div
                          className="w-10 h-10 rounded-3xl overflow-hidden shrink-0 relative"
                          style={{
                            background:
                              'linear-gradient(135deg,#4c1d95,#7c3aed)',
                          }}
                        >
                          {qv.image ? (
                            <Image
                              src={qv.image}
                              alt={qv.title}
                              fill
                              className="object-cover opacity-60"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Swords className="w-4 h-4 text-white/60" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate group-hover:text-violet-600 transition-colors">
                            {qv.title}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Vol. {qv.number}
                          </p>
                        </div>
                        {isActive ? (
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-violet-100 text-violet-600 shrink-0">
                            Aktif
                          </span>
                        ) : isPast ? (
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-600 shrink-0">
                            Selesai
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-500 shrink-0">
                            Segera
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* BimCourse section */}
            {courses.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                    <BimCourse />
                  </span>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className="text-[11px] font-bold text-emerald-500 hover:underline"
                  >
                    Lihat Semua →
                  </button>
                </div>
                <div className="space-y-2">
                  {courses.slice(0, 3).map((course) => (
                    <Link
                      key={course.id}
                      href={`/${website_sub_category_id}/user/bimcourse/${course.id}`}
                      className="flex items-center gap-3 p-2.5 rounded-3xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-3xl bg-slate-100 overflow-hidden shrink-0 relative">
                        {course.thumbnail ? (
                          <Image
                            src={course.thumbnail}
                            alt={course.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{
                              background: `linear-gradient(135deg,${mainColor},${mainColor}80)`,
                            }}
                          >
                            <BookOpen className="w-4 h-4 text-white/60" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-600 transition-colors">
                          {course.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${course.progress}%`,
                                backgroundColor: mainColor,
                              }}
                            />
                          </div>
                          <span
                            className="text-[10px] font-bold shrink-0"
                            style={{ color: mainColor }}
                          >
                            {course.progress}%
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All empty state */}
            {liveClasses.length === 0 &&
              tryouts.length === 0 &&
              quizVolumes.length === 0 &&
              courses.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium text-sm">
                    Belum ada aktivitas belajar
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Mulai dengan memilih program di bawah
                  </p>
                </div>
              )}
          </div>
        ) : activeTab === 'live' ? (
          filteredLiveClasses.length > 0 ? (
            <ScrollWrapper className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-hide">
              {filteredLiveClasses.map((liveClass) => {
                const lcStatus = getLiveClassStatus(
                  liveClass.scheduleTime,
                  liveClass.duration,
                );
                return (
                  <Link
                    key={liveClass.id}
                    href={`/${liveClass.websiteSubCategoryId}/user/bimlive/detail/${liveClass.id}`}
                    className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 bg-slate-900 border border-slate-100 flex-shrink-0 w-[280px] md:w-auto aspect-[4/5]"
                  >
                    {/* Full Background Image */}
                    {liveClass.thumbnail ? (
                      <Image
                        src={liveClass.thumbnail}
                        alt={liveClass.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center opacity-20"
                        style={{ backgroundColor: mainColor }}
                      >
                        <MonitorPlay className="w-16 h-16 text-white" />
                      </div>
                    )}

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    {/* Top Right: PRO badge */}
                    <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
                      {liveClass.isPremium && (
                        <div className="px-2 py-0.5 rounded-3xl bg-amber-400 text-white text-[10px] font-bold shadow-sm">
                          PRO
                        </div>
                      )}
                    </div>

                    {/* Top Left: real status badge */}
                    <div className="absolute top-3 left-3 z-10">
                      {lcStatus === 'live' ? (
                        <div className="bg-rose-500 text-white text-[10px] px-2 py-0.5 font-bold rounded-3xl animate-pulse shadow-sm">
                          LIVE
                        </div>
                      ) : lcStatus === 'past' ? (
                        <div className="bg-slate-600/90 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 font-bold rounded-3xl shadow-sm">
                          SELESAI
                        </div>
                      ) : (
                        <div className="bg-blue-500/90 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 font-bold rounded-3xl shadow-sm">
                          UPCOMING
                        </div>
                      )}
                    </div>

                    {/* Bottom Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                      <div className="flex items-center gap-2 mb-2">
                        {liveClass.instructorAvatar ? (
                          <Image
                            src={liveClass.instructorAvatar}
                            alt={liveClass.instructorName}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full object-cover border border-white/30"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                            <span className="text-[10px] font-bold text-white uppercase">
                              {liveClass.instructorName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span className="text-xs font-bold text-white drop-shadow-md truncate">
                          {liveClass.instructorName}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-white text-lg line-clamp-2 leading-tight mb-2 drop-shadow-md group-hover:text-blue-200 transition-colors">
                        {liveClass.title}
                      </h3>

                      <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm w-fit">
                        <Clock className="w-3 h-3 text-white/80" />
                        <span className="text-xs text-white/80 font-medium">
                          {new Date(liveClass.scheduleTime).toLocaleDateString(
                            'id-ID',
                            {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </ScrollWrapper>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <MonitorPlay className="w-16 h-16 text-slate-300 mb-4" />
              <p className="text-slate-500 text-center font-medium">
                {searchQuery
                  ? 'Tidak ada kelas live yang cocok'
                  : filterStatus === 'completed'
                    ? 'Belum ada kelas live yang selesai'
                    : filterStatus === 'in-progress'
                      ? 'Tidak ada kelas live yang berlangsung sekarang'
                      : 'Belum ada kelas live'}
              </p>
            </div>
          )
        ) : activeTab === 'courses' ? (
          filteredCourses.length > 0 ? (
            <ScrollWrapper className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-hide">
              {filteredCourses.map((course) => {
                const getStatusBadge = () => {
                  if (course.progress === 0) {
                    return (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                        <Clock className="w-3 h-3" />
                        Belum Dimulai
                      </span>
                    );
                  } else if (course.progress === 100) {
                    return (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        Selesai
                      </span>
                    );
                  } else {
                    return (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200">
                        <Target className="w-3 h-3" />
                        Berlangsung
                      </span>
                    );
                  }
                };

                return (
                  <Link
                    key={course.id}
                    href={`/${website_sub_category_id}/user/bimcourse/${course.id}`}
                    className="group relative bg-white rounded-3xl border-2 border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all overflow-hidden flex-shrink-0 w-[280px] md:w-auto h-fit"
                  >
                    {/* Progress Ring - Top Right */}
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="relative w-14 h-14">
                        <div className="absolute inset-0 bg-white rounded-full shadow-md" />
                        <svg
                          className="w-14 h-14 transform -rotate-90 relative z-10"
                          viewBox="0 0 36 36"
                        >
                          <path
                            className="text-slate-200"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            strokeDasharray="100, 100"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            stroke={mainColor}
                            strokeWidth="3"
                            fill="transparent"
                            strokeDasharray={`${course.progress}, 100`}
                            strokeLinecap="round"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className="text-[10px] font-black"
                            style={{ color: mainColor }}
                          >
                            {course.progress}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="relative w-full overflow-hidden bg-slate-100">
                      {course.thumbnail ? (
                        <Image
                          src={course.thumbnail}
                          alt={course.name}
                          width={300}
                          height={200}
                          className="w-full h-auto object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div
                          className="w-full h-36 flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${mainColor}, ${mainColor}80)`,
                          }}
                        >
                          <BookOpen className="w-12 h-12 text-white opacity-50" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      {/* Status Badge */}
                      <div>{getStatusBadge()}</div>

                      {/* Title & Category */}
                      <div>
                        <h3 className="font-bold text-sm text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
                          {course.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {course.category}
                        </p>
                      </div>

                      {/* Progress Info */}
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Clock className="w-3.5 h-3.5 opacity-70" />
                        <span className="font-bold">
                          {course.completedChapters}/{course.totalChapters}{' '}
                          Sub-Chapter Selesai
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${course.progress}%`,
                            backgroundColor: mainColor,
                          }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </ScrollWrapper>
          ) : (
            <div className="text-center py-8">
              <div className="w-32 h-32 mx-auto mb-3">
                <EmptyStateIllustrations.NoCourses />
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-2">
                {searchQuery ? (
                  'Tidak ada hasil'
                ) : (
                  <>
                    Belum Ada <BimCourse />
                  </>
                )}
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                {searchQuery ? (
                  'Coba kata kunci lain'
                ) : (
                  <>
                    Jelajahi <BimCourse /> yang tersedia dan mulai belajar
                  </>
                )}
              </p>
              {!searchQuery && (
                <Link
                  href={`/${website_sub_category_id}/user/bimcourse`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white shadow-md hover:shadow-lg transition-all hover:scale-105"
                  style={{ backgroundColor: mainColor }}
                >
                  Jelajahi <BimCourse />
                </Link>
              )}
            </div>
          )
        ) : activeTab === 'quiz' ? (
          filteredQuizVolumes.length > 0 ? (
            <ScrollWrapper className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-hide">
              {filteredQuizVolumes.map((qv) => {
                const now = new Date();
                const start = new Date(qv.startDate);
                const end = new Date(qv.endDate);
                const isActive = now >= start && now <= end;
                const isPast = now > end;

                return (
                  <Link
                    key={qv.id}
                    href={`/${website_sub_category_id}/user/bimarena/quiz`}
                    className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex-shrink-0 w-[280px] md:w-auto aspect-[4/5]"
                  >
                    {/* Base background */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: qv.image
                          ? 'linear-gradient(135deg, #111827, #312e81)'
                          : 'linear-gradient(135deg, #4c1d95, #6d28d9, #7c3aed)',
                      }}
                    />

                    {/* Optional background image */}
                    {qv.image && (
                      <Image
                        src={qv.image}
                        alt={qv.title}
                        fill
                        className="object-cover opacity-90 group-hover:opacity-95 transition-opacity duration-500"
                      />
                    )}

                    {/* Top gradient overlay */}
                    <div
                      className={cn(
                        'absolute inset-0',
                        qv.image
                          ? 'bg-gradient-to-t from-black/65 via-black/15 to-transparent'
                          : 'bg-gradient-to-t from-black/80 via-violet-950/30 to-transparent',
                      )}
                    />

                    {/* Top left: Quiz chip */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-violet-400/30 text-violet-200 border border-violet-400/50 backdrop-blur-sm uppercase tracking-wide">
                        Quiz
                      </span>
                    </div>

                    {/* Top right: status */}
                    <div className="absolute top-3 right-3 z-10">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/80 backdrop-blur-sm text-white border border-violet-400/50">
                          Berlangsung
                        </span>
                      ) : isPast ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/80 backdrop-blur-sm text-white border border-emerald-400/50">
                          Selesai
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700/80 backdrop-blur-sm text-white border border-slate-600/50">
                          Akan Datang
                        </span>
                      )}
                    </div>

                    {/* Center: faint swords decoration */}
                    {!qv.image && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <Swords className="w-24 h-24 text-white/10" />
                      </div>
                    )}

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                      <div className="flex items-center gap-1 mb-1.5">
                        <Swords className="w-3 h-3 text-violet-300" />
                        <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wide">
                          Vol. {qv.number}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-white text-lg line-clamp-2 leading-tight mb-2 drop-shadow-md group-hover:text-violet-200 transition-colors">
                        {qv.title}
                      </h3>
                      <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm w-fit">
                        <Calendar className="w-3 h-3 text-white/70" />
                        <span className="text-xs text-white/70 font-medium">
                          {new Date(qv.startDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })}
                          {' – '}
                          {new Date(qv.endDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </ScrollWrapper>
          ) : (
            <div className="text-center py-8">
              <Swords className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-black text-slate-800 mb-2">
                {searchQuery ? 'Tidak ada hasil' : 'Belum Ada Quiz'}
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                {searchQuery ? (
                  'Coba kata kunci lain'
                ) : (
                  <>
                    Ikuti <BimArena /> Quiz untuk menguji kemampuanmu
                  </>
                )}
              </p>
              {!searchQuery && (
                <Link
                  href={`/${website_sub_category_id}/user/bimarena/quiz`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white shadow-md hover:shadow-lg transition-all hover:scale-105"
                  style={{ backgroundColor: mainColor }}
                >
                  Mulai <BimArena /> Quiz
                </Link>
              )}
            </div>
          )
        ) : filteredTryouts.length > 0 ? (
          <ScrollWrapper className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-hide">
            {filteredTryouts.map((tryout) => {
              const getStatusBadge = () => {
                switch (tryout.status) {
                  case 'completed':
                    return (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/80 backdrop-blur-sm text-white border border-emerald-400/50">
                        Selesai
                      </span>
                    );
                  case 'in-progress':
                    return (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/80 backdrop-blur-sm text-white border border-orange-400/50">
                        Berlangsung
                      </span>
                    );
                  default:
                    return (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700/80 backdrop-blur-sm text-white border border-slate-600/50">
                        Belum Mulai
                      </span>
                    );
                }
              };

              return (
                <Link
                  key={tryout.id}
                  href={`/${website_sub_category_id}/user/bimarena/try-out/${tryout.id}`}
                  className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 bg-slate-900 border border-slate-100 flex-shrink-0 w-[280px] md:w-auto aspect-[4/5]"
                >
                  {/* Full Background Image */}
                  {tryout.thumbnail ? (
                    <Image
                      src={tryout.thumbnail}
                      alt={tryout.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 280px, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #ea580c, #dc2626)',
                      }}
                    >
                      <Target className="w-16 h-16 text-white/20" />
                    </div>
                  )}

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Top left: Try Out chip */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-orange-500/80 text-white border border-orange-400/50 backdrop-blur-sm uppercase tracking-wide">
                      Try Out
                    </span>
                  </div>

                  {/* Top right: status + score */}
                  <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-end">
                    {getStatusBadge()}
                    {tryout.score && tryout.score > 0 && (
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 border border-white/50">
                        <Target className="w-3 h-3 text-orange-500" />
                        <span className="text-xs font-black text-orange-500">
                          {tryout.score}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                    <h3 className="font-extrabold text-white text-base line-clamp-3 leading-tight mb-2 drop-shadow-md group-hover:text-orange-200 transition-colors">
                      {tryout.title}
                    </h3>
                    <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm w-fit">
                      <Target className="w-3 h-3 text-white/80" />
                      <span className="text-xs text-white/80 font-medium">
                        {tryout.totalQuestions} soal
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </ScrollWrapper>
        ) : (
          <div className="text-center py-8">
            <div className="w-32 h-32 mx-auto mb-3">
              <EmptyStateIllustrations.NoTryouts />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2">
              {searchQuery ? 'Tidak ada hasil' : 'Belum Ada Try Out'}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {searchQuery ? (
                'Coba kata kunci lain'
              ) : (
                <>
                  Mulai <BimArena /> untuk meningkatkan kemampuanmu
                </>
              )}
            </p>
            {!searchQuery && (
              <Link
                href={`/${website_sub_category_id}/user/bimarena/try-out`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white shadow-md hover:shadow-lg transition-all hover:scale-105"
                style={{ backgroundColor: mainColor }}
              >
                Mulai <BimArena />
              </Link>
            )}
          </div>
        )}
      </div>

      {/* View All Link */}
      {activeTab !== 'learning' &&
        ((activeTab === 'live' && filteredLiveClasses.length > 0) ||
          (activeTab === 'courses' && filteredCourses.length > 0) ||
          (activeTab === 'quiz' && filteredQuizVolumes.length > 0) ||
          (activeTab === 'tryouts' && filteredTryouts.length > 0)) && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link
              href={`/${website_sub_category_id}/user/${
                activeTab === 'courses'
                  ? 'bimcourse'
                  : activeTab === 'live'
                    ? 'bimlive'
                    : activeTab === 'quiz'
                      ? 'bimarena/quiz'
                      : 'bimarena/try-out'
              }`}
              className="flex items-center justify-center gap-2 text-sm font-bold hover:gap-3 transition-all"
              style={{ color: mainColor }}
            >
              Lihat Semua{' '}
              {activeTab === 'courses' ? (
                <BimCourse />
              ) : activeTab === 'live' ? (
                <BimLive />
              ) : activeTab === 'quiz' ? (
                <>
                  <BimArena /> Quiz
                </>
              ) : (
                <>
                  <BimArena /> Try Out
                </>
              )}
              <Target className="w-4 h-4" />
            </Link>
          </div>
        )}
    </div>
  );
}
