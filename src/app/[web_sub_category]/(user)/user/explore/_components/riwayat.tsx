'use client';

import Card from '@/app/(user)/user/_components/card';
import CardNotFound from '@/app/(user)/user/_components/card-not-found';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/trpc/react';
import { useEffect, useState } from 'react';

export default function Riwayat() {
  const [riwayat, setRiwayat] = useState<any>([]);

  const { data: document, isLoading } = api.document.getHistoryByUser.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );

  if (document) {
    console.log(document);
  }

  useEffect(() => {
    if (document) {
      const today = document.today.map((item: any) => {
        return {
          ...item.document,
        };
      });
      const yesterday = document.yesterday.map((item: any) => {
        return {
          ...item.document,
        };
      });
      const riwayatData = [...today, ...yesterday];
      setRiwayat([...riwayatData]);
    }
  }, [document]);

  return (
    <>
      <h1 className="text-[1.4rem] font-medium">Riwayat Terakhir</h1>
      {!isLoading && riwayat?.length > 0 && (
        <div className="grid grid-cols-2 gap-[1rem] md2:grid-cols-4">
          <Card
            data={riwayat}
            href={'/user/workspace'}
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
