import CardNotFound from '@/app/(user)/user/_components/card-not-found';
import { api } from '@/trpc/react';
import CardTryOutDone from './ui/card-tryout-done';

export default function DoneEvaluate() {
  const { data: cards, isLoading } =
    api.document.getTryOutDoneDocument.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  if (!cards && !isLoading) {
    return <div>Error</div>;
  }

  console.log('Done', cards);

  if (cards?.length === 0) return null;

  return (
    <>
      <h1 className="text-[1.4rem] font-medium">Terdahulu</h1>
      {!isLoading && cards && cards.length > 0 && (
        <div className="grid grid-cols-2 gap-[1rem] md2:grid-cols-4">
          <CardTryOutDone
            data={cards}
            href={'/user/workspace'}
            noCategory={true}
            done
          />
        </div>
      )}
      {!isLoading && cards?.length === 0 && (
        <div className="grid grid-cols-2 gap-[1rem] md2:grid-cols-4">
          <CardNotFound />
        </div>
      )}
      {isLoading && (
        <div className="grid grid-cols-2 gap-[1rem] md2:grid-cols-4">
          {Array.from({ length: 4 }).map((_: any, i: number) => (
            <div
              key={i}
              id="loading"
              className={
                'relative flex h-[160px] flex-col items-center justify-start overflow-hidden rounded-[20px] border border-main-gray-input bg-main-gray-input duration-300 mb:h-[200px] md:h-[200px] md2:h-[180px] xl:h-[250px] xxxl:h-[300px]'
              }
            ></div>
          ))}
        </div>
      )}
    </>
  );
}
