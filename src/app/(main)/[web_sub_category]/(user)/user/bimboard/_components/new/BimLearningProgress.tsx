'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { BimArena, BimCourse, BimLive } from '@/components/ui/bim-brand';
import { Input } from '@/components/ui/input';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import {
  BookOpen,
  CheckCircle,
  Clock,
  MonitorPlay,
  Search,
  Target,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { EmptyStateIllustrations } from './EmptyStateIllustrations';

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
            Selesai
          </span>
        );
      case 'in-progress':
        return (
          <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
            Sedang Berjalan
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            Belum Mulai
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border-2 border-slate-100 p-6 shadow-sm">
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
                <Link
                  key={liveClass.id}
                  href={`/${website_sub_category_id}/user/bimlive/${liveClass.id}`}
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

                  {/* Dark Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
                    {liveClass.isPremium && (
                      <div className="px-2 py-0.5 rounded-3xl bg-amber-400 text-white text-[10px] font-bold shadow-sm">
                        PRO
                      </div>
                    )}
                  </div>

                  <div className="absolute top-3 left-3 z-10">
                    <div className="bg-rose-500 text-white text-[10px] px-2 py-0.5 font-bold rounded-3xl animate-pulse shadow-sm">
                      LIVE
                    </div>
                  </div>

                  {/* Content Overlay at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                    {/* Instructor Info */}
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
                      <span className="text-xs font-bold text-white shadow-black drop-shadow-md truncate">
                        {liveClass.instructorName}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-white text-lg line-clamp-2 leading-tight mb-2 drop-shadow-md group-hover:text-blue-200 transition-colors">
                      {liveClass.title}
                    </h3>

                    {/* Schedule & Duration */}
                    <div className="flex items-center gap-3 text-xs text-white/80 font-medium">
                      <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
                        <Clock className="w-3 h-3" />
                        <span>
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
                  </div>
                </Link>
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
                          {course.completedChapters}/{course.totalChapters} Bab
                          Selesai
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
            </div>
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
        ) : filteredTryouts.length > 0 ? (
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-hide">
            {filteredTryouts.map((tryout) => {
              const getStatusBadge = () => {
                switch (tryout.status) {
                  case 'completed':
                    return (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        Selesai
                      </span>
                    );
                  case 'in-progress':
                    return (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                        <Clock className="w-3 h-3" />
                        Berlangsung
                      </span>
                    );
                  default:
                    return (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        <Target className="w-3 h-3" />
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
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center opacity-20"
                      style={{ backgroundColor: mainColor }}
                    >
                      <Target className="w-16 h-16 text-white" />
                    </div>
                  )}

                  {/* Dark Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex gap-2 z-10">
                    {getStatusBadge()}
                  </div>

                  {/* Score Badge - Top Right (if completed) */}
                  {tryout.score && tryout.score > 0 && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-sm px-2.5 py-1 flex items-center gap-1 border border-white/50">
                        <Target
                          className="w-3.5 h-3.5"
                          style={{ color: mainColor }}
                        />
                        <span
                          className="text-xs font-black"
                          style={{ color: mainColor }}
                        >
                          {tryout.score}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Content Overlay at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                    {/* Title */}
                    <h3 className="font-extrabold text-white text-lg line-clamp-3 leading-tight mb-3 drop-shadow-md group-hover:text-blue-200 transition-colors">
                      {tryout.title}
                    </h3>

                    {/* Subtitle/Hint */}
                    <p className="text-white/80 text-xs font-medium line-clamp-1 mb-1">
                      {tryout.totalQuestions} Soal •{' '}
                      {tryout.status === 'completed'
                        ? 'Selesai'
                        : tryout.status === 'in-progress'
                          ? 'Lanjutkan'
                          : 'Belum Mulai'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
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
    </div>
  );
}
