'use client';

import { useLeaderboardContext } from '@/app/(user)/user/leaderboard/_components/provider-leaderboard';
import { useSession } from '@/components/provider/session-provider-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getGeneral } from '@/lib/fetch-helper';
import { cn, getDateStringShort } from '@/lib/utils';
import { IconTimer2, IconUserAdmin } from '@/styles/icon';
import { useEffect, useState } from 'react';

type TryoutListType = {
  id: string;
  _count: {
    TryoutResult: number;
  };
  title: string;
  startDate: Date;
};

export function TryOutSelector() {
  const { data: sesssion } = useSession();
  const { selectedTryOut, setSelectedTryOut } = useLeaderboardContext();

  const [firstLoad, setFirstLoad] = useState<number>(0);

  // const {
  //   data: TryoutList,
  //   isError: TryoutListIsError,
  //   isLoading: TryoutListIsLoading,
  // } = api.leaderboard.getTryoutList.useQuery(undefined, {
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  // });

  const [TryoutList, setTryoutList] = useState<TryoutListType[]>([]);
  const [TryoutListIsLoading, setTryoutListIsLoading] = useState<boolean>(true);
  const [TryoutListIsError, setTryoutListIsError] = useState<boolean>(false);

  useEffect(() => {
    if (!sesssion) return;
    getGeneral(`/leaderboard/getTryoutList?userId=${sesssion.user.id}`, {
      setData: setTryoutList,
      setLoading: setTryoutListIsLoading,
      onError() {
        setTryoutListIsError(true);
      },
    });
  }, [sesssion]);

  useEffect(() => {
    if (Array.isArray(TryoutList) && TryoutList.length > 0 && firstLoad === 0) {
      console.log('TryoutList:', TryoutList);
      let selectedId: string | undefined;

      if (TryoutList.length > 1) {
        selectedId = TryoutList[1]?.id;
        console.log(
          `Setting selectedTryOut to TryoutList[1].id: ${selectedId}`,
        );
      } else {
        selectedId = TryoutList[0]?.id;
        console.log(
          `Setting selectedTryOut to TryoutList[0].id: ${selectedId}`,
        );
      }

      if (selectedId) {
        setSelectedTryOut(selectedId);
        setFirstLoad(1);
      } else {
        console.warn('Selected TryOut ID is undefined.');
      }
    }
  }, [TryoutList, firstLoad, setSelectedTryOut]);

  if (TryoutListIsError) return <div className="">Error...</div>;

  return (
    <Card className="flex h-full w-full flex-col bg-transparent border-none">
      <CardContent className="flex-grow overflow-hidden p-2">
        <div
          id="tryout-selector"
          className="scrollable-content h-fit md:h-[300px] max-h-[300px] space-y-2 overflow-y-scroll pr-2"
        >
          {TryoutList?.map((tryOut) => (
            <Button
              key={tryOut.id}
              className={cn(
                'h-auto w-full justify-start px-4 py-3 text-left bg-white text-black hover:bg-main/85 hover:text-white border rounded-xl',
                selectedTryOut === tryOut.id && 'text-white bg-main',
              )}
              onClick={() => setSelectedTryOut(tryOut.id)}
            >
              <div className="flex w-full flex-col items-start gap-1">
                <span className="font-medium">{tryOut.title}</span>
                <div
                  className={cn(
                    'flex items-center gap-4 text-xs text-muted-foreground',
                    selectedTryOut === tryOut.id && 'text-white',
                  )}
                >
                  <div className="flex items-center gap-1">
                    <IconTimer2 className="h-4 w-4" />
                    <span>{getDateStringShort(tryOut.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconUserAdmin className="h-4 w-4" />
                    <span>{tryOut._count.TryoutResult}</span>
                  </div>
                </div>
              </div>
            </Button>
          ))}
          {TryoutListIsLoading &&
            Array.from({ length: 8 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-[60px] w-full"
              />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default TryOutSelector;
