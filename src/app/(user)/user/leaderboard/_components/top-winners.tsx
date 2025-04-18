"use client";

import { useLeaderboardContext } from "@/app/(user)/user/leaderboard/_components/provider-leaderboard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getGeneral } from "@/lib/fetch-helper";
import { cn } from "@/lib/utils";
import { IconCrown } from "@/styles/icon";
// import { api } from '@/trpc/react';
import Image from "next/image";
import { useEffect, useState } from "react";

export type TopWinnersProp = "1" | "2" | "3" | "4";

type TryoutTop3Type = {
  rank: number;
  totalScore: number;
  averageScore: number;
  name: string;
  school: string | undefined;
  image: string | null;
};

export function TopWinners() {
  const { selectedTryOut: tryoutId } = useLeaderboardContext();

  // const { data: TryoutTop3, isLoading: TryoutTop3IsLoading } =
  //   api.leaderboard.getTryoutRankingTop3.useQuery(
  //     { tryoutId },
  //     { refetchOnWindowFocus: false },
  //   );

  const [TryoutTop3, setTryoutTop3] = useState<TryoutTop3Type[]>([]);
  const [TryoutTop3IsLoading, setTryoutTop3IsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!tryoutId) return;
    getGeneral(`/leaderboard/getTryoutRankingTop3?tryoutId=${tryoutId}`, {
      setData: setTryoutTop3,
      setLoading: setTryoutTop3IsLoading,
    });
  }, [tryoutId]);

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardContent className="p-6">
        {/* <h2 className="mb-6 text-center text-2xl font-bold">
          Pemenang Teratas
        </h2> */}
        <div className="flex items-center justify-center gap-4">
          {TryoutTop3?.map((winner) => (
            <div
              key={winner.rank}
              className={cn(
                `w-full max-w-[200px] ${
                  winner.rank === 1
                    ? "order-2"
                    : winner.rank === 2
                    ? "order-1"
                    : "order-3"
                }`,
                winner.rank !== 1 && "mb-[-6rem]"
              )}
            >
              <div className="relative mx-auto mb-4 h-16 md:h-20 w-16 md:w-20 rounded-full flex justify-center">
                <Image
                  className="rounded-full overflow-hidden"
                  src={`${winner.image}`}
                  alt={`Foto ${winner.name}`}
                  layout="fill"
                  objectFit="cover"
                />
                <div
                  className={`absolute bottom-[-1rem] flex h-10 w-10 items-center justify-center rounded-full font-bold text-white ${
                    winner.rank === 1
                      ? "bg-yellow-500"
                      : winner.rank === 2
                      ? "bg-blue-500"
                      : "bg-red-500"
                  }`}
                >
                  {winner.rank}
                </div>
                {winner.rank === 1 && (
                  <div className="absolute bottom-[calc(100%)] text-yellow-500">
                    <IconCrown className="w-8 h-8" />
                  </div>
                )}
              </div>
              <h3 className="mb-1 text-center text-base font-semibold">
                {winner.name}
              </h3>
              <p className="mb-2 text-center text-sm text-muted-foreground">
                {winner.school}
              </p>
              <div className="text-center text-lg font-bold">
                {winner.averageScore.toFixed(2)}
              </div>
            </div>
          ))}
          {TryoutTop3IsLoading &&
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-4">
                <Skeleton className="h-[40px] w-[40px] rounded-[50%]" />
                <Skeleton className="mt-[-.5rem] h-[80px] w-[80px] rounded-[50%]" />
                <Skeleton className="h-[12px] w-[80px]" />
                <Skeleton className="h-[12px] w-[60px]" />
                <Skeleton className="h-[14px] w-[90px]" />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default TopWinners;
