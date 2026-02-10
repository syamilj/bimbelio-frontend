'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BookOpenIcon,
  ClockIcon,
  FileQuestionIcon,
  FileTextIcon,
  PlayCircleIcon,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import type { SubChapterSearchResult, TypeCourseEnum } from './modul-types';

type SearchDropdownProps = {
  searchRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchResults: SubChapterSearchResult[];
  selectedIndex: number;
  mainColor: string;
  onResultClick: (result: SubChapterSearchResult) => void;
};

function getTypeIcon(type: TypeCourseEnum) {
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
}

function getTypeColor(type: TypeCourseEnum) {
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
}

function getThumbnail(result: SubChapterSearchResult) {
  if (result.video) return result.video;
  if (result.document) return result.document;
  if (result.materi) return result.materi;
  return null;
}

export function SearchDropdown({
  searchRef,
  inputRef,
  searchQuery,
  setSearchQuery,
  isSearchOpen,
  setIsSearchOpen,
  searchResults,
  selectedIndex,
  mainColor,
  onResultClick,
}: SearchDropdownProps) {
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

  return (
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
                      onClick={() => onResultClick(result)}
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
  );
}
