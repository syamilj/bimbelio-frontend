'use client';

import {
  StatCard,
  StatCardGrid,
  StatCardGridItem,
} from '@/components/ds';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Target, TrendingUp, Trophy } from 'lucide-react';

interface SummaryData {
  TryoutResult: number;
  TryoutUserAnswer: number;
  LastRanking: number;
  AverageScore: number;
  TotalTryout: number;
  AverageSubtestCount: number;
}

interface SummaryQuickStatsProps {
  summary: SummaryData | undefined;
  isLoading: boolean;
  isSNBT: boolean;
}

export function SummaryQuickStats({
  summary,
  isLoading,
  isSNBT,
}: SummaryQuickStatsProps) {
  const rawAvgScore =
    summary && summary.TotalTryout > 0
      ? Math.round(summary.AverageScore / summary.TotalTryout)
      : 0;
  const avgSubtestCount = summary?.AverageSubtestCount || 1;
  const avgScore =
    isSNBT && avgSubtestCount > 1
      ? Math.round(rawAvgScore / avgSubtestCount)
      : rawAvgScore;

  if (isLoading) {
    return (
      <StatCardGrid cols={4}>
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardGridItem key={i}>
            <Skeleton className="h-32 rounded-3xl" />
          </StatCardGridItem>
        ))}
      </StatCardGrid>
    );
  }

  return (
    <StatCardGrid cols={4}>
      <StatCardGridItem>
        <StatCard
          icon={Target}
          color="emerald"
          value={summary?.TryoutResult || 0}
          unit="tryout"
          label="TO Selesai"
          subtitle={
            summary && summary.TotalTryout > 0
              ? `${summary.TotalTryout} dengan hasil`
              : 'Yuk mulai!'
          }
        />
      </StatCardGridItem>
      <StatCardGridItem>
        <StatCard
          icon={BookOpen}
          color="blue"
          value={summary?.TryoutUserAnswer || 0}
          unit="soal"
          label="Total Soal"
          subtitle="dijawab sepanjang waktu"
        />
      </StatCardGridItem>
      <StatCardGridItem>
        <StatCard
          icon={Trophy}
          color="amber"
          value={summary?.LastRanking ? `#${summary.LastRanking}` : '-'}
          label="Peringkat Terakhir"
          subtitle={
            summary?.LastRanking ? 'di tryout terakhir' : 'Belum ada data'
          }
        />
      </StatCardGridItem>
      <StatCardGridItem>
        <StatCard
          icon={TrendingUp}
          color="purple"
          value={avgScore}
          label="Rata-rata Skor"
          subtitle={
            summary && summary.AverageScore > 0
              ? isSNBT
                ? `Skor total ÷ ${avgSubtestCount} subtes`
                : `Total ${summary.AverageScore} poin`
              : 'Belum ada data'
          }
        />
      </StatCardGridItem>
    </StatCardGrid>
  );
}
