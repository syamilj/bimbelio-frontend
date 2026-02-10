'use client';

import {
  SectionHeader,
  StatCard,
  StatCardGrid,
  StatCardGridItem,
} from '@/components/ds';
import { BimArena, BimCourse } from '@/components/ui/bim-brand';
import {
  Award,
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react';

interface BimQuickStatsOverviewProps {
  stats: {
    studyHours: number;
    studyHoursThisWeek: number;
    totalScore: number;
    averageScore: number;
    rank: number;
    rankFrom: number;
    previousRank: number;
    rankChange: number;
    tryoutsCompleted: number;
    coursesCompleted: number;
    coursesInProgress: number;
    documentsRead: number;
    liveClassesAttended: number;
  };
}

export default function BimQuickStatsOverview({
  stats,
}: BimQuickStatsOverviewProps) {
  const s = {
    studyHours: stats?.studyHours || 0,
    studyHoursThisWeek: stats?.studyHoursThisWeek || 0,
    totalScore: stats?.totalScore || 0,
    averageScore: stats?.averageScore || 0,
    rank: stats?.rank || 0,
    rankFrom: stats?.rankFrom || 0,
    rankChange: stats?.rankChange || 0,
    tryoutsCompleted: stats?.tryoutsCompleted || 0,
    coursesCompleted: stats?.coursesCompleted || 0,
    coursesInProgress: stats?.coursesInProgress || 0,
    documentsRead: stats?.documentsRead || 0,
    liveClassesAttended: stats?.liveClassesAttended || 0,
  };

  return (
    <div className="w-full">
      <SectionHeader
        icon={TrendingUp}
        iconColor="blue"
        title="Statistik Belajar"
      />
      <StatCardGrid cols={6}>
        <StatCardGridItem>
          <StatCard
            icon={Clock}
            color="blue"
            value={Math.floor(s.studyHours)}
            unit="jam"
            label="Jam Belajar"
            subtitle={`+${s.studyHoursThisWeek}j minggu ini`}
          />
        </StatCardGridItem>
        <StatCardGridItem>
          <StatCard
            icon={Target}
            color="emerald"
            value={s.tryoutsCompleted}
            unit="tryout"
            label={
              <>
                <BimArena /> Selesai
              </>
            }
            subtitle={
              s.rank > 0 ? `Peringkat #${s.rank}` : 'Yuk mulai!'
            }
          />
        </StatCardGridItem>
        <StatCardGridItem>
          <StatCard
            icon={TrendingUp}
            color="purple"
            value={s.averageScore > 0 ? Math.round(s.averageScore) : 0}
            label="Rata-rata Skor"
            subtitle={
              s.totalScore > 0
                ? `Total ${s.totalScore} poin`
                : 'Belum ada data'
            }
          />
        </StatCardGridItem>
        <StatCardGridItem>
          <StatCard
            icon={BookOpen}
            color="amber"
            value={s.coursesInProgress}
            unit="kursus"
            label={
              <>
                <BimCourse /> Aktif
              </>
            }
            subtitle={`${s.coursesCompleted} selesai`}
          />
        </StatCardGridItem>
        <StatCardGridItem>
          <StatCard
            icon={Trophy}
            color="pink"
            value={s.rank > 0 ? s.rank : '-'}
            label="Peringkat"
            subtitle={
              s.rankFrom > 0
                ? `dari ${s.rankFrom} • ${s.rankChange > 0 ? `↑${s.rankChange}` : s.rankChange < 0 ? `↓${Math.abs(s.rankChange)}` : '='}`
                : 'Belum ada ranking'
            }
          />
        </StatCardGridItem>
        <StatCardGridItem>
          <StatCard
            icon={Award}
            color="rose"
            value={s.liveClassesAttended + s.documentsRead}
            label="Total Prestasi"
            subtitle={`${s.liveClassesAttended} live class`}
          />
        </StatCardGridItem>
      </StatCardGrid>
    </div>
  );
}
