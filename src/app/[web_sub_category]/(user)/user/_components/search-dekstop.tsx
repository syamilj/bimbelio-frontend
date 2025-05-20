'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral } from '@/lib/fetch-helper';
import { Category } from '@/types/database';
import { Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const SearchDeskstop = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [categoryId, setCategoryId] = useState<string>('');

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
    const input = document.getElementById('searchValue2') as HTMLInputElement;
    router.push(
      `/${website_sub_category_id}/user/document/search?search=${input.value}${categoryId && `&categoryId=${categoryId}`}`,
    );
  };

  useEffect(() => {
    handleSearch();
  }, [categoryId]);

  return (
    <form
      className="flex w-[80%] gap-[.5rem] xxl:w-full xxl:max-w-[800px]"
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
    >
      <div className="flex w-full justify-between rounded-xl bg-white overflow-hidden">
        {/* Input Search */}
        <input
          id="searchValue2"
          type="text"
          placeholder="Cari material..."
          className="w-full text-sm px-[1rem] py-[.8rem] outline-none md:py-[.5rem]"
        />

        {/* Select Dropdown (Kategori) */}
        <div className="hidden items-center justify-center gap-[.7rem] pr-[1rem] md:flex">
          <p className="text-main-gray-text2 text-sm">di</p>
          <div className="font-regular">
            <Select
              value={categoryId === '' ? 'placeholder' : categoryId}
              onValueChange={(value) => {
                if (value === 'placeholder') setCategoryId('');
                else if (value) setCategoryId(value);
              }}
            >
              <SelectTrigger className="min-w-[150px] border-none shadow-none text-main-gray-text2 text-sm">
                <SelectValue placeholder="Seluruh Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder">Seluruh Kategori</SelectItem>
                {category?.map((item) => (
                  <SelectItem
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tombol Submit */}
        <Button
          type="submit"
          className="flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-main p-3 text-sm font-semibold text-white hover:bg-main-hover md:px-6"
        >
          <Search className="h-6 w-6" />
        </Button>
      </div>

      {/* Kategori Mobile */}
      <div className="absolute left-0 top-[100%] w-full px-[1rem]">
        {pathname?.includes('search') && (
          <div
            id="searchCategoryMobile"
            className="flex items-center justify-start gap-[.7rem] overflow-x-auto bg-bg-workspace pb-[.5rem] md:hidden"
          >
            <div
              className={`px-[1.5rem] py-[.7rem] ${
                categoryId === '' && 'bg-main text-white'
              } shrink-0 rounded-xl text-main-gray-text`}
              onClick={() => setCategoryId('')}
            >
              Semua
            </div>
            {category?.map((item) => (
              <div
                key={item.id}
                className={`px-[1.5rem] py-[.7rem] ${
                  categoryId === item.id && 'bg-main text-white'
                } shrink-0 rounded-xl text-main-gray-text`}
                onClick={() => setCategoryId(item.id)}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchDeskstop;
