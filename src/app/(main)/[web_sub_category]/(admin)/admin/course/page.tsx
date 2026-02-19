'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import axiosInstance from '@/lib/axios/axiosInstance';
import { useGet } from '@/lib/fetch-helper/useGet';
import { cn } from '@/lib/utils';
import { Category } from '@/types/database';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  ChevronRightIcon,
  Clock,
  Edit,
  Eye,
  EyeOff,
  FileText,
  Play,
  Plus,
  Search,
  Users,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface SubChapter {
  id: string;
  number: number;
  title: string;
  spendTime: number;
  type: 'VIDEO' | 'DOCUMENT' | 'TRYOUT' | 'MATERI' | 'PROGRESS_TEST';
  description: string;
  premium: boolean;
  Document?: { videoId: string | null } | null;
  _count?: {
    TryoutQuestion: number;
  };
}

interface Course {
  id: string;
  number: number;
  title: string;
  status: 'PRIVATE' | 'PUBLIC';
  categoryId: string;
  _count: {
    CourseSubChapter: number;
  };
  Category: {
    name: string;
  };
  visibleAtWebSubIds: string[];
  CourseSubChapter: SubChapter[];
}

export default function Index() {
  const { data: category, isLoading: isCategoryLoading } = useGet<Category[]>(
    '/category/getAllCategoryAdminCourse',
  );

  const {
    type: { isCore },
    sharingWebSubIds,
  } = useWebsiteSubCategory();

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(
    new Set(),
  );
  const [togglingSubChapters, setTogglingSubChapters] = useState<Set<string>>(new Set());

  const handleToggleSubChapterPremium = async (id: string, current: boolean) => {
    if (togglingSubChapters.has(id)) return;
    setTogglingSubChapters((prev) => new Set(prev).add(id));
    try {
      await axiosInstance.patch('/course/toggleSubChapterPremium', { id, premium: !current });
      await refetchCourses();
    } finally {
      setTogglingSubChapters((prev) => { const n = new Set(prev); n.delete(id); return n; });
    }
  };

  const { data: courses, isLoading: isCoursesLoading, refetch: refetchCourses } = useGet(
    '/course/getCourseByCategoryId',
    {
      params: { categoryId },
      useEffectDependencies: [categoryId],
    },
  );

  useEffect(() => {
    if (category && category.length > 0 && !categoryId) {
      setCategoryId(category[0].id);
    }
  }, [category, categoryId]);

  const filteredCourses = courses?.filter((course: Course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleCourseExpansion = (courseId: string) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
    }
    setExpandedCourses(newExpanded);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'DOCUMENT':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'TRYOUT':
        return <Play className="h-4 w-4 text-purple-500" />;
      case 'MATERI':
        return <BookOpen className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      VIDEO: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Video' },
      DOCUMENT: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        label: 'Dokumen',
      },
      TRYOUT: {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        label: 'Try Out',
      },
      MATERI: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Materi' },
    };

    const config = typeConfig[type as keyof typeof typeConfig] || {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      label: type,
    };

    return (
      <Badge className={cn('text-xs', config.bg, config.text, 'border-0')}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Kursus</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Kelola semua kursus dan materi pembelajaran
          </p>
        </div>
        <Button asChild className="gap-2 rounded-xl">
          <Link href={`/${website_sub_category_id}/admin/course/new`}>
            <Plus className="h-4 w-4" />
            Buat Kursus
          </Link>
        </Button>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        {/* Category Filter */}
        {!isCategoryLoading && category ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            {category.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryId(cat.id)}
                className={cn(
                  'h-8 px-4 text-sm font-medium rounded-lg transition-all border',
                  categoryId === cat.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600',
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        ) : (
          <Skeleton className="h-8 w-80 rounded-xl" />
        )}

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kursus..."
            className="pl-10 rounded-xl border-gray-200"
          />
        </div>

        {/* Course List */}
        <div className="space-y-3">
          {isCoursesLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))
          ) : filteredCourses?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <BookOpen className="h-7 w-7 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {searchQuery ? 'Tidak ditemukan' : 'Belum ada kursus'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {searchQuery ? 'Coba kata kunci lain' : 'Buat kursus pertama Kamu'}
              </p>
              {!searchQuery && (
                <Button asChild className="rounded-xl">
                  <Link href={`/${website_sub_category_id}/admin/course/new`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Kursus Baru
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            filteredCourses?.map((course: Course) => {
              const isExpanded = expandedCourses.has(course.id);

              return (
                <div
                  key={course.id}
                  className="border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all bg-white"
                >
                  {/* Main Course Row */}
                  <div className="flex items-center justify-between p-4">
                    {/* Course Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-blue-600 font-bold text-sm">
                          {course.number}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {course.title}
                          </h3>
                          <Badge
                            className={cn(
                              'text-xs border-0 px-2 py-0.5',
                              course.status === 'PUBLIC'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700',
                            )}
                          >
                            {course.status === 'PUBLIC' ? (
                              <Eye className="h-3 w-3 mr-1" />
                            ) : (
                              <EyeOff className="h-3 w-3 mr-1" />
                            )}
                            {course.status === 'PUBLIC' ? 'Publik' : 'Private'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-gray-500 mt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {course._count.CourseSubChapter} materi
                          </span>
                          {course.CourseSubChapter.filter(sc => sc.type === 'DOCUMENT').length > 0 && (
                            <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                              <FileText className="h-3 w-3" />
                              {course.CourseSubChapter.filter(sc => sc.type === 'DOCUMENT').length} Dok
                            </span>
                          )}
                          {(() => {
                            const videoCount =
                              course.CourseSubChapter.filter(
                                (sc) =>
                                  sc.type === 'VIDEO' ||
                                  (sc.type === 'DOCUMENT' && sc.Document?.videoId),
                              ).length;
                            return videoCount > 0 ? (
                              <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                <Video className="h-3 w-3" />
                                {videoCount} Video
                              </span>
                            ) : null;
                          })()}
                          {course.CourseSubChapter.filter(sc => sc.type === 'TRYOUT').length > 0 && (
                            <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                              <Play className="h-3 w-3" />
                              {course.CourseSubChapter.filter(sc => sc.type === 'TRYOUT').length} TryOut
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {course.Category.name}
                          </span>
                          {isCore && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              [{' '}
                              {course.visibleAtWebSubIds.length > 0
                                ? course.visibleAtWebSubIds.join(' | ')
                                : sharingWebSubIds.join(' | ')}{' '}
                              ]
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      {course.CourseSubChapter.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCourseExpansion(course.id)}
                          className="gap-1.5 text-xs h-8 px-3 rounded-lg"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronDown className="h-3.5 w-3.5" />
                              Sembunyikan
                            </>
                          ) : (
                            <>
                              <ChevronRight className="h-3.5 w-3.5" />
                              Lihat Materi
                            </>
                          )}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="gap-1.5 text-xs h-8 px-3 rounded-lg border-gray-200 hover:border-blue-300 hover:text-blue-600"
                      >
                        <Link href={`/${website_sub_category_id}/admin/course/edit/${course.id}`}>
                          <Edit className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                      </Button>
                      <ChevronRightIcon className="h-4 w-4 text-gray-300" />
                    </div>
                  </div>

                  {/* Collapsed preview strip */}
                  {!isExpanded && course.CourseSubChapter.length > 0 && (
                    <div className="px-4 pb-3 border-t border-gray-50 pt-2">
                      <div className="flex items-center gap-3 overflow-x-auto">
                        {course.CourseSubChapter.slice(0, 4).map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center gap-1.5 text-xs text-gray-500 whitespace-nowrap bg-gray-50 rounded-lg px-2.5 py-1"
                          >
                            {getTypeIcon(sub.type)}
                            <span className="max-w-[120px] truncate">{sub.title}</span>
                            <span className="text-gray-400">· {sub.spendTime}m</span>
                          </div>
                        ))}
                        {course.CourseSubChapter.length > 4 && (
                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            +{course.CourseSubChapter.length - 4} lainnya
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Expanded Sub Chapters */}
                  {isExpanded && course.CourseSubChapter.length > 0 && (
                    <div className="border-t border-gray-100 p-4 space-y-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-700">
                          Materi ({course.CourseSubChapter.length})
                        </span>
                        {/* Summary chips */}
                        <div className="flex gap-2">
                          {[
                            { label: 'Video', type: 'VIDEO', color: 'bg-blue-50 text-blue-600' },
                            { label: 'Dokumen', type: 'DOCUMENT', color: 'bg-green-50 text-green-600' },
                            { label: 'TryOut', type: 'TRYOUT', color: 'bg-purple-50 text-purple-600' },
                            { label: 'Materi', type: 'MATERI', color: 'bg-orange-50 text-orange-600' },
                          ]
                            .filter((s) =>
                            s.type === 'VIDEO'
                              ? course.CourseSubChapter.filter(
                                  (sc) =>
                                    sc.type === 'VIDEO' ||
                                    (sc.type === 'DOCUMENT' && sc.Document?.videoId),
                                ).length > 0
                              : course.CourseSubChapter.filter((sc) => sc.type === s.type).length > 0,
                          )
                            .map(stat => (
                              <span key={stat.label} className={cn('text-xs px-2 py-0.5 rounded-full font-medium', stat.color)}>
                                {stat.type === 'VIDEO'
                                ? course.CourseSubChapter.filter(
                                    (sc) =>
                                      sc.type === 'VIDEO' ||
                                      (sc.type === 'DOCUMENT' && sc.Document?.videoId),
                                  ).length
                                : course.CourseSubChapter.filter((sc) => sc.type === stat.type).length}{' '}
                              {stat.label}
                              </span>
                            ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {course.CourseSubChapter.map((subChapter, index) => (
                          <div
                            key={subChapter.id}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                          >
                            <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-500 shrink-0 shadow-sm">
                              {index + 1}
                            </div>
                            <div className="flex flex-col gap-1 shrink-0">
                              <div className="flex items-center gap-2">
                                {getTypeIcon(subChapter.type)}
                                {getTypeBadge(subChapter.type)}
                              </div>
                              {subChapter.type === 'DOCUMENT' && subChapter.Document?.videoId && (
                                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded-md text-xs font-medium ml-6">
                                  <Video className="h-3 w-3" />
                                  Video
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate">
                                {subChapter.title}
                              </p>
                              {subChapter.description && (
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                  {subChapter.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="flex items-center gap-1 text-xs text-gray-400">
                                <Clock className="h-3 w-3" />
                                {subChapter.spendTime}m
                              </span>
                              <div className="flex flex-col items-center gap-0.5 shrink-0">
                                <Switch
                                  checked={subChapter.premium}
                                  disabled={togglingSubChapters.has(subChapter.id)}
                                  onCheckedChange={() => handleToggleSubChapterPremium(subChapter.id, subChapter.premium)}
                                  className="scale-75 data-[state=checked]:bg-amber-400"
                                />
                                <span className={`text-[9px] font-semibold leading-none ${
                                  subChapter.premium ? 'text-amber-600' : 'text-gray-400'
                                }`}>
                                  {togglingSubChapters.has(subChapter.id) ? '...' : subChapter.premium ? 'Premium' : 'Free'}
                                </span>
                              </div>
                              {subChapter.type === 'TRYOUT' && subChapter._count && (
                                <span className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                                  <Play className="h-3 w-3" />
                                  {subChapter._count.TryoutQuestion} soal
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer count */}
        {filteredCourses && filteredCourses.length > 0 && (
          <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-50">
            {filteredCourses.length} kursus ditemukan
          </div>
        )}
      </div>
    </div>
  );
}
