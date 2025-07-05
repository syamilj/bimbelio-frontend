'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import { Category } from '@/types/database';
import { Filter, Search, Sparkles } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useMedia from 'use-media';

const SearchDeskstop = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const isMobile = useMedia({ maxWidth: '768px' });

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [categoryId, setCategoryId] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const [category, setCategory] = useState<
    Omit<Category, 'to' | 'website_sub_category_id'>[]
  >([]);

  const fetchCategory = async () => {
    await getGeneral('/category/getAllCategories', {
      setData: setCategory,
    });
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    router.push(
      `/${website_sub_category_id}/user/document/search?search=${searchValue}${
        categoryId && `&categoryId=${categoryId}`
      }`,
    );
  };

  useEffect(() => {
    if (!pathname.includes('search')) return;
    handleSearch();
  }, [categoryId]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Search Form */}
      <form
        className="relative"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <div
          className={cn(
            'relative flex items-center overflow-hidden bg-white dark:bg-gray-800 shadow-lg border-2 transition-all duration-300',
            isMobile ? 'rounded-xl' : 'rounded-2xl',
            isFocused ? 'shadow-xl scale-[1.02]' : 'shadow-lg',
          )}
          style={{
            borderColor: isFocused ? `${mainColor}60` : 'transparent',
          }}
        >
          {/* Search Icon */}
          <div className="absolute left-3 z-10">
            <Search
              className={cn('text-gray-400', isMobile ? 'w-4 h-4' : 'w-5 h-5')}
              style={{ color: isFocused ? mainColor : undefined }}
            />
          </div>

          {/* Search Input */}
          <input
            id="searchValue2"
            type="text"
            placeholder={
              isMobile ? 'Cari materi...' : 'Cari materi pembelajaran...'
            }
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              'flex-1 bg-transparent border-none outline-none placeholder:text-gray-400 dark:text-white',
              isMobile
                ? 'pl-10 pr-3 py-3 text-sm'
                : 'pl-12 pr-4 py-4 text-base',
            )}
          />

          {/* Category Filter - Desktop */}
          {!isMobile && (
            <div className="hidden md:flex items-center gap-3 px-4 border-l border-gray-200 dark:border-gray-700">
              <Filter className="w-4 h-4 text-gray-400" />
              <div className="min-w-[150px]">
                <Select
                  value={categoryId === '' ? 'all' : categoryId}
                  onValueChange={(value) => {
                    setCategoryId(value === 'all' ? '' : value);
                  }}
                >
                  <SelectTrigger className="border-none shadow-none bg-transparent text-gray-600 dark:text-gray-300 focus:ring-0 h-auto p-0">
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border shadow-xl">
                    <SelectItem
                      value="all"
                      className="rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: mainColor }}
                        />
                        Semua Kategori
                      </div>
                    </SelectItem>
                    {category?.map((item) => (
                      <SelectItem
                        key={item.id}
                        value={item.id}
                        className="rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: mainColor }}
                          />
                          {item.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Search Button */}
          <div className={cn('p-2', isMobile && 'p-1')}>
            <Button
              type="submit"
              disabled={!searchValue.trim()}
              className={cn(
                'shadow-lg transition-all duration-300 p-0',
                isMobile ? 'w-8 h-8 rounded-lg' : 'w-12 h-12 rounded-xl',
                searchValue.trim()
                  ? 'hover:shadow-xl hover:scale-105'
                  : 'opacity-50 cursor-not-allowed',
              )}
              style={{ backgroundColor: mainColor }}
            >
              <Search
                className={cn('text-white', isMobile ? 'w-4 h-4' : 'w-5 h-5')}
              />
            </Button>
          </div>
        </div>
      </form>

      {/* Mobile Category Filter */}
      <div className="mt-4 overflow-x-auto">
        <div className="flex items-center gap-2 pb-2">
          <button
            className={cn(
              'px-3 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all duration-200',
              categoryId === ''
                ? 'text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
            )}
            style={{
              backgroundColor: categoryId === '' ? mainColor : undefined,
            }}
            onClick={() => setCategoryId('')}
          >
            Semua
          </button>
          {category?.map((item) => (
            <button
              key={item.id}
              className={cn(
                'px-3 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all duration-200',
                categoryId === item.id
                  ? 'text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
              )}
              style={{
                backgroundColor: categoryId === item.id ? mainColor : undefined,
              }}
              onClick={() => setCategoryId(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Search Tips - Only show on desktop */}
      {!isMobile && (
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>AI-powered search</span>
          </div>
          <span>•</span>
          <span>Lebih dari 1000+ materi</span>
          <span>•</span>
          <span>Updated daily</span>
        </div>
      )}
    </div>
  );
};

export default SearchDeskstop;
