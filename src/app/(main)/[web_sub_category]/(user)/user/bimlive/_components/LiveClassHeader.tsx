'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  SectionHeader,
  StatCard,
  StatCardGrid,
  StatCardGridItem,
} from '@/components/ds';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Target,
  Timer,
  UserCheck,
  XCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { LiveLearningDataType } from './live-class-types';
import { UpcomingCard } from './upcoming-card';

interface AttendanceSummary {
  total: number;
  present: number;
  late: number;
  absent: number;
  upcoming: number;
  attendanceRate: number;
}

interface LiveClassHeaderProps {
  typeLabel: string;
  TypeIcon: LucideIcon;
  mainColor: string;
  secondaryColor: string;
  attendanceSummary?: AttendanceSummary;
  upcomingClasses?: LiveLearningDataType[];
  onViewAllClick: () => void;
}

export function LiveClassHeader({
  typeLabel,
  TypeIcon,
  mainColor,
  secondaryColor,
  attendanceSummary,
  upcomingClasses,
  onViewAllClick,
}: LiveClassHeaderProps) {
  return (
    <Card className="bg-white shadow-sm border-2 border-gray-100 rounded-3xl overflow-hidden mb-8">
      <CardHeader
        className="pb-6 border-b-2 border-gray-100 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
        }}
      >
        <div className="relative z-10">
          <CardTitle className="text-3xl font-black flex items-center gap-4 text-gray-900">
            <div
              className="w-12 h-12 rounded-3xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <TypeIcon
                className="w-6 h-6"
                style={{ color: mainColor }}
              />
            </div>
            {typeLabel} Dashboard
          </CardTitle>
          <CardDescription className="text-lg mt-3 text-gray-500 font-medium">
            Ikuti kelas langsung dengan tutor ahli dan tingkatkan persiapan
            ujian Anda
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Attendance Stats */}
        {attendanceSummary && attendanceSummary.total > 0 && (
          <div className="mb-6">
            <SectionHeader
              icon={UserCheck}
              iconColor="emerald"
              title="Statistik Kehadiran"
            />
            <StatCardGrid cols={5} className="mt-3">
              <StatCardGridItem>
                <StatCard
                  icon={CheckCircle2}
                  color="emerald"
                  value={attendanceSummary.present}
                  label="Hadir"
                />
              </StatCardGridItem>
              <StatCardGridItem>
                <StatCard
                  icon={AlertCircle}
                  color="amber"
                  value={attendanceSummary.late}
                  label="Terlambat"
                />
              </StatCardGridItem>
              <StatCardGridItem>
                <StatCard
                  icon={XCircle}
                  color="red"
                  value={attendanceSummary.absent}
                  label="Tidak Hadir"
                />
              </StatCardGridItem>
              <StatCardGridItem>
                <StatCard
                  icon={Clock}
                  color="blue"
                  value={attendanceSummary.upcoming}
                  label="Akan Datang"
                />
              </StatCardGridItem>
              <StatCardGridItem>
                <StatCard
                  icon={Target}
                  color="purple"
                  value={`${attendanceSummary.attendanceRate}%`}
                  label="Tingkat Kehadiran"
                />
              </StatCardGridItem>
            </StatCardGrid>
          </div>
        )}

        {/* Upcoming Live Classes Preview */}
        {upcomingClasses && upcomingClasses.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg">
                  <Timer className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    {typeLabel} Mendatang
                  </h3>
                  <p className="text-sm text-gray-500">
                    {upcomingClasses.length} kelas tersedia
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 font-bold hover:bg-blue-50"
                onClick={onViewAllClick}
              >
                Lihat Semua →
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {upcomingClasses.slice(0, 4).map((liveClass, index) => (
                <UpcomingCard
                  key={liveClass.id}
                  liveClass={liveClass}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
