'use client';

import { useNotification } from '@/components/provider/privoder-notification';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { LiveClass, Tryout } from '@/types/database';
import {
  AlertCircle,
  Bell,
  Camera,
  CheckCircle,
  Clock,
  CreditCard,
  Dot,
  Eye,
  FileText,
  Gift,
  GraduationCap,
  MessageSquare,
  Mic2,
  Music,
  Trophy,
  Tv,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export const NotificationPopUp = () => {
  const {
    usePopUp: { notificationPopUp, setNotificationPopUp },
    useAction: { handleMarkAsRead },
  } = useNotification();

  const handleClose = () => {
    setNotificationPopUp(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-50 border-red-200';
      case 'HIGH':
        return 'bg-orange-50 border-orange-200';
      case 'NORMAL':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'HIGH':
        return <Zap className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    const iconProps = { className: 'w-6 h-6' };

    switch (type) {
      case 'PAYMENT_SUCCESSFUL':
      case 'PAYMENT_FAILED':
      case 'PAYMENT_REMINDER':
        return (
          <CreditCard
            {...iconProps}
            className="text-green-600"
          />
        );

      case 'ORDER_CONFIRMATION':
      case 'ORDER_SHIPPED':
      case 'ORDER_DELIVERED':
      case 'REFUND_PROCESSED':
        return (
          <CheckCircle
            {...iconProps}
            className="text-emerald-600"
          />
        );

      case 'SUBSCRIPTION_ACTIVATED':
      case 'SUBSCRIPTION_RENEWED':
      case 'SUBSCRIPTION_EXPIRING':
      case 'SUBSCRIPTION_EXPIRED':
      case 'INSTALLMENT_REMINDER':
      case 'INSTALLMENT_DUE':
        return (
          <Clock
            {...iconProps}
            className="text-purple-600"
          />
        );

      case 'COURSE_ENROLLED':
      case 'COURSE_PROGRESS':
      case 'COURSE_COMPLETED':
      case 'NEW_COURSE_AVAILABLE':
        return (
          <FileText
            {...iconProps}
            className="text-blue-600"
          />
        );

      case 'TRYOUT_STARTED':
      case 'TRYOUT_COMPLETED':
      case 'TRYOUT_RESULTS':
        return (
          <Trophy
            {...iconProps}
            className="text-yellow-600"
          />
        );

      case 'NEW_MESSAGE':
      case 'MESSAGE_REPLY':
        return (
          <MessageSquare
            {...iconProps}
            className="text-cyan-600"
          />
        );

      case 'PROMOTION':
      case 'SPECIAL_OFFER':
        return (
          <Gift
            {...iconProps}
            className="text-pink-600"
          />
        );

      case 'VISION_USAGE':
        return (
          <Eye
            {...iconProps}
            className="text-indigo-600"
          />
        );

      default:
        return (
          <Bell
            {...iconProps}
            className="text-gray-600"
          />
        );
    }
  };

  const getTypeLabel = (type: string) => {
    return type
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins}m lalu`;
    if (diffHours < 24) return `${diffHours}h lalu`;
    if (diffDays < 7) return `${diffDays}d lalu`;
    return notifDate.toLocaleDateString('id-ID');
  };

  if (!notificationPopUp) return null;

  return (
    <Dialog
      open={!!notificationPopUp}
      onOpenChange={handleClose}
    >
      <DialogContent
        className={cn(
          'max-w-md border-l-4 p-0 overflow-hidden shadow-2xl',
          notificationPopUp.priority === 'URGENT' && 'border-l-red-500',
          notificationPopUp.priority === 'HIGH' && 'border-l-orange-500',
          notificationPopUp.priority === 'NORMAL' && 'border-l-blue-500',
          !notificationPopUp.priority && 'border-l-gray-500',
        )}
        classOverlay="z-[10000]"
      >
        {/* Header Section */}
        <div
          className={cn(
            'p-6 pb-0',
            notificationPopUp.priority === 'URGENT' &&
              'bg-gradient-to-br from-red-50 to-transparent',
            notificationPopUp.priority === 'HIGH' &&
              'bg-gradient-to-br from-orange-50 to-transparent',
            notificationPopUp.priority === 'NORMAL' &&
              'bg-gradient-to-br from-blue-50 to-transparent',
            !notificationPopUp.priority &&
              'bg-gradient-to-br from-gray-50 to-transparent',
          )}
        >
          {/* Header with Icon and Title */}
          <div className="flex gap-3 mb-3">
            <div
              className={cn(
                'flex-shrink-0 w-12 h-12 rounded-3xl flex items-center justify-center border-2 shadow-sm',
                getPriorityColor(notificationPopUp.priority),
              )}
            >
              {getTypeIcon(notificationPopUp.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-0.5">
                <h2 className="text-base font-bold text-gray-900 break-words leading-tight">
                  {notificationPopUp.title}
                </h2>
                {notificationPopUp.priority !== 'NORMAL' && (
                  <div className="flex-shrink-0 mt-0.5">
                    {getPriorityIcon(notificationPopUp.priority)}
                  </div>
                )}
              </div>
              {notificationPopUp.description && (
                <p className="text-xs text-gray-600 line-clamp-1">
                  {notificationPopUp.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 py-4 space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            {notificationPopUp.content}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-500 font-medium">
              {formatTimeAgo(notificationPopUp.createdAt)}
            </span>
            <span className="text-xs bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-3 py-1 rounded-full font-semibold border border-gray-200">
              {getTypeLabel(notificationPopUp.type)}
            </span>
          </div>
        </div>

        {getLiveClassMetadata()}

        {getTryoutMetadata()}

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-200 flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => {
              handleClose();
              handleMarkAsRead(notificationPopUp.id);
            }}
            className="rounded-3xl font-medium hover:bg-gray-100 transition-colors"
          >
            Tandai Telah Dibaca
          </Button>
          {notificationPopUp.actionUrl &&
            notificationPopUp.actionUrl.length > 0 &&
            notificationPopUp.actionUrl.startsWith('/') && (
              <Link
                href={notificationPopUp.actionUrl}
                className="inline-block"
              >
                <Button
                  onClick={() => {
                    handleClose();
                    handleMarkAsRead(notificationPopUp.id);
                  }}
                  className="rounded-3xl font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                  Lihat Selengkapnya
                </Button>
              </Link>
            )}
          {notificationPopUp.actionUrl &&
            notificationPopUp.actionUrl.length > 0 &&
            notificationPopUp.actionUrl.startsWith('http') && (
              <a
                href={notificationPopUp.actionUrl}
                className="inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  onClick={() => {
                    handleClose();
                    handleMarkAsRead(notificationPopUp.id);
                  }}
                  className="rounded-3xl font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                  Lihat Selengkapnya
                </Button>
              </a>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const getLiveClassMetadata = () => {
  const {
    usePopUp: { notificationPopUp, setNotificationPopUp },
  } = useNotification();

  if (!notificationPopUp) return null;

  const metadata = notificationPopUp.metadata as LiveClass;

  return (
    <>
      {notificationPopUp.relatedResourceType === 'LIVE_CLASS' &&
        metadata &&
        typeof metadata === 'object' && (
          <div className="mx-6 mb-6 border border-yellow-200 rounded-3xl overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-orange-50  shadow-sm hover:shadow-md transition-shadow">
            {/* Image */}
            {metadata.image && (
              <div className="relative w-full h-44 overflow-hidden bg-gradient-to-br from-blue-200 to-purple-200">
                <img
                  src={metadata.image}
                  alt={metadata.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {metadata.isRecord && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-lg">
                    <Dot className="w-2 h-2 fill-current animate-pulse" />
                    LIVE
                  </div>
                )}
              </div>
            )}

            {/* Details */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1">
                  {metadata.title}
                </h3>
                {metadata.description && (
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {metadata.description}
                  </p>
                )}
              </div>

              {/* Info Grid */}
              <div className="space-y-2">
                {/* Start Time */}
                <div className="flex items-center gap-2.5 text-xs bg-white/60 backdrop-blur rounded-3xl px-3 py-2 border border-blue-200">
                  <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">
                    {new Date(metadata.startDate).toLocaleDateString('id-ID', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Duration & Participants */}
                <div className="grid grid-cols-2 gap-2">
                  {metadata.duration && (
                    <div className="flex items-center gap-2 text-xs bg-orange-50 border border-orange-200 rounded-3xl px-2.5 py-2">
                      <Clock className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">
                        {metadata.duration} min
                      </span>
                    </div>
                  )}
                  {metadata.maxParticipant && (
                    <div className="flex items-center gap-2 text-xs bg-purple-50 border border-purple-200 rounded-3xl px-2.5 py-2">
                      <Users className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">
                        {metadata.maxParticipant}
                      </span>
                    </div>
                  )}
                </div>

                {/* Type Badge */}
                <div className="inline-flex items-center gap-2 text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 px-3 py-2 rounded-3xl font-bold border border-blue-200">
                  {metadata.type === 'LIVECLASS' ? (
                    <GraduationCap className="w-3.5 h-3.5" />
                  ) : metadata.type === 'LIVESTREAM' ? (
                    <Tv className="w-3.5 h-3.5" />
                  ) : (
                    <Mic2 className="w-3.5 h-3.5" />
                  )}
                  {metadata.type === 'LIVECLASS'
                    ? 'Live Class'
                    : metadata.type === 'LIVESTREAM'
                      ? 'Livestream'
                      : 'Webinar'}
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

const getTryoutMetadata = () => {
  const {
    usePopUp: { notificationPopUp, setNotificationPopUp },
  } = useNotification();

  if (!notificationPopUp) return null;

  const metadata = notificationPopUp.metadata as Tryout;

  console.log('Tryout Metadata:', metadata);

  return (
    <>
      {notificationPopUp.relatedResourceType === 'TRYOUT' &&
        metadata &&
        typeof metadata === 'object' && (
          <div className="mx-6 mb-6 border border-yellow-200 rounded-3xl overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-orange-50 shadow-sm hover:shadow-md transition-shadow">
            {/* Details */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1">
                  {metadata.title}
                </h3>
              </div>

              {/* Info Grid */}
              <div className="space-y-2">
                {/* Start Date */}
                <div className="flex items-center gap-2.5 text-xs bg-white/60 backdrop-blur rounded-3xl px-3 py-2 border border-yellow-100">
                  <Clock className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">
                    Mulai:{' '}
                    {new Date(metadata.startDate).toLocaleDateString('id-ID', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* End Date & Result Date */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-xs bg-orange-50 border border-orange-200 rounded-3xl px-2.5 py-2">
                    <Clock className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-orange-700 font-semibold">
                        Berakhir
                      </span>
                      <span className="text-gray-700 font-medium text-[11px]">
                        {new Date(metadata.endDate).toLocaleDateString(
                          'id-ID',
                          {
                            month: 'short',
                            day: 'numeric',
                          },
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs bg-purple-50 border border-purple-200 rounded-3xl px-2.5 py-2">
                    <Trophy className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-purple-700 font-semibold">
                        Hasil
                      </span>
                      <span className="text-gray-700 font-medium text-[11px]">
                        {new Date(metadata.resultDate).toLocaleDateString(
                          'id-ID',
                          {
                            month: 'short',
                            day: 'numeric',
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rest Time */}
                {metadata.restTime && (
                  <div className="flex items-center gap-2.5 text-xs bg-blue-50 border border-blue-200 rounded-3xl px-3 py-2">
                    <Clock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">
                      Waktu istirahat: {metadata.restTime} hari
                    </span>
                  </div>
                )}

                {/* Social Links */}
                {(metadata.instagram || metadata.tiktok) && (
                  <div className="flex items-center gap-2 pt-1">
                    {metadata.instagram && (
                      <a
                        href={metadata.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 px-2.5 py-1.5 rounded-3xl font-medium hover:from-pink-200 hover:to-purple-200 transition-colors border border-pink-200"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Instagram
                      </a>
                    )}
                    {metadata.tiktok && (
                      <a
                        href={metadata.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs bg-gradient-to-r from-black/10 to-gray-100 text-gray-800 px-2.5 py-1.5 rounded-3xl font-medium hover:from-black/20 hover:to-gray-200 transition-colors border border-gray-300"
                      >
                        <Music className="w-3.5 h-3.5" />
                        TikTok
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
    </>
  );
};
