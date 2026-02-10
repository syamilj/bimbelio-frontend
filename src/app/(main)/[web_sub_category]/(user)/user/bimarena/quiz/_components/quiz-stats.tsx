'use client';

import {
  StatCard,
  StatCardGrid,
  StatCardGridItem,
} from '@/components/ds';
import {
  CheckCircle2,
  Swords,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import { useQuizProvider } from '../_provider/_provider';
import {
  calculateBeatenPercentage,
  calculateCompletionPercentage,
  formatNumber,
} from './quiz-dummy';

export function QuizStats() {
  const {
    useUserStatistic: { UserStatistic },
  } = useQuizProvider();

  const userStats = UserStatistic?.userStatistic;
  const beatenCount = userStats?.userEliminate || 0;
  const completedQuizzes = userStats?.totalTryoutFinished || 0;
  const totalQuizzes = userStats?.totalTryout || 0;
  const accuracy = userStats?.accuracy || 0;

  return (
    <StatCardGrid cols={5}>
      <StatCardGridItem>
        <StatCard
          icon={Trophy}
          color="amber"
          label="Peringkat Battle"
          value={`#${userStats?.rank || '-'}`}
          subtitle={`dari ${userStats?.totalParticipant || '-'} pejuang`}
        />
      </StatCardGridItem>
      <StatCardGridItem>
        <StatCard
          icon={Swords}
          color="pink"
          label="Pejuang Dikalahkan"
          value={formatNumber(beatenCount)}
          subtitle={`${calculateBeatenPercentage(beatenCount)}% peserta`}
        />
      </StatCardGridItem>
      <StatCardGridItem>
        <StatCard
          icon={Zap}
          color="blue"
          label="Total Skor"
          value={formatNumber(userStats?.totalScore || 0)}
          subtitle="Gap rank atas: -"
        />
      </StatCardGridItem>
      <StatCardGridItem>
        <StatCard
          icon={Target}
          color="emerald"
          label="Quiz Selesai"
          value={`${completedQuizzes}/${totalQuizzes}`}
          subtitle={`${calculateCompletionPercentage(completedQuizzes, totalQuizzes)}% complete`}
        />
      </StatCardGridItem>
      <StatCardGridItem>
        <StatCard
          icon={CheckCircle2}
          color="emerald"
          label="Akurasi Tempur"
          value={`${accuracy.toFixed(1)}%`}
          subtitle={`${accuracy} hit`}
        />
      </StatCardGridItem>
    </StatCardGrid>
  );
}
