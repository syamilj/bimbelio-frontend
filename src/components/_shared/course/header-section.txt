'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';
import { StarIcon, TimerIcon, TrendingUpIcon } from 'lucide-react';

export default function HeaderSection() {
  const { data: headingData, isLoading } = api.course.getCourseHeading.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    },
  );

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Pembelajaran</h1>
        <p className="text-muted-foreground">
          Mari lanjutkan perjalanan belajarmu!
        </p>
      </div>

      {!isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatisticItem
            title="Sub Chapter"
            value={`${headingData?.completedSubChapters}/${headingData?.totalSubChapters}`}
            // trend="+5"
            icon={<TrendingUpIcon className="h-4 w-4" />}
            bgColour="bg-blue-100 text-blue-600"
          />
          <StatisticItem
            title="Streak Belajar"
            value={`${headingData?.streak} hari`}
            // trend="+2"
            icon={<TimerIcon className="h-4 w-4" />}
            bgColour="bg-green-100 text-green-600"
          />
          <StatisticItem
            title="Total Jam Belajar"
            value={`${headingData?.totalHours?.toFixed(2)} jam`}
            // trend="+150"
            icon={<StarIcon className="h-4 w-4" />}
            bgColour="bg-yellow-100 text-yellow-600"
          />
          <StatisticItem
            title="Nilai Tryout Terakhir"
            value={`${headingData?.tryoutResults?.score || '-'}`}
            // trend="Naik 3"
            icon={<TrendingUpIcon className="h-4 w-4" />}
            bgColour="bg-purple-100 text-purple-600"
          />
        </div>
      )}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_: any, i: number) => (
            <Skeleton
              key={i}
              className={'h-[102px] md:h-[120px]'}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function StatisticItem({
  title,
  value,
  // trend,
  icon,
  bgColour,
}: {
  title: string;
  value: string;
  // trend: string;
  icon: React.ReactNode;
  bgColour: string;
}) {
  return (
    <Card className={cn('overflow-hidden flex flex-col', bgColour)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <div className="bg-white p-2 rounded-full shadow-sm">{icon}</div>
      </CardHeader>
      <CardContent className="flex flex-col items-start">
        <div className="font-bold text-2xl">{value}</div>
        {/* <Badge
            variant="secondary"
            className="text-green-600 font-medium"
          >
            {trend}
          </Badge> */}
      </CardContent>
    </Card>
  );
}
