'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { getGeneralAdvanced } from '@/lib/fetch-helper/fetch-helper-advanced';
import { Sparkles, Star, Trophy } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { type Dispatch, type SetStateAction } from 'react';
import CardNotFound from '../../../_components/card-not-found';
import CardTryOut from './card-tryout';

type Props = {
  setOpenExternal: Dispatch<SetStateAction<boolean>>;
  openExternal: boolean;
};

export default function DialogRecomendation({
  openExternal,
  setOpenExternal,
}: Props) {
  const searchParams = useSearchParams();
  const register_tryout = searchParams?.get('register_tryout');
  const router = useRouter();
  const { data: session } = useSession();

  const { data, isLoading, fetchData } = getGeneralAdvanced(
    '/tryout/getTryOutCardUpcomingAnotherWeb',
    {
      params: { userId: session?.user.id },
      useEffectDependencies: [session],
    },
  );

  return (
    <Dialog
      open={openExternal}
      onOpenChange={(value) => {
        setOpenExternal(value);
        if (register_tryout) {
          router.push(`${window.location.pathname}`);
        }
      }}
    >
      <DialogContent className="max-w-[1200px] w-[90%] xl:w-full overflow-y-auto max-h-[90vh] bg-workspace border-0 shadow-2xl">
        <div className="relative text-center mb-8 pt-4">
          <div className="absolute top-0 left-1/4 animate-bounce">
            <Star className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="absolute top-2 right-1/4 animate-pulse delay-300">
            <Sparkles className="w-5 h-5 text-blue-500" />
          </div>

          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-4 shadow-xl">
            <Trophy className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-400 to-cyan-600 bg-clip-text text-transparent mb-2">
            🎉 Rekomendasi Tryout Lainnya
          </h1>
          <p className="text-gray-600 text-lg">
            Temukan tryout terbaik untuk meningkatkan kemampuanmu! ✨
          </p>

          <div className="flex items-center justify-center mt-4 mb-2">
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
            <Sparkles className="w-4 h-4 text-blue-500 mx-2" />
            <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
          </div>
        </div>

        <div className="flex flex-col gap-[1rem]">
          {!isLoading && data && data.length > 0 && (
            <div className="flex flex-wrap gap-6 justify-center">
              <CardTryOut
                data={data}
                userTryOutId={session?.user.userTryOutId || ''}
                isPrivate
                refresh={fetchData}
                reloadHref
              />
            </div>
          )}
          {!isLoading && data?.length === 0 && (
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
                    'h-[160px] mb:h-[200px] md:h-[200px] md2:h-[180px] xl:h-[250px] xxxl:h-[300px]'
                  }
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center items-center mt-8 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-gray-500">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Semangat belajar! 🚀</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
