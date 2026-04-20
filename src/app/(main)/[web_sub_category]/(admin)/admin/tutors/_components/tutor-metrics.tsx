'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGet } from '@/lib/fetch-helper/useGet';
import {
  BookOpen,
  LucideProps,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useState,
} from 'react';

type MetricsType = {
  title: string;
  value: number;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
  color: string;
  bgColor: string;
  description: string;
};

export function TutorMetrics() {
  // const activeInstructors = instructor.filter((tutor) => tutor.status).length;
  // const inactiveInstructors = instructor.filter(
  //   (tutor) => !tutor.status,
  // ).length;
  // const totalClasses = instructor.reduce(
  //   (sum, tutor) => sum + tutor.totalLiveClass,
  //   0,
  // );
  // const averageRating = '5.0';

  const { data: SummaryInstructor } = useGet<{
    totalTutors: number;
    totalTutorsActive: number;
    totalTutorsInActive: number;
    totalLiveClass: number;
  }>('/instructor/getSummaryInstructor');

  const [metrics, setMetrics] = useState<MetricsType[]>([
    {
      title: 'Total Tutor',
      value: 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: `Total tutor yang tersedia`,
    },
    {
      title: 'Tutor Aktif',
      value: 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Tutor yang tersedia',
    },
    {
      title: 'Tutor Tidak Aktif',
      value: 0,
      icon: TrendingDown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Tutor yang tersedia',
    },
    {
      title: 'Total Kelas',
      value: 0,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Total kelas yang sudah diajar',
    },
  ]);

  useEffect(() => {
    if (SummaryInstructor) {
      setMetrics((prev) =>
        prev.map((item, index) => {
          if (index === 0) {
            return {
              ...item,
              value: SummaryInstructor.totalTutors,
            };
          }
          if (index === 1) {
            return {
              ...item,
              value: SummaryInstructor.totalTutorsActive,
            };
          }
          if (index === 2) {
            return {
              ...item,
              value: SummaryInstructor.totalTutorsInActive,
            };
          }
          if (index === 3) {
            return {
              ...item,
              value: SummaryInstructor.totalLiveClass,
            };
          }
          return item;
        }),
      );
    }
  }, [SummaryInstructor]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-3xl ${metric.bgColor}`}>
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
