import CardNotFound from "@/app/(user)/user/_components/card-not-found";
import { Skeleton } from "@/components/ui/skeleton";
import CardTryOut, { CardTryoutProps } from "./ui/card-tryout";
import { useEffect, useState } from "react";
import { getGeneral } from "@/lib/fetch-helper";
import { useSession } from "@/components/provider/session-provider-auth";

export default function Upcoming({ id }: { id: string }) {
  const { data: session } = useSession();
  // const { data: cards, isLoading } = api.tryout.getTryOutCardUpcoming.useQuery(
  //   { userTryOutId: id },
  //   {
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //   },
  // );

  const [cards, setCards] = useState<CardTryoutProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getData = async () => {
    if (!session) return;
    await getGeneral(
      `/tryout/getTryOutCardUpcoming?userId=${session?.user.id}`,
      {
        setData: setCards,
        setLoading: setIsLoading,
      }
    );
  };

  useEffect(() => {
    getData();
  }, [session]);

  if (!cards && !isLoading) {
    return <div>Error</div>;
  }

  return (
    <>
      <h1 className="text-[1.4rem] font-medium">Akan Datang</h1>
      {!isLoading && cards && cards.length > 0 && (
        <div className="grid grid-cols-1 gap-[1rem] md2:grid-cols-3 xxxl:grid-cols-4">
          <CardTryOut
            data={cards}
            userTryOutId={id}
            isPrivate
            refresh={getData}
          />
        </div>
      )}
      {!isLoading && cards?.length === 0 && (
        <div className="grid grid-cols-1 gap-[1rem] md2:grid-cols-3 xxxl:grid-cols-4 border-none">
          <CardNotFound title="Belum tersedia" />
        </div>
      )}
      {isLoading && (
        <div className="grid grid-cols-1 gap-[1rem] md2:grid-cols-3 xxxl:grid-cols-4">
          {Array.from({ length: 4 }).map((_: any, i: number) => (
            <Skeleton
              key={i}
              className={
                "h-[160px] mb:h-[200px] md:h-[200px] md2:h-[180px] xl:h-[250px] xxxl:h-[300px]"
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
