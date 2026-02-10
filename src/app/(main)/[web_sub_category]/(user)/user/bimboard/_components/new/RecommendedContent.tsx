'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { ContentCard } from '@/components/ds';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import {
  BookOpen,
  Crown,
  FileText,
  Lock,
  Sparkles,
  Target,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { EmptyState } from '@/components/ds';

interface RecommendedContentProps {
  courses: Array<{
    id: string;
    name: string;
    category: string;
    thumbnail: string | null;
    progress: number;
    isLocked: boolean;
    isPremium: boolean;
  }>;
  tryouts: Array<{
    id: string;
    title: string;
    thumbnail: string | null;
    difficulty: string;
    totalQuestions: number;
    isPremium: boolean;
  }>;
  documents: Array<{
    id: string;
    title: string;
    category: string;
    thumbnail: string | null;
    type: string;
  }>;
}

export default function RecommendedContent({
  courses,
  tryouts,
  documents,
}: RecommendedContentProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const [activeTab, setActiveTab] = useState<
    'courses' | 'tryouts' | 'documents'
  >('courses');

  return (
    <ContentCard borderVariant="default" padding="md" className="w-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Sparkles
            className="w-5 h-5"
            style={{ color: mainColor }}
          />
          <h2 className="text-xl font-black text-slate-800">
            Rekomendasi untuk Kamu
          </h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-3xl mb-5">
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex-1 px-3 py-2 rounded-3xl text-sm font-bold transition-all ${
            activeTab === 'courses'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Kursus
        </button>
        <button
          onClick={() => setActiveTab('tryouts')}
          className={`flex-1 px-3 py-2 rounded-3xl text-sm font-bold transition-all ${
            activeTab === 'tryouts'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Try Out
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex-1 px-3 py-2 rounded-3xl text-sm font-bold transition-all ${
            activeTab === 'documents'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Materi
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {activeTab === 'courses' &&
          (courses.length > 0 ? (
            courses.map((course) => (
              <Link
                key={course.id}
                href={`/${website_sub_category_id}/user/bimcourse/${course.id}`}
              >
                <div className="group relative rounded-3xl border-2 border-slate-100 hover:border-slate-200 hover:shadow-md transition-all overflow-hidden cursor-pointer">
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-video bg-slate-100">
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
                        style={{ backgroundColor: `${mainColor}15` }}
                      >
                        <BookOpen
                          className="w-8 h-8"
                          style={{ color: mainColor }}
                        />
                      </div>
                    )}

                    {/* Premium Badge */}
                    {course.isPremium && (
                      <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        <span>Premium</span>
                      </div>
                    )}

                    {/* Lock Overlay */}
                    {course.isLocked && (
                      <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-xs text-slate-500 font-medium mb-1">
                      {course.category}
                    </p>
                    <h3 className="font-bold text-sm text-slate-800 line-clamp-2 mb-2 min-h-[40px]">
                      {course.name}
                    </h3>

                    {/* Progress */}
                    {course.progress > 0 && (
                      <div className="space-y-1">
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${course.progress}%`,
                              backgroundColor: mainColor,
                            }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {course.progress}% selesai
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-2 lg:col-span-4">
              <EmptyState icon={BookOpen} color="blue" title="Belum ada rekomendasi kursus" className="py-8" />
            </div>
          ))}

        {activeTab === 'tryouts' &&
          (tryouts.length > 0 ? (
            tryouts.map((tryout) => (
              <Link
                key={tryout.id}
                href={`/${website_sub_category_id}/user/bimarena/try-out/${tryout.id}`}
              >
                <div className="group relative rounded-3xl border-2 border-slate-100 hover:border-slate-200 hover:shadow-md transition-all overflow-hidden cursor-pointer">
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-video bg-purple-100">
                    {tryout.thumbnail ? (
                      <Image
                        src={tryout.thumbnail}
                        alt={tryout.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Target className="w-8 h-8 text-purple-500" />
                      </div>
                    )}

                    {tryout.isPremium && (
                      <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        <span>Premium</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold">
                        {tryout.difficulty}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {tryout.totalQuestions} soal
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-800 line-clamp-2 min-h-[40px]">
                      {tryout.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-2 lg:col-span-4">
              <EmptyState icon={Target} color="purple" title="Belum ada rekomendasi tryout" className="py-8" />
            </div>
          ))}

        {activeTab === 'documents' &&
          (documents.length > 0 ? (
            documents.map((doc) => (
              <Link
                key={doc.id}
                href={`/${website_sub_category_id}/user/bimaterial/${doc.id}`}
              >
                <div className="group relative rounded-3xl border-2 border-slate-100 hover:border-slate-200 hover:shadow-md transition-all overflow-hidden cursor-pointer">
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-video bg-amber-100">
                    {doc.thumbnail ? (
                      <Image
                        src={doc.thumbnail}
                        alt={doc.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-amber-600" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold">
                        {doc.type}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {doc.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-800 line-clamp-2 min-h-[40px]">
                      {doc.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-2 lg:col-span-4">
              <EmptyState icon={FileText} color="amber" title="Belum ada rekomendasi materi" className="py-8" />
            </div>
          ))}
      </div>
    </ContentCard>
  );
}
