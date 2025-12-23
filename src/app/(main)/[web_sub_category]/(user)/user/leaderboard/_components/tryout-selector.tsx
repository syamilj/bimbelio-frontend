'use client';

import { useLeaderboardContext } from '@/app/(main)/[web_sub_category]/(user)/user/leaderboard/_components/provider-leaderboard';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn, getDateStringShort } from '@/lib/utils';
import { Calendar, Users } from 'lucide-react';
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
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { selectedTryOut, setSelectedTryOut } = useLeaderboardContext();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const [firstLoad, setFirstLoad] = useState<number>(0);

  const [TryoutList, setTryoutList] = useState<TryoutListType[]>([]);
  const [TryoutListIsLoading, setTryoutListIsLoading] = useState<boolean>(true);
  const [TryoutListIsError, setTryoutListIsError] = useState<boolean>(false);

  useEffect(() => {
    if (!session) return;
    getGeneral(`/leaderboard/getTryoutList?userId=${session.user.id}`, {
      setData: setTryoutList,
      setLoading: setTryoutListIsLoading,
      onError() {
        setTryoutListIsError(true);
      },
    });
  }, [session]);

  useEffect(() => {
    if (Array.isArray(TryoutList) && TryoutList.length > 0 && firstLoad === 0) {
      let selectedId: string | undefined;

      if (TryoutList.length > 1) {
        selectedId = TryoutList[1]?.id;
      } else {
        selectedId = TryoutList[0]?.id;
      }

      if (selectedId) {
        setSelectedTryOut(selectedId);
        setFirstLoad(1);
      } else {
        console.warn('Selected TryOut ID is undefined.');
      }
    }
  }, [TryoutList, firstLoad, setSelectedTryOut]);

  if (TryoutListIsError) {
    return (
      <Card className="h-full border-2 border-red-200 bg-red-50">
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-red-600 font-medium">Gagal memuat data try out</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-white shadow-sm border-2 border-gray-100 rounded-3xl overflow-hidden">
      <CardHeader className="pb-4">
        <div>
          <CardTitle className="text-lg font-black text-gray-900 flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: mainColor }}
            >
              <Calendar className="w-4 h-4 text-white" />
            </div>
            Pilih Try Out
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Pilih try out untuk melihat leaderboard
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-0 grow overflow-hidden">
        <ScrollArea className="h-[400px] px-4 pb-4">
          <div className="space-y-3">
            {TryoutList?.map((tryOut) => (
              <Button
                key={tryOut.id}
                variant="ghost"
                className={cn(
                  'w-full h-auto justify-start p-4 text-left rounded-2xl border-2 transition-all duration-300 hover:shadow-sm',
                  selectedTryOut === tryOut.id
                    ? 'shadow-sm'
                    : 'border-gray-100 hover:border-gray-200 bg-white',
                )}
                style={{
                  backgroundColor:
                    selectedTryOut === tryOut.id ? mainColor : undefined,
                  color: selectedTryOut === tryOut.id ? 'white' : undefined,
                  borderColor:
                    selectedTryOut === tryOut.id ? mainColor : undefined,
                }}
                onClick={() => setSelectedTryOut(tryOut.id)}
              >
                <div className="flex w-full flex-col items-start gap-2">
                  <span className="font-bold text-sm leading-tight">
                    {tryOut.title}
                  </span>
                  <div className="flex items-center justify-between w-full">
                    <div
                      className={cn(
                        'flex items-center gap-1 text-xs font-medium',
                        selectedTryOut === tryOut.id
                          ? 'text-white/80'
                          : 'text-gray-500',
                      )}
                    >
                      <Calendar className="w-3 h-3" />
                      <span>{getDateStringShort(tryOut.startDate)}</span>
                    </div>
                    <div
                      className={cn(
                        'flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg',
                        selectedTryOut === tryOut.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-50 text-gray-700 border border-gray-200',
                      )}
                    >
                      <Users className="w-3 h-3" />
                      <span>{tryOut._count.TryoutResult}</span>
                    </div>
                  </div>
                </div>
              </Button>
            ))}

            {TryoutListIsLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl border-2 border-gray-100 bg-white"
                >
                  <Skeleton className="h-4 w-3/4 mb-3 rounded-lg" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-3 w-20 rounded-lg" />
                    <Skeleton className="h-6 w-12 rounded-xl" />
                  </div>
                </div>
              ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default TryOutSelector;
