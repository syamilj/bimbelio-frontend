'use client';

import React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  ActivityIcon,
  Brain,
  FileText,
  Highlighter,
  PenTool,
} from 'lucide-react';

import { LearningDataType } from './report-types';

export const LearningActivityCard: React.FC<{
  data: LearningDataType;
  mainColor: string;
  secondaryColor: string;
}> = ({ data, mainColor }) => {
  const activities = [
    {
      icon: FileText,
      value: data.documentsRead,
      label: 'Dokumen',
      increase: data.documentsReadIncrease,
      color: '#3B82F6',
      lightColor: '#DBEAFE',
    },
    {
      icon: PenTool,
      value: data.notesCreated,
      label: 'Catatan',
      increase: data.notesCreatedIncrease,
      color: '#8B5CF6',
      lightColor: '#EDE9FE',
    },
    {
      icon: Highlighter,
      value: data.highlightsMade,
      label: 'Highlight',
      increase: data.highlightsMadeIncrease,
      color: '#EC4899',
      lightColor: '#FCE7F3',
    },
    {
      icon: Brain,
      value: data.quizStudied,
      label: 'Quiz',
      increase: data.quizStudiedIncrease,
      color: '#F59E0B',
      lightColor: '#FFFBEB',
    },
  ];

  return (
    <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <ActivityIcon
            className="w-5 h-5"
            style={{ color: mainColor }}
          />
          Aktivitas Belajar
        </CardTitle>
        <CardDescription>Statistik kegiatan belajar kamu</CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {activities.map((activity, idx) => {
            const Icon = activity.icon;
            // Calculate progress percentage (max 100 items, normalized)
            const maxValue = 100;
            const progressPercent = Math.min(
              (activity.value / maxValue) * 100,
              100,
            );
            const circumference = 2 * Math.PI * 45; // radius 45
            const offset =
              circumference - (progressPercent / 100) * circumference;

            return (
              <div
                key={idx}
                className="flex flex-col items-center p-4 rounded-3xl transition-all hover:shadow-md"
                style={{ backgroundColor: activity.lightColor }}
              >
                {/* Circular Progress */}
                <div className="relative w-24 h-24 mb-3">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={activity.color}
                      strokeWidth="3"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  {/* Center value */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Icon
                      size={20}
                      style={{ color: activity.color }}
                      className="mb-1"
                    />
                    <span
                      className="text-sm font-bold"
                      style={{ color: activity.color }}
                    >
                      {activity.value}
                    </span>
                  </div>
                </div>

                {/* Label */}
                <p className="text-sm font-semibold text-gray-700 text-center">
                  {activity.label}
                </p>

                {/* Change indicator */}
                <div
                  className={`text-xs font-medium mt-1 ${
                    activity.increase >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {activity.increase >= 0 ? '↑' : '↓'}{' '}
                  {Math.abs(activity.increase)}%
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div
          className="mt-6 p-4 rounded-3xl border-2"
          style={{
            borderColor: `${mainColor}30`,
            backgroundColor: `${mainColor}05`,
          }}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 font-medium">
              Total Aktivitas Minggu Ini
            </span>
            <span
              className="text-lg font-bold"
              style={{ color: mainColor }}
            >
              {data.documentsRead +
                data.notesCreated +
                data.highlightsMade +
                data.quizStudied}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
