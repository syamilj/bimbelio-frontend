'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { Category, Subcategory } from '@/types/database';
import { useEffect, useState } from 'react';
import Card from '../../_components/card';
import CardNotFound from '../../_components/card-not-found';

export default function Terbaru() {
  // const {
  //   data: dokumen,
  //   isLoading,
  //   error,
  // } = api.document.getDocumentTerbaru.useQuery(undefined, {
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  // });

  const [datas, setDatas] = useState<
    (Document & {
      category: Category;
      subCategory: Subcategory;
    })[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getGeneral('/document/getDocumentTerbaru', {
      setData: setDatas,
      setLoading: setIsLoading,
    });
  }, []);

  // if (error)
  //   return (
  //     <>
  //       <h1 className="text-[1.4rem] font-medium">Terbaru</h1>
  //       <div className="grid grid-cols-2 gap-[1rem] md2:grid-cols-4">
  //         <CardNotFound />
  //       </div>
  //     </>
  //   );

  return (
    <>
      <h1 className="text-[1.4rem] font-medium">Terbaru</h1>
      {!isLoading && datas?.length > 0 && (
        <div className="grid grid-cols-2 gap-[1rem] md2:grid-cols-4">
          <Card
            data={datas}
            href={`${website_sub_category_id}/user/workspace`}
            noCategory={true}
          />
        </div>
      )}
      {!isLoading && datas?.length === 0 && (
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
