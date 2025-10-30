'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import axiosInstance from '@/lib/axios/axiosInstance';
import { response } from '@/lib/response';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type CategoryType = {
  name: string;
  id: string;
  total: number;
};

const Search = ({}: any) => {
  const router = useRouter();
  const pathname = usePathname();

  const { setSearch } = useAppContext();
  // const [search, setSearch] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  // const { data: category } = api.category.getAllCategories.useQuery(undefined, {
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  // });

  const [category, setCategory] = useState<CategoryType[]>([]);

  useEffect(() => {
    axiosInstance.get('/category/getAllCategories').then((res) => {
      const resData = response(res);
      setCategory(resData.data);
    });
  }, []);

  // const { data: searchData, refetch } = api.document.searchDocs.useQuery(
  //   `${search}`,
  //   { refetchOnWindowFocus: false }
  // );

  // const searchDataByCategory = api.document.searchDocsByCategory.useMutation();

  const handleSearch = async (e: any) => {
    e.preventDefault();
    const value = document.getElementById('searchValue') as HTMLInputElement;
    setSearch(`${value.value}`);
    // refetch();
    if (!pathname?.includes('search')) {
      localStorage.setItem('search', `${value.value}`);
      router.push(`/${website_sub_category_id}/user/search`);
    }
  };
  // useEffect(() => {
  //   if (search !== "" && categoryId === "") {
  //     setDocsSearchData(searchData);
  //   }
  //   if (search !== "" && categoryId !== "") {
  //     const getData = async () => {
  //       const data = await searchDataByCategory.mutateAsync({
  //         value: `${search}`,
  //         categoryId: categoryId,
  //       });
  //       setDocsSearchData(data);
  //     };
  //     getData();
  //   }
  // }, [search, searchData, categoryId]);

  useEffect(() => {
    const value = localStorage.getItem('search');
    const input = document.getElementById('searchValue') as HTMLInputElement;
    if (value) {
      input.value = value;
      setSearch(value);
      localStorage.removeItem('search');
    }
  }, []);

  return (
    <form
      className="flex w-full gap-[.5rem] md:w-[unset]"
      onSubmit={(e) => handleSearch(e)}
    >
      <div
        // id="border"
        className="flex w-full justify-between gap-2 rounded-2xl md:w-[unset] md:rounded-2xl border-2 border-gray-100 bg-white"
      >
        <input
          id="searchValue"
          type="text"
          // placeholder="Coming Soon..."
          className="w-full rounded-2xl px-4 py-[.8rem] text-sm outline-none md:w-[unset] md:rounded-2xl md:py-[.5rem]"
          disabled
        />
        <div className="hidden items-center justify-center gap-[.7rem] pr-4 md:flex">
          <p className="text-gray-600 font-medium">di</p>
          <div className="font-medium">
            <select
              className="outline-none text-gray-600"
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Seluruh Kategori</option>
              {category?.map((item, i) => (
                <option
                  key={i}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="absolute left-0 top-full w-full px-4">
          {pathname?.includes('search') && (
            <div
              id="searchCategoryMobile"
              className="flex items-center justify-start gap-[.7rem] overflow-x-auto bg-bg-workspace pb-[.5rem] md:hidden"
            >
              <div
                className={`px-6 py-[.7rem] ${
                  categoryId === '' && 'bg-main text-white'
                } shrink-0 rounded-2xl text-main-gray-text font-bold border-2 ${
                  categoryId === ''
                    ? 'border-transparent shadow-sm'
                    : 'border-gray-100 bg-white'
                }`}
                onClick={() => {
                  setCategoryId('');
                }}
              >
                Semua
              </div>
              {category?.map((item, i) => (
                <div
                  key={i}
                  className={`px-6 py-[.7rem] ${
                    categoryId === item.id && 'bg-main text-white'
                  } shrink-0 rounded-2xl text-main-gray-text font-bold border-2 ${
                    categoryId === item.id
                      ? 'border-transparent shadow-sm'
                      : 'border-gray-100 bg-white'
                  }`}
                  onClick={() => {
                    setCategoryId(item.id);
                  }}
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <button
        type="submit"
        id="border"
        className="flex h-0 w-0 cursor-pointer items-center justify-center overflow-hidden text-sm rounded-2xl bg-main p-0 font-bold text-white md:h-[unset] md:w-[unset] md:px-4"
      >
        Cari
      </button>
    </form>
  );
};

export default Search;
