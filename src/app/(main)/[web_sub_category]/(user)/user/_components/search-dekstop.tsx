'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { ScrollWrapper } from '@/components/ui/scroll-wrapper';
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

  // Sinkronisasi categoryId dengan URL - simplified logic
  useEffect(() => {
    const pathSegments = pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];

    // Jika di workspace dengan categoryId, ambil categoryId
    if (pathname.includes('/workspace/') && lastSegment !== 'workspace') {
      setCategoryId(lastSegment);
    } else {
      // Untuk explore atau halaman lain, kosongkan categoryId
      setCategoryId('');
    }
  }, [pathname]);

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

  const handleCategoryChange = (newCategoryId: string) => {
    // Jangan lakukan apapun kalau value tidak berubah
    if (categoryId === newCategoryId) return;

    // Fix: Jangan auto push ke explore kalau lagi di workspace dan newCategoryId kosong
    if (
      (!newCategoryId || newCategoryId === 'all') &&
      pathname.includes('/workspace/')
    ) {
      return;
    }

    if (!newCategoryId || newCategoryId === 'all') {
      router.push(`/${website_sub_category_id}/user/explore`);
    } else {
      router.push(
        `/${website_sub_category_id}/user/workspace/${newCategoryId}`,
      );
    }
  };

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
            'relative flex items-center overflow-hidden bg-white shadow-sm border-2 transition-all duration-300',
            isMobile ? 'rounded-3xl' : 'rounded-full',
            isFocused
              ? 'shadow-md scale-[1.01] border-2'
              : 'shadow-sm border-2',
          )}
          style={{
            borderColor: isFocused ? mainColor : '#f3f4f6',
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
            <div className="hidden md:flex items-center gap-3 px-4 border-l-2 border-gray-100">
              <Filter className="w-4 h-4 text-gray-400" />
              <div className="min-w-[150px]">
                <Select
                  value={categoryId === '' ? 'all' : categoryId}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="border-none shadow-none bg-transparent text-gray-600 focus:ring-0 h-auto p-0 font-medium">
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent className="rounded-3xl border-2 border-gray-100 shadow-sm">
                    <SelectItem
                      value="all"
                      className="rounded-3xl font-medium"
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
                        value={item.id ?? ''} // pastikan item.id ada!
                        className="rounded-3xl font-medium"
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
                'shadow-sm transition-all duration-300 p-0',
                isMobile ? 'w-8 h-8 rounded-3xl' : 'w-12 h-12 rounded-full',
                searchValue.trim()
                  ? 'hover:shadow-md hover:scale-105'
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
      <ScrollWrapper className="mt-4 overflow-x-auto">
        <div className="flex items-center gap-2 pb-2">
          <button
            className={cn(
              'px-3 py-2 rounded-3xl whitespace-nowrap text-sm font-bold transition-all duration-200 border-2',
              categoryId === ''
                ? 'text-white shadow-sm border-transparent'
                : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-100',
            )}
            style={{
              backgroundColor: categoryId === '' ? mainColor : undefined,
            }}
            onClick={() => handleCategoryChange('')}
          >
            Semua
          </button>
          {category?.map((item) => (
            <button
              key={item.id}
              className={cn(
                'px-3 py-2 rounded-3xl whitespace-nowrap text-sm font-bold transition-all duration-200 border-2',
                categoryId === item.id
                  ? 'text-white shadow-sm border-transparent'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-100',
              )}
              style={{
                backgroundColor: categoryId === item.id ? mainColor : undefined,
              }}
              onClick={() => handleCategoryChange(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </ScrollWrapper>

      {/* Search Tips - Only show on desktop */}
      {!isMobile && (
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>AI-powered search</span>
          </div>
          <span>•</span>
          <span>Lebih dari 1000+ materi</span>
        </div>
      )}
    </div>
  );
};

export default SearchDeskstop;
