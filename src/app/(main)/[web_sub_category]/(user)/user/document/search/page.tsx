'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { pixel } from '@/lib/pixel/_core';
import { Category, Subcategory } from '@/types/database';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Card from '../../_components/card';
import CardNotFound from '../../_components/card-not-found';
import SearchDeskstop from '../../_components/search-dekstop';

export default function DocumentSearch() {
  const { data: session } = useSession();
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

  useEffect(() => {
    // ✅ ENHANCED SEARCH EVENT - Track saat search berubah dengan data lengkap
    if (search && search.trim().length > 0) {
      pixel.meta.track(
        'Search',
        {
          content_name: 'Document Search',
          content_type: 'document',
          search_string: search,
        },
        // ✅ Advanced Matching untuk Meta Pixel
        session?.user
          ? {
              em: session.user.email,
              ph: session.user.phone || undefined,
              fn: session.user.name?.split(' ')[0],
              ln: session.user.name?.split(' ').slice(1).join(' '),
            }
          : undefined,
      );
      pixel.tiktok.track('Search', {
        content_name: 'Document Search',
        search_string: search,
        content_id: `document_search_${search.replace(/\s+/g, '_').toLowerCase()}`, // ✅ Required untuk TikTok VSA
      });
    }
  }, [search, session]); // ✅ DUPLIKASI FIX: Trigger saat search berubah, bukan saat mount

  return (
    <div className="flex flex-col gap-4 px-4 md:gap-8 md:p-0">
      <div className="hidden w-full justify-center md:flex">
        <SearchDeskstop />
      </div>
      <div className="mt-12 flex flex-col gap-4 md:mt-0 md:gap-0">
        <h1 className="text-[1.5rem] font-semibold">Hasil Pencarian :</h1>
      </div>

      {searchDatas.length !== 0 ? (
        <div className="grid grid-cols-2 gap-4 font-semibold md2:grid-cols-4">
          <Card
            data={searchDatas}
            href={`${website_sub_category_id}/user/workspace`}
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
                <div className="grid grid-cols-2 gap-4 md2:grid-cols-4">
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
