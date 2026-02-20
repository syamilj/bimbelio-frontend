'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import { TypeCourseEnum } from '@/types/database';

import { Input } from '@/components/ui/input';
import {
  ArrowRightIcon,
  BookOpenIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRight,
  ClockIcon,
  FileQuestionIcon,
  FileTextIcon,
  ForwardIcon,
  LayoutGridIcon,
  ListIcon,
  Loader2,
  PlayCircleIcon,
  PlayIcon,
  Rows3Icon,
  Search,
  Sparkles,
  TrendingUpIcon,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

type SubChapterSearchResult = {
  id: string;
  title: string;
  description: string;
  type: TypeCourseEnum;
  spendTime: number;
  number: number;
  categoryName: string;
  categoryId: string;
  chapterTitle: string;
  isCompleted: boolean;
  video: string | null;
  document: string | null;
  materi: string | null;
};

type TypeData = {
  id: string;
  name: string;
  image: string | null;
  CourseChapter: {
    isDone: boolean;
    title: string;
    CourseSubChapter: ({
      CourseProgress: {
        website_sub_category_id: string;
        id: string;
        createdAt: Date;
        userId: string;
        courseSubChapterId: string;
        totalScore: number | null;
      }[];
    } & {
      number: number;
      website_sub_category_id: string;
      id: string;
      title: string;
      description: string;
      courseChapterId: string;
      spendTime: number;
      type: TypeCourseEnum;
      premium: boolean;
      tryoutSessionId: string | null;
      video: string | null;
      document: string | null;
      materi: string | null;
    })[];
  }[];
  totalChapters: number;
  completedChapters: number;
  percentageProgress: number;
  totalSpendTime: number;
  totalTryout: number;
}[];

export default function ModulPembelajaranSection() {
  const router = useRouter();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { data: CategoryCard, isLoading } = useGet<TypeData>(
    '/course/getCategoryForCard',
  );
  const [loadingCourseId, setLoadingCourseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load view preference from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem('bimcourse-view-mode');
    if (savedView && (savedView === 'grid' || savedView === 'list')) {
      setViewMode(savedView);
    }
  }, []);

  // Save view preference to localStorage
  const handleViewChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('bimcourse-view-mode', mode);
  };

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  // Flatten all sub chapters for search
  const allSubChapters = useMemo<SubChapterSearchResult[]>(() => {
    if (!CategoryCard) return [];
    return CategoryCard.flatMap((category) =>
      category.CourseChapter.flatMap((chapter) =>
        chapter.CourseSubChapter.map((subChapter) => ({
          id: subChapter.id,
          title: subChapter.title,
          description: subChapter.description,
          type: subChapter.type,
          spendTime: subChapter.spendTime,
          number: subChapter.number,
          categoryName: category.name,
          categoryId: category.id,
          chapterTitle: chapter.title,
          isCompleted: subChapter.CourseProgress.length > 0,
          video: subChapter.video,
          document: subChapter.document,
          materi: subChapter.materi,
        })),
      ),
    );
  }, [CategoryCard]);

  // Search filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase().trim();
    return allSubChapters.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.categoryName.toLowerCase().includes(query) ||
        item.chapterTitle.toLowerCase().includes(query),
    );
  }, [searchQuery, allSubChapters]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update search open state
  useEffect(() => {
    setIsSearchOpen(searchQuery.length >= 2 && searchResults.length > 0);
    setSelectedIndex(0);
  }, [searchQuery, searchResults.length]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isSearchOpen || searchResults.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev,
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (searchResults[selectedIndex]) {
          handleResultClick(searchResults[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, searchResults, selectedIndex]);

  const handleResultClick = (result: SubChapterSearchResult) => {
    router.push(
      `/${website_sub_category_id_params}/user/bimcourse/${result.categoryId}/study?sub=${result.id}&tab=chat`,
    );
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const getTypeIcon = (type: TypeCourseEnum) => {
    switch (type) {
      case 'VIDEO':
        return <PlayCircleIcon className="w-4 h-4" />;
      case 'DOCUMENT':
        return <FileTextIcon className="w-4 h-4" />;
      case 'MATERI':
        return <BookOpenIcon className="w-4 h-4" />;
      case 'TRYOUT':
        return <FileQuestionIcon className="w-4 h-4" />;
      default:
        return <BookOpenIcon className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: TypeCourseEnum) => {
    switch (type) {
      case 'VIDEO':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'DOCUMENT':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'MATERI':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'TRYOUT':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getThumbnail = (result: SubChapterSearchResult) => {
    if (result.video) return result.video;
    if (result.document) return result.document;
    if (result.materi) return result.materi;
    return null;
  };

  const highlightMatch = (text: string) => {
    if (!searchQuery) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark
              key={i}
              className="bg-yellow-200 text-gray-900 rounded px-0.5"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </>
    );
  };

  const handleStartCourse = (categoryId: string) => {
    setLoadingCourseId(categoryId);
    router.push(
      `/${website_sub_category_id_params}/user/bimcourse/${categoryId}/study`,
    );
  };

  return (
    <section className="mb-12">
      {/* View Mode Toggle */}
      {!isLoading && (
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-3xl flex items-center justify-center"
              style={{ backgroundColor: mainColor }}
            >
              <BookOpenIcon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Modul Belajar</h2>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-3xl">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewChange('grid')}
              className={`px-3 py-2 rounded-3xl transition-all ${
                viewMode === 'grid'
                  ? 'text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              style={{
                backgroundColor:
                  viewMode === 'grid' ? mainColor : 'transparent',
              }}
            >
              <LayoutGridIcon className="w-4 h-4" />
              <span className="ml-2 hidden sm:inline font-semibold">Grid</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewChange('list')}
              className={`px-3 py-2 rounded-3xl transition-all ${
                viewMode === 'list'
                  ? 'text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              style={{
                backgroundColor:
                  viewMode === 'list' ? mainColor : 'transparent',
              }}
            >
              <Rows3Icon className="w-4 h-4" />
              <span className="ml-2 hidden sm:inline font-semibold">
                Detail
              </span>
            </Button>
          </div>
        </div>
      )}

      {/* Advanced Search Bar */}
      {!isLoading && (
        <div
          ref={searchRef}
          className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 mb-8 relative"
        >
          <div className="relative max-w-3xl mx-auto">
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-10"
              style={{ color: isSearchOpen ? mainColor : '#9ca3af' }}
            >
              <Search className="w-5 h-5" />
            </div>
            <Input
              ref={inputRef}
              type="text"
              placeholder="Cari materi, video, tryout, atau dokumen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 h-16 rounded-3xl border-2 border-gray-200 focus:border-transparent text-base font-medium transition-all shadow-sm hover:shadow-md"
              style={{
                boxShadow: isSearchOpen
                  ? `0 0 0 3px ${mainColor}20`
                  : undefined,
              }}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-3xl hover:bg-gray-100 z-10"
              >
                <X className="w-5 h-5" />
              </Button>
            )}

            {/* Search Results Dropdown */}
            {isSearchOpen && (
              <div
                className="absolute top-full mt-3 w-full bg-white border-2 rounded-3xl shadow-2xl z-50 overflow-hidden"
                style={{ borderColor: `${mainColor}40` }}
              >
                {/* Results Header */}
                <div
                  className="px-5 py-3 border-b flex items-center justify-between"
                  style={{ backgroundColor: `${mainColor}08` }}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles
                      className="w-4 h-4"
                      style={{ color: mainColor }}
                    />
                    <span className="text-sm font-bold text-gray-700">
                      {searchResults.length} hasil ditemukan
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <kbd className="px-2 py-1 text-[10px] font-semibold bg-gray-100 border border-gray-200 rounded">
                      ↑↓
                    </kbd>
                    <span>navigasi</span>
                  </div>
                </div>

                {/* Results List */}
                <div className="max-h-[500px] overflow-y-auto">
                  <div className="p-2">
                    {searchResults.map((result, index) => {
                      const thumbnail = getThumbnail(result);
                      return (
                        <div
                          key={result.id}
                          onClick={() => handleResultClick(result)}
                          className={`p-4 rounded-3xl transition-all mb-1.5 group cursor-pointer ${
                            index === selectedIndex
                              ? 'ring-2 ring-offset-1'
                              : 'hover:bg-gray-50'
                          }`}
                          style={{
                            backgroundColor:
                              index === selectedIndex
                                ? `${mainColor}08`
                                : undefined,
                            ...(index === selectedIndex
                              ? ({
                                  '--tw-ring-color': mainColor,
                                } as React.CSSProperties)
                              : {}),
                          }}
                        >
                          <div className="flex items-start gap-4">
                            {/* Thumbnail */}
                            <div className="relative flex-shrink-0 w-24 h-24 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 group-hover:scale-105 transition-transform">
                              {thumbnail ? (
                                <>
                                  <img
                                    src={thumbnail}
                                    alt={result.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      const parent = target.parentElement;
                                      if (parent) {
                                        target.style.display = 'none';
                                        // Create fallback icon container
                                        const fallbackDiv =
                                          document.createElement('div');
                                        fallbackDiv.className =
                                          'w-full h-full flex items-center justify-center absolute inset-0';
                                        fallbackDiv.style.backgroundColor = `${mainColor}15`;
                                        fallbackDiv.style.color = mainColor;

                                        // Create icon element
                                        const iconWrapper =
                                          document.createElement('div');
                                        iconWrapper.className = 'scale-150';
                                        fallbackDiv.appendChild(iconWrapper);
                                        parent.appendChild(fallbackDiv);
                                      }
                                    }}
                                  />
                                </>
                              ) : (
                                <div
                                  className="w-full h-full flex items-center justify-center"
                                  style={{
                                    backgroundColor: `${mainColor}15`,
                                    color: mainColor,
                                  }}
                                >
                                  <div className="scale-150">
                                    {getTypeIcon(result.type)}
                                  </div>
                                </div>
                              )}
                              {/* Type Badge Overlay */}
                              <div className="absolute bottom-1 right-1">
                                <Badge
                                  className={`text-[10px] px-1.5 py-0.5 ${getTypeColor(result.type)}`}
                                >
                                  {result.type}
                                </Badge>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              {/* Badges */}
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="text-xs text-gray-600 font-semibold">
                                  {result.categoryName}
                                </span>
                                <span className="text-xs text-gray-400">›</span>
                                <span className="text-xs text-gray-500">
                                  {result.chapterTitle}
                                </span>
                                {result.isCompleted && (
                                  <>
                                    <span className="text-xs text-gray-400">
                                      •
                                    </span>
                                    <Badge className="text-[10px] px-2 py-0 bg-green-50 text-green-700 border-green-200">
                                      ✓ Selesai
                                    </Badge>
                                  </>
                                )}
                              </div>

                              {/* Title */}
                              <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-gray-700">
                                {highlightMatch(result.title)}
                              </h3>

                              {/* Description */}
                              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                {highlightMatch(result.description)}
                              </p>

                              {/* Meta Info */}
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <ClockIcon className="w-3 h-3" />
                                  <span>{result.spendTime} menit</span>
                                </div>
                                <span>•</span>
                                <span>Sub Chapter #{result.number}</span>
                              </div>
                            </div>

                            {/* Selection Indicator */}
                            {index === selectedIndex && (
                              <div
                                className="flex-shrink-0 w-1 h-20 rounded-full self-center"
                                style={{ backgroundColor: mainColor }}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t bg-gray-50 text-center">
                  <p className="text-xs text-gray-500">
                    Tip: Gunakan{' '}
                    <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-white border border-gray-200 rounded">
                      Enter
                    </kbd>{' '}
                    untuk membuka
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Module Cards - Grid or Detailed List View */}
      {!isLoading ? (
        viewMode === 'grid' ? (
          <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CategoryCard?.map((category) => {
                const getActionButton = () => {
                  if (category.completedChapters === 0) {
                    return (
                      <Button
                        size="sm"
                        onClick={() => handleStartCourse(category.id)}
                        disabled={loadingCourseId === category.id}
                        className="w-full rounded-3xl text-white border-0 font-semibold transition-all"
                        style={{ backgroundColor: mainColor }}
                      >
                        {loadingCourseId === category.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Memuat...
                          </>
                        ) : (
                          <>
                            <PlayIcon className="w-4 h-4 mr-2" />
                            Mulai Belajar
                          </>
                        )}
                      </Button>
                    );
                  } else if (
                    category.completedChapters === category.totalChapters
                  ) {
                    return (
                      <Link
                        href={`/${website_sub_category_id_params}/user/bimcourse/${category.id}`}
                        className="block w-full"
                      >
                        <Button
                          size="sm"
                          className="w-full rounded-3xl bg-green-600 hover:bg-green-700 text-white border-0 font-semibold"
                        >
                          <CheckIcon className="w-4 h-4 mr-2" />
                          Selesai
                        </Button>
                      </Link>
                    );
                  } else {
                    return (
                      <Link
                        href={`/${website_sub_category_id_params}/user/bimcourse/${category.id}`}
                        className="block w-full"
                      >
                        <Button
                          size="sm"
                          className="w-full rounded-3xl bg-orange-600 hover:bg-orange-700 text-white border-0 font-semibold"
                        >
                          <ForwardIcon className="w-4 h-4 mr-2" />
                          Lanjutkan
                        </Button>
                      </Link>
                    );
                  }
                };

                const getStatusBadge = () => {
                  if (category.completedChapters === 0) {
                    return (
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                        <PlayIcon className="w-3 h-3 mr-1" />
                        Belum Dimulai
                      </Badge>
                    );
                  } else if (
                    category.completedChapters === category.totalChapters
                  ) {
                    return (
                      <Badge className="bg-green-50 text-green-700 border-green-200 font-medium">
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        Selesai
                      </Badge>
                    );
                  } else {
                    return (
                      <Badge className="bg-orange-50 text-orange-700 border-orange-200 font-medium">
                        <TrendingUpIcon className="w-3 h-3 mr-1" />
                        Berlangsung
                      </Badge>
                    );
                  }
                };

                // GRID VIEW (Default)
                if (viewMode === 'grid') {
                  return (
                    <Card
                      key={category.id}
                      className="border border-gray-100 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden p-0 gap-0"
                    >
                      {/* Image Cover */}
                      <div className="relative w-full aspect-video overflow-hidden">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: `${mainColor}20` }}
                          >
                            <BookOpenIcon className="w-12 h-12" style={{ color: mainColor }} />
                          </div>
                        )}
                        {/* Progress badge overlay */}
                        <div className="absolute top-3 right-3">
                          <div
                            className="px-2.5 py-1 rounded-full text-xs font-black text-white shadow"
                            style={{ backgroundColor: mainColor }}
                          >
                            {Math.min(100, Math.round(category.percentageProgress || 0))}%
                          </div>
                        </div>
                        {/* Status badge overlay */}
                        <div className="absolute top-3 left-3">
                          {getStatusBadge()}
                        </div>
                      </div>

                      <CardContent className="p-4 space-y-3">
                        <CardTitle className="text-base font-bold text-gray-900 line-clamp-2 leading-snug">
                          {category.name}
                        </CardTitle>

                        {/* Progress Bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500">Progress</span>
                            <span className="font-bold text-gray-700">
                              {category.completedChapters}/{category.totalChapters} Sub Chapter
                            </span>
                          </div>
                          <Progress
                            value={category.percentageProgress}
                            className="h-1.5"
                            style={{ backgroundColor: `${mainColor}20` }}
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-1">
                          {/* Detail Dialog Button */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 rounded-3xl border-2 border-gray-200 hover:border-gray-300"
                              >
                                <ListIcon className="w-4 h-4 mr-2" />
                                Detail
                              </Button>
                            </DialogTrigger>

                            <DialogContent className="md:max-w-[700px] max-h-[85vh]">
                              <DialogHeader>
                                <div className="flex items-center gap-4">
                                  <div
                                    className="w-14 h-14 rounded-3xl flex items-center justify-center shadow-lg"
                                    style={{ backgroundColor: mainColor }}
                                  >
                                    <BookOpenIcon className="w-7 h-7 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <DialogTitle className="text-2xl font-black text-gray-900">
                                      {category.name}
                                    </DialogTitle>
                                    <DialogDescription className="text-sm">
                                      Daftar lengkap materi pembelajaran
                                    </DialogDescription>
                                  </div>
                                </div>
                              </DialogHeader>

                              {/* Enhanced Stats Overview */}
                              <div className="grid grid-cols-3 gap-3 pb-4 border-b">
                                <div
                                  className="p-4 rounded-3xl border-2 text-center"
                                  style={{
                                    background: `linear-gradient(to bottom right, rgb(239 246 255), rgb(219 234 254))`,
                                    borderColor: 'rgb(191 219 254)',
                                  }}
                                >
                                  <div className="text-2xl font-black text-blue-700">
                                    {category.percentageProgress}%
                                  </div>
                                  <div className="text-xs font-medium text-blue-600 mt-1">
                                    Progress
                                  </div>
                                </div>

                                <div
                                  className="p-4 rounded-3xl border-2 text-center"
                                  style={{
                                    background: `linear-gradient(to bottom right, rgb(254 249 195), rgb(254 240 138))`,
                                    borderColor: 'rgb(253 224 71)',
                                  }}
                                >
                                  <div className="text-2xl font-black text-yellow-700">
                                    {category.totalChapters}
                                  </div>
                                  <div className="text-xs font-medium text-yellow-600 mt-1">
                                    Total Sub Chapter
                                  </div>
                                </div>

                                <div
                                  className="p-4 rounded-3xl border-2 text-center"
                                  style={{
                                    background: `linear-gradient(to bottom right, rgb(240 253 244), rgb(220 252 231))`,
                                    borderColor: 'rgb(187 247 208)',
                                  }}
                                >
                                  <div className="text-2xl font-black text-green-700">
                                    {category.completedChapters}
                                  </div>
                                  <div className="text-xs font-medium text-green-600 mt-1">
                                    Selesai
                                  </div>
                                </div>
                              </div>

                              {/* Chapter List with Enhanced Info */}
                              <ScrollArea className="h-[400px] pr-4">
                                <div className="space-y-3">
                                  {category.CourseChapter.map((chapter, i) => (
                                    <DetailContent
                                      key={i}
                                      category={category}
                                      chapter={chapter}
                                      index={i}
                                    />
                                  ))}
                                </div>
                              </ScrollArea>

                              <DialogFooter>
                                <Button
                                  className="w-full rounded-3xl text-white"
                                  style={{ backgroundColor: mainColor }}
                                  onClick={() => {
                                    if (category.completedChapters === 0) {
                                      router.push(
                                        `/${website_sub_category_id_params}/user/bimcourse/${category.id}/study`,
                                      );
                                    } else {
                                      router.push(
                                        `/${website_sub_category_id_params}/user/bimcourse/${category.id}/study`,
                                      );
                                    }
                                  }}
                                >
                                  {category.completedChapters === 0
                                    ? 'Mulai Belajar'
                                    : 'Lanjutkan Belajar'}
                                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          {/* Main Action Button */}
                          <div className="flex-1">{getActionButton()}</div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                }

                // LIST VIEW - Detail dengan Chapter & Sub-chapter
                if (viewMode === 'list') {
                  return (
                    <div
                      key={category.id}
                      className="border-2 border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden flex-shrink-0 w-[85vw] sm:w-[75vw] md:w-[500px] lg:w-[550px] snap-start"
                    >
                      {/* Header Section */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b-2 border-gray-100">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div
                              className="w-16 h-16 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg"
                              style={{ backgroundColor: mainColor }}
                            >
                              <BookOpenIcon className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getStatusBadge()}
                                <span
                                  className="text-2xl font-black"
                                  style={{ color: mainColor }}
                                >
                                  {Math.min(
                                    100,
                                    Math.round(
                                      category.percentageProgress || 0,
                                    ),
                                  )}
                                  %
                                </span>
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {category.name}
                              </h3>
                              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <BookOpenIcon className="w-4 h-4" />
                                  {category.CourseChapter.length} Chapter
                                </span>
                                <span className="flex items-center gap-1">
                                  <FileTextIcon className="w-4 h-4" />
                                  {category.totalChapters} Sub-Chapter
                                </span>
                                <span className="flex items-center gap-1">
                                  <ClockIcon className="w-4 h-4" />
                                  {category.totalSpendTime / 60 < 1
                                    ? `${category.totalSpendTime} Min`
                                    : `${(category.totalSpendTime / 60).toFixed(1)} Jam`}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {getActionButton()}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex justify-between items-center text-xs mb-2">
                            <span className="font-medium text-gray-700">
                              Progress Keseluruhan
                            </span>
                            <span className="font-bold text-gray-900">
                              {category.completedChapters}/
                              {category.totalChapters} Sub-Chapter Selesai
                            </span>
                          </div>
                          <Progress
                            value={category.percentageProgress}
                            className="h-3 rounded-full"
                            style={{ backgroundColor: `${mainColor}20` }}
                          />
                        </div>
                      </div>

                      {/* Chapters & Sub-chapters */}
                      <div className="p-6">
                        <div className="space-y-6">
                          {category.CourseChapter.map(
                            (chapter, chapterIndex) => {
                              const chapterSubChapters =
                                chapter.CourseSubChapter || [];
                              const completedInChapter =
                                chapterSubChapters.filter(
                                  (sub) =>
                                    sub.CourseProgress &&
                                    sub.CourseProgress.length > 0,
                                ).length;
                              const chapterProgress =
                                chapterSubChapters.length > 0
                                  ? Math.round(
                                      (completedInChapter /
                                        chapterSubChapters.length) *
                                        100,
                                    )
                                  : 0;

                              return (
                                <div
                                  key={chapterIndex}
                                  className="border-2 border-gray-100 rounded-3xl overflow-hidden"
                                >
                                  {/* Chapter Header */}
                                  <div
                                    className="p-4"
                                    style={{
                                      backgroundColor: `${mainColor}10`,
                                    }}
                                  >
                                    <div className="flex items-start gap-3">
                                      <div
                                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-3xl text-white font-bold text-lg shadow-md"
                                        style={{ backgroundColor: mainColor }}
                                      >
                                        {chapterIndex + 1}
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="text-lg font-bold text-gray-900 mb-1">
                                          {chapter.title}
                                        </h4>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                          <span className="font-semibold">
                                            {completedInChapter}/
                                            {chapterSubChapters.length} Sub-Chapter
                                            Selesai
                                          </span>
                                          <span
                                            className="font-bold"
                                            style={{ color: mainColor }}
                                          >
                                            {chapterProgress}%
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Sub-chapters List */}
                                  <div className="divide-y divide-gray-100">
                                    {chapterSubChapters.map(
                                      (subChapter, subIndex) => {
                                        const isCompleted =
                                          subChapter.CourseProgress &&
                                          subChapter.CourseProgress.length > 0;
                                        const subChapterTypeIcon =
                                          {
                                            VIDEO: PlayCircleIcon,
                                            DOCUMENT: FileTextIcon,
                                            MATERI: BookOpenIcon,
                                            TRYOUT: FileQuestionIcon,
                                            PROGRESS_TEST: FileQuestionIcon,
                                          }[subChapter.type] || FileTextIcon;
                                        const SubChapterIcon =
                                          subChapterTypeIcon;

                                        return (
                                          <button
                                            key={subChapter.id}
                                            onClick={() =>
                                              router.push(
                                                `/${website_sub_category_id_params}/user/bimcourse/${category.id}/study?sub=${subChapter.id}&tab=chat`,
                                              )
                                            }
                                            className="group w-full flex items-center gap-4 p-4 text-left transition-all hover:bg-gray-50"
                                          >
                                            <div
                                              className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-3xl ${
                                                isCompleted
                                                  ? 'bg-green-100'
                                                  : 'bg-gray-100'
                                              }`}
                                            >
                                              {isCompleted ? (
                                                <CheckCircleIcon className="h-6 w-6 text-green-600" />
                                              ) : (
                                                <SubChapterIcon className="h-6 w-6 text-gray-600" />
                                              )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p
                                                className={`font-semibold text-base mb-1 ${
                                                  isCompleted
                                                    ? 'text-gray-600 line-through'
                                                    : 'text-gray-900 group-hover:text-blue-600'
                                                }`}
                                              >
                                                {subChapter.title}
                                              </p>
                                              <div className="flex items-center gap-3 text-sm text-gray-500">
                                                <span className="capitalize font-medium">
                                                  {subChapter.type.toLowerCase()}
                                                </span>
                                                {subChapter.spendTime && (
                                                  <>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                      <ClockIcon className="w-3 h-3" />
                                                      {subChapter.spendTime}{' '}
                                                      menit
                                                    </span>
                                                  </>
                                                )}
                                                {isCompleted && (
                                                  <>
                                                    <span>•</span>
                                                    <span className="text-green-600 font-semibold flex items-center gap-1">
                                                      <CheckCircleIcon className="w-3 h-3" />
                                                      Selesai
                                                    </span>
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                            <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
                                          </button>
                                        );
                                      },
                                    )}
                                  </div>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Fallback (shouldn't reach here)
                return null;
              })}
            </div>
          </div>
        ) : (
          <div className="w-full overflow-x-auto pb-4">
            <div
              className="flex gap-4 snap-x snap-mandatory scrollbar-hide"
              style={{
                paddingLeft: 'max(1rem, calc((100vw - 1280px) / 2))',
                paddingRight: 'max(1rem, calc((100vw - 1280px) / 2))',
              }}
            >
              {CategoryCard?.map((category) => {
                const getActionButton = () => {
                  if (category.completedChapters === 0) {
                    return (
                      <Button
                        size="sm"
                        onClick={() => handleStartCourse(category.id)}
                        disabled={loadingCourseId === category.id}
                        className="w-full rounded-3xl text-white border-0 font-semibold transition-all"
                        style={{ backgroundColor: mainColor }}
                      >
                        {loadingCourseId === category.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Memuat...
                          </>
                        ) : (
                          <>
                            <PlayIcon className="w-4 h-4 mr-2" />
                            Mulai Belajar
                          </>
                        )}
                      </Button>
                    );
                  } else if (
                    category.completedChapters === category.totalChapters
                  ) {
                    return (
                      <Button
                        size="sm"
                        onClick={() => handleStartCourse(category.id)}
                        disabled={loadingCourseId === category.id}
                        className="w-full rounded-3xl bg-green-600 hover:bg-green-700 text-white border-0 font-semibold"
                      >
                        {loadingCourseId === category.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Memuat...
                          </>
                        ) : (
                          <>
                            <CheckIcon className="w-4 h-4 mr-2" />
                            Selesai
                          </>
                        )}
                      </Button>
                    );
                  } else {
                    return (
                      <Button
                        size="sm"
                        onClick={() => handleStartCourse(category.id)}
                        disabled={loadingCourseId === category.id}
                        className="w-full rounded-3xl text-white border-0 font-semibold"
                        style={{ backgroundColor: mainColor }}
                      >
                        {loadingCourseId === category.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Memuat...
                          </>
                        ) : (
                          <>
                            <ForwardIcon className="w-4 h-4 mr-2" />
                            Lanjutkan
                          </>
                        )}
                      </Button>
                    );
                  }
                };

                const getStatusBadge = () => {
                  if (category.completedChapters === category.totalChapters) {
                    return (
                      <Badge className="bg-green-50 text-green-700 border-green-200 font-medium">
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        Selesai
                      </Badge>
                    );
                  } else {
                    return (
                      <Badge className="bg-orange-50 text-orange-700 border-orange-200 font-medium">
                        <TrendingUpIcon className="w-3 h-3 mr-1" />
                        Berlangsung
                      </Badge>
                    );
                  }
                };

                // LIST VIEW - Detail dengan Chapter & Sub-chapter
                return (
                  <div
                    key={category.id}
                    className="border-2 border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden flex-shrink-0 w-[85vw] md:w-[65vw] lg:w-[55vw] xl:w-[45vw] snap-start"
                  >
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b-2 border-gray-100">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div
                            className="w-16 h-16 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg"
                            style={{ backgroundColor: mainColor }}
                          >
                            <BookOpenIcon className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusBadge()}
                              <span
                                className="text-2xl font-black"
                                style={{ color: mainColor }}
                              >
                                {Math.min(
                                  100,
                                  Math.round(category.percentageProgress || 0),
                                )}
                                %
                              </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate">
                              {category.name}
                            </h3>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <BookOpenIcon className="w-4 h-4" />
                                {category.CourseChapter.length} Chapter
                              </span>
                              <span className="flex items-center gap-1">
                                <FileTextIcon className="w-4 h-4" />
                                {category.totalChapters} Sub-Chapter
                              </span>
                              <span className="flex items-center gap-1">
                                <ClockIcon className="w-4 h-4" />
                                {category.totalSpendTime / 60 < 1
                                  ? `${category.totalSpendTime} Min`
                                  : `${(category.totalSpendTime / 60).toFixed(1)} Jam`}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          {getActionButton()}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between items-center text-xs mb-2">
                          <span className="font-medium text-gray-700">
                            Progress Keseluruhan
                          </span>
                          <span className="font-bold text-gray-900">
                            {category.completedChapters}/
                            {category.totalChapters} Sub-Chapter Selesai
                          </span>
                        </div>
                        <Progress
                          value={category.percentageProgress}
                          className="h-3 rounded-full"
                          style={{ backgroundColor: `${mainColor}20` }}
                        />
                      </div>
                    </div>

                    {/* Chapters & Sub-chapters */}
                    <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
                      <div className="space-y-6">
                        {category.CourseChapter.map((chapter, chapterIndex) => {
                          const chapterSubChapters =
                            chapter.CourseSubChapter || [];
                          const completedInChapter = chapterSubChapters.filter(
                            (sub) =>
                              sub.CourseProgress &&
                              sub.CourseProgress.length > 0,
                          ).length;
                          const chapterProgress =
                            chapterSubChapters.length > 0
                              ? Math.round(
                                  (completedInChapter /
                                    chapterSubChapters.length) *
                                    100,
                                )
                              : 0;

                          return (
                            <div
                              key={chapterIndex}
                              className="border-2 border-gray-100 rounded-3xl overflow-hidden"
                            >
                              {/* Chapter Header */}
                              <div
                                className="p-4"
                                style={{ backgroundColor: `${mainColor}10` }}
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-3xl text-white font-bold text-lg shadow-md"
                                    style={{ backgroundColor: mainColor }}
                                  >
                                    {chapterIndex + 1}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-lg font-bold text-gray-900 mb-1 truncate">
                                      {chapter.title}
                                    </h4>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                      <span className="font-semibold">
                                        {completedInChapter}/
                                        {chapterSubChapters.length} Sub-Chapter
                                        Selesai
                                      </span>
                                      <span
                                        className="font-bold"
                                        style={{ color: mainColor }}
                                      >
                                        {chapterProgress}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Sub-chapters List */}
                              <div className="divide-y divide-gray-100">
                                {chapterSubChapters.map(
                                  (subChapter, subIndex) => {
                                    const isCompleted =
                                      subChapter.CourseProgress &&
                                      subChapter.CourseProgress.length > 0;
                                    const subChapterTypeIcon =
                                      {
                                        VIDEO: PlayCircleIcon,
                                        DOCUMENT: FileTextIcon,
                                        MATERI: BookOpenIcon,
                                        TRYOUT: FileQuestionIcon,
                                        PROGRESS_TEST: FileQuestionIcon,
                                      }[subChapter.type] || FileTextIcon;
                                    const SubChapterIcon = subChapterTypeIcon;

                                    return (
                                      <button
                                        key={subChapter.id}
                                        onClick={() =>
                                          router.push(
                                            `/${website_sub_category_id_params}/user/bimcourse/${category.id}/study?sub=${subChapter.id}&tab=chat`,
                                          )
                                        }
                                        className="group w-full flex items-center gap-4 p-4 text-left transition-all hover:bg-gray-50"
                                      >
                                        <div
                                          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-3xl ${
                                            isCompleted
                                              ? 'bg-green-100'
                                              : 'bg-gray-100'
                                          }`}
                                        >
                                          {isCompleted ? (
                                            <CheckCircleIcon className="h-6 w-6 text-green-600" />
                                          ) : (
                                            <SubChapterIcon className="h-6 w-6 text-gray-600" />
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p
                                            className={`font-semibold text-base mb-1 truncate ${
                                              isCompleted
                                                ? 'text-gray-600 line-through'
                                                : 'text-gray-900 group-hover:text-blue-600'
                                            }`}
                                          >
                                            {subChapter.title}
                                          </p>
                                          <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <span className="capitalize font-medium">
                                              {subChapter.type.toLowerCase()}
                                            </span>
                                            {subChapter.spendTime && (
                                              <>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                  <ClockIcon className="w-3 h-3" />
                                                  {subChapter.spendTime} menit
                                                </span>
                                              </>
                                            )}
                                            {isCompleted && (
                                              <>
                                                <span>•</span>
                                                <span className="text-green-600 font-semibold flex items-center gap-1">
                                                  <CheckCircleIcon className="w-3 h-3" />
                                                  Selesai
                                                </span>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
                                      </button>
                                    );
                                  },
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      ) : (
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className={
                  viewMode === 'list'
                    ? 'h-[250px] rounded-3xl'
                    : 'h-[400px] rounded-3xl'
                }
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

const DetailContent = ({
  category,
  chapter,
  index,
}: {
  category: TypeData[0];
  chapter: TypeData[0]['CourseChapter'][0];
  index: number;
}) => {
  const router = useRouter();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);

  const totalSubChapters = chapter.CourseSubChapter.length;
  const videoCount = chapter.CourseSubChapter.filter(
    (sub) => sub.video !== null,
  ).length;
  const quizCount = chapter.CourseSubChapter.filter(
    (sub) => sub.type === 'TRYOUT',
  ).length;
  const materiCount = chapter.CourseSubChapter.filter(
    (sub) => sub.materi !== null,
  ).length;
  const totalTime = chapter.CourseSubChapter.reduce(
    (acc, sub) => acc + sub.spendTime,
    0,
  );

  return (
    <div key={index}>
      {/* Header Chapter */}
      <div
        className="p-4 rounded-3xl border-2 border-gray-100 hover:border-gray-300 transition-all cursor-pointer group"
        onClick={() =>
          setExpandedChapter(expandedChapter === index ? null : index)
        }
      >
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-3xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: mainColor }}
          >
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-sm text-gray-900 group-hover:text-gray-700 flex-1">
                {chapter.title}
              </h4>
              {chapter.isDone && (
                <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
              )}
              <ChevronDownIcon
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                  expandedChapter === index ? 'rotate-180' : ''
                }`}
              />
            </div>
            <p className="text-xs text-gray-500">
              {totalSubChapters} Sub Chapter
            </p>
          </div>
        </div>

        {/* Content Type Stats */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {videoCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-3xl bg-red-50 border border-red-200">
              <PlayIcon className="w-3 h-3 text-red-600" />
              <span className="text-xs font-semibold text-red-700">
                {videoCount}
              </span>
            </div>
          )}
          {materiCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-3xl bg-purple-50 border border-purple-200">
              <BookOpenIcon className="w-3 h-3 text-purple-600" />
              <span className="text-xs font-semibold text-purple-700">
                {materiCount}
              </span>
            </div>
          )}
          {quizCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-3xl bg-green-50 border border-green-200">
              <FileQuestionIcon className="w-3 h-3 text-green-600" />
              <span className="text-xs font-semibold text-green-700">
                {quizCount}
              </span>
            </div>
          )}
          {totalTime > 0 && (
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-3xl bg-blue-50 border border-blue-200">
              <ClockIcon className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700">
                {totalTime}m
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar per Chapter */}
        {chapter.isDone ? (
          <div className="flex items-center gap-2 text-xs font-medium text-green-600">
            <div className="flex-1 h-1.5 bg-green-500 rounded-full" />
            <span>100% Selesai</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
            <span>Belum Dimulai</span>
          </div>
        )}
      </div>

      {/* Sub Chapter List - Dropdown */}
      {expandedChapter === index && (
        <div className="mt-2 ml-4 space-y-2 border-l-2 border-gray-200 pl-4">
          {chapter.CourseSubChapter.map((subChapter) => (
            <div
              key={subChapter.id}
              className="p-3 rounded-3xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer"
              onClick={() => {
                router.push(
                  `/${website_sub_category_id_params}/user/bimcourse/${category.id}/study?sub=${subChapter.id}&tab=chat`,
                );
              }}
            >
              <div className="flex items-start gap-2">
                <div className="mt-1 flex-shrink-0">
                  {subChapter.type === 'TRYOUT' ? (
                    <FileQuestionIcon className="w-4 h-4 text-green-600" />
                  ) : subChapter.video ? (
                    <PlayIcon className="w-4 h-4 text-red-600" />
                  ) : subChapter.materi ? (
                    <BookOpenIcon className="w-4 h-4 text-purple-600" />
                  ) : (
                    <FileQuestionIcon className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-semibold text-gray-900">
                    {subChapter.number}. {subChapter.title}
                  </h5>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {subChapter.description}
                  </p>
                  {subChapter.spendTime > 0 && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                      <ClockIcon className="w-3 h-3" />
                      {subChapter.spendTime}m
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // return (
  //   <div
  //     key={index}
  //     className="p-4 rounded-3xl border-2 border-gray-100 hover:border-gray-300 transition-all cursor-pointer group"
  //     onClick={() => {
  //       if (chapter.CourseSubChapter.length > 0) {
  //         router.push(
  //           `/${website_sub_category_id_params}/user/bimcourse/${category.id}?sub=${chapter.CourseSubChapter[0].id}&tab=chat`,
  //         );
  //       }
  //     }}
  //   >
  //     {/* Header Chapter */}
  //     <div className="flex items-start gap-3 mb-3">
  //       <div
  //         className="w-10 h-10 rounded-3xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
  //         style={{ backgroundColor: mainColor }}
  //       >
  //         {index + 1}
  //       </div>
  //       <div className="flex-1 min-w-0">
  //         <div className="flex items-center gap-2 mb-1">
  //           <h4 className="font-bold text-sm text-gray-900 group-hover:text-gray-700">
  //             {chapter.title}
  //           </h4>
  //           {chapter.isDone && (
  //             <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
  //           )}
  //         </div>
  //         <p className="text-xs text-gray-500">
  //           {totalSubChapters} Sub Chapter
  //         </p>
  //       </div>
  //     </div>

  //     {/* Content Type Stats */}
  //     <div className="grid grid-cols-4 gap-2 mb-3">
  //       {videoCount > 0 && (
  //         <div className="flex items-center gap-1 px-2 py-1.5 rounded-3xl bg-red-50 border border-red-200">
  //           <PlayIcon className="w-3 h-3 text-red-600" />
  //           <span className="text-xs font-semibold text-red-700">
  //             {videoCount}
  //           </span>
  //         </div>
  //       )}
  //       {materiCount > 0 && (
  //         <div className="flex items-center gap-1 px-2 py-1.5 rounded-3xl bg-purple-50 border border-purple-200">
  //           <BookOpenIcon className="w-3 h-3 text-purple-600" />
  //           <span className="text-xs font-semibold text-purple-700">
  //             {materiCount}
  //           </span>
  //         </div>
  //       )}
  //       {quizCount > 0 && (
  //         <div className="flex items-center gap-1 px-2 py-1.5 rounded-3xl bg-green-50 border border-green-200">
  //           <FileQuestionIcon className="w-3 h-3 text-green-600" />
  //           <span className="text-xs font-semibold text-green-700">
  //             {quizCount}
  //           </span>
  //         </div>
  //       )}
  //       {totalTime > 0 && (
  //         <div className="flex items-center gap-1 px-2 py-1.5 rounded-3xl bg-blue-50 border border-blue-200">
  //           <ClockIcon className="w-3 h-3 text-blue-600" />
  //           <span className="text-xs font-semibold text-blue-700">
  //             {totalTime}m
  //           </span>
  //         </div>
  //       )}
  //     </div>

  //     {/* Progress Bar per Chapter */}
  //     {chapter.isDone ? (
  //       <div className="flex items-center gap-2 text-xs font-medium text-green-600">
  //         <div className="flex-1 h-1.5 bg-green-500 rounded-full" />
  //         <span>100% Selesai</span>
  //       </div>
  //     ) : (
  //       <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
  //         <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
  //         <span>Belum Dimulai</span>
  //       </div>
  //     )}
  //   </div>
  // );
};
