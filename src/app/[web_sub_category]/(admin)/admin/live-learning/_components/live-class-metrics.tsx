'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGet } from '@/lib/fetch-helper/useGet';
import {
  mockLiveClasses,
  mockLiveClassParticipants,
} from '@/lib/mock-data/live-class';
import { Calendar, Clock, LucideProps, TrendingUp, Users } from 'lucide-react';
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

export function LiveClassMetrics() {
  // Calculate metrics from mock data
  const totalClasses = mockLiveClasses.length;
  const activeClasses = mockLiveClasses.filter(
    (c) => c.status === 'ONGOING',
  ).length;
  const scheduledClasses = mockLiveClasses.filter(
    (c) => c.status === 'SCHEDULED',
  ).length;
  const completedToday = mockLiveClasses.filter((c) => {
    const today = new Date();
    const classDate = new Date(c.scheduleDate);
    return (
      c.status === 'COMPLETED' &&
      classDate.toDateString() === today.toDateString()
    );
  }).length;
  const averageParticipants = Math.round(
    mockLiveClasses.reduce((sum, c) => sum + c.currentParticipants, 0) /
      totalClasses,
  );

  // Calculate participant metrics
  const totalParticipants = mockLiveClassParticipants.length;
  const registeredParticipants = mockLiveClassParticipants.filter(
    (p) => p.status === 'registered',
  ).length;
  const invitedParticipants = mockLiveClassParticipants.filter(
    (p) => p.status === 'invited',
  ).length;

  const { data: SummaryLiveClass } = useGet<{
    total: number;
    totalWillCome: number;
    totalOnGoing: number;
    totalCompleted: number;
  }>('/liveClass/getSummaryLiveClass');

  const [metrics, setMetrics] = useState<MetricsType[]>([
    {
      title: 'Total Kelas',
      value: 0,
      description: 'Semua kelas live',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Sedang Berlangsung',
      value: 0,
      description: 'Live class yang sedang berlangsung',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Akan datang',
      value: 0,
      description: 'Live class yang akan datang',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Selesai',
      value: 0,
      description: 'Live class yang sudah selesai',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]);

  useEffect(() => {
    if (SummaryLiveClass) {
      setMetrics((prev) =>
        prev.map((item, index) => {
          if (index === 0) {
            return {
              ...item,
              value: SummaryLiveClass.total,
            };
          }
          if (index === 1) {
            return {
              ...item,
              value: SummaryLiveClass.totalOnGoing,
            };
          }
          if (index === 2) {
            return {
              ...item,
              value: SummaryLiveClass.totalWillCome,
            };
          }
          if (index === 3) {
            return {
              ...item,
              value: SummaryLiveClass.totalCompleted,
            };
          }
          return item;
        }),
      );
    }
  }, [SummaryLiveClass]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card
            key={metric.title}
            className="border-0 shadow-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <div
                className={`w-10 h-10 rounded-xl ${metric.bgColor} flex items-center justify-center`}
              >
                <Icon className={`w-5 h-5 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {metric.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
