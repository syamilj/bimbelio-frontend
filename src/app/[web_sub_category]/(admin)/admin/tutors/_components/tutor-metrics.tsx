'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MockTutor } from '@/lib/mock-data/live-class';
import { BookOpen, Star, TrendingUp, Users } from 'lucide-react';

interface TutorMetricsProps {
  tutors: MockTutor[];
}

export function TutorMetrics({ tutors }: TutorMetricsProps) {
  const activeTutors = tutors.filter((tutor) => tutor.isActive).length;
  const inactiveTutors = tutors.filter((tutor) => !tutor.isActive).length;
  const totalClasses = tutors.reduce(
    (sum, tutor) => sum + tutor.totalClasses,
    0,
  );
  const averageRating =
    tutors.length > 0
      ? (
          tutors.reduce((sum, tutor) => sum + tutor.rating, 0) / tutors.length
        ).toFixed(1)
      : '0.0';

  const metrics = [
    {
      title: 'Total Tutor',
      value: tutors.length.toString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: `${activeTutors} aktif, ${inactiveTutors} tidak aktif`,
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
      value: activeTutors.toString(),
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
