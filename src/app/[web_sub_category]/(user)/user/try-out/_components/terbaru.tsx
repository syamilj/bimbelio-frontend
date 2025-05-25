import CardNotFound from '@/app/[web_sub_category]/(user)/user/_components/card-not-found';
import { useSession } from '@/components/provider/provider-session-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { getGeneral } from '@/lib/fetch-helper';
import { useEffect, useState } from 'react';
import CardTryOut, { CardTryoutProps } from './ui/card-tryout';

export default function Terbaru({ id }: { id: string }) {
  const { data: session } = useSession();
  // const { data: cards, isLoading } = api.tryout.getTryOutCard.useQuery(
  //   { userTryOutId: id },
  //   {
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //   }
  // );

  const [cards, setCards] = useState<CardTryoutProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getData = async () => {
    if (!session) return;
    await getGeneral(`/tryout/getTryOutCard?userId=${session?.user.id}`, {
      setData: setCards,
      setLoading: setIsLoading,
    });
  };

  useEffect(() => {
    getData();
  }, [session]);

  if (!cards && !isLoading) {
    return <div>Error</div>;
  }

  if (cards?.length === 0 && !isLoading) return null;

  return (
    <>
      <h1 className="text-[1.4rem] font-semibold">Sedang Berlangsung</h1>
      {!isLoading && cards && cards.length > 0 && (
        <div className="grid grid-cols-1 gap-[1rem] md2:grid-cols-3 xxxl:grid-cols-4">
          <CardTryOut
            data={cards}
            userTryOutId={id}
            refresh={getData}
          />
        </div>
      )}
      {!isLoading && cards?.length === 0 && (
        <div className="grid grid-cols-1 gap-[1rem] md2:grid-cols-3 xxxl:grid-cols-4">
          <CardNotFound />
        </div>
      )}
      {isLoading && (
        <div className="grid grid-cols-1 gap-[1rem] md2:grid-cols-3 xxxl:grid-cols-4">
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
