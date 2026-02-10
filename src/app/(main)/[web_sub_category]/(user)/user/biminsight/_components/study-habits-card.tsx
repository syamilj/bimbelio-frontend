'use client';

import React from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Award,
  Calendar,
  Clock,
  Flame,
  LibraryBigIcon,
  Trophy,
  Zap,
} from 'lucide-react';

export const StudyHabitsCard: React.FC<{
  studyHabits: any;
  mainColor: string;
  secondaryColor: string;
}> = ({ studyHabits, mainColor, secondaryColor }) => {
  const milestones = [
    {
      label: 'Mulai',
      value: 0,
      icon: Clock,
      color: 'text-gray-400',
    },
    {
      label: '10 Jam',
      value: 10,
      icon: Award,
      color: 'text-blue-500',
      achieved: studyHabits.totalHoursStudied >= 10,
    },
    {
      label: '30 Jam',
      value: 30,
      icon: Trophy,
      color: 'text-yellow-500',
      achieved: studyHabits.totalHoursStudied >= 30,
    },
    {
      label: studyHabits.totalHoursStudied?.toFixed(0) + ' Jam',
      value: studyHabits.totalHoursStudied,
      icon: Zap,
      color: 'text-orange-500',
      achieved: true,
    },
  ];

  const progress = Math.min((studyHabits.totalHoursStudied / 50) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Timeline Progress */}
      <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <LibraryBigIcon
              className="w-5 h-5"
              style={{ color: mainColor }}
            />
            Kebiasaan Belajar
          </CardTitle>
          <CardDescription>Progres perjalanan belajar kamu</CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Total Jam Belajar
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: mainColor }}
              >
                {studyHabits.totalHoursStudied?.toFixed(1)} / 50 jam
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
                }}
              />
            </div>
          </div>

          {/* Milestone Timeline */}
          <div className="flex justify-between items-start">
            {milestones.map((milestone, idx) => {
              const Icon = milestone.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center flex-1"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                      milestone.achieved ? 'shadow-lg' : 'bg-gray-200'
                    }`}
                    style={{
                      backgroundColor: milestone.achieved
                        ? `${mainColor}20`
                        : undefined,
                    }}
                  >
                    <Icon
                      size={18}
                      className={
                        milestone.achieved ? milestone.color : 'text-gray-400'
                      }
                    />
                  </div>
                  <span className="text-xs font-semibold text-center text-gray-700">
                    {milestone.label}
                  </span>
                  {milestone.achieved && (
                    <span className="text-xs text-green-600 mt-1">✓</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="p-3 rounded-3xl"
              style={{ backgroundColor: `${mainColor}10` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Flame
                  size={16}
                  style={{ color: mainColor }}
                />
                <span className="text-xs text-gray-600">Streak</span>
              </div>
              <div
                className="text-xl font-bold"
                style={{ color: mainColor }}
              >
                {studyHabits.longestStreak} hari
              </div>
            </div>
            <div
              className="p-3 rounded-3xl"
              style={{ backgroundColor: `${secondaryColor}10` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Clock
                  size={16}
                  style={{ color: secondaryColor }}
                />
                <span className="text-xs text-gray-600">Rata-rata</span>
              </div>
              <div
                className="text-xl font-bold"
                style={{ color: secondaryColor }}
              >
                {studyHabits.averageDailyStudyTime?.toFixed(1)} jam
              </div>
            </div>
            <div
              className="p-3 rounded-3xl col-span-2"
              style={{ backgroundColor: `${mainColor}08` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Calendar
                  size={16}
                  style={{ color: mainColor }}
                />
                <span className="text-xs text-gray-600">Minggu ini</span>
              </div>
              <div className="flex justify-between items-end">
                <div
                  className="text-2xl font-bold"
                  style={{ color: mainColor }}
                >
                  {studyHabits.hoursThisWeek} jam
                </div>
                <Badge
                  className="text-white border-0"
                  style={{ backgroundColor: mainColor }}
                >
                  Hari terbaik: {studyHabits.mostProductiveDay}
                </Badge>
              </div>
            </div>
          </div>

          {/* Effective Time */}
          <div
            className="p-4 rounded-3xl border-2"
            style={{
              borderColor: `${mainColor}30`,
              backgroundColor: `${mainColor}05`,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Waktu Belajar Paling Efektif
              </span>
              <Badge
                className="text-white border-0"
                style={{ backgroundColor: mainColor }}
              >
                {studyHabits.mostEffectiveTime}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
