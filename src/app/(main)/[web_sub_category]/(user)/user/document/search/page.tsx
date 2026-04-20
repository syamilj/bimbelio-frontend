'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { trackUnifiedEvent } from '@/lib/tracking/track';
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
      const fullName = session?.user?.name || '';
      const [firstName, ...restNameParts] = fullName.split(' ').filter(Boolean);
      const lastName = restNameParts.length
        ? restNameParts.join(' ')
        : undefined;

      trackUnifiedEvent({
        eventName: 'Search',
        customData: {
          content_name: 'Document Search',
          content_type: 'document',
          search_string: search,
          content_id: `document_search_${search.replace(/\s+/g, '_').toLowerCase()}`,
        },
        user: session?.user
          ? {
              userId: session.user.id?.toString?.() || undefined,
              email: session.user.email || undefined,
              phone: session.user.phone || undefined,
              firstName: firstName || undefined,
              lastName,
            }
          : undefined,
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
          <Card data={searchDatas} />
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
