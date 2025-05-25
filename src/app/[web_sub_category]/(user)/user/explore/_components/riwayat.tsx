'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral } from '@/lib/fetch-helper';
import { Category, Subcategory } from '@/types/database';
import { useEffect, useState } from 'react';
import Card from '../../_components/card';
import CardNotFound from '../../_components/card-not-found';

export default function Riwayat() {
  const [riwayat, setRiwayat] = useState<any>([]);
  const { data: session } = useSession();

  // const { data: document, isLoading } = api.document.getHistoryByUser.useQuery(
  //   undefined,
  //   {
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //   },
  // );

  const [datas, setDatas] = useState<{
    today: {
      document: Document & {
        category: Category;
        subCategory: Subcategory;
      };
    }[];
    yesterday: {
      document: Document & {
        category: Category;
        subCategory: Subcategory;
      };
    }[];
  }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getGeneral('/document/getHistoryByUser', {
      params: { userId: session?.user.id },
      setData: setDatas,
      setLoading: setIsLoading,
    });
  }, []);

  useEffect(() => {
    if (datas) {
      const today = datas?.today.map((item) => {
        return {
          ...item.document,
        };
      });
      const yesterday = datas?.yesterday.map((item) => {
        return {
          ...item.document,
        };
      });
      const riwayatData = [...today, ...yesterday];
      setRiwayat([...riwayatData]);
    }
  }, [datas]);

  return (
    <>
      <h1 className="text-[1.4rem] font-medium">Riwayat Terakhir</h1>
      {!isLoading && riwayat?.length > 0 && (
        <div className="grid grid-cols-2 gap-[1rem] md2:grid-cols-4">
          <Card
            data={riwayat}
            href={`${website_sub_category_id}/user/workspace`}
            noCategory={true}
          />
        </div>
      )}
      {!isLoading && riwayat?.length === 0 && (
        <div className="grid grid-cols-2 gap-[1rem] md2:grid-cols-4">
          <CardNotFound />
        </div>
      )}
      {isLoading && (
        <div className="grid grid-cols-2 gap-[1rem] md2:grid-cols-4">
          {Array.from({ length: 4 }).map((_: any, i: number) => (
            <Skeleton
              key={i}
              className={
                'h-[160px] mb:h-[200px] md:h-[200px] md2:h-[180px] xl:h-[250px] xxxl:h-[300px]'
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
