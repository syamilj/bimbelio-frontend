'use client';

import Card from '@/app/(user)/user/_components/card';
import CardNotFound from '@/app/(user)/user/_components/card-not-found';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/trpc/react';

export default function Terbaru() {
  const {
    data: dokumen,
    isLoading,
    error,
  } = api.document.getDocumentTerbaru.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  if (error)
    return (
      // <div className='flex justify-center items-center h-screen mt-[-80px]'>
      //   {error.message}
      // </div>
      <>
        <h1 className="text-[1.4rem] font-medium">Terbaru</h1>
        <div className="grid grid-cols-2 gap-[1rem] md2:grid-cols-4">
          <CardNotFound />
        </div>
      </>
    );

  // console.log('dokumen', dokumen)

  return (
    <>
      <h1 className="text-[1.4rem] font-medium">Terbaru</h1>
      {!isLoading && dokumen?.length > 0 && (
        <div className="grid grid-cols-2 gap-[1rem] md2:grid-cols-4">
          <Card
            data={dokumen}
            href={'/user/workspace'}
            noCategory={true}
          />
        </div>
      )}
      {!isLoading && dokumen?.length === 0 && (
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
