'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MockLiveClass } from '@/lib/mock-data/live-class';
import { Bell, Calendar, Clock, ExternalLink, X } from 'lucide-react';
import { useState } from 'react';

interface LiveClassNotification {
  id: string;
  type: 'reminder' | 'starting' | 'cancelled' | 'rating';
  liveClass: MockLiveClass;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Mock notifications
const mockNotifications: LiveClassNotification[] = [
  {
    id: '1',
    type: 'starting',
    liveClass: {
      id: '1',
      title: 'Matematika: Integral dan Diferensial',
      subject: 'Matematika',
      tutorName: 'Dr. Ahmad Syahril',
      scheduleDate: new Date('2025-01-15T09:00:00'),
    } as MockLiveClass,
    message: 'Kelas akan dimulai dalam 5 menit',
    isRead: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    type: 'reminder',
    liveClass: {
      id: '2',
      title: 'Fisika: Mekanika Kuantum',
      subject: 'Fisika',
      tutorName: 'Prof. Dr. Siti Nurhaliza',
      scheduleDate: new Date('2025-01-16T14:00:00'),
    } as MockLiveClass,
    message: 'Reminder: Kelas akan dimulai besok',
    isRead: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    type: 'rating',
    liveClass: {
      id: '4',
      title: 'Kimia: Reaksi Organik',
      subject: 'Kimia',
      tutorName: 'Dr. Budi Santoso',
      scheduleDate: new Date('2025-01-14T10:00:00'),
    } as MockLiveClass,
    message: 'Berikan rating untuk kelas yang sudah selesai',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

export function LiveClassNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
    );
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const getNotificationIcon = (type: LiveClassNotification['type']) => {
    switch (type) {
      case 'starting':
        return <ExternalLink className="h-4 w-4 text-green-600" />;
      case 'reminder':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-red-600" />;
      case 'rating':
        return <Bell className="h-4 w-4 text-orange-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: LiveClassNotification['type']) => {
    switch (type) {
      case 'starting':
        return 'bg-green-50 border-green-200';
      case 'reminder':
        return 'bg-blue-50 border-blue-200';
      case 'cancelled':
        return 'bg-red-50 border-red-200';
      case 'rating':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatNotificationTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} hari lalu`;
    if (hours > 0) return `${hours} jam lalu`;
    if (minutes > 0) return `${minutes} menit lalu`;
    return 'Baru saja';
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-80 z-50">
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Notifikasi Live Class</span>
                <Badge variant="outline">{notifications.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {notifications.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`border-b border-gray-100 last:border-b-0 p-4 ${
                        !notification.isRead ? 'bg-blue-50' : 'bg-white'
                      } hover:bg-gray-50 transition-colors`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.liveClass.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                <Calendar className="h-3 w-3" />
                                {formatNotificationTime(notification.createdAt)}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                dismissNotification(notification.id);
                              }}
                              className="h-6 w-6 p-0 hover:bg-red-100"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Tidak ada notifikasi</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
