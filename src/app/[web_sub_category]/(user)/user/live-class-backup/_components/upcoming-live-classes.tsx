'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import {
  formatDateTime,
  formatDuration,
  MockLiveClass,
} from '@/lib/mock-data/live-class';
import { Calendar, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { LiveClassAvailableType } from '../_type';

// Mock enrolled classes
const mockEnrolledClassIds = ['1', '2', '4'];

export function UpcomingLiveClasses({
  data,
}: {
  data: LiveClassAvailableType[];
}) {
  // Filter untuk kelas yang terdaftar dan akan berlangsung
  const upcomingClasses = data.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  const getTimeUntilClass = (scheduleDate: Date) => {
    const now = new Date();
    const diff = scheduleDate.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} hari lagi`;
    if (hours > 0) return `${hours} jam lagi`;
    if (minutes > 0) return `${minutes} menit lagi`;
    return 'Sekarang';
  };

  const getUrgencyColor = (scheduleDate: Date) => {
    const now = new Date();
    const diff = scheduleDate.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes <= 0) return 'bg-red-500';
    if (minutes <= 30) return 'bg-orange-500';
    if (minutes <= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const canJoinNow = (liveClass: MockLiveClass) => {
    return liveClass.status === 'ONGOING';
  };

  const handleJoinClass = (liveClass: MockLiveClass) => {
    window.location.href = `/${website_sub_category_id}/user/live-class/join/${liveClass.id}`;
  };

  if (upcomingClasses.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Kelas Mendatang
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingClasses.map((liveClass) => (
            <div
              key={liveClass.id}
              className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Urgency Indicator */}
              <div className="shrink-0">
                <div
                  className={`w-3 h-3 rounded-full ${getUrgencyColor(new Date(liveClass.startDate))}`}
                />
              </div>

              {/* Class Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate">
                    {liveClass.title}
                  </h4>
                  {liveClass.status === 'ONGOING' && (
                    <Badge
                      variant="destructive"
                      className="text-xs"
                    >
                      LIVE
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDateTime(liveClass.startDate)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {formatDuration(liveClass.duration)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={liveClass.Instructor.image || undefined}
                      />
                      <AvatarFallback className="text-xs">
                        {liveClass.Instructor.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-600">
                      {liveClass.Instructor.name}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-gray-900">
                    {getTimeUntilClass(new Date(liveClass.startDate))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link
                    href={`/${website_sub_category_id}/user/live-class/${liveClass.id}`}
                  >
                    Detail
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
