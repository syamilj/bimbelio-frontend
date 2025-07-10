'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Star, TrendingUp, Users } from 'lucide-react';
import { InstructorsType } from '../page';

interface Props {
  instructor: InstructorsType;
}

export function TutorMetrics({ instructor }: Props) {
  const activeInstructors = instructor.filter((tutor) => tutor.status).length;
  const inactiveInstructors = instructor.filter(
    (tutor) => !tutor.status,
  ).length;
  const totalClasses = instructor.reduce(
    (sum, tutor) => sum + tutor.totalLiveClass,
    0,
  );
  const averageRating = '5.0';

  const metrics = [
    {
      title: 'Total Tutor',
      value: instructor.length.toString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: `${activeInstructors} aktif, ${inactiveInstructors} tidak aktif`,
    },
    {
      title: 'Rating Rata-rata',
      value: averageRating,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      description: 'Rating dari semua tutor',
    },
    {
      title: 'Total Kelas',
      value: totalClasses.toString(),
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Total kelas yang sudah diajar',
    },
    {
      title: 'Tutor Aktif',
      value: activeInstructors.toString(),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Tutor yang tersedia',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {metric.value}
            </div>
            <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
