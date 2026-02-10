'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { BimArena, BimCourse, BimLive } from '@/components/ui/bim-brand';
import { Input } from '@/components/ui/input';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import {
  BookOpen,
  MonitorPlay,
  Search,
  Target,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { EmptyState, ContentCard } from '@/components/ds';
import { CourseProgressCard } from './CourseProgressCard';
import { LiveClassProgressCard } from './LiveClassProgressCard';
import { TryoutProgressCard } from './TryoutProgressCard';

interface BimLearningProgressProps {
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
  }>;
}

export default function BimLearningProgress({
  courses,
  tryouts,
  liveClasses,
}: BimLearningProgressProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  // Default tab to BimLive
  const [activeTab, setActiveTab] = useState<'live' | 'courses' | 'tryouts'>(
    'live',
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'completed' | 'in-progress'
  >('all');

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
    <ContentCard borderVariant="default" padding="lg" className="w-full">
      {/* Header with Tabs */}
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-lg font-black text-slate-800">Progress Belajar</h2>

        <div className="flex gap-2 w-fit bg-slate-100 p-1 rounded-full overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('live')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'live'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <MonitorPlay className="w-4 h-4" />
            <BimLive />
          </button>
          <button
            onClick={() => setActiveTab('tryouts')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'tryouts'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Target className="w-4 h-4" />
            <BimArena />
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'courses'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <BimCourse />
          </button>

        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder={`Cari ${activeTab === 'live' ? 'BimLive' : activeTab === 'courses' ? 'BimCourse' : 'BimArena'}...`}
            className="pl-10 h-10 rounded-full border-slate-200 bg-slate-50 focus:bg-white transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
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
        </div>
      </div>

      {/* Content - Horizontal Scroll for Mobile, Grid for Desktop */}
      <div className="max-h-[500px] overflow-y-auto scrollbar-hide">
        {activeTab === 'live' ? (
          liveClasses && liveClasses.length > 0 ? (
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-hide">
              {liveClasses.map((liveClass) => (
                <LiveClassProgressCard
                  key={liveClass.id}
                  liveClass={liveClass}
                  webSubCategoryId={website_sub_category_id || ''}
                  mainColor={mainColor}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <MonitorPlay className="w-16 h-16 text-slate-300 mb-4" />
              <p className="text-slate-500 text-center font-medium">
                Belum ada kelas live
              </p>
              <p className="text-slate-400 text-sm text-center mt-2">
                Kelas live akan ditampilkan di sini
              </p>
            </div>
          )
        ) : activeTab === 'courses' ? (
          filteredCourses.length > 0 ? (
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-hide">
              {filteredCourses.map((course) => (
                <CourseProgressCard
                  key={course.id}
                  course={course}
                  webSubCategoryId={website_sub_category_id || ''}
                  mainColor={mainColor}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <EmptyState
                icon={BookOpen}
                color="blue"
                title={searchQuery ? 'Tidak ada hasil' : 'Belum Ada Kursus'}
                description={searchQuery ? 'Coba kata kunci lain' : 'Jelajahi kursus yang tersedia dan mulai belajar'}
                action={
                  !searchQuery ? (
                    <Link
                      href={`/${website_sub_category_id}/user/bimcourse`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white shadow-md hover:shadow-lg transition-all hover:scale-105"
                      style={{ backgroundColor: mainColor }}
                    >
                      Jelajahi <BimCourse />
                    </Link>
                  ) : undefined
                }
              />
            </div>
          )
        ) : filteredTryouts.length > 0 ? (
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-hide">
            {filteredTryouts.map((tryout) => (
              <TryoutProgressCard
                key={tryout.id}
                tryout={tryout}
                webSubCategoryId={website_sub_category_id || ''}
                mainColor={mainColor}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <EmptyState
              icon={Target}
              color="purple"
              title={searchQuery ? 'Tidak ada hasil' : 'Belum Ada Try Out'}
              description={searchQuery ? 'Coba kata kunci lain' : 'Mulai try out untuk meningkatkan kemampuanmu'}
              action={
                !searchQuery ? (
                  <Link
                    href={`/${website_sub_category_id}/user/bimarena/try-out`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white shadow-md hover:shadow-lg transition-all hover:scale-105"
                    style={{ backgroundColor: mainColor }}
                  >
                    Mulai <BimArena />
                  </Link>
                ) : undefined
              }
            />
          </div>
        )}
      </div>

      {/* View All Link */}
      {((activeTab === 'courses' && filteredCourses.length > 0) ||
        (activeTab === 'tryouts' && filteredTryouts.length > 0)) && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <Link
            href={`/${website_sub_category_id}/user/${activeTab === 'courses' ? 'bimcourse' : 'bimarena/try-out'}`}
            className="flex items-center justify-center gap-2 text-sm font-bold hover:gap-3 transition-all"
            style={{ color: mainColor }}
          >
            Lihat Semua {activeTab === 'courses' ? <BimCourse /> : <BimArena />}
            <Target className="w-4 h-4" />
          </Link>
        </div>
      )}
    </ContentCard>
  );
}
