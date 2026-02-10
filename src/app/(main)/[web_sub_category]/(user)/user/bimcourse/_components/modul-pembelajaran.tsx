'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import { BookOpenIcon, LayoutGridIcon, Rows3Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CourseGridCard } from './course-grid-card';
import { CourseListCard } from './course-list-card';
import type { SubChapterSearchResult, TypeData } from './modul-types';
import { SearchDropdown } from './search-dropdown';

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
        <SearchDropdown
          searchRef={searchRef}
          inputRef={inputRef}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
          searchResults={searchResults}
          selectedIndex={selectedIndex}
          mainColor={mainColor}
          onResultClick={handleResultClick}
        />
      )}

      {/* Module Cards - Grid or Detailed List View */}
      {!isLoading ? (
        viewMode === 'grid' ? (
          <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CategoryCard?.map((category) => (
                <CourseGridCard
                  key={category.id}
                  category={category}
                  loadingCourseId={loadingCourseId}
                  onStartCourse={handleStartCourse}
                  mainColor={mainColor}
                />
              ))}
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
              {CategoryCard?.map((category) => (
                <CourseListCard
                  key={category.id}
                  category={category}
                  loadingCourseId={loadingCourseId}
                  onStartCourse={handleStartCourse}
                  mainColor={mainColor}
                />
              ))}
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
