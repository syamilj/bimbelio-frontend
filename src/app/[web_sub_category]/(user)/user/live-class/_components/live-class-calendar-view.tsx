'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStatusColor } from '@/lib/utils/live-class';
import { CalendarIcon, Clock, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { LiveClassAvailableType } from '../page';

interface CalendarViewProps {
  liveClass: any[];
  // needsUpgradeClasses: any[];
  onJoin: (liveClass: LiveClassAvailableType) => void;
  onRate: (liveClass: LiveClassAvailableType) => void;
  onUpgrade: (liveClass: any) => void;
}

export function CalendarView({
  liveClass,
  onJoin,
  onRate,
  onUpgrade,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const allClasses = [...liveClass];

  // Group classes by date
  const classesByDate = useMemo(() => {
    const grouped: { [key: string]: any[] } = {};

    allClasses.forEach((liveClass) => {
      const date = new Date(liveClass.startDate).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(liveClass);
    });
    return grouped;
  }, [liveClass]); // Fix the dependency array

  // Generate calendar days for current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 for Sunday, 1 for Monday, etc.

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const monthDays = getDaysInMonth(currentDate);

  const monthName = currentDate.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getClassesForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return classesByDate[dateStr] || [];
  };

  const selectedDateClasses = selectedDate
    ? getClassesForDate(selectedDate)
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900">
                {monthName}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                  className="h-8 w-8 p-0"
                >
                  ←
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                  className="h-8 w-8 p-0"
                >
                  →
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-sm font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((day, index) => {
                if (!day) {
                  return (
                    <div
                      key={index}
                      className="p-2 h-20"
                    ></div>
                  );
                }
                const dayClasses = getClassesForDate(day);
                const isToday =
                  day.toDateString() === new Date().toDateString();
                const isSelected =
                  selectedDate?.toDateString() === day.toDateString();
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={`calendar-day p-2 h-20 border rounded-lg transition-all hover:shadow-md relative ${
                      isSelected
                        ? 'selected bg-blue-100 border-blue-300'
                        : isToday
                          ? 'bg-blue-50 border-blue-200'
                          : dayClasses.length > 0
                            ? 'has-events bg-green-50 border-green-200 hover:bg-green-100'
                            : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {day.getDate()}
                    </div>
                    {dayClasses.length > 0 && (
                      <div className="mt-1">
                        <div className="flex flex-wrap gap-1">
                          {dayClasses.slice(0, 2).map((liveClass, idx) => (
                            <div
                              key={idx}
                              className={`w-2 h-2 rounded-full ${
                                liveClass.status === 'Akan Datang'
                                  ? 'bg-blue-500'
                                  : liveClass.status === 'Sedang Berlangsung'
                                    ? 'bg-red-500'
                                    : 'bg-gray-400'
                              }`}
                            />
                          ))}
                          {dayClasses.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{dayClasses.length - 2}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {isToday && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Date Details */}
      <div className="space-y-4">
        <Card className="border-0 shadow-lg rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <CardTitle className="text-lg font-bold">
              {selectedDate
                ? selectedDate.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Pilih Tanggal'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {selectedDate && selectedDateClasses.length > 0 ? (
              <div className="space-y-3">
                {selectedDateClasses.map((liveClass, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm line-clamp-2 flex-1 pr-2">
                        {liveClass.title}
                      </h4>
                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          className={`${getStatusColor(liveClass.status)} text-xs flex-shrink-0`}
                        >
                          {liveClass.status}
                        </Badge>
                        <div className="text-xs font-mono text-gray-500">
                          #{liveClass.id.slice(-6).toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(liveClass.startDate).toLocaleTimeString(
                          'id-ID',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {liveClass.Instructor.name}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {liveClass.canJoin && (
                        <Button
                          size="sm"
                          onClick={() => onJoin(liveClass)}
                          className="flex-1 h-8 text-xs"
                        >
                          Join
                        </Button>
                      )}
                      {liveClass.needsUpgrade && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpgrade(liveClass)}
                          className="flex-1 h-8 text-xs border-orange-300 text-orange-600"
                        >
                          🔒 Upgrade
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : selectedDate ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">
                  Tidak ada kelas pada tanggal ini
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">
                  Klik tanggal untuk melihat detail kelas
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calendar Legend */}
        <Card className="border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Keterangan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Akan Datang</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Sedang Berlangsung</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span>Selesai</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-orange-500 rounded-full ring-2 ring-blue-200"></div>
              <span>Hari Ini</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
