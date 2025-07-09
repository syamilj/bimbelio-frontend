'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  mockLiveClasses,
  mockLiveClassParticipants,
} from '@/lib/mock-data/live-class';
import { Calendar, Clock, TrendingUp, Users } from 'lucide-react';

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

  const metrics = [
    {
      title: 'Total Kelas',
      value: totalClasses,
      description: 'Semua kelas live',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Kelas Aktif',
      value: activeClasses,
      description: 'Sedang berlangsung',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Terjadwal',
      value: scheduledClasses,
      description: 'Akan datang',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Total Peserta',
      value: totalParticipants,
      description: 'Semua peserta',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Perlu Undangan',
      value: registeredParticipants,
      description: 'Belum diundang',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Sudah Diundang',
      value: invitedParticipants,
      description: 'Siap join',
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

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
