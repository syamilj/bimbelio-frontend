'use client';

import { useLeaderboardContext } from '@/app/[web_sub_category]/(user)/user/leaderboard/_components/provider-leaderboard';
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
    <Card className="h-full bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
      <CardHeader
        className="pb-4 relative overflow-hidden"
        style={{ backgroundColor: `${mainColor}05` }}
      >
        <div className="relative z-10">
          <CardTitle
            className="text-lg font-bold flex items-center gap-2"
            style={{ color: mainColor }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Calendar
                className="w-4 h-4"
                style={{ color: mainColor }}
              />
            </div>
            Pilih Try Out
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Pilih try out untuk melihat leaderboard
          </p>
        </div>
        {/* Decorative elements */}
        <div
          className="absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-10"
          style={{ backgroundColor: mainColor }}
        />
      </CardHeader>

      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-[400px] px-4 pb-4">
          <div className="space-y-3">
            {TryoutList?.map((tryOut) => (
              <Button
                key={tryOut.id}
                variant="ghost"
                className={cn(
                  'w-full h-auto justify-start p-4 text-left rounded-xl border-2 transition-all duration-200 hover:shadow-md',
                  selectedTryOut === tryOut.id
                    ? 'shadow-md border-transparent'
                    : 'border-gray-200 hover:border-gray-300 bg-white',
                )}
                style={{
                  backgroundColor:
                    selectedTryOut === tryOut.id ? mainColor : undefined,
                  color: selectedTryOut === tryOut.id ? 'white' : undefined,
                }}
                onClick={() => setSelectedTryOut(tryOut.id)}
              >
                <div className="flex w-full flex-col items-start gap-2">
                  <span className="font-medium text-sm leading-tight">
                    {tryOut.title}
                  </span>
                  <div className="flex items-center justify-between w-full">
                    <div
                      className={cn(
                        'flex items-center gap-1 text-xs',
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
                        'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-xl',
                        selectedTryOut === tryOut.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-gray-600',
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
                  className="p-4 rounded-xl border-2 border-gray-200 bg-white"
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
