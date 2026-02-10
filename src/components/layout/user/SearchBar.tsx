'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import { TypeCourseEnum } from '@/types/database';
import {
  BookOpenIcon,
  FileQuestionIcon,
  FileText,
  PlayCircleIcon,
  Search as SearchIcon,
  Sparkles,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  CourseDataType,
  SubChapterSearchResult,
} from './layout-user-types';

// ─── Helpers ────────────────────────────────────────────────────

const getTypeIcon = (type: TypeCourseEnum) => {
  switch (type) {
    case 'VIDEO':
      return <PlayCircleIcon className="w-4 h-4" />;
    case 'DOCUMENT':
      return <FileText className="w-4 h-4" />;
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

// ─── SearchResultItem ───────────────────────────────────────────

function SearchResultItem({
  result,
  index,
  selectedIndex,
  mainColor,
  highlightMatch,
  onClick,
}: {
  result: SubChapterSearchResult;
  index: number;
  selectedIndex: number;
  mainColor: string;
  highlightMatch: (text: string) => React.ReactNode;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-3xl transition-all mb-1.5 group cursor-pointer ${
        index === selectedIndex
          ? 'ring-2 ring-offset-1'
          : 'hover:bg-gray-50 active:bg-gray-100'
      }`}
      style={{
        backgroundColor:
          index === selectedIndex ? `${mainColor}08` : undefined,
        ...(index === selectedIndex
          ? ({ '--tw-ring-color': mainColor } as React.CSSProperties)
          : {}),
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-3xl flex items-center justify-center shrink-0"
          style={{
            backgroundColor: `${mainColor}15`,
            color: mainColor,
          }}
        >
          {getTypeIcon(result.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
              {highlightMatch(result.title)}
            </h4>
            <Badge
              className={`text-[10px] px-1.5 py-0.5 shrink-0 ${getTypeColor(result.type)}`}
            >
              {result.type}
            </Badge>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2 mb-1.5">
            {highlightMatch(result.description)}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 flex-wrap">
            <span className="font-medium">{result.categoryName}</span>
            <span>•</span>
            <span className="line-clamp-1">{result.chapterTitle}</span>
            {result.isCompleted && (
              <>
                <span>•</span>
                <span className="text-green-600 font-medium">✓ Selesai</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SearchResultsDropdown ──────────────────────────────────────

function SearchResultsDropdown({
  searchResults,
  selectedIndex,
  mainColor,
  highlightMatch,
  onResultClick,
}: {
  searchResults: SubChapterSearchResult[];
  selectedIndex: number;
  mainColor: string;
  highlightMatch: (text: string) => React.ReactNode;
  onResultClick: (result: SubChapterSearchResult) => void;
}) {
  return (
    <div
      className="absolute top-full mt-2 w-full left-0 bg-white border-2 rounded-3xl shadow-2xl z-50 overflow-hidden"
      style={{ borderColor: `${mainColor}40` }}
    >
      <div
        className="px-4 py-2.5 border-b flex items-center justify-between"
        style={{ backgroundColor: `${mainColor}08` }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: mainColor }} />
          <span className="text-sm font-bold text-gray-700">
            {searchResults.length} hasil
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 border border-gray-200 rounded">
            ↑↓
          </kbd>
        </div>
      </div>
      <div className="max-h-[60vh] overflow-y-auto">
        <div className="p-2">
          {searchResults.map((result, index) => (
            <SearchResultItem
              key={result.id}
              result={result}
              index={index}
              selectedIndex={selectedIndex}
              mainColor={mainColor}
              highlightMatch={highlightMatch}
              onClick={() => onResultClick(result)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SearchBar ──────────────────────────────────────────────────

export function SearchBar({ isMobile }: { isMobile: boolean }) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const router = useRouter();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch course data for search
  const { data: CourseData } = useGet<CourseDataType>(
    '/course/getCategoryForCard',
  );

  // Flatten all sub chapters for search
  const allSubChapters = useMemo<SubChapterSearchResult[]>(() => {
    if (!CourseData) return [];
    return CourseData.flatMap((category) =>
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
  }, [CourseData]);

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

  // Desktop search input
  if (!isMobile) {
    return (
      <div ref={searchRef} className="hidden md:block relative w-full max-w-md">
        <div className="relative">
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-10"
            style={{ color: isSearchOpen ? mainColor : '#9ca3af' }}
          >
            <SearchIcon className="w-5 h-5" />
          </div>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Cari materi, video, tryout..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 h-12 rounded-3xl border-2 border-gray-200 focus:border-transparent text-sm font-medium transition-all"
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
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-3xl hover:bg-gray-100 z-10"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
          {isSearchOpen && (
            <SearchResultsDropdown
              searchResults={searchResults}
              selectedIndex={selectedIndex}
              mainColor={mainColor}
              highlightMatch={highlightMatch}
              onResultClick={handleResultClick}
            />
          )}
        </div>
      </div>
    );
  }

  // Mobile: returns null — mobile search lives in MobileSearchOverlay
  return null;
}

// ─── MobileSearchOverlay ────────────────────────────────────────

export function MobileSearchOverlay({
  showMobileSearch,
  onClose,
}: {
  showMobileSearch: boolean;
  onClose: () => void;
}) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const router = useRouter();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: CourseData } = useGet<CourseDataType>(
    '/course/getCategoryForCard',
  );

  const allSubChapters = useMemo<SubChapterSearchResult[]>(() => {
    if (!CourseData) return [];
    return CourseData.flatMap((category) =>
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
  }, [CourseData]);

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

  useEffect(() => {
    setIsSearchOpen(searchQuery.length >= 2 && searchResults.length > 0);
    setSelectedIndex(0);
  }, [searchQuery, searchResults.length]);

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
    onClose();
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

  if (!showMobileSearch) return null;

  return (
    <div className="border-t border-gray-200 p-3 bg-white">
      <div ref={searchRef} className="relative">
        <div className="relative">
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-10"
            style={{ color: isSearchOpen ? mainColor : '#9ca3af' }}
          >
            <SearchIcon className="w-5 h-5" />
          </div>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Cari materi, video, tryout, atau dokumen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="pl-12 pr-12 h-12 rounded-3xl border-2 border-gray-200 focus:border-transparent text-sm font-medium transition-all"
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
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-3xl hover:bg-gray-100 z-10"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
          {isSearchOpen && (
            <SearchResultsDropdown
              searchResults={searchResults}
              selectedIndex={selectedIndex}
              mainColor={mainColor}
              highlightMatch={highlightMatch}
              onResultClick={handleResultClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}
