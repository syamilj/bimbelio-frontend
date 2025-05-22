'use client';

import { getGeneral } from '@/lib/fetch-helper';
import { Category, Subcategory } from '@/types/database';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Card from '../../_components/card';
import CardNotFound from '../../_components/card-not-found';
import SearchDeskstop from '../../_components/search-dekstop';

export default function DocumentSearch() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const categoryId = searchParams.get('categoryId');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [searchDatas, setSearchDatas] = useState<
    (Document & { category: Category; subCategory: Subcategory })[]
  >([]);

  const fetchSearchData = async () => {
    if (!search && !categoryId) return;
    await getGeneral('/document/searchDocs', {
      params: {
        search,
        categoryId,
      },
      setLoading: setIsLoading,
      setData: setSearchDatas,
    });
  };

  useEffect(() => {
    fetchSearchData();
  }, [search, categoryId]);

  console.log('searchDatas', searchDatas);

  return (
    <div className="flex flex-col gap-[1rem] px-[1rem] md:gap-[2rem] md:p-0">
      <div className="hidden w-full justify-center md:flex">
        <SearchDeskstop />
      </div>
      <div className="mt-[3rem] flex flex-col gap-[1rem] md:mt-0 md:gap-0">
        <h1 className="text-[1.5rem] font-semibold">Hasil Pencarian :</h1>
      </div>

      {searchDatas.length !== 0 ? (
        <div className="grid grid-cols-2 gap-[1rem] font-semibold md2:grid-cols-4">
          <Card
            data={searchDatas}
            href="#"
          />
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="flex justify-center items-center h-full w-full">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : (
            <>
              {searchDatas?.length === 0 && (
                <div className="grid grid-cols-2 gap-[1rem] md2:grid-cols-4">
                  <CardNotFound title="Document Not Found" />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
