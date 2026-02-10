'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { formatDateTime } from '@/lib/utils';
import { Calendar, Eye } from 'lucide-react';
import Link from 'next/link';
import { useCountdown } from './live-class-hooks';
import type { LiveLearningDataType } from './live-class-types';

export const UpcomingCard = ({
  liveClass,
  index,
}: {
  liveClass: LiveLearningDataType;
  index?: number;
}) => {
  const timeLeft = useCountdown(liveClass.startDate);
  const colors = [
    {
      bg: 'from-blue-500 to-indigo-600',
      light: 'bg-blue-50 border-blue-200',
      text: 'text-blue-700',
    },
    {
      bg: 'from-purple-500 to-pink-600',
      light: 'bg-purple-50 border-purple-200',
      text: 'text-purple-700',
    },
    {
      bg: 'from-emerald-500 to-teal-600',
      light: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-700',
    },
    {
      bg: 'from-orange-500 to-red-600',
      light: 'bg-orange-50 border-orange-200',
      text: 'text-orange-700',
    },
  ];
  const color = colors[(index ?? 0) % colors.length];

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 border-2 ${color.light} rounded-3xl overflow-hidden`}
    >
      <CardContent className="p-0">
        <div className={`h-2 bg-gradient-to-r ${color.bg}`} />
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <Badge
              className={`${color.light} ${color.text} border font-bold text-xs`}
            >
              {liveClass.status}
            </Badge>
            <span className="text-xs font-mono text-gray-400">
              #{liveClass.id.slice(-4).toUpperCase()}
            </span>
          </div>

          <h4 className="font-black text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {liveClass.title}
          </h4>

          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 border border-gray-200">
              <AvatarImage src={liveClass.Instructor.image || undefined} />
              <AvatarFallback className="text-xs font-bold">
                {liveClass.Instructor.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-gray-700 truncate">
              {liveClass.Instructor.name}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>{formatDateTime(liveClass.startDate)}</span>
          </div>

          {!timeLeft.isExpired && (
            <div className="bg-gray-50 rounded-3xl p-2 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1 text-center font-semibold">
                Dimulai dalam
              </div>
              <div className="flex justify-center gap-2">
                {timeLeft.days > 0 && (
                  <div className="text-center">
                    <div className="text-lg font-black text-gray-900">
                      {timeLeft.days}
                    </div>
                    <div className="text-xs text-gray-500">hari</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-lg font-black text-gray-900">
                    {timeLeft.hours.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-500">jam</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-black text-gray-900">
                    {timeLeft.minutes.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-500">mnt</div>
                </div>
              </div>
            </div>
          )}

          <Link
            href={`/${website_sub_category_id}/user/bimlive/detail/${liveClass.id}`}
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full h-9 font-bold rounded-3xl border-2 hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              Lihat Detail
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
